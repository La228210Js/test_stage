export interface Task {
  id: number;
  userId: number;
  label: string;
  status: "En cours" | "Bloqué" | "Terminé";
}
