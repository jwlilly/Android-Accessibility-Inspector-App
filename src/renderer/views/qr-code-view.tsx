import { QrCodeIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button, Modal } from 'react-daisyui';
import adb from '../utils/adb';

const QrCodeView = function QrCodeView() {
  const [modalOpen, setModalOpen] = useState(false);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState('');
  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
    setModalOpen(true);
    adb
      .wifiConnectStart()
      .then((response) => {
        setCode(response);
        console.log(response);
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ref]);

  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      QRCode.toCanvas(canvasEl.current, code)
        .then(() => {
          console.log('canvas received');
          return true;
        })
        .catch((canvasError) => {
          console.log(canvasError);
        });
    }
  }, [code, canvasEl]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    adb.wifiConnectStop();
  }, []);
  return (
    <div>
      <Button
        aria-label="Logs"
        onClick={handleShow}
        color="ghost"
        className="px-0"
      >
        <QrCodeIcon title="Logs" className="h-full" />
      </Button>
      <Modal
        ref={ref}
        ariaHidden={!modalOpen}
        onClose={handleClose}
        className=""
      >
        <Modal.Header tabIndex={-1} className="font-bold scroll">
          <h2>QR Code</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center justify-center w-full h-full m-auto">
            <span>
              To pair an <span className="font-bold">Android 11+</span> device,
              scan the QR code from you device
            </span>
            <canvas
              // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
              role="img"
              aria-label="QR Code"
              className="w-full h-full p-4 mx-auto my-4 bg-white border rounded-md border-primary"
              ref={canvasEl}
              tabIndex={-1}
            />
            <h3 className="font-bold">QR scanner available at: </h3>
            <div>
              Developer options{' '}
              <span role="img" aria-label="then">
                &gt;
              </span>{' '}
              Wireless debugging{' '}
              <span role="img" aria-label="then">
                &gt;
              </span>{' '}
              Pair using QR code
            </div>
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

export default QrCodeView;
