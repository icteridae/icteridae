const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../static/icon.png"),
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.removeMenu()

  win.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, "../build/index.html")}`
  )

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
