/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Select, Button } from 'react-daisyui';
import { IDevice } from 'adb-ts/lib/util';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import adb from '../utils/adb';
import QrCodeView from './qr-code-view';

const ConnectDevice = function ConnectDevice({ onDeviceConnected }: any) {
  const [devices, setDevices] = useState<IDevice[] | null>(null);
  const [deviceValue, setDeviceValue] = useState<number>(0);
  const [appInstalled, setAppInstalled] = useState<number>(0);
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  let runOnce = true;
  const AppStatus = {
    UNKNOWN: 0,
    INSTALLED: 1,
    NOT_INSTALLED: 2,
  };
  if (!devices && runOnce) {
    adb
      .listDevices()
      .then((response) => {
        setDevices(response);
        if (response && response.length === 1) {
          onDeviceConnected(response[0]);
        }
        return null;
      })
      .catch((error) => console.log(error));

    runOnce = false;
  }

  const deviceConnected = (device: IDevice) => {
    onDeviceConnected(device);
  };

  const refreshDevices = () => {
    adb
      .listDevices()
      .then((response) => {
        console.log(response);
        setDevices(response);
        return null;
      })
      .catch((error) => console.log(error));
  };

  const deviceDescription = (device: IDevice): string => {
    if (device && device.state && device.id && device.model) {
      if (device.state.includes('offline')) {
        return 'offline';
      }
      if (device.id.includes('adb-tls-connect')) {
        return 'wifi';
      }
      if (device.state.includes('emulator')) {
        return 'virtual';
      }
      if (device.state.includes('device')) {
        return 'physical';
      }
    }
    return '';
  };

  const deviceOptions =
    devices !== null && devices.length > 0 ? (
      devices.map((device, index) => {
        return (
          <Select.Option
            disabled={device.state === 'offline'}
            value={index}
            key={device.id}
          >
            {device.model} - {deviceDescription(device)}
          </Select.Option>
        );
      })
    ) : (
      <Select.Option disabled value={0}>
        No devices found
      </Select.Option>
    );

  const forwardPort = (device: IDevice) => {
    adb
      .forward(device)
      .then((response) => console.log('device connected ', response))
      .catch((error) => console.log(error));
    deviceConnected(device);
  };

  const startService = (device: IDevice) => {
    adb
      .startService(device)
      .then(() => {
        console.log('service started');
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectDevice = (index: number) => {
    if (index >= 0) {
      const device = devices![index];
      setSelectedDevice(device);
      adb
        .logcat(device)
        .then(() => {
          console.log('logcat');
          return true;
        })
        .catch((error) => {
          console.log(error);
        });
      adb
        .isAppInstalled(device)
        // do something if the app is not installed
        .then((response) => {
          setAppInstalled(
            response ? AppStatus.INSTALLED : AppStatus.NOT_INSTALLED,
          );
          setTimeout(() => {
            startService(device);
          }, 1000);
          return true;
        })
        .catch((error) => {
          console.log(error);
          setAppInstalled(AppStatus.UNKNOWN);
        });
      forwardPort(device);
    }
  };

  const installApp = () => {
    if (selectedDevice) {
      adb
        .installApp(selectedDevice)
        .then(() => {
          selectDevice(deviceValue);
          return null;
        })
        .catch(null);
    }
  };

  const deviceOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setDeviceValue(parseInt(event.target.value, 10));
  };

  const deviceSelect = (
    <div className="flex w-full max-w-xs col-span-5 row-span-4 form-control">
      <div className="label">
        <label htmlFor="device" className="label-text">
          Select a device
        </label>
        <button
          onClick={refreshDevices}
          type="button"
          className="label-text-alt link"
        >
          Refresh Devices
        </button>
      </div>
      <Select
        id="device"
        value={deviceValue}
        onChange={(event) => deviceOnChange(event)}
        className="w-full max-w-xs select-primary"
        aria-describedby="developer-mode"
      >
        {deviceOptions}
      </Select>
      <div className="label">
        <div id="developer-mode" className="label-text-alt">
          <a
            className="link"
            href="https://developer.android.com/studio/debug/dev-options"
            target="_blank"
            rel="noreferrer"
          >
            <span className="flex flex-row">
              Enable developer mode and debugging{' '}
              <ArrowTopRightOnSquareIcon
                className="h-3"
                role="img"
                aria-label="Opens in your browser"
                aria-hidden="false"
              />
            </span>
          </a>
        </div>
        <div className="label-text-alt">
          <QrCodeView />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-row items-center justify-center w-full gap-2 p-4 font-sans">
        {deviceSelect}
        <div className="col-span-1 mb-[30px]">
          <Button
            onClick={() => selectDevice(deviceValue)}
            disabled={
              devices === null ||
              devices.length <= 0 ||
              devices[deviceValue].state === 'offline'
            }
            color="primary"
          >
            Connect
          </Button>
        </div>
      </div>
      <div role="status" className="flex flex-row justify-center">
        {appInstalled === AppStatus.NOT_INSTALLED ? (
          <>
            <h2 className="sr-only">Companion app not installed</h2>
            <Button
              color="error"
              className="font-extrabold motion-safe:animate-pulse"
              onClick={installApp}
            >
              Install companion app
            </Button>
          </>
        ) : null}
        {appInstalled === AppStatus.INSTALLED ? (
          <div className="sr-only">
            Device selected and companion app is installed
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ConnectDevice;
