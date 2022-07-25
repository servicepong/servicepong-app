import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface ConfirmModalInterface {
  title: string;
  text: string;
  onConfirm: () => void;
}

interface ConfirmModalContextInterface {
  confirmModalData: ConfirmModalInterface | null;
  setConfirmModalData: Dispatch<SetStateAction<ConfirmModalInterface | null>>;
}

const ConfirmModalContext = createContext<
  ConfirmModalContextInterface | undefined
>(undefined);

interface ConfirmModalProviderProps {
  children: ReactNode;
}

export const ConfirmModalProvider: FC<ConfirmModalProviderProps> = ({
  children,
}) => {
  const context = useProvideConfirmModal();

  return (
    <ConfirmModalContext.Provider value={context}>
      {children}
    </ConfirmModalContext.Provider>
  );
};

const useProvideConfirmModal = () => {
  const [confirmModalData, setConfirmModalData] =
    useState<ConfirmModalInterface | null>(null);

  return {
    confirmModalData,
    setConfirmModalData,
  };
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);

  if (!context) {
    throw new Error(
      'Must be wrapped in <ConfirmModalProvider></ConfirmModalProvider>'
    );
  }

  return context as ConfirmModalContextInterface;
};
