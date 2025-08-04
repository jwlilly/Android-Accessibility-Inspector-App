import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal, Tabs } from 'react-daisyui';

const Logs = function Logs({ messages }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [logMessages, setLogMessages] = useState(messages);
  const [speechOutputMessages, setSpeechOutputMessages] = useState([]);

  useEffect(() => {
    setLogMessages(messages);
  }, [messages]);

  const speechContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electron.ipcRenderer.on('speech-output', (arg) => {
      // console.log(arg);
      if (modalOpen) {
        setSpeechOutputMessages([...speechOutputMessages, arg]);
      }
    });
    if (modalOpen) {
      const containerParent = speechContainer.current?.parentElement;
      if (containerParent) {
        // containerParent.scrollTop = containerParent.scrollHeight;
        containerParent.scrollTo({
          top: containerParent.scrollHeight,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [
    setSpeechOutputMessages,
    speechOutputMessages,
    speechContainer,
    modalOpen,
  ]);

  const clearSpeechOutput = () => {
    setSpeechOutputMessages([]);
  };

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
    setModalOpen(true);
  }, [ref]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div>
      <Button aria-label="Logs" onClick={handleShow} color="ghost">
        <InformationCircleIcon title="Logs" className="h-[24px]" />
      </Button>
      <Modal
        ref={ref}
        ariaHidden={!modalOpen}
        onClose={handleClose}
        className="w-11/12 max-w-5xl h-[calc(100vh-8em)] max-h-5xl overflow-hidden"
        aria-labelledby="dialog-title"
      >
        <Modal.Header id="dialog-title" tabIndex={-1} className="font-bold">
          Message Log
        </Modal.Header>
        <Modal.Body>
          <Tabs variant="lifted">
            <Tabs.RadioTab
              name="my_tabs_2"
              label="Announcements"
              contentClassName="bg-base-100 border-base-content rounded-box p-6 h-[calc(100vh-22em)] max-h-[calc(100vh-22em)] overflow-auto"
              defaultChecked
            >
              <div
                role="tabpanel"
                className="p-3 focus:outline-base-content"
                tabIndex={0}
              >
                <table className="table mx-2 table-zebra-zebra" role="status">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[30%}" />
                    <col className="w-[50%]" />
                  </colgroup>
                  <thead className="text-primary-content bg-primary">
                    <tr>
                      <th>timestamp</th>
                      <th>type</th>
                      <th>message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logMessages !== null && logMessages.length > 0
                      ? logMessages.map(
                          (logMessage: {
                            time: string;
                            message: string;
                            type: string;
                            id: number;
                          }) => {
                            return (
                              <tr key={logMessage.id}>
                                <td>{logMessage.time}</td>
                                <td>{logMessage.type}</td>
                                <td>{logMessage.message}</td>
                              </tr>
                            );
                          },
                        )
                      : null}
                    <tr />
                  </tbody>
                </table>
              </div>
            </Tabs.RadioTab>
            <Tabs.RadioTab
              name="my_tabs_2"
              label="Speech Output"
              contentClassName="bg-base-100 border-base-content rounded-box p-6 h-[calc(100vh-22em)] overflow-auto"
            >
              <div
                role="tabpanel"
                className="p-3 focus:outline-base-content"
                tabIndex={0}
                ref={speechContainer}
              >
                <div className="flex w-full flex-row">
                  <p className="p-4 card block shadow-md bg-base-100 rounded-box">
                    The logging for TalkBack needs to be set to VERBOSE in order
                    to capture the speech output. Go to{' '}
                    <span className="font-extrabold">Settings</span> &gt;{' '}
                    <span className="font-extrabold">Accessibility</span> &gt;{' '}
                    <span className="font-extrabold">TalkBack</span> &gt;{' '}
                    <span className="font-extrabold">Settings</span> &gt;{' '}
                    <span className="font-extrabold">Advanced settings</span>{' '}
                    &gt;{' '}
                    <span className="font-extrabold">Developer settings</span>.
                    Select Log output level and set it to VERBOSE.
                  </p>
                  <div className="divider divider-horizontal"></div>
                  <Button
                    variant="outline"
                    color="error"
                    className="h-auto w-[12%] stroke-error hover:stroke-error-content hover:!text-error-content"
                    title="Clear speech output"
                    aria-label="Clear speech output"
                    onClick={clearSpeechOutput}
                  >
                    <TrashIcon className="h-[36px]" />
                  </Button>
                </div>
                <div role="status">
                  {speechOutputMessages !== null &&
                  speechOutputMessages.length > 0
                    ? speechOutputMessages.map(
                        (speechOutputMessage: {
                          message: string;
                          hint: string;
                        }) => {
                          return (
                            <ul className="border-b p-4">
                              <li className="text-primary">
                                <span className="sr-only select-none">
                                  announcement:
                                </span>
                                <span>{speechOutputMessage.message}</span>
                              </li>
                              <li
                                className="pl-4 text-secondary"
                                aria-hidden={speechOutputMessage.hint === ''}
                              >
                                <span className="sr-only select-none">
                                  hint:
                                </span>
                                <span>{speechOutputMessage.hint}</span>
                              </li>
                            </ul>
                          );
                        },
                      )
                    : null}
                </div>
              </div>
            </Tabs.RadioTab>
          </Tabs>
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

export default Logs;
