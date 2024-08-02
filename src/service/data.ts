import { axiosData } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getRequest = <T>(url: string) =>
  axiosData
    .get<{ data: T }>(url)
    .then((res: AxiosResponse<{ data: T }>) => res.data.data);
