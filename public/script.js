const socket = io(); // Conexión al servidor de WebSocket
const qrCodeContainer = document.getElementById('qrCodeContainer');

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
    console.log(data);
});
