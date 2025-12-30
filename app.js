/**
 * Year Progress App
 * A beautiful PWA to visualize your year as dots
 */

// ===========================
// Configuration
// ===========================

const DEFAULT_EMOJIS = '❤️😊⭐🎉💪🌸☀️🌙✨🌈💜🍀';

const CONFIG = {
  colors: [
    '#FFB7C5', // Soft pink
    '#98E4C9', // Mint
    '#C9B1FF', // Lavender
    '#FFCCB3', // Peach
    '#FFE066', // Sunny yellow
    '#7DD3C0', // Teal
    '#FF9AA2', // Coral
    '#B5EAD7', // Sage
  ],
  themes: {
    sakura: {
      name: 'Sakura',
      colors: ['#FFB7C5', '#FFF8F0', '#E8D5E7']
    },
    mint: {
      name: 'Mint Dream',
      colors: ['#98E4C9', '#F0FFF4', '#C5E8F7']
    },
    lavender: {
      name: 'Lavender Haze',
      colors: ['#C9B1FF', '#F8F4FF', '#FFD6E8']
    },
    honey: {
      name: 'Honey Morning',
      colors: ['#FFCCB3', '#FFFBF0', '#FFF2C9']
    }
  }
};

// ===========================
// State Management
// ===========================

let state = {
  year: new Date().getFullYear(),
  days: {},
  theme: 'sakura',
  emojis: DEFAULT_EMOJIS,
  lastUpdated: null
};

let selectedDay = null;

// ===========================
// Utility Functions
// ===========================

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getDateFromDayOfYear(year, dayOfYear) {
  const date = new Date(year, 0);
  date.setDate(dayOfYear);
  return date;
}

function formatDate(date) {
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatDateWithWeekday(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===========================
// Storage Functions
// ===========================

function saveState() {
  try {
    state.lastUpdated = new Date().toISOString();
    localStorage.setItem('yearProgress', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem('yearProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = {
        ...state,
        ...parsed
      };
      // Default to current year if no year saved or on first load of new year
      if (!state.year) {
        state.year = new Date().getFullYear();
      }
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

function exportData() {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `year-progress-backup-${state.year}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && typeof data === 'object') {
          state = {
            ...state,
            ...data,
            year: new Date().getFullYear()
          };
          saveState();
          resolve(true);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ===========================
// Theme Functions
// ===========================

function setTheme(themeName) {
  if (CONFIG.themes[themeName]) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName === 'sakura' ? '' : themeName);
    saveState();
    renderThemePicker();
  }
}

function renderThemePicker() {
  const picker = document.getElementById('themePicker');
  if (!picker) return;
  
  picker.innerHTML = '';
  
  Object.entries(CONFIG.themes).forEach(([key, theme]) => {
    const option = document.createElement('div');
    option.className = `theme-option ${state.theme === key ? 'selected' : ''}`;
    
    option.innerHTML = `
      <div class="theme-preview">
        ${theme.colors.map(c => `<div class="theme-dot" style="background: ${c}; border: 1px solid rgba(0,0,0,0.1);"></div>`).join('')}
      </div>
      <span class="theme-name">${theme.name}</span>
    `;
    
    option.addEventListener('click', () => setTheme(key));
    picker.appendChild(option);
  });
}

function renderYearSelector() {
  const selector = document.getElementById('yearSelector');
  if (!selector) return;
  
  selector.innerHTML = '';
  
  const currentYear = new Date().getFullYear();
  // Show current year and a few previous years
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  years.forEach(year => {
    const option = document.createElement('button');
    option.className = `year-option ${state.year === year ? 'selected' : ''}`;
    option.textContent = year;
    option.addEventListener('click', () => {
      state.year = year;
      saveState();
      renderProgress();
      renderGrid();
      renderYearSelector();
    });
    selector.appendChild(option);
  });
}

// ===========================
// Grid Rendering
// ===========================

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function renderGrid() {
  const grid = document.getElementById('yearGrid');
  const today = new Date();
  const currentDayOfYear = getDayOfYear(today);
  
  grid.innerHTML = '';
  
  // Render each month separately
  for (let month = 0; month < 12; month++) {
    const monthBlock = document.createElement('div');
    monthBlock.className = 'month-block';
    
    // Month header
    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-header';
    monthHeader.textContent = MONTH_NAMES[month];
    monthBlock.appendChild(monthHeader);
    
    // Day headers (Mon, Tue, etc.)
    const dayHeaders = document.createElement('div');
    dayHeaders.className = 'day-headers';
    DAY_NAMES.forEach(day => {
      const header = document.createElement('span');
      header.className = 'day-header';
      header.textContent = day;
      dayHeaders.appendChild(header);
    });
    monthBlock.appendChild(dayHeaders);
    
    // Month grid
    const monthGrid = document.createElement('div');
    monthGrid.className = 'month-grid';
    
    // Get first day of month and how many days
    const firstOfMonth = new Date(state.year, month, 1);
    const startDayOfWeek = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(state.year, month + 1, 0).getDate();
    
    // Add empty cells for alignment
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyDot = document.createElement('div');
      emptyDot.className = 'day-dot empty';
      monthGrid.appendChild(emptyDot);
    }
    
    // Render each day of the month
    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const date = new Date(state.year, month, dayOfMonth);
      const dateKey = getDateKey(date);
      const dayData = state.days[dateKey] || {};
      const dayOfYear = getDayOfYear(date);
      
      const dot = document.createElement('button');
      dot.className = 'day-dot';
      dot.setAttribute('aria-label', `${formatDate(date)}`);
      dot.dataset.date = dateKey;
      
      // Mark weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dot.classList.add('weekend');
      }
      
      // Past, today, or future
      if (state.year < today.getFullYear() || (state.year === today.getFullYear() && dayOfYear < currentDayOfYear)) {
        dot.classList.add('past');
      } else if (state.year === today.getFullYear() && dayOfYear === currentDayOfYear) {
        dot.classList.add('today');
        dot.classList.add('past');
      }
      
      // Apply custom color if marked
      if (dayData.color) {
        dot.classList.add('marked');
        dot.style.background = dayData.color;
      }
      
      // Show emoji if set
      if (dayData.emoji) {
        dot.innerHTML = `<span class="emoji">${dayData.emoji}</span>`;
      }
      
      // Show note indicator
      if (dayData.note) {
        const indicator = document.createElement('span');
        indicator.className = 'note-indicator';
        dot.appendChild(indicator);
      }
      
      // Add click handler
      dot.addEventListener('click', () => openDayPopup(dayOfYear, date, dateKey));
      
      monthGrid.appendChild(dot);
    }
    
    monthBlock.appendChild(monthGrid);
    grid.appendChild(monthBlock);
  }
  
  // Update hint text based on context
  updateHintText();
}

function updateHintText() {
  const hintText = document.getElementById('hintText');
  if (!hintText) return;
  
  const today = new Date();
  const currentDayOfYear = getDayOfYear(today);
  const totalDays = getDaysInYear(state.year);
  const hasMarks = Object.keys(state.days).length > 0;
  
  if (hasMarks) {
    hintText.classList.add('hidden');
  } else {
    hintText.classList.remove('hidden');
    
    // Contextual messages
    if (currentDayOfYear <= 7) {
      hintText.textContent = 'A fresh year awaits! ✨ Tap any day to begin.';
    } else if (currentDayOfYear >= totalDays - 7) {
      hintText.textContent = 'The year is almost complete! 🌟 Mark your memories.';
    } else {
      hintText.textContent = 'Tap any day to mark it ✨';
    }
  }
}

function renderProgress() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const totalDays = getDaysInYear(state.year);
  
  document.querySelector('.year-title').textContent = state.year;
  
  if (state.year === currentYear) {
    // Current year: show days left and percentage
    const currentDayOfYear = getDayOfYear(today);
    const daysRemaining = totalDays - currentDayOfYear + 1;
    const daysPassed = currentDayOfYear - 1;
    const percentage = ((daysPassed / totalDays) * 100).toFixed(1);
    
    document.querySelector('.days-remaining').textContent = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
    document.querySelector('.percentage').textContent = `${percentage}%`;
  } else if (state.year < currentYear) {
    // Past year: show as complete
    document.querySelector('.days-remaining').textContent = 'Complete';
    document.querySelector('.percentage').textContent = '100%';
  } else {
    // Future year: show as not started
    document.querySelector('.days-remaining').textContent = `${totalDays} days`;
    document.querySelector('.percentage').textContent = '0%';
  }
}

// ===========================
// Popup Functions
// ===========================

function openDayPopup(dayNumber, date, dateKey) {
  selectedDay = { dayNumber, date, dateKey };
  const dayData = state.days[dateKey] || {};
  
  // Set date in popup (with weekday)
  document.querySelector('.popup-date').textContent = formatDateWithWeekday(date);
  
  // Render color palette
  renderColorPalette(dayData.color);
  
  // Render emoji picker
  renderEmojiPicker(dayData.emoji);
  
  // Handle note section
  const noteInput = document.getElementById('noteInput');
  noteInput.value = dayData.note || '';
  updateCharCount();
  
  // Show popup
  document.getElementById('popupOverlay').classList.add('active');
}

function closePopup() {
  // Auto-save note before closing
  if (selectedDay) {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value.trim();
    const dayData = state.days[selectedDay.dateKey] || {};
    
    if (note) {
      dayData.note = note;
    } else {
      delete dayData.note;
    }
    
    if (Object.keys(dayData).length === 0) {
      delete state.days[selectedDay.dateKey];
    } else {
      state.days[selectedDay.dateKey] = dayData;
    }
    
    saveState();
    renderGrid();
  }
  
  document.getElementById('popupOverlay').classList.remove('active');
  selectedDay = null;
}

function renderColorPalette(selectedColor) {
  const palette = document.getElementById('colorPalette');
  palette.innerHTML = '';
  
  CONFIG.colors.forEach(color => {
    const option = document.createElement('button');
    option.className = `color-option ${selectedColor === color ? 'selected' : ''}`;
    option.style.background = color;
    option.setAttribute('aria-label', `Select color ${color}`);
    option.addEventListener('click', () => selectColor(color));
    palette.appendChild(option);
  });
}

function getEmojis() {
  // Parse emojis from string (handles multi-codepoint emojis)
  const emojiString = state.emojis || DEFAULT_EMOJIS;
  const segments = [...new Intl.Segmenter().segment(emojiString)].map(s => s.segment);
  // Remove spaces and duplicates
  const unique = [...new Set(segments.filter(s => s.trim() !== ''))];
  return unique;
}

function renderEmojiPicker(selectedEmoji) {
  const picker = document.getElementById('emojiPicker');
  picker.innerHTML = '';
  
  getEmojis().forEach(emoji => {
    const option = document.createElement('button');
    option.className = `emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`;
    option.textContent = emoji;
    option.setAttribute('aria-label', `Select emoji ${emoji}`);
    option.addEventListener('click', () => selectEmoji(emoji));
    picker.appendChild(option);
  });
}

function selectColor(color) {
  if (!selectedDay) return;
  
  const dayData = state.days[selectedDay.dateKey] || {};
  
  // Toggle color off if same color selected
  if (dayData.color === color) {
    delete dayData.color;
  } else {
    dayData.color = color;
  }
  
  if (Object.keys(dayData).length === 0) {
    delete state.days[selectedDay.dateKey];
  } else {
    state.days[selectedDay.dateKey] = dayData;
  }
  
  saveState();
  renderGrid();
  renderColorPalette(dayData.color);
}

function selectEmoji(emoji) {
  if (!selectedDay) return;
  
  const dayData = state.days[selectedDay.dateKey] || {};
  
  // Toggle emoji off if same selected
  if (dayData.emoji === emoji) {
    delete dayData.emoji;
  } else {
    dayData.emoji = emoji;
  }
  
  if (Object.keys(dayData).length === 0) {
    delete state.days[selectedDay.dateKey];
  } else {
    state.days[selectedDay.dateKey] = dayData;
  }
  
  saveState();
  renderGrid();
  // Pass undefined if no emoji selected to clear highlight
  renderEmojiPicker(state.days[selectedDay.dateKey]?.emoji);
}



function updateCharCount() {
  const noteInput = document.getElementById('noteInput');
  const charCount = document.getElementById('charCount');
  charCount.textContent = noteInput.value.length;
}



// ===========================
// Settings Functions
// ===========================

function openSettings() {
  renderThemePicker();
  renderYearSelector();
  
  // Set emoji input value
  const emojiInput = document.getElementById('emojiInput');
  emojiInput.value = state.emojis || DEFAULT_EMOJIS;
  
  document.getElementById('settingsOverlay').classList.add('active');
}

function closeSettings() {
  // Save emoji customization (clean up spaces and duplicates)
  const emojiInput = document.getElementById('emojiInput');
  const rawEmojis = emojiInput.value;
  if (rawEmojis.trim()) {
    const segments = [...new Intl.Segmenter().segment(rawEmojis)].map(s => s.segment);
    const unique = [...new Set(segments.filter(s => s.trim() !== ''))];
    state.emojis = unique.join('');
  } else {
    state.emojis = DEFAULT_EMOJIS;
  }
  saveState();
  
  document.getElementById('settingsOverlay').classList.remove('active');
}

// ===========================
// Event Listeners
// ===========================

function initEventListeners() {
  // Settings button
  document.querySelector('.settings-btn').addEventListener('click', openSettings);
  
  // Close popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
  document.getElementById('popupOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'popupOverlay') closePopup();
  });
  
  // Close settings
  document.querySelector('.settings-close').addEventListener('click', closeSettings);
  document.getElementById('settingsOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'settingsOverlay') closeSettings();
  });
  
  // Note functionality
  document.getElementById('noteInput').addEventListener('input', updateCharCount);
  
  // Export/Import
  document.getElementById('exportBtn').addEventListener('click', () => {
    exportData();
    closeSettings();
  });
  
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importInput').click();
  });
  
  document.getElementById('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importData(file);
        renderGrid();
        renderProgress();
        closeSettings();
        alert('Your data has been restored! 🎉');
      } catch (err) {
        alert('Oops! That file doesn\'t look right. Please try a different backup file.');
      }
    }
    e.target.value = '';
  });
  
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('popupOverlay').classList.contains('active')) {
        closePopup();
      } else if (document.getElementById('settingsOverlay').classList.contains('active')) {
        closeSettings();
      }
    }
  });
}

function scrollToToday() {
  const currentYear = new Date().getFullYear();
  if (state.year !== currentYear) return;
  
  const todayDot = document.querySelector('.day-dot.today');
  if (todayDot) {
    const rect = todayDot.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - (window.innerHeight / 2);
    window.scrollTo(0, scrollTop);
  }
}

// ===========================
// Initialization
// ===========================

function init() {
  loadState();
  
  // Apply saved theme
  if (state.theme && state.theme !== 'sakura') {
    document.documentElement.setAttribute('data-theme', state.theme);
  }
  
  renderProgress();
  renderGrid();
  initEventListeners();
  
  // Scroll to current day if viewing current year (after fonts load)
  window.addEventListener('load', scrollToToday);
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
