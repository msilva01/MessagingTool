import { createSignalRContext } from "react-signalr";
import { JobProcessingProcess } from "./Hub";
import { PropsWithChildren } from "react";

export const SignalRContext = createSignalRContext<JobProcessingProcess>({
  shareConnectionBetweenTab: true,
});

export const SignalR = ({ children }: PropsWithChildren) => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
  console.log(baseUrl);
  return (
    <SignalRContext.Provider
      url={`${baseUrl}hub`}
      onOpen={() => console.log("open")}
      onClosed={() => console.log("close", SignalRContext.connection?.state)}
    >
      {children}
    </SignalRContext.Provider>
  );
};
