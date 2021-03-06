import React, { useState } from 'react';
import { Button } from 'src/components/Common/Button/Button';
import { Modal } from 'src/components/Common/Modal/Modal';
import { ReactChild } from 'src/types';
import TextareaAutosize from 'react-textarea-autosize';
import style from './ButtonWith.module.scss';

interface IProps {
  text: string;
  onConfirm: (promptAnswer: string) => void;
  children: ReactChild | ReactChild[];
}

export function ButtonWithPromptModal({ text, onConfirm, children }: IProps) {
  const [showModal, setShowModal] = useState(false);
  const [promptAnswer, setPromptAnswer] = useState('');
  const confirmAndClose = () => {
    onConfirm(promptAnswer);
    setShowModal(false);
  };
  return (
    <>
      <Button onClick={() => setShowModal(true)}>{text}</Button>
      {showModal && (
        <Modal header={text} closeModal={() => setShowModal(false)}>
          <>
            {children}
            <TextareaAutosize
              className={style.textArea}
              value={promptAnswer}
              onChange={event => setPromptAnswer(event.target.value)}
              minRows={5}
            />
            <Button color={'White'} onClick={confirmAndClose}>
              {text}
            </Button>
          </>
        </Modal>
      )}
    </>
  );
}
