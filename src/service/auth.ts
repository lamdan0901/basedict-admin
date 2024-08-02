import { axiosAuth } from "@/lib/axios";
import { TAuthBody } from "@/service/types";
import axios from "axios";

const login = (data: { email: string; password: string }) => {
  return axiosAuth.post<TAuthBody>("/token?grant_type=password", data);
};

const logout = () => {
  return axiosAuth.post("/logout?scope=local");
};

const getRefreshToken = (refresh_token: string): Promise<TAuthBody> => {
  return axiosAuth.post("/token?grant_type=refresh_token", {
    refresh_token,
  });
};

const setTokenServer = async (data: object) => {
  console.log("data: ", data);
  try {
    const res = await axios.post("/api/auth", { data });
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

const deleteTokenServer = async () => {
  try {
    const res = await axios.delete("/api/auth");
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

export { login, setTokenServer, getRefreshToken, logout, deleteTokenServer };
