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
  install: () => {},
};

export default adb;
