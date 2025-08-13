const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

let mainWindow;

function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: true,
    show: false
  });

  mainWindow.loadFile('renderer/login.html'); // Vite dev server

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createDashboardWindow() {
  const dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    dashboardWindow.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    // Cargar el build de React desde resources
    dashboardWindow.loadFile(path.join(process.resourcesPath, 'frontend/dist/index.html'));
  }
}

// Import handlers
const CognitoHandler = require('./cognito-handler');
const BackendManager = require('./backend-manager');

const cognitoHandler = new CognitoHandler();
const backendManager = new BackendManager();

// IPC handlers
ipcMain.handle('login', async (_, credentials) => {
  try {
    const result = await cognitoHandler.login(credentials.username, credentials.password);
    
    if (result.success) {
      const userAttributes = await cognitoHandler.getUserAttributes();
      return {
        success: true,
        user: {
          email: userAttributes.email || credentials.username
        }
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Error de autenticación'
    };
  }
});

ipcMain.handle('save-config', async (_, config) => {
  console.log('Config saved:', config);
  // TODO: Optionally persist config to file
  return { success: true };
});

ipcMain.handle('start-server', async (_, config) => {
  return await backendManager.startServer(config);
});

ipcMain.handle('stop-server', async () => {
  return backendManager.stopServer();
});

ipcMain.handle('server-status', async () => {
  return backendManager.getStatus();
});

ipcMain.handle('open-dashboard', async () => {
  createDashboardWindow();
  return { success: true };
});

// App event handlers
app.whenReady().then(() => {
  createLoginWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoginWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Stop backend and frontend when app closes
  backendManager.stopServer();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure cleanup on quit
  backendManager.stopServer();
});

// Development helpers
if (isDev) {
  app.whenReady().then(() => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });
}