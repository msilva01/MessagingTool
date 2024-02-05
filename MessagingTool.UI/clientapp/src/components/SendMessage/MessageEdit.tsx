import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Paper, TextField } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PostAsync, PostFile } from "../../utils/apiDataWorker";
import { toast } from "react-toastify";
import { useEffect } from "react";

export interface MessageEditProps {
  ids?: GridRowId[];
  language: string;
  sendToAll: boolean;
  show?: boolean;
  onHide?: any;
  totalCount?: number;
}

interface SMSMessageData {
  text: string;
  language: string;
  phoneNumberIds: string[] | undefined;
  sendToAll: boolean;
}
export function MessageEdit(props: MessageEditProps) {
  const schema = yup.object({
    text: yup.string().required("Required Field"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SMSMessageData>({
    resolver: yupResolver(schema),
    defaultValues: { text: "" },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: SMSMessageData) =>
      await PostAsync("Home/Post", data),
    onSuccess: (res: any) => {
      queryClient.resetQueries({ queryKey: ["PhoneNumberGrid"], exact: false });
      if (!res.data) {
        toast.error(
          "One or more phone numbers were moved to the Do Not Call List"
        );
      } else {
        toast.success(`Messages Sent`);
      }
      reset({ text: "" });
      props.onHide();
    },
    onError: (err: any) => {
      toast.error(err.response?.data.message || err);
    },
  });

  useEffect(() => {
    setValue("language", props.language);
    setValue(
      "phoneNumberIds",
      props?.ids?.map((x) => x.toString())
    );
    setValue("sendToAll", props.sendToAll);
  }, [props.sendToAll, props.language, props.ids]);
  async function onSubmit(data: SMSMessageData) {
    mutate(data);
  }
  return (
    <Container>
      <Modal
        show={props.show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={props.onHide}
      >
        <Modal.Header closeButton className={`modal-header primary`}>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>Send SMS Message</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Paper variant="outlined" className="mt-2 p-2">
            <h5>
              Send Message to:&nbsp;
              {props.sendToAll ? props.totalCount : props.ids?.length} Phone
              Numbers
              <em>
                <b>&nbsp;{props.language == "1" ? "English" : "Spanish"}</b>
              </em>
            </h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="text">
                <TextField
                  id="text"
                  type="text"
                  multiline
                  minRows={3}
                  label="Message"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                    required: true,
                  }}
                  fullWidth
                  {...register("text")}
                  className={errors ? "field-error" : ""}
                />

                {errors?.text && (
                  <p className="errorMessage">{errors?.text?.message}</p>
                )}
              </Form.Group>
              <Button variant="contained" color="primary" type="submit">
                <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
                &nbsp;Send Messages
              </Button>
            </form>
          </Paper>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
