import { Dialog, DialogBackdrop, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type ConfirmDeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: React.ReactNode;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 flex items-center justify-center text-center"
    >
      <div className="bg-white p-6 rounded shadow-md">
        <DialogTitle className="font-bold text-yellow-500">
          <div className="flex justify-center">
            <ExclamationTriangleIcon className="size-10" />
          </div>
          Suppression d&apos;une tâche
        </DialogTitle>
        <DialogBackdrop className="mt-2">{message}</DialogBackdrop>
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 w-32"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded w-32"
          >
            Supprimer
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
