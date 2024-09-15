// components/Modal.tsx

import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    body: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function Modal({ isOpen, title, body, onConfirm, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <p>{body}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Confirm</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
}
