// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const path = require('path')
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '/components/server.js'),
      nodeIntegration: true
    }
  });

  mainWindow.setMenu(null)
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/components/html/load.html'))
  // mainWindow.loadFile(path.join(__dirname, '/components/html/report.html'));
  // Shortcut key to Open the DevTools.
  //mainWindow.webContents.openDevTools()
  globalShortcut.register('CommandOrControl+Alt+K', () => {
    mainWindow.webContents.openDevTools()
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  return mainWindow
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on('create',(e)=>{
  mainWindow.loadURL('http://127.0.0.1:9080/createUser');
})

ipcMain.on('genReport', (e,msg)=>{
  console.log('report: '+msg);
  mainWindow.loadFile(path.join(__dirname, '/components/html/report.html'));
  // mainWindow.webContents.send(msg);
});

ipcMain.on('refresh',(e)=>{
  mainWindow.reload();
})

exports.Window = mainWindow;
