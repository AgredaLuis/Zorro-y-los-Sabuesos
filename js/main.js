"use strict"
let internationalTiles = true

function startup() {
    generateNewBoard()
    setupListeners()
    mainAILoop()
}

function setupListeners() {
    document.getElementById("controls-reset-scores").onclick = () => {
        document.getElementById("win-fox").innerText = "0"
        document.getElementById("win-hound").innerText = "0"
        generateNewBoard()
    }  
}

function notify(level, message, duration=3000) {
    // Muestra una notificación en verde (info), advertir (naranja) o error (rojo).
    // Las notificaciones solo se muestran si no están deshabilitadas en la página
    const onlyWarnings = false
    const onlyErrors = false
    if (onlyWarnings && level === "info") {
        return
    } else if (onlyErrors && level !== "error") {
        return
    }
    const body = `<div class="notification notify-${level}">${message}</div>`
    const notifications = document.getElementById("notifications")
    notifications.innerHTML += body
    setTimeout(() => {
        notifications.removeChild(notifications.childNodes[0])
    }, duration)
}

function title(string) {
    return string[0].toUpperCase()  + string.slice(1)
}

function nombreFicha(name, pretty=false) {
    if (internationalTiles) {
        return name
    }
}

window.onload = startup
