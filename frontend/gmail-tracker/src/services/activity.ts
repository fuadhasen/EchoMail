import api from "./api";

export interface ActivityData {
  day: string;
  responses: number;
  reminders: number;
  completed: number;
  actions: number;
}

export const dailyActivities = async (): Promise<ActivityData[]> => {
  const response = await api.get<ActivityData[]>("/automation/responses");
  return response.data;
};
