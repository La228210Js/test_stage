const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TaskResponse = {
  id: number;
  userId: number;
  label: string;
  status: number;
};

type FetchTasksResponse = {
  tasks: TaskResponse[];
  totalTasks: number;
};

export const fetchTasks = async (
  pageNumber: number,
  pageSize: number,
  userId?: number,
  status?: number,
  label?: string
): Promise<FetchTasksResponse> => {
  let url = `${API_URL}/tasks`;

  const queryParams = [
    `pageNumber=${encodeURIComponent(pageNumber)}`,
    `pageSize=${encodeURIComponent(pageSize)}`,
  ];

  if (userId !== undefined) {
    queryParams.push(`userId=${encodeURIComponent(userId)}`);
  }
  if (status !== undefined) {
    queryParams.push(`status=${encodeURIComponent(status)}`);
  }
  if (label) {
    queryParams.push(`label=${encodeURIComponent(label)}`);
  }

  url += `?${queryParams.join("&")}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Erreur de réseau : ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log(data);
  return {
    tasks: data.tasks || [],
    totalTasks: data.totalTasks || 0,
  };
};

export const createTask = async (newTask: {
  label: string;
  userId: number;
  status: number;
}) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error(
      `Erreur de création : ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur de création : ${response.status} ${response.statusText}`
    );
  }

  return true;
};

export const updateTask = async (task: TaskResponse) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(
      `Erreur de mise à jour : ${response.status} ${response.statusText}`
    );
  }

  return null;
};

export const exportTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks/export`, {
      method: "GET",
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Taches.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Erreur lors de l'exportation du fichier Excel");
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
};
