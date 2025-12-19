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

    if (xStr === "" || y === "" || !r || parseFloat(r) === 0) {
        message.style.display = "block";
        return false;
    }
    message.style.display = "none";

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
    markFormSubmitAttempt();
    return true;
}

function isValidX(str) {
    if (!/^-?\d+(\.\d+)?$/.test(str)) {
        return false;
    }

    const num = parseFloat(str);
    if (isNaN(num)) return false;

    if (num < -5 || num > 3) return false;

    if (str.includes(".")) {
        const parts = str.replace("-", "").split(".");
        const intPart = parseInt(parts[0]);
        const decPart = parts[1];

        if (num >= 0 && intPart === 3 && decPart && !/^0*$/.test(decPart)) {
            return false;
        }

        if (num < 0 && intPart === 5 && decPart && !/^0*$/.test(decPart)) {
            return false;
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

        submitFromGraph([
            { name: "x", value: x },
            { name: "y", value: y },
            { name: "r", value: r },
        ]);
    });

let isRestoring = false;

function saveFormToStorage() {
    if (isRestoring) {
        return;
    }

    const xValue = document.getElementById("mainForm:xValue").value;
    const yValue = document.getElementById("mainForm:yValue").value;
    const rValue = document.getElementById("mainForm:rValue").value;

    sessionStorage.setItem("lab3_x", xValue);
    sessionStorage.setItem("lab3_y", yValue);
    sessionStorage.setItem("lab3_r", rValue);
}

function markFormSubmitAttempt() {
    sessionStorage.setItem("lab3_submit_pending", "true");
}

function restoreFormFromStorage() {
    isRestoring = true;

    const savedX = sessionStorage.getItem("lab3_x");
    const savedY = sessionStorage.getItem("lab3_y");
    const savedR = sessionStorage.getItem("lab3_r");

    if (savedX !== null && savedX !== "") {
        const xInput = document.getElementById("mainForm:xValue");
        if (xInput) {
            xInput.value = savedX;
        }
    }

    if (savedY !== null && savedY !== "") {
        const yInput = document.getElementById("mainForm:yValue");
        const yDisplay = document.getElementById("yDisplay");

        if (yInput) {
            yInput.value = savedY;
            if (yDisplay) {
                yDisplay.textContent = savedY;
                yDisplay.innerText = savedY;
            }

            setTimeout(function () {
                if (typeof PrimeFaces !== "undefined") {
                    const ySlider = PrimeFaces.widgets.ySlider;
                    if (ySlider && ySlider.setValue) {
                        ySlider.setValue(parseInt(savedY));
                    } else {
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
                            }
                        }
                    }
                }
            }, 50);
        }
    }

    if (savedR !== null && savedR !== "" && savedR !== "0") {
        const rLinks = document.querySelectorAll(".r-link");
        let foundButton = false;

        rLinks.forEach((link, index) => {
            const buttonText = link.textContent.trim();

            if (buttonText === savedR) {
                link.click();
                foundButton = true;

                setTimeout(function () {
                    const rInput = document.getElementById("mainForm:rValue");
                    if (rInput) {
                    }
                }, 150);
            }
        });

        if (!foundButton) {
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

    setTimeout(function () {
        isRestoring = false;
    }, 200);
}

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

function setupStorageListeners() {
    const xInput = document.getElementById("mainForm:xValue");
    if (xInput) {
        xInput.addEventListener("input", saveFormToStorage);
        xInput.addEventListener("change", saveFormToStorage);
    }

    const yInput = document.getElementById("mainForm:yValue");
    if (yInput) {
        const observer = new MutationObserver(saveFormToStorage);
        observer.observe(yInput, {
            attributes: true,
            attributeFilter: ["value"],
        });
        yInput.addEventListener("change", saveFormToStorage);
    }

    const rLinks = document.querySelectorAll(".r-link");

    rLinks.forEach((link, index) => {
        const buttonValue = link.textContent.trim();
        link.addEventListener("click", function () {
            setTimeout(function () {
                const rInput = document.getElementById("mainForm:rValue");
                if (rInput) {
                }
                saveFormToStorage();
            }, 150);
        });
    });
}

function checkAndAutoSubmit() {
    const submitPending = sessionStorage.getItem("lab3_submit_pending");

    if (submitPending === "true") {
        sessionStorage.removeItem("lab3_submit_pending");

        setTimeout(function () {
            const xValue = document.getElementById("mainForm:xValue").value;
            const yValue = document.getElementById("mainForm:yValue").value;
            const rValue = document.getElementById("mainForm:rValue").value;

            const checkBtn = document.getElementById("mainForm:checkBtn");
            if (checkBtn) {
                if (validateForm()) {
                    checkBtn.click();
                } else {
                    restoreFormFromStorage();
                    setTimeout(function () {
                        if (validateForm()) {
                            checkBtn.click();
                        } else {
                        }
                    }, 250);
                }
            }
        }, 250);
    }
}

window.addEventListener("beforeunload", function () {
    if (!isRestoring) {
        const xValue = document.getElementById("mainForm:xValue")?.value;
        const yValue = document.getElementById("mainForm:yValue")?.value;
        const rValue = document.getElementById("mainForm:rValue")?.value;

        if (xValue || yValue || rValue) {
            sessionStorage.setItem("lab3_x", xValue || "");
            sessionStorage.setItem("lab3_y", yValue || "");
            sessionStorage.setItem("lab3_r", rValue || "0");
        }
    }
});

window.onload = function () {
    getValuesFromTable();
    restoreFormFromStorage();
    setupStorageListeners();
    checkAndAutoSubmit();
};