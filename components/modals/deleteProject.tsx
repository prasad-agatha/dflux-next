// react
import React, { FC } from "react";
// next router
// import { useRouter } from "next/router";
// react-bootstrap
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// toast
import { toast } from "react-toastify";
// services
import { ProjectsService } from "services";
import { useRequest } from "@lib/hooks";
//toast configuration
toast.configure();

const projects = new ProjectsService();

interface IDeleteProjectProps {
  projectDelete: any;
  setProjectDelete: any;
  id: any;
  projectsMutate: any;
}
const DeleteProject: FC<IDeleteProjectProps> = (props) => {
  const { projectDelete, setProjectDelete, id, projectsMutate } = props;
  // project delete loader
  const [deleteLoader, setDeleteLoader] = React.useState(false);

  // delete project
  const deleteProject = (id: number) => {
    setDeleteLoader(true);
    projects
      .deleteProject(id)
      .then(() => {
        setDeleteLoader(false);
        toast.success("Project deleted...!", { delay: 3300 });
        projectsMutate();
      })
      .catch((error: any) => {
        setDeleteLoader(false);
        projectsMutate();
        toast.error(error.msg);
        toast.error("Error deleting project");
      });
  };
  const { data: userRole }: any = useRequest({
    url: `api/projects/${id}/role/`,
  });
  return (
    <Modal
      show={projectDelete}
      onHide={() => {
        setProjectDelete(!projectDelete);
      }}
      // show={show}
      // onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      // dialogClassName="modal-40w"
    >
      <Modal.Header className="border-0 d-flex justify-content-center align-items-center mt-4 ps-4">
        <Modal.Title className="mb-0">Confirm action</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-0 mt-0 d-flex justify-content-center align-items-center pt-0">
        <div className="d-flex flex-column">
          <p className="d-flex justify-content-center mt-3 mb-0 align-items-center">
            The following action is irreversible, once deleted cannot be retrieved.
          </p>
          <p className="d-flex justify-content-center align-items-center">
            Are you sure to delete this project?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mt-2 mb-2 d-flex justify-content-center align-items-center">
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setProjectDelete(!projectDelete);
          }}
        >
          Cancel
        </button>
        {userRole?.user_role === "Owner" ? (
          <Button
            variant="danger"
            className="text-white"
            loading={deleteLoader}
            onClick={() => {
              deleteProject(id);
              setProjectDelete(!projectDelete);
            }}
            style={{ width: 150 }}
          >
            Yes, delete
          </Button>
        ) : (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-0" id="tooltip-engine">
                You didn&apos;t have access to this feature
              </Tooltip>
            }
          >
            <Button variant="light" className="text-black-50">
              <div className="d-flex w-100 align-items-center">Yes, delete</div>
            </Button>
          </OverlayTrigger>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteProject;
