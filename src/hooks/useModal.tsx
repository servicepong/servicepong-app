import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface ModalInterface {
  title: string;
  content: ReactNode;
}

interface ModalContextInterface {
  modalData: ModalInterface | null;
  setModalData: Dispatch<SetStateAction<ModalInterface | null>>;
}

const ModalContext = createContext<ModalContextInterface | undefined>(
  undefined
);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const context = useProvideModal();

  return (
    <ModalContext.Provider value={context}>{children}</ModalContext.Provider>
  );
};

const useProvideModal = () => {
  const [modalData, setModalData] = useState<ModalInterface | null>(null);

  return {
    modalData,
    setModalData,
  };
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Must be wrapped in <ModalProvider></ModalProvider>');
  }

  return context as ModalContextInterface;
};
