const socket = io(); // Conexión al servidor de WebSocket
const qrCodeContainer = document.getElementById('qrCodeContainer');

if (!qrCodeLoaded) {
    qrCodeContainer.innerHTML = `<p>WhatsApp está conectado o no hay QR
disponible en este momento.</p>`;
} else {
    qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>Escanee el qr</h1>
        <img src="${qrCodeLoaded}" alt="QR Code" />
    `;
}

socket.on('qrCode', (qr) => {
    console.log('QR Code received', qr);
    if (!qr) {
        qrCodeContainer.innerHTML = `<p>WhatsApp está conectado o no hay QR
disponible en este momento.</p>`;
        return;
    }
    qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>Escanee el qr</h1>
        <img src="${qr}" alt="QR Code" />
    `;
});
socket.on('log-response', (data) => {
    console.log(data);
});
