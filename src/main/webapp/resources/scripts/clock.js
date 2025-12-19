function updateDateTime() {
    let d = new Date();

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = d.toLocaleDateString('ru-RU', options);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    document.getElementById("date").innerHTML = dateStr;

    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}

updateDateTime();

window.setInterval(updateDateTime, 13000);
