import React, { FC } from "react";
// next link
import Link from "next/link";
// react-bootstrap
import { ListGroup, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
// import { LinkAlt, Edit } from "@styled-icons/boxicons-regular";
// import { Delete } from "@styled-icons/fluentui-system-filled";
import { Modal, Image } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";

interface IDashboardsMenuProps {
  project_id: any;
  item: any;
  shareDashboard: any;
  deleteDashboard: any;
  userRole: any;
}

const DashboardsMenu: FC<IDashboardsMenuProps> = (props) => {
  const { project_id, item, shareDashboard, deleteDashboard, userRole } = props;
  const [dashboardDelete, setDashboardDelete] = React.useState(false);
  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup style={{ border: "0px solid black" }}>
          {userRole?.user_role === "Owner" ||
          userRole?.user_module_access[6]["Dashboards"] === "WRITE" ? (
            <>
              <Link href={`/projects/${project_id}/dashboards/${item.id}`}>
                <a className="text-decoration-none">
                  <ListGroup.Item
                    onClick={() => {
                      document.body.click();
                    }}
                    className="menu-item list-group-item"
                  >
                    <div className="df1 flex-row">
                      <p className="menu-item-text mb-0">
                        {/* <Edit className="icon-size me-2" /> */}
                        <Image
                          src="/newicons/chart-menu/edit.svg"
                          // width={20}
                          // height={20}
                          className="menu-item-icon"
                        />
                        Edit
                      </p>
                    </div>
                  </ListGroup.Item>
                </a>
              </Link>
              <ListGroup.Item
                className="menu-item list-group-item"
                onClick={() => {
                  shareDashboard(item.id);
                  document.body.click();
                }}
              >
                <div className="df1 flex-row">
                  <p className="menu-item-text mb-0">
                    {/* <LinkAlt className="icon-size me-2" /> */}
                    <Image
                      src="/newicons/chart-menu/get-link.svg"
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    Get link
                  </p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item
                className="menu-item list-group-item"
                onClick={() => {
                  setDashboardDelete(!dashboardDelete);
                  document.body.click();
                }}
              >
                <div className="df1 flex-row">
                  <p className="menu-item-text mb-0">
                    <Image
                      src="/newicons/delete.svg"
                      //  width={20} height={20}
                      className="menu-item-icon"
                    />
                    Delete
                  </p>
                </div>
              </ListGroup.Item>
            </>
          ) : (
            <>
              <Link href={`/projects/${project_id}/dashboards/${item.id}`}>
                <a className="text-decoration-none">
                  <ListGroup.Item
                    onClick={() => {
                      document.body.click();
                    }}
                    className="menu-item list-group-item"
                  >
                    <div className="df1 flex-row">
                      <p className="menu-item-text mb-0">
                        {/* <Edit className="icon-size me-2" /> */}
                        <Image
                          src="/newicons/chart-menu/edit.svg"
                          // width={20}
                          // height={20}
                          className="menu-item-icon"
                        />
                        Edit
                      </p>
                    </div>
                  </ListGroup.Item>
                </a>
              </Link>
              <ListGroup.Item className="menu-item list-group-item disabled-item-hover">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <div className="df1 flex-row">
                    <p className="menu-item-text_disable mb-0">
                      <Image
                        src="/newicons/chart-menu/disabled-get-link.svg"
                        // width={20}
                        // height={20}
                        className="menu-item-icon"
                      />
                      Get link
                    </p>
                  </div>
                </OverlayTrigger>
              </ListGroup.Item>
              <ListGroup.Item className="menu-item list-group-item disabled-item-hover">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <div className="df1 flex-row">
                    <p className="menu-item-text_disable mb-0">
                      <Image
                        src="/newicons/disabled-delete.svg"
                        // width={20}
                        // height={20}
                        className="menu-item-icon"
                      />
                      Delete
                    </p>
                  </div>
                </OverlayTrigger>
              </ListGroup.Item>
            </>
          )}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <OverlayTrigger rootClose trigger="click" placement="bottom-end" overlay={popover} transition>
        <MoreVerticalOutline className="icon-size cursor-pointer" />
      </OverlayTrigger>
      <Modal
        show={dashboardDelete}
        onHide={() => {
          setDashboardDelete(!dashboardDelete);
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
              Are you sure you want to delete this chart?
            </p>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn bg-white"
              onClick={() => {
                setDashboardDelete(!dashboardDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                deleteDashboard(item.id);
                setDashboardDelete(!dashboardDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardsMenu;
