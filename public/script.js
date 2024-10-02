const socket = io(); // Conexión al servidor de WebSocket
const $qrCodeContainer = document.getElementById('qrCodeContainer');
const $logsContainer = document.getElementById('logs-container');
const $logoutModal = document.getElementById('logout-modal');

if (!qrCodeLoaded) {
    $qrCodeContainer.innerHTML = `
        <p>Sessión Iniciada ✅</p>
        <button class='block bg-green-500 text-white px-4 py-2 rounded-lg mt-4 mx-auto' onclick="handleClickLogout()">
            Cerrar Sesión
        </button>
    `;
} else {
    $qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>ESCANEE EL CÓDIGO QR</h1>
        <img src="${qrCodeLoaded}" alt="QR Code" />
    `;
}

function handleClickLogout() {
    $logoutModal.classList.remove('hidden');
    $logoutModal.classList.add('flex');
}

$logoutModal.addEventListener('click', (e) => {
    if (e.target === $logoutModal) {
        $logoutModal.secret.value = '';
        $logoutModal.classList.remove('flex');
        $logoutModal.classList.add('hidden');
    }
});

$logoutModal.onsubmit = (e) => {
    e.preventDefault();
    if (!$logoutModal.secret.value) return;
    const secret = $logoutModal.secret.value;

    fetch('/whatsapp/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret }),
    })
        .then((res) => res.text())
        .then((res) => {
            console.log('Logout response: ', res);
            $logoutModal.classList.remove('flex');
            $logoutModal.classList.add('hidden');
        })
        .catch((err) => {
            console.error(err);
        });
};

socket.on('qrCode', (qr) => {
    console.log('QR Code received', qr);
    if (!qr) {
        $qrCodeContainer.innerHTML = `
            <p>Sessión Iniciada ✅</p>
            <button class='block bg-green-500 text-white px-4 py-2 rounded-lg mt-4 mx-auto' onclick="handleClickLogout()">
                Cerrar Sesión
            </button>
        `;
        return;
    }
    $qrCodeContainer.innerHTML = `
        <h1 class='uppercase font-bold'>ESCANEE EL CÓDIGO QR</h1>
        <img src="${qr}" alt="QR Code" />
    `;
});
socket.on('log-response', (data) => {
    const content =
        `
        <div class="flex items-start space-x-4 shadow rounded-lg p-5 bg-gray-50 border">
            <div class="relative">
                <img src="/message-icon.png" class="flex h-8 aspect-square object-contain p-1.5 items-center justify-center rounded-full bg-gray-100"></img>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium">${data.detail}</p>
                <p class="text-xs text-gray-500">${data.dateTime}</p>
            </div>
        </div>
    ` + $logsContainer.innerHTML;
    $logsContainer.innerHTML = content;
});
