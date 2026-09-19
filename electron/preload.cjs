const { contextBridge, ipcRenderer } = require('electron')

// Expose protected Electron Native API bridge to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  sendNotification: (title, body) => ipcRenderer.send('notify', { title, body }),
})
