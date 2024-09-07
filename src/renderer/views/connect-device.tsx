import React, { useState } from 'react';
import { Select, Button } from 'react-daisyui';
import { IDevice } from 'adb-ts/lib/util';
import adb from '../utils/adb';

const ConnectDevice = function () {
  const [devices, setDevices] = useState<IDevice[] | null>(null);
  if (!devices) {
    adb
      .listDevices()
      .then((response) => {
        setDevices(response);
        return null;
      })
      .catch((error) => console.log(error));
  }

  const deviceOptions = devices ? (
    devices.map((device) => {
      return (
        <Select.Option value={device.id} key={device.id}>
          {device.device}
        </Select.Option>
      );
    })
  ) : (
    <Select.Option>No devices found</Select.Option>
  );

  const deviceSelect = (
    <div>
      <label htmlFor="device" className="label">
        <span className="label-text">Select a device</span>
        <Select id="device">{deviceOptions}</Select>
      </label>
    </div>
  );

  return (
    <div>
      <div>{devices && devices.length > 0 ? deviceSelect : null}</div>
      <div>
        <Button>Select</Button>
      </div>
    </div>
  );
};

export default ConnectDevice;
