/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Select, Button } from 'react-daisyui';
import { IDevice } from 'adb-ts/lib/util';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import adb from '../utils/adb';

const ConnectDevice = function ConnectDevice() {
  const [devices, setDevices] = useState<IDevice[] | null>(null);
  const [deviceValue, setDeviceValue] = useState<number>(0);
  let runOnce = true;

  if (!devices && runOnce) {
    adb
      .listDevices()
      .then((response) => {
        setDevices(response);
        return null;
      })
      .catch((error) => console.log(error));

    runOnce = false;
  }

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

  const deviceOptions =
    devices !== null && devices.length > 0 ? (
      devices.map((device, index) => {
        return (
          <Select.Option
            disabled={device.state === 'offline'}
            value={index}
            key={device.id}
          >
            {device.model} - {device.state}
          </Select.Option>
        );
      })
    ) : (
      <Select.Option disabled value={0}>
        No devices found
      </Select.Option>
    );

  const selectDevice = (index: number) => {
    if (index >= 0) {
      adb
        .forward(devices![index])
        .then((response) => console.log('device connected ', response))
        .catch((error) => console.log(error));
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
      >
        {deviceOptions}
      </Select>
      <div className="label">
        <div className="label-text-alt" />
        <div className="label-text-alt">
          <Button
            aria-label="Connect with QR code"
            color="ghost"
            className="px-0"
          >
            <QrCodeIcon className="h-full" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-row items-center justify-center w-full gap-2 p-4">
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
  );
};

export default ConnectDevice;
