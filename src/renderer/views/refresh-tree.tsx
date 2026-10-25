import { ArrowPathIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { IDevice } from 'adb-ts/lib/util';
import adb from '../utils/adb';

// Companion apps older than 1.2.0 never answer the version request
const VERSION_TIMEOUT_MS = 3000;

const RefreshTree = function RefreshTree({
  onMessageReceived,
  device,
  connectRequest,
  onScreencapReceived,
  onDisconnected,
  onCompanionVersionMissing,
}: any) {
  const socketUrl = 'ws://127.0.0.1:38301/';
  // null means "not connected". react-use-websocket only resets its reconnect
  // counter when the url is null, so '' would leave a reconnect with no retries.
  const [url, setUrl] = useState<string | null>(null);
  const [pendingConnect, setPendingConnect] = useState(false);
  const [captureNotImportant, setCaptureNotImportant] = useState(false);
  const versionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectStopped = () => {
    setUrl(null);
    console.log('reconnection stopped');
    onDisconnected();
  };
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => {
      console.log('connection opened');
      sendMessage('{"message":"version"}');
      if (versionTimeout.current) {
        clearTimeout(versionTimeout.current);
      }
      versionTimeout.current = setTimeout(
        () => onCompanionVersionMissing(),
        VERSION_TIMEOUT_MS,
      );
    },
    shouldReconnect: () => true,
    reconnectAttempts: 30,
    onReconnectStop: () => reconnectStopped(),
  });

  const messageReceived = useCallback(
    (data: any) => {
      onMessageReceived(data);
    },
    [onMessageReceived],
  );

  // Only handle each websocket message once, even when other dependencies change
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'version' && versionTimeout.current) {
        clearTimeout(versionTimeout.current);
        versionTimeout.current = null;
      }
      messageReceived(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // Every connect starts fresh: drop to null for one render so the reconnect
  // counter resets, then connect again.
  useEffect(() => {
    if (device !== null) {
      setUrl(null);
      setPendingConnect(true);
    }
  }, [device, connectRequest]);

  useEffect(() => {
    if (pendingConnect && url === null) {
      setPendingConnect(false);
      setUrl(socketUrl);
    }
  }, [pendingConnect, url]);

  useEffect(() => {
    return () => {
      if (versionTimeout.current) {
        clearTimeout(versionTimeout.current);
      }
    };
  }, []);

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
