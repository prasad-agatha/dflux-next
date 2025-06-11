// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Modal, Form } from "react-bootstrap";
// react button loader
import Button from "react-bootstrap-button-loader";
// toastify
import { toast } from "react-toastify";
// services
import { NotebookService, ProjectsService } from "services";

//toast configuration
toast.configure();

const projectsAPI = new ProjectsService();
const notebookService = new NotebookService();

export interface ICreateProjecProps {
  createJupiter: boolean;
  setCreateJupiter: any;
  projectsMutate?: any;
}

const CreateJupiter: FC<ICreateProjecProps> = ({
  createJupiter,
  setCreateJupiter,
}) => {
  const router = useRouter();
  const { project_id } = router.query;

  // "e4cf68f6890d4e67ac985b4bd4d4770390733740490e433584934ccfd703c2e1",
  // set new project name
  const [value, setValue] = React.useState({
    name: "",
  });

  const [token, setToken] = React.useState("");
  // project create loader
  const [createLoader, setCreateLoader] = React.useState(false);

  projectsAPI
    .getProjectData(project_id)
    .then((response) => {
      setToken(response.token);
    })
    .catch((error: any) => {
      toast.error(error);
    });

  // create project funtion & call
  const newJupiter = () => {
    if (!value.name.trim()) {
      alert("Please enter Jupyter Notebook name");
    } else {
      setCreateLoader(true);

      notebookService
        .createNotebook({
          project: token,
          notebook_name: value.name,
        })
        .then((data: any) => {
          setCreateLoader(false);
          setCreateJupiter(false);
          window.open(data.notebook_url,"_blank");
        })
        .catch((error: any) => {
          setCreateLoader(false);
          toast.error(error);
        });
    }
  };

  // create project - multiple inputs
  const handleInputChange = (e: any) => {
    // values
    const val = e.target.value.trim();
    // input name field
    const name = e.target.name;
    // set value to input name
    setValue({ ...value, [name]: val });
  };

  return (
    <Modal
      show={createJupiter}
      onHide={() => {
        {
          setCreateJupiter(!createJupiter);
          setValue({
            name: "",
          });
        }
      }}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header className="mb-0 d-flex justify-content-center align-items-center">
        <Modal.Title
          className="mt-0 mb-0 f-24"
          style={{ color: "#495968", textAlign: "start", opacity: 0.9 }}
        >
          Create notebook
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 mt-3">
        <div className="d-flex flex-column">
          <Form>
            {/* <Form.Label>Notebook Name</Form.Label> */}
            <Form.Control
              autoComplete="off"
              name="name"
              onChange={handleInputChange}
              placeholder="Enter notebook name"
              className="input-create-project mb-2"
              height="50px"
            />
            {/* <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              autoComplete="off"
              name="description"
              onChange={handleInputChange}
              placeholder="About project (optional)"
              className="input-create-project"
            /> */}
            {/* <Form.Label>Add Data</Form.Label>
          <div className="d-flex justify-content-around flex-row">
            <Form.Check type="radio" label="Connect to data" />
            <Form.Check type="radio" label="My datasources" />
          </div> */}
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        <Button
          onClick={() => {
            setCreateJupiter(!createJupiter);
            setValue({
              name: "",
            });
          }}
          variant="text"
          className="btn ms-3 bg-white"
        >
          Cancel
        </Button>
        {value.name === "" ? (
          <Button
            loading={createLoader}
            variant="light"
            type="button"
            // onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
            className="f-17 text-center"
          >
            Create
          </Button>
        ) : (
          <Button
            loading={createLoader}
            onClick={newJupiter}
            variant="primary"
            type="button"
            // onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
            className="text-white f-17 text-center"
          >
            Create
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default CreateJupiter;