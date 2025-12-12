function getValuesFromTable(data) {
        clearPoints();
        const table = document.getElementById('resultTable');
        
        const firstRow = table.rows[1];
        const r = parseFloat(firstRow.cells[2].innerText);
        
        if (!isNaN(r)) {
            document.getElementById('label-r').textContent = `${r}`;
            document.getElementById('label-half-r').textContent = `${(r / 2).toFixed(2)}`;
            document.getElementById('label-minus-r').textContent = `-${r}`;
            document.getElementById('label-minus-half-r').textContent = `-${(r / 2).toFixed(2)}`;

            document.getElementById('label-r-y').textContent = `${r}`;
            document.getElementById('label-half-r-y').textContent = `${(r / 2).toFixed(2)}`;
            document.getElementById('label-minus-r-y').textContent = `-${r}`;
            document.getElementById('label-minus-half-r-y').textContent = `-${(r / 2).toFixed(2)}`;
        
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
    document.getElementById('mainForm:yValue').value = value;
}

function validateForm() {
    const xStr = document.getElementById('mainForm:xValue').value.trim();
    const y = document.getElementById('mainForm:yValue').value;
    const r = document.getElementById('mainForm:rValue').value;
    const message = document.getElementById('formMessage');
    const xMessage = document.getElementById('mainForm:xMessage');
    
    // Check if all values are filled and R is selected (not 0)
    if (xStr === '' || y === '' || !r || parseFloat(r) === 0) {
        message.style.display = 'block';
        return false;
    }
    message.style.display = 'none';
    
    // Validate X with strict boundary check
    if (!isValidX(xStr)) {
        if (xMessage) {
            xMessage.textContent = 'Значение X от -5 до 3!';
            xMessage.style.display = 'block';
            xMessage.style.color = 'red';
            xMessage.style.fontSize = '16px';
            xMessage.style.fontWeight = 'bold';
        }
        return false;
    }
    
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
    if (str.includes('.')) {
        const parts = str.replace('-', '').split('.');
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
    circles.forEach(circle => circle.remove());
}

function drawPoint(x, y, r, result) {
    const svg = document.querySelector("svg"); 
    const scaleFactor = 150 / r;
    const scaledX = x * scaleFactor; 
    const scaledY = -y * scaleFactor;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", scaledX); 
    circle.setAttribute("cy", scaledY);
    circle.setAttribute("r", 5); 
    circle.setAttribute("fill", result ? "green" : "red");

    svg.appendChild(circle);
}
document.getElementById('graph-svg').addEventListener('click', function(event) {
    let r = parseFloat(document.getElementById('mainForm:rValue').value);
    if (!r || isNaN(r)) {
        console.error("Invalid R value");
        return;
    }
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const scaleFactor = 150 / r;

    const x = ((clickX - 200) / scaleFactor);
    const y = -((clickY - 200) / scaleFactor);
    
    // Call remoteCommand with parameters (bypasses slider restrictions)
    submitFromGraph([{name: 'x', value: x}, {name: 'y', value: y}, {name: 'r', value: r}]);
});

window.onload = getValuesFromTable();