import { Container, Paper, TextField } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

export interface MessageEditProps {
  ids?: GridRowId[];
  show?: boolean;
  onHide?: any;
}

interface SMSMessage {
  text: string;
  language: string;
}
export function MessageEdit(props: MessageEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SMSMessage>({
    defaultValues: { text: "" },
  });

  const onSubmit = () => {
    console.log("here");
  };
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
            <form>
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

                {errors && (
                  <p className="errorMessage">{errors?.text?.message}</p>
                )}
              </Form.Group>
            </form>
          </Paper>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
