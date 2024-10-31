const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des utilisateurs");

  return response.json();
};

export const fetchUserById = async (id: number) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération de l'utilsateur");

  const user = await response.json();
  return user.firstName;
};
