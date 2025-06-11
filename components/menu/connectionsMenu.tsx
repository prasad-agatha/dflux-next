// react
import React, { FC } from "react";
// next link
import Link from "next/link";
// react-bootstrap
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
// import { CodeBlock } from "@styled-icons/boxicons-regular/CodeBlock";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
// import { Delete, Update } from "@styled-icons/material";
// services
import { ConnectionsService } from "services";
// components
import { ViewConnection } from "components/modals";
import { Modal, Image } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
//toast configuration
toast.configure();

const connections = new ConnectionsService();

interface IConnectionMenuProps {
  item: any;
  project_Id: any;
  connMutate: any;
  values: any;
  setValues: any;
  dsState: any;
  setDsState: any;
  valuesSnowflake?: any;
  setValuesSnowflake?: any;
  userRole?: any;
}

const ConnectionsMenu: FC<IConnectionMenuProps> = (props) => {
  const {
    item,
    project_Id,
    connMutate,
    values,
    setValues,
    dsState,
    setDsState,
    valuesSnowflake,
    setValuesSnowflake,
    userRole,
  } = props;

  const deleteConnection = async (id: number) => {
    await connections
      .deleteConnection(id)
      .then(() => {
        // connectionsData(project_id);
        toast.success("Connection deleted", { delay: 3500 });
        connMutate();
      })
      .catch(() => {
        toast.error("Error deleting connection");
      });
  };
  const [datasourceDelete, setDatasourceDelete] = React.useState(false);
  return (
    <Dropdown className="align-self-start pt-2 mt-1">
      <Dropdown.Toggle className="bg-transparent border-0 float-right p-0" id="dropdown-basic">
        <MoreVerticalOutline cursor="pointer" className="icon-size" />
        <Dropdown.Menu align="left" className="pt-0 pb-0">
          {userRole?.user_role === "Owner" ||
          userRole?.user_module_access[0]["Data sources"] === "WRITE" ? (
            <>
              <Dropdown.Item className="menu-item list-group-item">
                <Link href={`/projects/${project_Id}/queries/${item.id}`}>
                  <div className="df1 flex-row align-items-center">
                    {/* <CodeBlock width={16} height={16} className="me-2" /> */}
                    <Image
                      src="/newicons/datasource-menu/new-query.svg"
                      className="menu-item-icon"
                    />
                    <p className="menu-item-text mb-0">New query</p>
                  </div>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item
                className="menu-item list-group-item"
                onClick={() => {
                  let temp_dbType = "";
                  if (item.connection_type === "snowflake") {
                    setDsState({ ...dsState, dbtype: item.connection_type, view: true });
                    temp_dbType = item.connection_type;
                  } else {
                    setDsState({ ...dsState, dbtype: item.engine, view: true });
                    temp_dbType = item.engine;
                  }

                  setValues({
                    dbname: item.dbname,
                    engine: temp_dbType,
                    host: item.host,
                    name: item.name,
                    password: item.password,
                    port: item.port,
                    project: project_Id,
                    username: item.username,
                  });
                  setValuesSnowflake({
                    dbname: item.dbname,
                    username: item.username,
                    password: item.password,
                    schema: item.schema,
                    warehouse: item.warehouse,
                    account: item.account,
                    name: item.name,
                    connection_type: item.connection_type,
                  });
                }}
              >
                <div className="df1 flex-row align-items-center">
                  {/* <Update width={20} height={20} className="me-2" /> */}
                  <Image src="/newicons/datasource-menu/update.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Update</p>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                className="menu-item list-group-item"
                onClick={() => {
                  // deleteConnection(item.id);
                  setDatasourceDelete(!datasourceDelete);
                }}
              >
                <div className="df1 flex-row align-items-center">
                  {/* <Delete width={20} height={20} className="me-2" /> */}
                  <Image src="/newicons/delete.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Delete</p>
                </div>
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item className="menu-item list-group-item disabled-item-hover">
                <div className="df1 flex-row align-items-center">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex align-items-center">
                      <Image
                        src="/newicons/datasource-menu/disabled-new-query.svg"
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text_disable mb-0">New query</p>
                    </div>
                  </OverlayTrigger>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="menu-item list-group-item disabled-item-hover">
                <div className="df1 flex-row align-items-center">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex align-items-center">
                      <Image
                        src="/newicons/datasource-menu/disabled-update.svg"
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text_disable mb-0">Update</p>
                    </div>
                  </OverlayTrigger>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="menu-item list-group-item disabled-item-hover">
                <div className="df1 flex-row align-items-center">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="mt-3" id="tooltip-engine">
                        You didn&apos;t have access to this feature
                      </Tooltip>
                    }
                  >
                    <div className="d-flex align-items-center">
                      <Image src="/newicons/disabled-delete.svg" className="menu-item-icon" />
                      <p className="menu-item-text_disable mb-0">Delete</p>
                    </div>
                  </OverlayTrigger>
                </div>
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown.Toggle>
      <Modal
        show={datasourceDelete}
        onHide={() => {
          setDatasourceDelete(!datasourceDelete);
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <h4 className="p-2 pt-3 d-flex justify-content-center align-items-center">
            Confirm delete
          </h4>
          <div className="mb-0 mt-0 d-flex justify-content-center align-items-center pt-0">
            <div className="d-flex flex-column">
              <p className="d-flex mb-0 justify-content-center align-items-center">
                Are you sure you want to delete this datasource?
              </p>
              <p className="d-flex mt-0 mb-1 justify-content-center mb-0 ms-2 text-center align-items-center">
                All the data, queries, models, charts and dashboards of this data source will be
                removed permanently.
              </p>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn bg-white"
              onClick={() => {
                setDatasourceDelete(!datasourceDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                deleteConnection(item.id);
                setDatasourceDelete(!datasourceDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <ViewConnection
        item={item}
        values={values}
        setValues={setValues}
        dsState={dsState}
        setDsState={setDsState}
        connMutate={connMutate}
        valuesSnowflake={valuesSnowflake}
        setValuesSnowflake={setValuesSnowflake}
      />
    </Dropdown>
  );
};
export default ConnectionsMenu;
