import React from "react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task Confirmation"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Task
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900 dark:text-slate-100">
            "{taskTitle || "this task"}"
          </strong>
          ? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};
