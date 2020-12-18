import { app, BrowserWindow, shell} from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

function createWindow () {

  // Create new electron window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../icon.png"),
    webPreferences: {
      nodeIntegration: true // Allow for IPC between React and Electron
    }
  })
  
  // Remove the default menu bar
  win.removeMenu() 

  // In dev, load from local react server. Else load from compiled files
  win.loadURL( 
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, "../index.html")}`
  )

  // When a new Window is opened, open it in regular browser instead of 
  // an electron window
  win.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
