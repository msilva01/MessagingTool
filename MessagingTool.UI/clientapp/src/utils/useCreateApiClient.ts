import axios from "axios";

export interface AxiosRequestConfig {
  authorization?: boolean;
}

export function useCreateApiClient(isFileUpload?: boolean) {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
  const contentType = isFileUpload ? "multipart/form-data" : "application/json";
  const axiosConfig = {
    baseURL: baseUrl,
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": contentType,
    },
  };

  const client = axios.create(axiosConfig);

  client.interceptors.request.use(
    async (config) => {
      if (!isFileUpload) {
        config.headers["Content-Type"] = "application/json";
      } else {
        config.headers["Content-Type"] = "multipart/form-data";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
}
