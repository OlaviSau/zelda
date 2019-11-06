// Modules to control selectedApplication life and create native browser window
const {app, BrowserWindow, globalShortcut } = require('electron');
const { format } = require('url');
const { join } = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const args = process.argv.slice(1);

function createWindow () {

  const { screen } = require('electron');
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minHeight: 900,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: `${__dirname}/heart.ico`
  });

  mainWindow.setMenu(null);
  if (args.some(arg => arg === '--serve')) {
    mainWindow.loadURL("http://localhost:5200");
  } else {
    // and load the projectIndex.html of the app.
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'dist/zelda/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
