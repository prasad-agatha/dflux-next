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
import { ProjectsService } from "services";
//toast configuration
toast.configure();

const projectsAPI = new ProjectsService();

export interface ICreateProjectProps {
  createProject: boolean;
  setCreateProject: any;
  projectsMutate: any;
}

const CreateProject: FC<ICreateProjectProps> = ({
  createProject,
  setCreateProject,
  projectsMutate,
}) => {
  const router = useRouter();

  // set new project name
  const [value, setValue] = React.useState({
    name: "",
    description: "",
  });
  // project create loader
  const [createLoader, setCreateLoader] = React.useState(false);

  // create project function & call
  const newProject = () => {
    if (value.name === "") {
      alert("Please enter a project name");
    } else {
      setCreateLoader(true);
      // create project api call
      projectsAPI
        .createProject(value)
        .then((response) => {
          setCreateLoader(false);
          setCreateProject(!createProject);
          projectsMutate();
          toast.success(`${response.name} project created...!`, { delay: 3500 });
          router.push(`/projects/${response.id}/`);
        })
        .catch((error: any) => {
          toast.error(error);
          setCreateLoader(false);
          if (error.non_field_errors[0]) {
            toast.error("Duplicate project name");
          }
        });
    }
  };

  // create project - multiple inputs
  const handleInputChange = (e: any) => {
    // values
    const val = e.target.value;
    // input name field
    const name = e.target.name;
    // set value to input name
    setValue({ ...value, [name]: val });
  };

  return (
    <Modal
      show={createProject}
      onHide={() => {
        {
          setCreateProject(!createProject);
          setValue({
            name: "",
            description: "",
          });
        }
      }}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title className="mb-0">Create new project</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="d-flex flex-column">
          <Form>
            <Form.Label>Project name</Form.Label>
            <Form.Control
              autoComplete="off"
              name="name"
              onChange={handleInputChange}
              placeholder="Enter project name"
              className="input-create-project1 mb-2"
            />
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              autoComplete="off"
              name="description"
              onChange={handleInputChange}
              placeholder="About project (optional)"
              className="input-create-project1"
            />
            {/* <Form.Label>Add Data</Form.Label>
          <div className="d-flex justify-content-around flex-row">
            <Form.Check type="radio" label="Connect to data" />
            <Form.Check type="radio" label="My datasources" />
          </div> */}
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top-0 mb-1 pt-0 justify-content-center">
        <Button
          onClick={() => {
            setCreateProject(!createProject);
            setValue({
              name: "",
              description: "",
            });
          }}
          variant="text"
          className="f-14"
        >
          Cancel
        </Button>
        <Button loading={createLoader} onClick={newProject} className="f-14 text-white">
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CreateProject;
