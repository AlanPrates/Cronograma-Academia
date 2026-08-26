let timerInterval = null;
let deferredPrompt = null;

// Detectar plataforma
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

// Mostrar banner de instalação
function showInstallBanner() {
  if (isStandalone()) return; // Já está instalado
  
  const banner = document.getElementById('installBanner');
  const iosInstructions = document.getElementById('iosInstructions');
  const installBtn = document.getElementById('installBtn');
  const installHint = document.getElementById('installHint');

  if (isIOS()) {
    installBtn.style.display = 'none';
    iosInstructions.classList.remove('hidden');
    installHint.textContent = 'Adicione à tela inicial pelo Safari';
  } else if (isAndroid() && deferredPrompt) {
    installBtn.style.display = 'block';
    installHint.textContent = 'Instale o app no seu dispositivo';
  } else if (!isAndroid() && !isIOS()) {
    // Desktop — não mostrar
    return;
  } else {
    // Android mas sem deferredPrompt (já instalou ou browser não suporta)
    return;
  }

  banner.classList.remove('hidden');
}

// Instalar app (Android)
async function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    document.getElementById('installBanner').classList.add('hidden');
  }
  deferredPrompt = null;
}

// Fechar banner
function closeInstall() {
  document.getElementById('installBanner').classList.add('hidden');
  localStorage.setItem('installDismissed', 'true');
}

// Evento beforeinstallprompt (Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem('installDismissed')) {
    setTimeout(showInstallBanner, 2000);
  }
});

// Já instalado via PWA
window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').classList.add('hidden');
  deferredPrompt = null;
});

// iOS — mostrar após 3s se não foi dispensado
window.addEventListener('load', () => {
  if (isIOS() && !isStandalone() && !localStorage.getItem('installDismissed')) {
    setTimeout(showInstallBanner, 3000);
  }
});

function switchTab(tabId, element) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');
}

function openVideo(url) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoPlayer');
  iframe.src = url;
  modal.style.display = 'flex';
}

function closeVideo(event) {
  if (!event || event.target.id === 'videoModal' || event.target.classList.contains('close-btn')) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoPlayer');
    iframe.src = '';
    modal.style.display = 'none';
  }
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  const container = document.getElementById('timerContainer');
  const display = document.getElementById('timerDisplay');
  container.classList.remove('hidden');

  let remaining = seconds;
  updateTimerDisplay(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      alert('⏱️ Tempo de descanso finalizado! Hora da próxima série.');
      container.classList.add('hidden');
    }
  }, 1000);
}

function updateTimerDisplay(sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  document.getElementById('timerDisplay').innerText =
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function cancelTimer() {
  clearInterval(timerInterval);
  document.getElementById('timerContainer').classList.add('hidden');
}
