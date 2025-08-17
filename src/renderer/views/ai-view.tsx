import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import Markdown from 'react-markdown';
import OpenAiIcon from '../images/openai';

const { ipcRenderer } = window.electron;

const AiView = function AiView({ viewHierarchy, screencap }: any) {
  const ref = useRef<HTMLDialogElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [working, setWorking] = useState(false);
  const isProcessing = useRef(false);
  const charQueue = useRef([]);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
    setModalOpen(true);
  }, [ref]);
  const processQueue = () => {
    if (isProcessing.current) return; // already running
    isProcessing.current = true;
    setWorking(false);
    const interval = setInterval(() => {
      if (charQueue.current.length === 0) {
        clearInterval(interval);
        isProcessing.current = false;
        return;
      }
      // Append the next character
      setAiResponse((prev) => prev + charQueue.current.shift());
    }, 5); // 15ms per character
  };

  const updateWorking = useCallback(
    (isWorking: boolean) => {
      setWorking(isWorking);
    },
    [setWorking],
  );

  useEffect(() => {
    ipcRenderer.on('stream-chunk', (chunk) => {
      // Push all characters into the queue
      charQueue.current.push(...chunk.split(''));
      processQueue();
    });

    ipcRenderer.once('stream-end', () => {
      console.log('Stream finished');
      updateWorking(false);
    });

    ipcRenderer.once('stream-error', (event, message) => {
      console.error('Stream error:', message);
      updateWorking(false);
    });
  }, [updateWorking]);

  const startStreaming = () => {
    setAiResponse('');
    charQueue.current = [];
    ipcRenderer.invoke('analyze-accessibility', [
      JSON.stringify(viewHierarchy),
      screencap,
    ]);
  };

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const analyzeScreen = async () => {
    startStreaming();
    setWorking(true);
  };

  return (
    <div>
      <Button
        className="ml-2 btn-success btn-outline hover:fill-success-content fill-success"
        onClick={handleShow}
        aria-label="AI Analysis"
      >
        <OpenAiIcon className="h-[24px]" />
      </Button>
      <Modal
        ref={ref}
        ariaHidden={!modalOpen}
        onClose={handleClose}
        className="w-11/12 max-w-5xl"
      >
        <Modal.Header tabIndex={-1} className="font-bold scroll text-xl">
          <div className="flex flex-row">
            <div role="status">
              <OpenAiIcon
                aria-hidden={working ? null : true}
                aria-label="Waiting for response"
                className={`h-7 mr-4 fill-base-content ${working ? 'animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]' : ''}`}
              />
            </div>{' '}
            <h2>AI Analysis</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Button disabled={working} onClick={analyzeScreen}>
            GO
          </Button>
          <div className="prose max-w-full">
            <Markdown>{aiResponse}</Markdown>
          </div>
        </Modal.Body>

        <Modal.Actions>
          <form method="dialog">
            <Button tabIndex={!modalOpen ? -1 : 0}>Close</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AiView;
