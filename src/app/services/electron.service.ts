import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private ipc: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }


  async getIpAddress() {
    return new Promise((resolve, reject) => {
      this.ipc.once('getIpAddress', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getIpAddress');
    });
  }

  async getTemp() {
    return new Promise((resolve, reject) => {
      this.ipc.once('Temp', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('Temp');
    });
  }
}
