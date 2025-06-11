// react
import React, { FC } from "react";
// react-bootstrap
import { Modal } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";

interface INewQueryProps {
  newState: any;
  onSave: any;
  onDiscard: any;
}
const SaveChanges: FC<INewQueryProps> = (props) => {
  const { newState, onSave, onDiscard } = props;
  return (
    <Modal show={newState ? true : false} size="sm" backdrop="static" keyboard={false} centered>
      <Modal.Body>
        <h4 className="f-18 p-2 pt-3 mb-0 mt-1 d-flex justify-content-center align-items-center">
          Save changes?
        </h4>
        <div className="text-center">
          <p className="f-14 mb-0">Your unsaved changes will be lost.</p>
          <p className="f-14 m-0">Save before leaving this page</p>
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center mt-4">
          <button className="btn bg-white f-14" onClick={onDiscard}>
            Discard
          </button>
          <Button
            variant="primary"
            className="f-14 text-white"
            // loading={deleteLoader}
            onClick={onSave}
            style={{ width: 100, marginLeft: "25px" }}
          >
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default SaveChanges;
