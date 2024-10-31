import { fetchUsers } from "@/services/userService";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FormEvent, useEffect, useState } from "react";

type Task = {
  id?: number;
  userId: number;
  label: string;
  status: number;
};

type User = {
  id: number;
  name: string;
  firstName: string;
};

type AddTaskFormProps = {
  onSubmit: (newTask: Task) => void;
  onClose: () => void;
  isOpen: boolean;
  task?: Task;
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onSubmit,
  onClose,
  isOpen,
  task,
}) => {
  const STATUS_MAP = {
    "En cours": 0,
    Bloqué: 1,
    Terminé: 2,
  };
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<Task["status"]>(STATUS_MAP["En cours"]);
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const title = task ? "Modification de la tâche" : "Ajout de tâche";

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (task) {
      setLabel(task.label);
      setStatus(task.status);
      setUserId(task.userId);
    }
  }, [task]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!label) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const newTask: Task = {
      id: task?.id,
      userId: userId!,
      label: label,
      status: status,
    };

    onSubmit(newTask);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed z-10 inset-0 flex items-center justify-center text-center"
      >
        <DialogBackdrop
          transition
          className="bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5">
                <div className="mt-3">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-yellow-500"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label
                          htmlFor="label"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Libellé de la tâche
                        </label>
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="userId"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Attribution
                        </label>
                        <select
                          value={userId || ""}
                          onChange={(e) => setUserId(Number(e.target.value))}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Pas d&apos;attribution</option>
                          {users.map((user: User) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Statut
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(Number(e.target.value))}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value={0}>En cours</option>
                          <option value={1}>Bloqué</option>
                          <option value={2}>Terminé</option>
                        </select>
                      </div>
                      <div className="flex justify-end mt-5">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                          onClick={onClose}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-nav-btn-color px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 ml-5"
                        >
                          {task ? "Modifier" : "Ajouter"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddTaskForm;
