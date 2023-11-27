var isWin = process.platform === "win32";
const {app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut} = require('electron');
const title = "Android Accessibility Inspector";
const url = require("url");
require ('hazardous');
const path = require("path");
const appPath = app.getAppPath();
const adbMac = path.join(appPath + '/src/assets/', 'adb');
const adbWin = path.join(appPath +'/src/assets/', 'adb.exe');
const companionAppPath = path.join(appPath + '/src/assets/', 'app-release.apk');
const { exec } = require("child_process");

let mainWindow

function createWindow () {
  if (process.platform === 'darwin') {
    globalShortcut.register('Command+Q', () => {
        app.quit();
    })
  }
  mainWindow = new BrowserWindow({
    width: 1200, height: 900,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      contextIsolation : false,
    },
    title: title
  });


  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/and-acc-ins/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(title);
  });
}

app.on('ready', () => {
  createWindow();
  const menuTemplate = [
    {
        label: 'Tools',
        submenu: [
            {
                label: 'Show dev tools',
                click: () => {
                    mainWindow.webContents.openDevTools();
                }
            },
            {
              label: 'Install companion app',
              click: () => {
                  installApp();
              }
            },
            {
              id: "not-important-views",
              label: 'Toggle Not Important Views',
              click: (e) => {
                  mainWindow.webContents.send('infoMessage', {'message':'Toggling not important views'});
                  mainWindow.webContents.send('showImportantViews');
              }
          },
            {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ]
    }
];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  });

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

app.on('activate', function () {
    if (mainWindow === null) createWindow()
  })
ipcMain.on('finishSetup', (event, arg) => {
    finishSetup();
  });
ipcMain.on('forwardPorts', (event, arg) => {
    forwardPorts();
  });
ipcMain.on('restartServer', (event, arg) => {
    restartServer();
  });
ipcMain.on('setNotImportant', (event, arg) => {
  myItem = Menu.getApplicationMenu().getMenuItemById('not-important-views');
  myItem.checked = arg;
});
function installApp() {
  mainWindow.webContents.send('infoMessage', {'message':'Performing install'});
  let command = "";
  if(!isWin) {
    command = '"' + adbMac + '" install -r -d "' + companionAppPath + '"';
  }
  if(isWin) {
    command = '"' + adbWin + '" install -r -d "' + companionAppPath + '"';
  }
  runCommand = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`${error.message}`);
        if(error.message.includes('signatures')) {
          mainWindow.webContents.send('commandError', {'error': 'App signatures do not match. Manually uninstall the app from the device and try again'});
        } else {
          mainWindow.webContents.send('commandError', {'error': error.message});
        }
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        if(stderr.includes('signatures')) {
          mainWindow.webContents.send('commandError', {'error': 'App signatures do not match. Manually uninstall the app from the device and try again'});
        } else {
          mainWindow.webContents.send('commandError', {'error': stderr});
        }
        return;
    }
    result = stdout;
  });
  runCommand.stdout.on('data', (data) => {
    result = data.toString();
    if(result.includes('Success')) {
      setTimeout(() => {
        mainWindow.webContents.send('refreshConnection', {});
      }, 500)
      mainWindow.webContents.send('successMessage', {'message':'Install success'});
    } else if(result.includes('Streamed')) {
      // do nothing
    } else if(result.includes('signatures')) {
      mainWindow.webContents.send('commandError', {'error': 'App signatures do not match. Manually uninstall the app from the device and try again'});
    } else {
      mainWindow.webContents.send('commandError', {'error': result});
    }
  });
}
function finishSetup() {
  let command = "";
  if(!isWin) {
    command = '"' + adbMac + '" shell am broadcast -a A11yInspector';
  }
  if(isWin) {
    command = '"' + adbWin + '" shell am broadcast -a A11yInspector';
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`${error.message}`);
        mainWindow.webContents.send('commandError', {'error': error.message});
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        mainWindow.webContents.send('commandError', {'error': stderr});
        return;
    }
    console.log(`${stdout}`);

  });
}
function forwardPorts() {
  let command = "";
  if(!isWin) {
    command = '"' + adbMac + '" forward tcp:38301 tcp:38301';
  }
  if(isWin) {
    command = '"' + adbWin + '" forward tcp:38301 tcp:38301';
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`${error.message}`);
        mainWindow.webContents.send('commandError', {'error': error.message});
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        mainWindow.webContents.send('commandError', {'error': stderr});
        return;
    }
    console.log(`${stdout}`);
  });
}
function restartServer() {
  let command = "";
  let forceStop = ' shell am force-stop com.jwlilly.accessibilityinspector';
  let getRunningServices = ' shell settings get secure enabled_accessibility_services';
  let runningServices = '';
  if(!isWin) {
    command = '"' + adbMac + '"' + forceStop + '; "' + adbMac + '"' + getRunningServices;
  }
  if(isWin) {
    command = '"' + adbWin + '"' + forceStop + ' && "' + adbWin + '"' + getRunningServices;
  }
  runCommand = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`${error.message}`);
        mainWindow.webContents.send('commandError', {'error': error.message});
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        mainWindow.webContents.send('commandError', {'error': stderr});
        return;
    }
    runningServices = stdout;
  });
  runCommand.stdout.on('data', (data) => {
    runningServices = data.toString();
    setTimeout(() => {
      startAccessibilityService(runningServices.trim());
    }, 1000);
  });
}
function startAccessibilityService(runningServices){
  let accesibilityAppName = 'com.jwlilly.accessibilityinspector/com.jwlilly.accessibilityinspector.AccessibilityInspector';
  let restartCommand = ' shell settings put secure enabled_accessibility_services ';
  let restartApp = ' shell am start-foreground-service com.jwlilly.accessibilityinspector/.SocketService '
  if(runningServices && runningServices.length > 0) {
    accesibilityAppName = ':' + accesibilityAppName;
  }
  if(!isWin) {
    command = '"' + adbMac + '"' + restartApp + '; "' + adbMac + '"' + restartCommand + runningServices + accesibilityAppName + ' ; "' + adbMac + '" forward tcp:38301 tcp:38301';
  }
  if(isWin) {
    command = '"' + adbWin + '"' + restartApp + '&& "' + '"' + adbWin + '"' + restartCommand + runningServices + accesibilityAppName + ' && "' + adbWin + '" forward tcp:38301 tcp:38301';
  }
  console.log(command);
  runCommand = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`${error.message}`);
        mainWindow.webContents.send('commandError', {'error': error.message});
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        mainWindow.webContents.send('commandError', {'error': stderr});
        return;
    }
  });
  setTimeout(() => {
    mainWindow.webContents.send('reconnect', {'data': ""});
  }, 5000);
}
