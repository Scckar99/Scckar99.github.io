export function getTheme(): 'dark' | 'light' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme?: string, save = false) {
  if (theme) {
    if (theme !== 'dark' && theme !== 'light') return
    if (save) localStorage.setItem('theme', theme)
  } else {
    // Toggle between dark and light
    const current = getTheme()
    theme = current === 'dark' ? 'light' : 'dark'
    if (save) localStorage.setItem('theme', theme)
  }

  // Apply theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0B0B10' : '#FCFCFD')

  return theme
}
