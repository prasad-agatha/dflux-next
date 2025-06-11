import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Modal, Form } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
// react button loader
import Button from "react-bootstrap-button-loader";
// services
import { ProjectsService } from "services";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";

//toast configuration
toast.configure();

const projects = new ProjectsService();

interface InviteUserProps {
  newState: any;
  setNewState: any;
}

const InviteUser: FC<InviteUserProps> = (props) => {
  const { newState, setNewState } = props;
  const router = useRouter();
  const { project_id } = router.query;
  // invite user loader
  const [inviteLoader, setInviteLoader] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const components = {
    DropdownIndicator: null,
  };
  const sendInvitation = () => {
    if (triggerState === null || triggerState.email?.length === 0) {
      setError(true);
      setErrorMessage("This field is required");
    } else {
      setInviteLoader(true);
      projects
        .inviteUser(project_id, {
          emails: _.map(triggerState.email, "value"),
          access: "WRITE",
          module_access: state.map((item: any) => {
            const obj: any = {};
            obj[item.name] = item.checked;
            return obj;
          }),
        })
        .then(() => {
          setInviteLoader(false);
          setNewState({ ...newState, invite: false });
          setTriggerState({
            ...triggerState,
            email: [],
          });
          toast.success("Invitation sent successfully", { autoClose: 1000 });
        })
        .catch(() => {
          toast.error("Error sending invitation", { autoClose: 1000 });
          setInviteLoader(false);
        });
    }
  };

  const [triggerState, setTriggerState] = React.useState({
    email: [],
    users: [],
  });

  // email validation
  const isValid = (email: any) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  };
  const listItems = [
    // { name: "Project summary", checked: "READ" },
    { name: "Data sources", checked: "READ" },
    { name: "Queries", checked: "READ" },
    { name: "Notebook", checked: "READ" },
    { name: "Models", checked: "READ" },
    {
      name: "Charts",
      checked: "READ",
    },
    { name: "Triggers", checked: "READ" },
    { name: "Dashboards", checked: "READ" },
    { name: "Members", checked: "READ" },
  ];
  const [state, setState] = React.useState<any>(listItems);
  const options = ["READ", "WRITE", "NONE"];
  const handleChange1 = (e: any, id: any) => {
    const { value } = e.target;
    const tempState: any = [...state];
    // const moduleAccess1 =
    tempState[id]["checked"] = value;
    setState(tempState);
  };

  const handleChange = (newValue: any) => {
    const data: any = [];
    for (let i = 0; i < newValue.length; i++) {
      if (isValid(newValue[i].value)) {
        data.push(newValue[i]);
      }
    }
    setTriggerState({ ...triggerState, email: data });
  };

  return (
    <Modal
      show={newState?.invite}
      onHide={() => {
        setError(false);
        setNewState({ ...newState, invite: false });
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
          Invite member
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 mt-0 pb-0 pt-0 mb-0">
        <div className="d-flex flex-column mt-4 ">
          <Form style={{ backgroundColor: "white" }}>
            <CreatableSelect
              components={components}
              isClearable
              isMulti
              onChange={handleChange}
              options={triggerState.users}
              noOptionsMessage={() => null}
              value={triggerState.email}
              placeholder="Enter email"
              type="email"
              style={{ height: 48 }}
            />
            {error ? (
              <span id="error" style={{ color: "red", fontSize: "12px", marginLeft: "2px" }}>
                {errorMessage}
              </span>
            ) : null}
          </Form>

          <table className="table mt-2">
            <thead>
              <tr>
                <th>Module</th>
                <th>Read</th>
                <th>&nbsp; Read and write</th>
                <th>None</th>
              </tr>
            </thead>
            <tbody>
              {state.map((item: any, id: any) => {
                return (
                  <tr key={id}>
                    <td>{item.name}</td>
                    {options.map((option) => {
                      return (
                        <td key={`${item.name}_${option}`} className="access access-radio">
                          {/* <InputGroup.Checkbox
                            className="radio-size justify-content-center mt-1"
                            type="radio"
                            aria-label="radio 1"
                            value={option}
                            name={item.name}
                            defaultChecked={option === "READ"}
                            onChange={(e: any) => {
                              handleChange1(e, id);
                            }}
                          /> */}
                          <label>
                            <input
                              type="radio"
                              value={option}
                              name={item.name}
                              defaultChecked={option === "READ"}
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
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setError(false);
            setNewState({ ...newState, invite: false });
            setTriggerState({ ...triggerState, email: [] });
          }}
        >
          Cancel
        </button>
        {triggerState.email?.length === 0 ? (
          <Button
            variant="light"
            type="button"
            style={{ opacity: 0.9, color: "#A0A4A8", width: 154 }}
            className="f-17 text-center"
          >
            Send invite
          </Button>
        ) : (
          <Button
            loading={inviteLoader}
            variant="primary"
            type="button"
            onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 160 }}
            className="text-white f-17 text-center"
          >
            Send invite
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default InviteUser;
