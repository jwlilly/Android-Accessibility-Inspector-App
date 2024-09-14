import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { IDevice } from 'adb-ts/lib/util';
import adb from '../utils/adb';

const RefreshTree = function RefreshTree({
  onMessageReceived,
  device,
  onScreencapReceived,
}: any) {
  const socketUrl = 'ws://127.0.0.1:38301/';
  const [url, setUrl] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('connection opened'),
    shouldReconnect: () => true,
    reconnectAttempts: 30,
  });
  useEffect(() => {
    if (lastMessage !== null) {
      onMessageReceived(JSON.parse(lastMessage.data));
    }
    if (device !== null) {
      setUrl(socketUrl);
    }
  }, [lastMessage, onMessageReceived, device]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleClickSendMessage = async () => {
    sendMessage('{"message":"capture"}');
    const selectedDevice = device as IDevice;
    onScreencapReceived(await adb.screencap(selectedDevice));
  };

  return (
    <div>
      <Button
        onClick={handleClickSendMessage}
        color="primary"
        aria-label="Refresh Tree"
        disabled={readyState !== ReadyState.OPEN || device == null}
      >
        <ArrowPathIcon
          className={`h-[24px] ${readyState === ReadyState.CONNECTING && 'motion-safe:animate-spin'}`}
          title="Refresh Tree"
        />
      </Button>
      {/* <div
        className={`inline ${readyState !== ReadyState.OPEN && readyState !== ReadyState.CONNECTING ? 'text-error' : 'text-primary'} ${readyState === ReadyState.OPEN ? ' hidden' : ''}`}
      >
        {connectionStatus}
        {device && device.id}
      </div> */}
    </div>
  );
};

export default RefreshTree;
