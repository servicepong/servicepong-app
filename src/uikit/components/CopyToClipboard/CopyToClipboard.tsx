import { FC } from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

interface CopyToClipboardProps {
  text: string;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ text }) => {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <>
      <IconButton
        onClick={copy}
        size="sm"
        aria-label="copy"
        icon={<CopyIcon />}
      />
    </>
  );
};

export { CopyToClipboard };
