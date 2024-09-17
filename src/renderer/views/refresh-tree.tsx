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
  onDisconnected,
}: any) {
  const socketUrl = 'ws://127.0.0.1:38301/';
  const [url, setUrl] = useState('');
  const reconnectStopped = () => {
    setUrl('');
    console.log('reconnection stopped', url);
    onDisconnected();
  };
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('connection opened'),
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    onReconnectStop: () => reconnectStopped(),
  });
  useEffect(() => {
    if (lastMessage !== null) {
      onMessageReceived(JSON.parse(lastMessage.data));
    }
    if (device !== null) {
      setUrl(socketUrl);
      console.log("device not null", url);
    }
    if (device === null) {
      console.log("device null", url);
    }
  }, [lastMessage, onMessageReceived, device, url]);

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
