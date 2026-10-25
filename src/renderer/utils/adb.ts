import { IDevice } from 'adb-ts/lib/util';
import type { CompanionStatus, CompanionVersion } from '../../main/main';

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
  companionStatus: (device: IDevice): Promise<CompanionStatus> => {
    return window.electron.ipcRenderer.invoke('adb-companion-status', [device]);
  },
  expectedCompanionVersion: (): Promise<CompanionVersion | null> => {
    return window.electron.ipcRenderer.invoke('companion-expected-version');
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
  installApp: (device: IDevice): Promise<void> => {
    return window.electron.ipcRenderer.invoke('adb-install-app', [device]);
  },
};

export default adb;
