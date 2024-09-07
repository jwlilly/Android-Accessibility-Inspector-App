import { IDevice } from 'adb-ts/lib/util';

const adb = {
  listDevices: (): Promise<IDevice[] | null> => {
    return window.electron.ipcRenderer.invoke('adb-list-devices');
  },
  forwardPort: () => {},
  install: () => {},
};

export default adb;
