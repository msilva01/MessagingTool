import { Modal } from "react-bootstrap";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";

export interface NotificationModalProps {
  headerTitle: string;
  bodyMessage?: string;
  show?: boolean;
  onHide?: any;
  showYesNoButtons?: boolean;
  updateData: any;
  yesButtonText?: string;
  noButtonText?: string;
  headerColor: "primary" | "edit" | "delete";
}

export function NotificationModal(props: NotificationModalProps) {
  const {
    bodyMessage = "Are you sure you want to delete this record? \\n\\n Click Yes to delete or No  to cancel and return to the previous screen.",
    headerColor = "primary",
    showYesNoButtons = true,
    yesButtonText = "Yes",
    noButtonText = "No",
  } = props;
  return (
    <Modal
      show={props.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={props.onHide}
    >
      <Modal.Header closeButton className={`modal-header ${headerColor}`}>
        {props.headerTitle}
      </Modal.Header>
      <Modal.Body>
        <div>
          {bodyMessage.split("\\n").map((line, idx) => (
            <Fragment key={idx}>
              {line}
              <br></br>
            </Fragment>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {showYesNoButtons ? (
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={props.onHide}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
              &nbsp;{noButtonText}
            </Button>
            <Button
              className="ms-2"
              variant="contained"
              color="primary"
              type="button"
              onClick={() => {
                props.updateData();
              }}
            >
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
              &nbsp;{yesButtonText}
            </Button>
          </div>
        ) : (
          <Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={props.onHide}
            >
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
              &nbsp;Ok
            </Button>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
