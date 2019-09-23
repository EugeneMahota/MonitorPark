import {app, BrowserWindow, ipcMain} from 'electron';

const nodeCmd = require('node-cmd');

import * as path from 'path';
import * as url from 'url';
import * as os from 'os';

let win: BrowserWindow;
const networkInterfaces = os.networkInterfaces();

app.on('ready', createWindow);

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({fullscreen: true});

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/MonitorPark/index.html`),
      protocol: 'file:',
      slashes: true,
      kiosk: true,
      webSecurity: false
    })
  );

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}


ipcMain.on('getIpAddress', (event, arg) => {
  event.sender.send('getIpAddress', networkInterfaces);
});

ipcMain.on('Temp', (event, arg) => {
  nodeCmd.get('vcgencmd measure_temp', (err, data) => {
    event.sender.send('Temp', data);
  });
});
