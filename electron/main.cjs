const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    title: 'NuVida — Todo tu consultorio nutricional, en un solo lugar',
    icon: path.join(__dirname, '../public/icons/icon-512.svg'),
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  const distPath = path.join(__dirname, '../dist/index.html')

  if (fs.existsSync(distPath)) {
    // Always load NuVida built application
    mainWindow.loadFile(distPath)
  } else {
    // Fallback to dev server port if configured
    const port = process.env.PORT || '8443'
    mainWindow.loadURL(`http://localhost:${port}`)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
