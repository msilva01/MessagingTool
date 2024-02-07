import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Paper, TextField } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { DeleteAsync, PostAsync, PostFile } from "../../utils/apiDataWorker";
import { toast } from "react-toastify";
import { useEffect } from "react";

export interface DeletePhoneProps {
  show?: boolean;
  onHide?: any;
}

export function DeletePhone(props: DeletePhoneProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async () => await DeleteAsync("Home/Delete"),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["PhoneNumberGrid"], exact: false });
      props.onHide();
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
        show={props.show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={props.onHide}
      >
        <Modal.Header closeButton className={`modal-header error`}>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>Delete Data</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
      </Modal>
    </Container>
  );
}
