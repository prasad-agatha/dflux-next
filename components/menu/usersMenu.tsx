// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Image, Popover, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ProjectsService } from "services";
// import { NewModelPickle } from "components/modals";
import Form from "react-bootstrap/Form";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// import { ArrowDropDown } from "@styled-icons/material/ArrowDropDown";
import { toast } from "react-toastify";

interface IResetPasswordFormProps {
  row: any;
  deleteUser: any;
  userMutate: any;
  userRole: any;
}
const UsersMenu: FC<IResetPasswordFormProps> = (props) => {
  const { row, deleteUser, userMutate, userRole } = props;
  const router = useRouter();
  const projects = new ProjectsService();
  const { project_id } = router.query;
  // const [select, setSelect] = React.useState(row.access);
  const [modelDelete, setModelDelete] = React.useState(false);
  const [modelUpdate, setModelUpdate] = React.useState(false);
  const userName = row.user.first_name + " " + row.user.last_name;
  const handleChange1 = (e: any, id: any) => {
    const { value } = e.target;
    const tempState: any = [...state];
    tempState[id][modules[id]] = value;
    setState(tempState);
  };
  const modules = [
    "Data sources",
    "Queries",
    "Notebook",
    "Models",
    "Charts",
    "Triggers",
    "Dashboards",
    "Members",
  ];
  const [state, setState] = React.useState<any>(row.module_access);
  const options = ["READ", "WRITE", "NONE"];
  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup style={{ border: "0px solid black" }}>
          {userRole?.user_role === "Owner" ||
          userRole?.user_module_access[7]["Members"] === "WRITE" ? (
            <>
              <ListGroup.Item
                className="menu-item"
                onClick={() => {
                  document.body.click();
                  setModelUpdate(!modelUpdate);
                }}
              >
                <div className="df1 flex-row">
                  {/* <Image src="/editpermission.svg" className="menu-item-icon" /> */}
                  <Image src="/newicons/chart-menu/edit.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Edit permission</p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item
                className="menu-item"
                onClick={() => {
                  document.body.click();
                  setModelDelete(!modelDelete);
                }}
              >
                <div className="df1 flex-row">
                  <Image src="/newicons/delete.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Delete</p>
                </div>
              </ListGroup.Item>
            </>
          ) : (
            <>
              <ListGroup.Item className="menu-item disabled-item-hover">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <div className="df1 flex-row">
                    <Image
                      src="/newicons/chart-menu/disabled-edit.svg"
                      className="menu-item-icon"
                    />
                    <p className="menu-item-text_disable mb-0">Edit permission</p>
                  </div>
                </OverlayTrigger>
              </ListGroup.Item>
              <ListGroup.Item className="menu-item disabled-item-hover">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <div className="df1 flex-row">
                    <Image src="/newicons/disabled-delete.svg" className="menu-item-icon" />
                    <p className="menu-item-text_disable mb-0">Delete</p>
                  </div>
                </OverlayTrigger>
              </ListGroup.Item>
            </>
          )}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  const updateUser = (id: any) => {
    projects
      .updateUser(project_id, id, {
        access: "WRITE",
        module_access: state.map((item: any) => {
          const obj: any = {};
          obj[item.name] = item.checked;
          return item;
        }),
      })
      .then(() => {
        userMutate();
        toast.success("User updated");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div>
      <OverlayTrigger rootClose trigger="click" placement="bottom-end" overlay={popover} transition>
        <MoreVerticalOutline className="icon-size" />
      </OverlayTrigger>

      <Modal
        show={modelDelete}
        onHide={() => {
          setModelDelete(!modelDelete);
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <h4 className="p-2 pt-3 mb-0 mt-1 d-flex justify-content-center align-items-center">
            Confirm delete
          </h4>
          <div className="mb-0 mt-1 d-flex justify-content-center align-items-center pt-0">
            <p className="d-flex justify-content-center align-items-center">
              Are you sure you want to delete this member?
            </p>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn ms-3 bg-white"
              onClick={() => {
                setModelDelete(!modelDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                deleteUser(row.id);
                setModelDelete(!modelDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        // size="sm"
        show={modelUpdate}
        onHide={() => {
          setModelUpdate(!modelUpdate);
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <div className="mt-4 border-bottom">
          <h4 className="mb-4 text-center">Edit permission</h4>
        </div>
        <Modal.Body>
          <div className="mt-1 d-flex flex-column justify-content-center align-items-center">
            <Form.Group className="w-75 mb-3">
              <Form.Control style={{ height: "45px" }} placeholder={userName} disabled />
            </Form.Group>
            <Form.Group className="w-75 mt-1 mb-3">
              <Form.Control style={{ height: "45px" }} placeholder={row.user.email} disabled />
            </Form.Group>

            {/* <Dropdown
              className="w-75 mt-1"
              style={{ height: "45px" }}
              onSelect={(value: any) => {
                setSelect(value);
              }}
            > */}
            {/* <Dropdown.Toggle className="w-100 bg-white border br-10" id="dropdown-basic">
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="sort text-dark-grey fw-normal">
                      {select === "WRITE" ? "Read and write" : select}
                    </small>
                  </div>
                  <ArrowDropDown size="25" className="sort text-light-grey"></ArrowDropDown>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                <Dropdown.Item eventKey="READ">Read</Dropdown.Item>
                <Dropdown.Item eventKey="WRITE">Read and write</Dropdown.Item>
              </Dropdown.Menu> */}
            <table className="table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th> &nbsp; Read</th>
                  <th>&nbsp; &nbsp; &nbsp;Read and write</th>
                  <th>&nbsp; None</th>
                </tr>
              </thead>
              <tbody>
                {state.map((item: any, id: any) => {
                  return (
                    <tr key={id}>
                      <td>{modules[id]}</td>
                      {options.map((option) => {
                        return (
                          <td key={`${modules[id]}_${option}`} className="access access-radio">
                            <label>
                              <input
                                type="radio"
                                aria-label="radio 1"
                                value={option}
                                name={modules[id]}
                                defaultChecked={
                                  row.module_access && row.module_access.length !== 0
                                    ? option === item[modules[id]]
                                    : false
                                }
                                onChange={(e: any) => {
                                  handleChange1(e, id);
                                }}
                              />
                              <span
                                className={option !== "WRITE" ? "checkmark" : "checkmark write"}
                              ></span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* </Dropdown> */}
            <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
              <button
                className="btn bg-white"
                onClick={() => {
                  setModelUpdate(!modelUpdate);
                }}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="text-white"
                // loading={deleteLoader}
                onClick={() => {
                  updateUser(row.id);
                  setModelUpdate(!modelUpdate);
                }}
                style={{ width: 80, marginLeft: "25px" }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default UsersMenu;
