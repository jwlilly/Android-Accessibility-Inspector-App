import { ArrowPathIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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
  const [captureNotImportant, setCaptureNotImportant] = useState(false);
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
    }
  }, [lastMessage, onMessageReceived, device, url]);

  const handleClickSendMessage = async () => {
    if (captureNotImportant) {
      sendMessage('{"message":"captureNotImportant"}');
    } else {
      sendMessage('{"message":"capture"}');
    }
    const selectedDevice = device as IDevice;
    onScreencapReceived(await adb.screencap(selectedDevice));
  };

  const toggleNotImportant = () => {
    setCaptureNotImportant(!captureNotImportant);
  };

  return (
    <div className="flex flex-row">
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
      <Button
        className={`ml-2 ${captureNotImportant ? 'btn-primary' : 'btn-secondary'} btn-outline `}
        onClick={toggleNotImportant}
        aria-pressed={captureNotImportant}
        active={captureNotImportant}
        aria-label="show not important for accessibility views"
      >
        <EyeSlashIcon
          className="h-[24px]"
          title="show not important for accessibility views"
        />
      </Button>
    </div>
  );
};

export default RefreshTree;
