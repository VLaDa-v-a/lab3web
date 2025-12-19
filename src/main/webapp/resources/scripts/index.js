function getValuesFromTable(data) {
    clearPoints();
    const table = document.getElementById("resultTable");

    const firstRow = table.rows[1];
    const r = parseFloat(firstRow.cells[2].innerText);

    if (!isNaN(r)) {
        document.getElementById("label-r").textContent = `${r}`;
        document.getElementById("label-half-r").textContent = `${(
            r / 2
        ).toFixed(2)}`;
        document.getElementById("label-minus-r").textContent = `-${r}`;
        document.getElementById("label-minus-half-r").textContent = `-${(
            r / 2
        ).toFixed(2)}`;

        document.getElementById("label-r-y").textContent = `${r}`;
        document.getElementById("label-half-r-y").textContent = `${(
            r / 2
        ).toFixed(2)}`;
        document.getElementById("label-minus-r-y").textContent = `-${r}`;
        document.getElementById("label-minus-half-r-y").textContent = `-${(
            r / 2
        ).toFixed(2)}`;

        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const x = parseFloat(row.cells[0].innerText);
            const y = parseFloat(row.cells[1].innerText);
            const result = row.cells[3].innerText === "Попал";
            drawPoint(x, y, r, result);
        }
    }
}

function updateYValue(value) {
    document.getElementById("mainForm:yValue").value = value;
}

function validateForm() {
    const xStr = document.getElementById("mainForm:xValue").value.trim();
    const y = document.getElementById("mainForm:yValue").value;
    const r = document.getElementById("mainForm:rValue").value;
    const message = document.getElementById("formMessage");
    const xMessage = document.getElementById("mainForm:xMessage");

    // Check if all values are filled and R is selected (not 0)
    if (xStr === "" || y === "" || !r || parseFloat(r) === 0) {
        message.style.display = "block";
        return false;
    }
    message.style.display = "none";

    // Validate X with strict boundary check
    if (!isValidX(xStr)) {
        if (xMessage) {
            xMessage.textContent = "Значение X от -5 до 3!";
            xMessage.style.display = "block";
            xMessage.style.color = "red";
            xMessage.style.fontSize = "16px";
            xMessage.style.fontWeight = "bold";
        }
        return false;
    }

    // Mark that we're attempting to submit (for ViewExpiredException recovery)
    markFormSubmitAttempt();

    return true;
}

function isValidX(str) {
    // Check if it's a valid number format
    if (!/^-?\d+(\.\d+)?$/.test(str)) {
        return false;
    }

    // Parse and check basic range
    const num = parseFloat(str);
    if (isNaN(num)) return false;

    // Strict boundary check: if very close to boundary, check string representation
    if (num < -5 || num > 3) return false;

    // Check for numbers like 3.0000001 or -5.0000001 using string analysis
    if (str.includes(".")) {
        const parts = str.replace("-", "").split(".");
        const intPart = parseInt(parts[0]);
        const decPart = parts[1];

        // For positive numbers near 3
        if (num >= 0 && intPart === 3 && decPart && !/^0*$/.test(decPart)) {
            return false; // 3.anything (except zeros) is invalid
        }

        // For negative numbers near -5
        if (num < 0 && intPart === 5 && decPart && !/^0*$/.test(decPart)) {
            return false; // -5.anything (except zeros) is invalid
        }
    }

    return true;
}

function clearPoints(data) {
    const svg = document.querySelector("svg");
    const circles = svg.querySelectorAll("circle");
    circles.forEach((circle) => circle.remove());
}

function drawPoint(x, y, r, result) {
    const svg = document.querySelector("svg");
    const scaleFactor = 150 / r;
    const scaledX = x * scaleFactor;
    const scaledY = -y * scaleFactor;

    const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );
    circle.setAttribute("cx", scaledX);
    circle.setAttribute("cy", scaledY);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", result ? "green" : "red");

    svg.appendChild(circle);
}
document
    .getElementById("graph-svg")
    .addEventListener("click", function (event) {
        let r = parseFloat(document.getElementById("mainForm:rValue").value);
        if (!r || isNaN(r)) {
            console.error("Invalid R value");
            return;
        }
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const scaleFactor = 150 / r;

        const x = (clickX - 200) / scaleFactor;
        const y = -((clickY - 200) / scaleFactor);

        // Call remoteCommand with parameters (bypasses slider restrictions)
        submitFromGraph([
            { name: "x", value: x },
            { name: "y", value: y },
            { name: "r", value: r },
        ]);
    });

// ==================== SessionStorage Management ====================
// Flag to prevent saving during restoration
let isRestoring = false;

// Save form values to sessionStorage to survive server restarts
function saveFormToStorage() {
    // Don't save if we're in the middle of restoring values
    if (isRestoring) {
        console.log("⏸️ Skipping save during restoration (isRestoring = true)");
        return;
    }

    const xValue = document.getElementById("mainForm:xValue").value;
    const yValue = document.getElementById("mainForm:yValue").value;
    const rValue = document.getElementById("mainForm:rValue").value;

    sessionStorage.setItem("lab3_x", xValue);
    sessionStorage.setItem("lab3_y", yValue);
    sessionStorage.setItem("lab3_r", rValue);

    console.log(
        "💾 Saved to storage - X:",
        xValue,
        "Y:",
        yValue,
        "R:",
        rValue,
        "(R type:",
        typeof rValue + ")"
    );
}

// Mark that user attempted to submit the form
function markFormSubmitAttempt() {
    sessionStorage.setItem("lab3_submit_pending", "true");
}

// Restore form values from sessionStorage
function restoreFormFromStorage() {
    // Set flag to prevent saving during restoration
    isRestoring = true;
    console.log("🔒 Locking storage saves during restoration");

    const savedX = sessionStorage.getItem("lab3_x");
    const savedY = sessionStorage.getItem("lab3_y");
    const savedR = sessionStorage.getItem("lab3_r");

    console.log(
        "🔄 Restoring from storage - X:",
        savedX,
        "Y:",
        savedY,
        "R:",
        savedR
    );

    // Restore X value
    if (savedX !== null && savedX !== "") {
        const xInput = document.getElementById("mainForm:xValue");
        if (xInput) {
            xInput.value = savedX;
            console.log("✓ Restored X:", savedX);
        }
    }

    // Restore Y value (PrimeFaces slider)
    if (savedY !== null && savedY !== "") {
        const yInput = document.getElementById("mainForm:yValue");
        const yDisplay = document.getElementById("yDisplay");

        if (yInput) {
            // Set the hidden input value
            yInput.value = savedY;

            // Update the display text
            if (yDisplay) {
                yDisplay.textContent = savedY;
                yDisplay.innerText = savedY;
            }

            // Update PrimeFaces slider widget using widgetVar
            setTimeout(function () {
                if (typeof PrimeFaces !== "undefined") {
                    const ySlider = PrimeFaces.widgets.ySlider;
                    if (ySlider && ySlider.setValue) {
                        ySlider.setValue(parseInt(savedY));
                        console.log("✓ Updated PrimeFaces slider to:", savedY);
                    } else {
                        console.log("⚠ PrimeFaces slider widget not found");
                        // Fallback: manual DOM manipulation
                        const sliderDiv = document.querySelector(".ui-slider");
                        if (sliderDiv) {
                            const minValue = -5;
                            const maxValue = 5;
                            const range = maxValue - minValue;
                            const normalizedValue =
                                (parseInt(savedY) - minValue) / range;
                            const percentage = normalizedValue * 100;

                            const sliderHandle =
                                sliderDiv.querySelector(".ui-slider-handle");
                            if (sliderHandle) {
                                sliderHandle.style.left = percentage + "%";
                                console.log(
                                    "✓ Manual slider update to:",
                                    percentage + "%"
                                );
                            }
                        }
                    }
                }
            }, 50); // Reduced to 50ms - minimal but safe

            console.log("✓ Restored Y:", savedY);
        }
    }

    // Restore R value
    if (savedR !== null && savedR !== "" && savedR !== "0") {
        console.log(
            "Attempting to restore R:",
            savedR,
            "(type:",
            typeof savedR + ")"
        );

        // Find and click the correct R button to trigger AJAX update immediately
        // No delay needed - buttons should be ready
        const rLinks = document.querySelectorAll(".r-link");
        let foundButton = false;

        console.log("Found", rLinks.length, "R buttons");

        rLinks.forEach((link, index) => {
            const buttonText = link.textContent.trim();
            console.log(
                "Button",
                index + ":",
                buttonText,
                "===",
                savedR,
                "?",
                buttonText === savedR
            );

            if (buttonText === savedR) {
                console.log("✓ Clicking R button:", savedR);
                link.click(); // This triggers AJAX and updates pointBean.r
                foundButton = true;

                // Verify after AJAX completes
                setTimeout(function () {
                    const rInput = document.getElementById("mainForm:rValue");
                    if (rInput) {
                        console.log(
                            "✓ R value after AJAX:",
                            rInput.value,
                            "(expected:",
                            savedR + ")"
                        );
                    }
                }, 150); // Reduced to 150ms - minimal for AJAX
            }
        });

        if (!foundButton) {
            console.log("⚠ R button not found for value:", savedR);
            // Fallback: manually set values
            const rInput = document.getElementById("mainForm:rValue");
            const rDisplay = document.getElementById("rDisplay");
            if (rInput) {
                rInput.value = savedR;
            }
            if (rDisplay) {
                rDisplay.textContent = savedR;
                rDisplay.innerText = savedR;
            }
            updateRSelectorVisual(savedR);
        }
    }

    // Unlock saving after all restorations and AJAX calls complete
    // Wait for longest operation (R AJAX verify = 150ms)
    setTimeout(function () {
        isRestoring = false;
        console.log("🔓 Unlocked storage saves after restoration complete");
    }, 200); // Reduced to 200ms - minimal safe time
}

// Update R selector visual state (highlight selected button)
function updateRSelectorVisual(rValue) {
    const rLinks = document.querySelectorAll(".r-link");
    rLinks.forEach((link) => {
        if (link.textContent === rValue) {
            link.classList.add("selected");
        } else {
            link.classList.remove("selected");
        }
    });
}

// Setup storage listeners for form inputs
function setupStorageListeners() {
    console.log("📡 Setting up storage listeners...");

    // Listen for X input changes
    const xInput = document.getElementById("mainForm:xValue");
    if (xInput) {
        xInput.addEventListener("input", saveFormToStorage);
        xInput.addEventListener("change", saveFormToStorage);
        console.log("✓ X input listeners attached");
    }

    // Listen for Y slider changes (using MutationObserver for hidden field)
    const yInput = document.getElementById("mainForm:yValue");
    if (yInput) {
        // Create observer to watch for value changes
        const observer = new MutationObserver(saveFormToStorage);
        observer.observe(yInput, {
            attributes: true,
            attributeFilter: ["value"],
        });

        // Also listen for direct value changes
        yInput.addEventListener("change", saveFormToStorage);
        console.log("✓ Y slider listeners attached");
    }

    // Listen for R selector changes (via AJAX complete)
    const rLinks = document.querySelectorAll(".r-link");
    console.log("✓ Found", rLinks.length, "R buttons, attaching listeners");

    rLinks.forEach((link, index) => {
        const buttonValue = link.textContent.trim();
        link.addEventListener("click", function () {
            console.log(
                "🖱️ R button clicked:",
                buttonValue,
                "(button index:",
                index + ")"
            );

            // Wait for AJAX to complete before saving
            setTimeout(function () {
                const rInput = document.getElementById("mainForm:rValue");
                if (rInput) {
                    console.log(
                        "💾 Saving after R click, rInput.value =",
                        rInput.value
                    );
                }
                saveFormToStorage();
            }, 150); // Reduced to 150ms - minimal for AJAX
        });
    });

    console.log("✓ All storage listeners set up successfully");
}

// Check if we need to auto-submit after ViewExpiredException recovery
function checkAndAutoSubmit() {
    const submitPending = sessionStorage.getItem("lab3_submit_pending");

    if (submitPending === "true") {
        // Clear the flag first to avoid infinite loops
        sessionStorage.removeItem("lab3_submit_pending");

        console.log(
            "🔄 Auto-submitting form after ViewExpiredException recovery..."
        );

        // Wait for restoration to complete (200ms) + small buffer
        setTimeout(function () {
            // Double-check that values are present
            const xValue = document.getElementById("mainForm:xValue").value;
            const yValue = document.getElementById("mainForm:yValue").value;
            const rValue = document.getElementById("mainForm:rValue").value;

            console.log(
                "Form values before auto-submit - X:",
                xValue,
                "Y:",
                yValue,
                "R:",
                rValue
            );

            const checkBtn = document.getElementById("mainForm:checkBtn");
            if (checkBtn) {
                if (validateForm()) {
                    console.log("✓ Validation passed, submitting...");
                    checkBtn.click();
                } else {
                    console.log(
                        "✗ Validation failed on first attempt, retrying..."
                    );
                    // Try to restore again
                    restoreFormFromStorage();
                    // Try one more time after another delay (wait for AJAX)
                    setTimeout(function () {
                        if (validateForm()) {
                            console.log("✓ Second attempt: validation passed");
                            checkBtn.click();
                        } else {
                            console.log(
                                "✗ Could not auto-submit, user needs to click manually"
                            );
                        }
                    }, 250); // Reduced to 250ms - minimal retry time
                }
            }
        }, 250); // Reduced to 250ms - near-instant response!
    }
}

// Save form values before page unload (e.g., server restart, page refresh)
window.addEventListener("beforeunload", function () {
    // Force save current values before page closes
    if (!isRestoring) {
        const xValue = document.getElementById("mainForm:xValue")?.value;
        const yValue = document.getElementById("mainForm:yValue")?.value;
        const rValue = document.getElementById("mainForm:rValue")?.value;

        if (xValue || yValue || rValue) {
            sessionStorage.setItem("lab3_x", xValue || "");
            sessionStorage.setItem("lab3_y", yValue || "");
            sessionStorage.setItem("lab3_r", rValue || "0");
            console.log(
                "💾 Force saved before unload - X:",
                xValue,
                "Y:",
                yValue,
                "R:",
                rValue
            );
        }
    }
});

// Initialize on page load
window.onload = function () {
    getValuesFromTable();
    restoreFormFromStorage();
    setupStorageListeners();
    checkAndAutoSubmit();
};
