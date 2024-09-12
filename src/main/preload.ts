// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const validChannels = [
  'adb-list-devices',
  'adb-forward',
  'ipc-example',
  'adb-screencap',
];

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]) {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      }
      return null;
    },
    once(channel: string, func: (...args: unknown[]) => any) {
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
    invoke(channel: string, args?: any): Promise<any | null> {
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
      }
      return Promise.resolve(null);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
