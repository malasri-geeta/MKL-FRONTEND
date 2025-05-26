const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow () {
  // Start your Node.js backend
  exec('node server/index.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Backend failed to start:', err);
    }
  });

  // Wait a bit for backend to start, then open the frontend
  setTimeout(() => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      }
    });
    win.loadURL('http://localhost:5000'); // Your backend serves the frontend
  }, 2000); // Wait 2 seconds for backend to start
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
