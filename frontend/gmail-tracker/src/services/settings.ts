import api from "./api";

export interface UserSettings {
  notify_on_response: boolean;
  reminder_template: string;
}

export const getSettings = async (): Promise<UserSettings> => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (
  settings: UserSettings,
): Promise<UserSettings> => {
  const response = await api.put("/settings", settings);
  return response.data;
};
