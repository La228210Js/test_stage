import {
  deleteTask,
  exportTasks,
  fetchTasks,
  updateTask,
} from "@/services/taskService";
import { fetchUsers, fetchUserById } from "@/services/userService";
import { useEffect, useState } from "react";
import { createTask } from "@/services/taskService";
import AddTaskForm from "./AddTaskForm";
import {
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
} from "@heroicons/react/16/solid";
import { DocumentTextIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Task = {
  id: number;
  userId: number;
  label: string;
  status: number;
};

type User = {
  id: number;
  name: string;
  firstName: string;
};

const TaskList: React.FC = () => {
  const STATUS_MAP = {
    "En cours": 0,
    Bloqué: 1,
    Terminé: 2,
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const tasksPerPage = 7;
  const [showAddTask, setShowAddTask] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleAddTaskClick = () => {
    setShowAddTask(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowAddTask(true);
  };

  const handleTaskSubmit = async (newTask: Omit<Task, "id">) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setShowAddTask(false);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur inconnue lors de la création de la tâche");
      }
    }
  };

  const handleDelete = async () => {
    if (taskIdToDelete === null) return;

    try {
      await deleteTask(taskIdToDelete);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskIdToDelete)
      );
      setError(null);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche : ${error}`);
      setError("Impossible de supprimer la tâche");
    } finally {
      setTaskIdToDelete(null);
    }
  };

  const handleEditSubmit = async (updatedTask: Omit<Task, "id">) => {
    if (!editingTask) return;

    try {
      const taskWithId: Task = { ...editingTask, ...updatedTask };
      await updateTask(taskWithId);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskWithId.id ? { ...task, ...updatedTask } : task
        )
      );

      setShowAddTask(false);
      setEditingTask(null);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche", error);
      setError("Erreur lors de la modification de la tâche");
    }
  };

  const openConfirmDeleteModal = (id: number) => {
    setTaskIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const convertStatus = (status: number): "En cours" | "Bloqué" | "Terminé" => {
    switch (status) {
      case 0:
        return "En cours";
      case 1:
        return "Bloqué";
      case 2:
        return "Terminé";
      default:
        throw new Error("Statut de tâche inconnu");
    }
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const matchesUser = selectedUserId
        ? task.userId === selectedUserId
        : true;
      const matchesStatus =
        selectedStatus !== null ? task.status === selectedStatus : true;
      const matchesLabel = task.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesUser && matchesStatus && matchesLabel;
    });
  };

  type StatusKey = keyof typeof STATUS_MAP;

  const isStatusKey = (key: string): key is StatusKey => {
    return key in STATUS_MAP;
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusValue = event.target.value;
    if (isStatusKey(statusValue)) {
      setSelectedStatus(STATUS_MAP[statusValue]);
    }
  };

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    fetchTasks(currentPage, tasksPerPage)
      .then(async (response) => {
        const allTasks = response.tasks || [];
        const filteredTasks = filterTasks(allTasks);
        setTasks(filteredTasks);
        setTotalPages(Math.ceil(response.totalTasks / tasksPerPage));
        setError(null);

        const userNamesMap: { [key: number]: string } = {};
        await Promise.all(
          allTasks.map(async (task: Task) => {
            if (task.userId != null) {
              try {
                if (!userNamesMap[task.userId]) {
                  const firstName = await fetchUserById(task.userId);
                  userNamesMap[task.userId] =
                    firstName || "Pas d'utilisateur attribué";
                }
              } catch (error) {
                const userError = error as { message: string };
                console.error(userError.message);
                userNamesMap[task.userId] = `Erreur : ${userError.message}`;
              }
            } else {
              userNamesMap[task.userId] = "Pas d'utilisateur attribué";
            }
          })
        );
        setUserNames((prevUserNames) => ({
          ...prevUserNames,
          ...userNamesMap,
        }));
      })
      .catch((error) => {
        console.error(error);
        setError(
          "Une erreur s'est produite lors de la récupération des tâches"
        );
      });
  }, [currentPage, selectedUserId, selectedStatus, searchTerm]);

  return (
    <div className="w-4/5">
      <div className="flex justify-between">
        <button
          onClick={handleAddTaskClick}
          className="btn-primary bg-nav-btn-color text-white px-4 py-2 my-6 rounded-md"
        >
          Ajouter une tâche
        </button>
        {showAddTask && (
          <AddTaskForm
            isOpen={showAddTask}
            onSubmit={editingTask ? handleEditSubmit : handleTaskSubmit}
            onClose={() => {
              setShowAddTask(false);
              setEditingTask(null);
            }}
            task={editingTask || undefined}
          />
        )}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Rechercher sur le libellé"
            className="border border-gray-950 h-8 w-52 rounded-xl mt-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={exportTasks}>
            <DocumentTextIcon className="size-10 text-green-500" />
          </button>
          <button onClick={() => setIsFilterModalOpen(true)}>
            <FunnelIcon className="size-10 text-gray-500" />
          </button>
        </div>
      </div>
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-bold">Filtrer les tâches</h3>
            <div className="mt-4">
              <label className="block text-yellow-500">Attribution</label>
              <select
                className="border rounded w-full"
                value={selectedUserId || ""}
                onChange={(e) =>
                  setSelectedUserId(Number(e.target.value) || null)
                }
              >
                <option value="">Tous les utilisateurs</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-yellow-500">Statut</label>
              <select
                className="border rounded w-full"
                onChange={handleStatusChange}
              >
                <option value="">Tous les statuts</option>
                {Object.keys(STATUS_MAP).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  setSelectedUserId(null);
                  setSelectedStatus(null);
                }}
                className="bg-nav-btn-color text-white px-4 py-2 rounded"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-nav-btn-color text-white px-4 py-2 rounded"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
      {error ? (
        <p>{error}</p>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center text-center">
          <ListBulletIcon className="size-10 " />
          <p>Aucune tâche disponible</p>
        </div>
      ) : (
        <>
          <table className="text-center w-full border-collapse">
            <thead>
              <tr className="border-b-2 text-yellow-600">
                <th>Libellé</th>
                <th>Attribution</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b-2">
                  <td className="py-6">{task.label}</td>
                  <td className="py-6">{userNames[task.userId]}</td>
                  <td className="py-6">{convertStatus(task.status)}</td>
                  <td className="py-6">
                    <button onClick={() => handleEditTaskClick(task)}>
                      <PencilIcon className="size-6 text-yellow-500" />
                    </button>
                    <button onClick={() => openConfirmDeleteModal(task.id)}>
                      <TrashIcon className="size-6 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end py-4 mr-3">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={
                  currentPage === index + 1
                    ? "bg-slate-300 text-sky-950 px-1 mx-2"
                    : ""
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        message={
          <>
            Vous êtes sur le point de supprimer une tâche.
            <br />
            Êtes-vous sûr de vouloir procéder à la suppression ?
          </>
        }
      />
    </div>
  );
};

export default TaskList;
