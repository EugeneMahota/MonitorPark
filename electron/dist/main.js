"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var nodeCmd = require('node-cmd');
var path = require("path");
var url = require("url");
var os = require("os");
var win;
var networkInterfaces = os.networkInterfaces();
electron_1.app.on('ready', createWindow);
electron_1.app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ fullscreen: true });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/MonitorPark/index.html"),
        protocol: 'file:',
        slashes: true,
        kiosk: true,
        webSecurity: false
    }));
    // win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('getIpAddress', function (event, arg) {
    event.sender.send('getIpAddress', networkInterfaces);
});
electron_1.ipcMain.on('Temp', function (event, arg) {
    nodeCmd.get('vcgencmd measure_temp', function (err, data) {
        event.sender.send('Temp', data);
    });
});
//# sourceMappingURL=main.js.map