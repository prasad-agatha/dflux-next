// react
import React, { FC } from "react";
//next link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Image, Popover, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
// services
import { QueryService } from "services";
import { Modal, Form } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// import Select from "react-select";
// const DeleteCustom = styled(Delete)`
//   color: #919eab;
// `;
//toast configuration
toast.configure();

const queries = new QueryService();

interface IQueriesMenuProps {
  queriesStates: any;
  setQueriesStates: any;
  query: any;
  queryMutate: any;
  userRole?: any;
}

const QueriesMenu: FC<IQueriesMenuProps> = (props) => {
  const { query, queryMutate, userRole } = props;

  const router = useRouter();
  const { project_id } = router.query;
  const [queryDelete, setQueryDelete] = React.useState(false);
  const [showModel, setShowModel]: any = React.useState(false);
  const [value, setValue] = React.useState({
    name: "",
  });
  // Delete a query function & api call
  const handleDelete = (id: any) => {
    queries
      .deleteQuery(id)
      .then(() => {
        toast.success("Query deleted", { delay: 3500 });
        queryMutate();
      })
      .catch(() => {
        toast.error("Error deleting query");
      });
  };
  const handleInputChange = (e: any) => {
    // values
    const val = e.target.value.trim();
    // input name field
    const name = e.target.name;
    // set value to input name
    setValue({ ...value, [name]: val });
  };
  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup className="border-0">
          {userRole?.user_role === "Owner" ||
          userRole?.user_module_access[1]["Queries"] === "WRITE" ? (
            <>
              <Link
                href={{
                  pathname: `/projects/${project_id}/queries/${query.connection}/`,
                  query: {
                    editquery: query.id,
                    excel: query.excel,
                    type: query.engine_type,
                  },
                }}
              >
                <a className="text-decoration-none">
                  <ListGroup.Item
                    onClick={() => {
                      document.body.click();
                    }}
                    className="menu-item"
                  >
                    <div className="d-flex flex-row">
                      <Image src="/newicons/query-menu/edit-query.svg" className="menu-item-icon" />
                      <p className="menu-item-text mb-0">Edit query</p>
                    </div>
                  </ListGroup.Item>
                </a>
              </Link>
              <ListGroup.Item
                onClick={() => {
                  document.body.click();
                  setShowModel(!showModel);
                }}
                className="menu-item"
              >
                <div className="d-flex flex-row">
                  <Image src="/newicons/query-menu/ml-modelling.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">ML modelling</p>
                </div>
              </ListGroup.Item>
              <Link href={`/projects/${project_id}/visualization/query/${query.id}`}>
                <a className="text-decoration-none">
                  <ListGroup.Item
                    onClick={() => {
                      document.body.click();
                    }}
                    className="menu-item"
                  >
                    <div className="d-flex flex-row">
                      <Image src="/newicons/query-menu/visualize.svg" className="menu-item-icon" />
                      <p className="menu-item-text mb-0">Visualize</p>
                    </div>
                  </ListGroup.Item>
                </a>
              </Link>

              <ListGroup.Item
                className="menu-item"
                onClick={() => {
                  document.body.click();
                  setQueryDelete(!queryDelete);
                }}
              >
                <div className="d-flex flex-row">
                  {/* <DeleteCustom width={20} height={20} className="me-2" /> */}
                  <Image src="/newicons/delete.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Delete</p>
                </div>
              </ListGroup.Item>
            </>
          ) : (
            <>
              <ListGroup.Item className="menu-item disabled-item-hover">
                <div className="d-flex flex-row">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/query-menu/disabled-edit-query.svg"
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text mb-0" style={{ color: "#d4d4d4" }}>
                        Edit query
                      </p>
                    </div>
                  </OverlayTrigger>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="menu-item disabled-item-hover">
                <div className="d-flex flex-row">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/query-menu/disabled-mlmodelling.svg"
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text mb-0" style={{ color: "#d4d4d4" }}>
                        ML modelling
                      </p>
                    </div>
                  </OverlayTrigger>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="menu-item disabled-item-hover">
                <div className="d-flex flex-row">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/query-menu/disabled-visualize.svg"
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text mb-0" style={{ color: "#d4d4d4" }}>
                        Visualize
                      </p>
                    </div>
                  </OverlayTrigger>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="menu-item disabled-item-hover">
                <div className="d-flex flex-row">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex">
                      <Image src="/newicons/disabled-delete.svg" className="menu-item-icon" />
                      <p className="menu-item-text mb-0" style={{ color: "#d4d4d4" }}>
                        Delete
                      </p>
                    </div>
                  </OverlayTrigger>
                </div>
              </ListGroup.Item>
            </>
          )}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="auto-end" overlay={popover} transition>
        <Image src="/menuIcon.svg" className="icon-size cursor-pointer" />
      </OverlayTrigger>

      <Modal
        show={showModel}
        onHide={() => {
          setShowModel(!showModel);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="justify-content-center align-items-center">
          <Modal.Title className="mt-0 mb-0 f-24" style={{ color: "#495968", fontWeight: 600 }}>
            Create model
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-3">
          <div>
            <Form>
              <Form.Control
                autoComplete="off"
                name="name"
                onChange={handleInputChange}
                placeholder="Enter model name"
                className="w-100 input-create-project mb-3"
                height="50px"
              />
            </Form>
          </div>
          <div>
            <select
              className="form-select  image-placeholder"
              id="inputGroupSelect02"
              style={{ backgroundColor: "#EDF2F7", fontSize: 15, color: "#263238" }}
              required
              disabled={true}
              placeholder={query.name}
              value={query.name}
            >
              <option value="" className="text-muted" disabled hidden selected>
                {query.name}
              </option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 mb-2 d-flex justify-content-center align-items-center">
          <button
            className="btn ms-3 bg-white"
            onClick={() => {
              setShowModel(!showModel);
            }}
          >
            Cancel
          </button>

          {value.name === "" ? (
            <Button
              variant="light"
              type="button"
              style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
              className="f-17 text-center"
            >
              Create
            </Button>
          ) : (
            <Link href={`/projects/${project_id}/modelling/${query?.id}?name=${value.name}`}>
              <Button
                variant="primary"
                type="button"
                style={{ opacity: 0.9, width: 117 }}
                className="text-white f-17 text-center"
              >
                Create
              </Button>
            </Link>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={queryDelete}
        onHide={() => {
          setQueryDelete(!queryDelete);
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
              Are you sure you want to delete this query?
            </p>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn bg-white"
              onClick={() => {
                setQueryDelete(!queryDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                handleDelete(query.id);
                setQueryDelete(!queryDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default QueriesMenu;
