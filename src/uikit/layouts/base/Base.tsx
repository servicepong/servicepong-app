import { FC, ReactNode, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { useConfirmModal } from '@hooks/useConfirmModal';
import { useModal } from '@hooks/useModal';
import { Header } from '@uikit/components';
import { Footer } from '@uikit/components/Footer';

interface BaseProps {
  children: ReactNode;
}

const Base: FC<BaseProps> = ({ children }) => {
  const { modalData, setModalData } = useModal();
  const { confirmModalData, setConfirmModalData } = useConfirmModal();
  const cancelRef = useRef(null);

  const confirm = () => {
    confirmModalData?.onConfirm();
    setConfirmModalData(null);
  };

  return (
    <>
      <Header />
      <main>{children}</main>
      <Modal isOpen={modalData !== null} onClose={() => setModalData(null)}>
        {modalData && (
          <>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{modalData.title}</ModalHeader>
              <ModalCloseButton />
              {modalData.content}
            </ModalContent>
          </>
        )}
      </Modal>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmModalData(null)}
        isOpen={setConfirmModalData !== null}
        isCentered
      >
        {confirmModalData && (
          <>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>{confirmModalData.title}</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>{confirmModalData.text}</AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setConfirmModalData(null)}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" ml={3} onClick={confirm}>
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </>
        )}
      </AlertDialog>
      <Footer />
    </>
  );
};

export { Base };
