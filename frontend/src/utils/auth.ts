import api from "./api";
import { useAuthStore } from "@store/authStore";
import { ROUTES } from "@constants/routes";
import Cookies from "js-cookie";


export const loginUser = async (username: string, password: string) => {
  const response = await api.post(ROUTES.LOGIN, { username, password });
  const { access } = response.data;

  const { setToken, setUser } = useAuthStore.getState();
  setToken(access);
  setUser(username);

  Cookies.set("token", access, { expires: 1 / 24 });
  Cookies.set("user", username, { expires: 1 / 24 });


  return response.data;
};

export const logoutUser = () => {
  const { clearUser } = useAuthStore.getState();
  clearUser();

  Cookies.remove("token");
  Cookies.remove("user");

};
