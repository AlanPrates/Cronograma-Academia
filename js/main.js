let timerInterval = null;

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
