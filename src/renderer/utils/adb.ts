import { IDevice } from 'adb-ts/lib/util';

const adb = {
  listDevices: (): Promise<IDevice[] | null> => {
    return window.electron.ipcRenderer.invoke('adb-list-devices');
  },
  forward: (device: IDevice): Promise<boolean> => {
    return window.electron.ipcRenderer.invoke('adb-forward', [device]);
  },
  install: () => {},
};

export default adb;
