const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  startServer: (config) => ipcRenderer.invoke('start-server', config),
  stopServer: () => ipcRenderer.invoke('stop-server'),
  serverStatus: () => ipcRenderer.invoke('server-status'),
  openDashboard: () => ipcRenderer.invoke('open-dashboard')
});