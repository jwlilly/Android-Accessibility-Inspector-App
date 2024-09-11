import { ArrowPathIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { Button } from 'react-daisyui';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const RefreshTree = function RefreshTree({ onMessageReceived }: any) {
  const socketUrl = 'ws://127.0.0.1:38301/';

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connection opened'),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage !== null) {
      onMessageReceived(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleClickSendMessage = () => {
    sendMessage('{"message":"capture"}');
  };

  return (
    <div>
      <Button
        onClick={handleClickSendMessage}
        color="primary"
        aria-label="Refresh Tree"
      >
        <ArrowPathIcon className="h-[24px]" title="Refresh Tree" />
      </Button>
      <div
        className={`inline ${readyState !== ReadyState.OPEN && readyState !== ReadyState.CONNECTING ? 'text-error' : 'text-primary'}`}
      >
        {connectionStatus}
      </div>
    </div>
  );
};

export default RefreshTree;
