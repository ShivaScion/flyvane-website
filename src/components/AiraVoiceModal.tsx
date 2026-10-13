import type { FC } from 'react';
import { AiraCompanion } from './AiraCompanion';

interface AiraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (query: string) => void;
}

export const AiraVoiceModal: FC<AiraVoiceModalProps> = ({
  isOpen,
  onClose,
  onCommand,
}) => {
  return (
    <AiraCompanion
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) onClose();
      }}
      onSetMode={(mode) => onCommand(`mode ${mode}`)}
    />
  );
};

export default AiraVoiceModal;
