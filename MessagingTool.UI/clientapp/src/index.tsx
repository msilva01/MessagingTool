import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SignalR } from "./Services/SignalRContext";
import { Provider } from "react-redux";
import { store } from "./ReduxStore/Store";

const root = createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error);
    },
  }),
  defaultOptions: {
    queries: {
      placeholderData: (prev: any) => prev,
      refetchOnWindowFocus: process.env.REACT_APP_ENVIRONMENT !== "DEV",
      staleTime: Infinity,
    },
  },
});
root.render(
  <React.StrictMode>
    <Router>
      <ToastContainer></ToastContainer>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Provider store={store}>
          <SignalR>
            <App />
          </SignalR>
        </Provider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
