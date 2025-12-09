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
                const result = row.cells[3].innerText === "Hit";
                drawPoint(x, y, r, result);
            }
        }      
}

function updateYValue(value) {
    document.getElementById('yValueDisplay').value = value;
    document.getElementById('yValue').value = value;
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
    let r = parseFloat(document.getElementById('j_idt6:rValue').value);
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
    
    document.getElementById('j_idt6:xValue').value = x; 
    document.getElementById('j_idt6:yValue').value = y;
    document.querySelector('[type="submit"]').click();
});

window.onload = getValuesFromTable();