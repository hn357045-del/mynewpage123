const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const clockEl = document.getElementById('clock');
const timerDisplay = document.getElementById('timerDisplay');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const deadlineInput = document.getElementById('deadlineInput');
const deadlineStatus = document.getElementById('deadlineStatus');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

let timerSeconds = 1500;
let timerInterval = null;
let timerRunning = false;

function updateClock() {
  const now = new Date();
  const formatted = now.toLocaleTimeString('vi-VN', { hour12: false });
  clockEl.textContent = formatted;
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  startStopBtn.textContent = 'Pause';
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds -= 1;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      startStopBtn.textContent = 'Start';
      alert('Thời gian học đã kết thúc! Hãy nghỉ ngơi hoặc tiếp tục với nhiệm vụ tiếp theo.');
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  startStopBtn.textContent = 'Start';
  clearInterval(timerInterval);
}

function resetTimer() {
  timerSeconds = 1500;
  updateTimerDisplay();
  pauseTimer();
}

function updateDeadline() {
  const value = deadlineInput.value;
  if (!value) {
    deadlineStatus.textContent = 'Chưa có deadline';
    return;
  }

  const target = new Date(value);
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    deadlineStatus.textContent = 'Deadline đã qua!';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  deadlineStatus.textContent = `Còn lại ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

  if (diff < 1000 * 60 * 60 * 4) {
    deadlineStatus.textContent += ' — Gần đến hạn!';
    if (!document.body.classList.contains('alert-visible')) {
      document.body.classList.add('alert-visible');
      setTimeout(() => document.body.classList.remove('alert-visible'), 4000);
    }
  }
}

function loadTheme() {
  const stored = localStorage.getItem('portfolio-theme');
  if (stored === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
}

function saveTheme() {
  if (body.classList.contains('dark')) {
    localStorage.setItem('portfolio-theme', 'dark');
  } else {
    localStorage.setItem('portfolio-theme', 'light');
  }
}

function toggleTheme() {
  body.classList.toggle('dark');
  themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
  saveTheme();
}

function createNote(content) {
  const noteItem = document.createElement('div');
  noteItem.className = 'note-item';
  noteItem.innerHTML = `
    <button type="button" aria-label="Delete note">×</button>
    <p>${content}</p>
  `;
  const deleteBtn = noteItem.querySelector('button');
  deleteBtn.addEventListener('click', () => {
    noteItem.remove();
    saveNotes();
  });
  notesList.prepend(noteItem);
}

function saveNotes() {
  const noteTexts = Array.from(notesList.querySelectorAll('.note-item p')).map(p => p.textContent);
  localStorage.setItem('portfolio-notes', JSON.stringify(noteTexts));
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem('portfolio-notes') || '[]');
  saved.forEach(createNote);
}

startStopBtn.addEventListener('click', () => {
  if (timerRunning) pauseTimer(); else startTimer();
});

resetBtn.addEventListener('click', resetTimer);

deadlineInput.addEventListener('change', updateDeadline);

deadlineInput.addEventListener('blur', updateDeadline);

addNoteBtn.addEventListener('click', () => {
  const note = prompt('Thêm ghi chú học tập hoặc công việc:');
  if (!note) return;
  createNote(note);
  saveNotes();
});

themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('load', () => {
  loadTheme();
  loadNotes();
  updateClock();
  updateTimerDisplay();
  setInterval(updateClock, 1000);
  setInterval(updateDeadline, 1000);
});

window.addEventListener('scroll', () => {
  const topbar = document.querySelector('.topbar');
  topbar.classList.toggle('scrolled', window.scrollY > 8);
});
