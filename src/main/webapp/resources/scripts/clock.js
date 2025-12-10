function updateDateTime() {
    let d = new Date();
    
    // Форматируем дату и делаем первую букву заглавной
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = d.toLocaleDateString('ru-RU', options);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    document.getElementById("date").innerHTML = dateStr;
    
    // Форматируем время
    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}

// Показываем дату и время сразу при загрузке
updateDateTime();

// Обновляем каждые 13 секунд
window.setInterval(updateDateTime, 13000);
