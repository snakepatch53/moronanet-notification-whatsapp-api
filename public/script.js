const socket = io(); // Conexión al servidor de WebSocket
const qrCodeContainer = document.getElementById('qrCodeContainer');
const logsContainer = document.getElementById('logs-container');

if (!qrCodeLoaded) {
    qrCodeContainer.innerHTML = `<p>Sessión Iniciada ✅</p>`;
} else {
    qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>ESCANEE EL CÓDIGO QR</h1>
        <img src="${qrCodeLoaded}" alt="QR Code" />
    `;
}

socket.on('qrCode', (qr) => {
    console.log('QR Code received', qr);
    if (!qr) {
        qrCodeContainer.innerHTML = `<p>Sessión Iniciada ✅</p>`;
        return;
    }
    qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>ESCANEE EL CÓDIGO QR</h1>
        <img src="${qr}" alt="QR Code" />
    `;
});
socket.on('log-response', (data) => {
    const content =
        `
        <div id="logs-container" class="flex items-start space-x-4 shadow rounded-lg p-5 bg-gray-50 border">
            <div class="relative">
                <img src="/message-icon.png" class="flex h-8 aspect-square object-contain p-1.5 items-center justify-center rounded-full bg-gray-100"></img>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium">${data.detail}</p>
                <p class="text-xs text-gray-500">${data.dateTime}</p>
            </div>
        </div>
    ` + logsContainer.innerHTML;
    logsContainer.innerHTML = content;
});
