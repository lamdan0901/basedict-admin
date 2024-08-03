import { axiosData } from "@/lib/axios";

export const getRequest = (url: string) =>
  axiosData.get(url).then((res) => res.data.data);
