import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useCallback, useRef, useState } from 'react';
import { Button, Modal } from 'react-daisyui';

const Logs = function Logs() {
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
    setModalOpen(true);
  }, [ref]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);
  return (
    <div className="font-sans">
      <Button aria-label="Logs" onClick={handleShow} color="ghost">
        <InformationCircleIcon title="Logs" className="h-[24px]" />
      </Button>
      <Modal
        ref={ref}
        ariaHidden={!modalOpen}
        onClose={handleClose}
        className="w-11/12 max-w-5xl"
      >
        <Modal.Header tabIndex={-1} className="font-bold scroll">
          Logs
        </Modal.Header>
        <Modal.Body>Logs go here</Modal.Body>
        <Modal.Actions>
          <form method="dialog">
            <Button tabIndex={!modalOpen ? -1 : 0}>Close</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Logs;
