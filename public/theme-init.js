try {
  const saved = JSON.parse(localStorage.getItem('arivithai:v1') || '{}');
  if (saved.version === 1) {
    if (saved.theme === 'light' || saved.theme === 'dark') document.documentElement.dataset.theme = saved.theme;
    if (saved.language === 'ta') document.documentElement.lang = 'ta';
  }
} catch { /* Preferences remain at browser defaults when storage is blocked. */ }
