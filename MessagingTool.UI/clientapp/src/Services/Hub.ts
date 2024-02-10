export enum JobProcessingCallbacksNames {
  finishedSendingTexts = "finishedSending",
  errorSendingTexts = "errorSending",
}

export type JobProcessingCallBacks = {
  [JobProcessingCallbacksNames.finishedSendingTexts]: (
    result: boolean,
    numberOfTextsSent: number
  ) => void;
  [JobProcessingCallbacksNames.errorSendingTexts]: (
    errorJobProcessing: string
  ) => void;
};

export interface JobProcessingProcess {
  callbacksName: JobProcessingCallbacksNames;
  callbacks: JobProcessingCallBacks;
  methodsName: "";
  methods: {};
}
