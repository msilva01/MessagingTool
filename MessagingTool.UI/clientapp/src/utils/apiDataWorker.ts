import { useCreateApiClient } from "./useCreateApiClient";
import { toast } from "react-toastify";

export async function PostFile(url: string, postData: {}) {
  const apiClient = useCreateApiClient(true);
  let abortController = new AbortController();
  const response = await apiClient
    .post(
      url,
      { ...postData },
      {
        signal: abortController.signal,
      }
    )
    .catch((err) => {
      if (err.response?.data?.errors) {
        Object.keys(err.response?.data?.errors).forEach((itm: string) => {
          toast.error(err.response?.data?.errors[itm][0]);
        });
      }

      return Promise.reject(err);
    });
  return response;
}

export async function GetAsync<T>(url: string) {
  const apiClient = useCreateApiClient();
  let abortController = new AbortController();
  const response = await apiClient
    .get<T>(url, { signal: abortController.signal })
    .catch((err) => {
      return Promise.reject(err);
    });

  return response;
}

export async function PostAsync(url: string, postData: {}) {
  const apiClient = useCreateApiClient();
  let abortController = new AbortController();
  const response = await apiClient
    .post(
      url,
      { ...postData },
      {
        signal: abortController.signal,
      }
    )
    .catch((err) => {
      if (err.response?.data?.errors) {
        Object.keys(err.response?.data?.errors).forEach((itm: string) => {
          toast.error(err.response?.data?.errors[itm][0]);
        });
      }

      return Promise.reject(err);
    });

  return response;
}
