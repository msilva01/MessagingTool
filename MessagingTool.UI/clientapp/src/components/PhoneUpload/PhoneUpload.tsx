import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEraser,
  faFile,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAsync, PostFile } from "../../utils/apiDataWorker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./PhoneUpload.css";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { DeletePhone } from "./DeletePhone";
import { useSelector } from "react-redux";
import { MessageState } from "../../ReduxStore/Store";

interface FileUploadData {
  language: string;
  doNotCall: boolean;
  file: any;
}

export function PhoneUpload() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);
  const schema = yup.object({
    language: yup
      .string()
      .nullable()
      .when("doNotCall", {
        is: (val: boolean) => val,
        then: yup.string().notRequired(),
        otherwise: yup.string().required("Please select the language"),
      }),
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FileUploadData>({
    resolver: yupResolver(schema),
    defaultValues: { language: "", doNotCall: false },
  });
  const queryClient = useQueryClient();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: { "csv/*": [".csv"] },
    onDrop: (files) => {
      clearErrors("file");
      setValue("file", files);
    },
  });

  useEffect(() => {
    setSelectedFile(acceptedFiles[0]);
  }, [acceptedFiles]);

  const { mutate: mutate } = useMutation({
    mutationFn: async (data: FileUploadData) => {
      return await PostFile("Home/Upload", {
        File: selectedFile,
        language: data.doNotCall ? "1" : data.language,
        doNotCall: data.doNotCall,
      }).then((r: any) => r.data);
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["PhoneNumberGrid"], exact: false });
      clearErrors("file");
      setSelectedFile(null);
      reset({ language: "" });
      toast.success("File Uploaded Successfully");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.response?.data.message || err);
    },
  });

  async function onSubmit(data: FileUploadData) {
    mutate(data);
  }

  const doNotCallWatch = useWatch({
    control,
    name: "doNotCall",
    defaultValue: false,
  });

  useEffect(() => {
    if (doNotCallWatch) {
      clearErrors("language");
    }
  }, [doNotCallWatch]);
  const { messageStatus } = useSelector(
    (state: MessageState) => state.reducers.messageProgress
  );

  return (
    <Container maxWidth="md" className=" p-3 mt-5">
      <DeletePhone show={showModal} onHide={() => setShowModal(false)} />
      <Paper
        elevation={8}
        className="mt-2 p-4"
        style={{ backgroundColor: "#F6F3EE" }}
      >
        <h2 className="mb-4">Phone File Upload </h2>
        <hr></hr>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Controller
                control={control}
                name="doNotCall"
                render={({ field: { onChange, name, value } }) => (
                  <FormControl sx={{ m: 0 }} variant="outlined">
                    <FormControlLabel
                      label="Upload as DO NOT CALL list"
                      control={
                        <Switch
                          {...register("doNotCall")}
                          color="error"
                          id="doNotCall"
                          onChange={onChange}
                          checked={value}
                          value={value}
                        />
                      }
                    />
                  </FormControl>
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                control={control}
                name="language"
                render={({ field: { onChange, name, value } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      language
                    </InputLabel>
                    <Select
                      {...register("language")}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Language"
                      onChange={onChange}
                      disabled={doNotCallWatch}
                      value={value}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1"> English </MenuItem>
                      <MenuItem value="2"> Spanish </MenuItem>
                    </Select>
                    {errors?.language && (
                      <p className="errorMessage">
                        {errors?.language?.message?.toString()}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <FormLabel className="label ms-2 mb-2">CSV File:</FormLabel>
              <div className="container">
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop the file here, or click to select</p>
                  <em>Only *.csv files are accepted</em>
                </div>
              </div>
              {errors?.file && (
                <p className="errorMessage">
                  {errors?.file?.message?.toString()}
                </p>
              )}
              <aside className="m-3">
                {selectedFile && (
                  <div>
                    <span style={{ color: "#0480BE" }}>
                      <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                      &nbsp;
                      {selectedFile?.path} - {selectedFile?.size} bytes
                    </span>
                    <IconButton
                      className="ms-2"
                      size="small"
                      onClick={() => {
                        setSelectedFile(null);
                        setValue("file", null);
                      }}
                    >
                      <FontAwesomeIcon
                        className="fa-red-trash"
                        icon={faTrash}
                      ></FontAwesomeIcon>
                    </IconButton>
                  </div>
                )}
              </aside>
            </Col>
          </Row>
          <Row className="justify-content-md-center mb-2">
            <Col xs={12}>
              {(messageStatus === "processing" ||
                messageStatus === "failed") && (
                <Alert severity="error" variant="filled">
                  Please wait. You cannot upload or delete data while processing
                  the queue. {messageStatus}
                </Alert>
              )}
            </Col>
          </Row>
          <Row className="justify-content-md-end">
            <Col xs lg="auto">
              <Button
                variant="contained"
                color="error"
                type="button"
                size="large"
                disabled={messageStatus !== "idle"}
                onClick={() => setShowModal(true)}
              >
                <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
                &nbsp;Delete All Data
              </Button>
            </Col>
            <Col xs lg="2">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={selectedFile == null || messageStatus !== "idle"}
              >
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                &nbsp;Upload
              </Button>
            </Col>
          </Row>
        </form>
      </Paper>
    </Container>
  );
}
