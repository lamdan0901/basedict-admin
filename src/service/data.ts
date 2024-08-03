import { axiosData } from "@/lib/axios";

export const getRequest = (url: string) =>
  axiosData.get(url).then((res) => res.data.data);

export const postRequest = (url: string, { arg }: { arg: any }) =>
  axiosData.post(url, arg).then((res) => res.data.data);

export const patchRequest = (url: string, { arg }: { arg: any }) =>
  axiosData.patch(url, arg).then((res) => res.data.data);

export const deleteRequest = (url: string, { arg }: { arg: any }) =>
  axiosData.delete(url, arg).then((res) => res.data.data);
