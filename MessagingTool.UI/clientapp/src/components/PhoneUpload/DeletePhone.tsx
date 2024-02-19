import { faEraser, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { DeleteAsync, PostAsync, PostFile } from "../../utils/apiDataWorker";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export interface DeletePhoneProps {
  show?: boolean;
  onHide?: any;
}

export function DeletePhone({ show = false, onHide = null }: DeletePhoneProps) {
  const queryClient = useQueryClient();
  const [englishUpload, setEnglishUpload] = useState(false);
  const [spanishUpload, setSpanishUpload] = useState(false);
  const [doNotCall, setDoNotCall] = useState(false);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async () =>
      await DeleteAsync(
        `Home/Delete?english=${englishUpload}&spanish=${spanishUpload}&doNotCall=${doNotCall}`
      ),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["PhoneNumberGrid"], exact: false });
      onHide();
      toast.success("All data successfuly deleted");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.response?.data.message || err);
    },
  });

  return (
    <Container>
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide}
      >
        <Modal.Header closeButton className={`modal-header delete`}>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>Delete Data</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    value={englishUpload}
                    onChange={(e) => setEnglishUpload(e.target.checked)}
                  />
                }
                label="English"
              ></FormControlLabel>
              <FormControlLabel
                control={
                  <Switch
                    value={englishUpload}
                    onChange={(e) => setSpanishUpload(e.target.checked)}
                  />
                }
                label="Spanish"
              ></FormControlLabel>
              <FormControlLabel
                control={
                  <Switch
                    value={englishUpload}
                    onChange={(e) => setDoNotCall(e.target.checked)}
                  />
                }
                label="Do Not Call"
              ></FormControlLabel>
            </FormGroup>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            type="button"
            size="large"
            disabled={!englishUpload && !spanishUpload && !doNotCall}
            onClick={() => deleteMutation()}
          >
            <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
            &nbsp;Delete Selected Data
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
