import { IDevice } from 'adb-ts/lib/util';

const adb = {
  listDevices: (): Promise<IDevice[] | null> => {
    return window.electron.ipcRenderer.invoke('adb-list-devices');
  },
  forward: (device: IDevice): Promise<boolean> => {
    return window.electron.ipcRenderer.invoke('adb-forward', [device]);
  },
  screencap: (device: IDevice): Promise<string> => {
    return window.electron.ipcRenderer.invoke('adb-screencap', [device]);
  },
  isAppInstalled: (device: IDevice): Promise<string> => {
    return window.electron.ipcRenderer.invoke('adb-app-installed', [device]);
  },
  wifiConnectStart: (): Promise<string> => {
    return window.electron.ipcRenderer.invoke('wifi-connect-start', []);
  },
  wifiConnectStop: (): void => {
    window.electron.ipcRenderer.invoke('wifi-connect-stop', []);
  },
  startService: (device: IDevice): Promise<string> => {
    return window.electron.ipcRenderer.invoke('adb-start-service', [device]);
  },
  install: () => {},
};

export default adb;
