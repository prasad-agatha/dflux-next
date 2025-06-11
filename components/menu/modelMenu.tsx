// react
import React, { FC } from "react";
//next link
import Link from "next/link";
// csvlink
import { CSVLink } from "react-csv";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Image, Popover, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

import { NewModelPickle } from "components/modals";

// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";

interface IResetPasswordFormProps {
  row: any;
  deleteModel: any;
  userRole: any;
}
const ModelMenu: FC<IResetPasswordFormProps> = (props) => {
  const { row, deleteModel, userRole } = props;
  const router = useRouter();
  const { project_id } = router.query;
  const [modelDelete, setModelDelete] = React.useState(false);
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });

  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup style={{ border: "0px solid black" }}>
          <Link href={`/projects/${project_id}/modelling/${row.extra.query_id}/view/${row.id}`}>
            <a className="text-decoration-none">
              <ListGroup.Item
                className="menu-item"
                onClick={() => {
                  document.body.click();
                }}
              >
                <div className="df1 flex-row">
                  <Image src="/newicons/models-menu/analysis.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Analysis</p>
                </div>
              </ListGroup.Item>
            </a>
          </Link>
          {userRole?.user_role === "Owner" || userRole?.user_module_access[3]['Models'] === 'WRITE' ? (
            <ListGroup.Item
              className="menu-item"
              onClick={() => {
                document.body.click();
                setNewState({ ...newState, model: true });
              }}
            >
              <div className="df1 flex-row">
                <Image
                  src="/newicons/models-menu/run-with-new-data.svg"
                  className="menu-item-icon"
                />
                <p className="menu-item-text mb-0">Run with new data</p>
              </div>
            </ListGroup.Item>
          ) : (
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
                  <Image src="/newicons/models-menu/disabled-run.svg" className="menu-item-icon" />
                  <p className="menu-item-text_disable mb-0">Run with new data</p>
                </div>
              </OverlayTrigger>
            </ListGroup.Item>
          )}
          {userRole?.user_role === "Owner" || userRole?.user_module_access[3]['Models'] === 'WRITE' ? (
            <ListGroup.Item className="menu-item">
              <CSVLink
                data={
                  row.data.length < 10000 ? row.data : row.data.filter((idx: any) => idx < 10000)
                }
                filename={`model_data.csv`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="cursor-pointer csv"
              >
                <div className="df1 flex-row align-items-center">
                  <Image
                    color=""
                    src="/newicons/models-menu/export.svg"
                    className="menu-item-icon"
                  />
                  <p className="menu-item-text mb-0">Export as CSV</p>
                </div>
              </CSVLink>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item className="menu-item disabled-item-hover">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip className="mt-3" id="tooltip-engine">
                    You didn&apos;t have access to this feature
                  </Tooltip>
                }
              >
                <div className="df1 flex-row align-items-center">
                  <Image
                    src="/newicons/models-menu/disabled-export.svg"
                    className="menu-item-icon"
                  />
                  <p className="menu-item-text_disable mb-0">Export as CSV</p>
                </div>
              </OverlayTrigger>
            </ListGroup.Item>
          )}
          {userRole?.user_role === "Owner" ? (
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
          ) : (
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
          )}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );
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
              Are you sure you want to delete this model?
            </p>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn bg-white"
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
                deleteModel(row.id);
                setModelDelete(!modelDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <NewModelPickle newState={newState} setNewState={setNewState} row={row.id} />
    </div>
  );
};
export default ModelMenu;
