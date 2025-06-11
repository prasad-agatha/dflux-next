// react
import React, { FC } from "react";
// react -bootstrap
import { Dropdown, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
// styled icons
// import { Edit, LinkAlt } from "@styled-icons/boxicons-regular";
// import { Delete } from "@styled-icons/fluentui-system-filled";
// import { Schedule } from "@styled-icons/material-twotone/Schedule";
// services
import { ChartService } from "services";
import { Modal } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
import { MoreVerticalOutline } from "styled-icons/evaicons-outline";
//toast configuration
toast.configure();

// service instance
const chartService = new ChartService();

interface IChartsMenuProps {
  chartMutate: any;
  item: any;
  chartState: any;
  setChartState: any;
  project_id: any;
  dashboardData: any;
  shareChart: any;
  userRole: any;
}

const ChartsMenu: FC<IChartsMenuProps> = (props) => {
  const {
    chartMutate,
    item,
    chartState,
    setChartState,
    project_id,
    dashboardData,
    shareChart,
    userRole,
  } = props;
  const [chartDelete, setChartDelete] = React.useState(false);
  const checkDashboard = async (id: any) => {
    if (dashboardData.length === 0) {
      return false;
    } else {
      const y: any = [];

      [...dashboardData].map((item: any) => {
        return item.charts.map((item1: any) => {
          y.push(item1.chart.id);
          return item1.chart.id;
        });
      });
      return y.includes(id);
    }
  };
  const deleteChart = async (data: any) => {
    if (await checkDashboard(data.id)) {
      toast.error("Chart is in a dashboard !!!");
    } else {
      chartService
        .deleteChart(data.id)
        .then(() => {
          toast.success("Chart deleted successfully", { autoClose: 3000 });
          chartMutate();
        })
        .catch((err: any) => {
          if (err.response.status === 401) {
            toast.error("Don't have write permission to delete this chart");
          } else {
            toast.error("Error deleting chart!!!");
            toast.error(err.error, { autoClose: 3000 });
          }
        });
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="ms-auto">
      <Dropdown>
        <Dropdown.Toggle
          className="bg-transparent border-0 float-right p-0"
          id="dropdown-split-basic"
        >
          {/* <Image src="/menuIcon.svg" className="icon-size cursor-pointer" /> */}
          <MoreVerticalOutline className="icon-size cursor-pointer" style={{ marginTop: "-8px" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="pb-0 pt-0">
          {userRole?.user_role === "Owner" ||
          userRole?.user_module_access[4]["Charts"] === "WRITE" ? (
            <>
              <Dropdown.Item
                eventKey="1"
                className="menu-item list-group-item menu-item-text mb-0"
                href={`${
                  item.save_from === "query"
                    ? `/projects/${project_id}/visualization/query/${item.query.id}?edit=${item.id}`
                    : `/projects/${project_id}/visualization/model/${item.data_model}?edit=${item.id}`
                }`}
              >
                {/* <Edit className="icon-size me-2 ms-1" />  */}
                <Image
                  src="/newicons/chart-menu/edit.svg"
                  // width={20}
                  // height={20}
                  className="menu-item-icon"
                />
                Edit
              </Dropdown.Item>
              {item.query !== null ? (
                <Dropdown.Item
                  eventKey="2"
                  className="menu-item list-group-item menu-item-text mb-0"
                  onClick={() => {
                    const item_data = {
                      ...item,
                      field: item.name,
                      label: item.name,
                      value: item.name,
                    };
                    setChartState({
                      ...chartState,
                      name: item.name,
                      trigger: true,
                      id: item.id,
                      query: item.query.id,
                      item: item_data,
                    });
                  }}
                >
                  {/* <Schedule className="icon-size me-2 ms-1" /> */}
                  <Image
                    src="/newicons/chart-menu/set-trigger.svg"
                    // width={20}
                    // height={20}
                    className="menu-item-icon"
                  />
                  Set trigger
                </Dropdown.Item>
              ) : null}
              <Dropdown.Item
                eventKey="3"
                className="menu-item list-group-item menu-item-text mb-0"
                onClick={() => {
                  shareChart(item.id);
                  document.body.click();
                }}
              >
                {/* <LinkAlt className="icon-size me-2 ms-1" /> */}
                <Image
                  src="/newicons/chart-menu/get-link.svg"
                  // width={20}
                  // height={20}
                  className="menu-item-icon"
                />
                Get link
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                className="menu-item list-group-item menu-item-text mb-0"
                onClick={() => setChartDelete(!chartDelete)}
              >
                {/* <Delete className="icon-size me-2 ms-1" /> */}
                <Image
                  src="/newicons/delete.svg"
                  // width={20} height={20}
                  className="menu-item-icon testsvg"
                />
                Delete
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item
                eventKey="1"
                className="menu-item list-group-item"
                href={`${
                  item.save_from === "query"
                    ? `/projects/${project_id}/visualization/query/${item.query.id}?edit=${item.id}`
                    : `/projects/${project_id}/visualization/model/${item.data_model}?edit=${item.id}`
                }`}
              >
                <div className="d-flex align-items-center">
                  <Image
                    src="/newicons/chart-menu/edit.svg"
                    // width={20}
                    // height={20}
                    className="menu-item-icon"
                  />
                  <p className="menu-item-text mb-0">Edit</p>
                </div>
              </Dropdown.Item>
              {item.query !== null ? (
                <Dropdown.Item
                  eventKey="2"
                  className="menu-item list-group-item disabled-item-hover"
                >
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
                        src="/newicons/chart-menu/disabled-trigger.svg"
                        // width={20}
                        // height={20}
                        className="menu-item-icon"
                      />
                      <p className="menu-item-text_disable mb-0">Set trigger</p>
                    </div>
                  </OverlayTrigger>
                </Dropdown.Item>
              ) : null}
              <Dropdown.Item
                eventKey="3"
                className="menu-item list-group-item disabled-item-hover "
              >
                {/* <LinkAlt className="icon-size me-2 ms-1" /> */}
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
                      src="/newicons/chart-menu/disabled-get-link.svg"
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    <p className="menu-item-text_disable mb-0">Get link</p>
                  </div>
                </OverlayTrigger>
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" className="menu-item list-group-item disabled-item-hover">
                {/* <Delete className="icon-size me-2 ms-1" /> */}
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
                      src="/newicons/disabled-delete.svg"
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    <p className="menu-item-text_disable mb-0">Delete</p>
                  </div>
                </OverlayTrigger>
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        show={chartDelete}
        onHide={() => setChartDelete(!chartDelete)}
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
          <div className="d-flex flex-row justify-content-center align-items-center my-4">
            <button
              className="btn bg-white"
              onClick={() => {
                setChartDelete(!chartDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                deleteChart(item);
                setChartDelete(!chartDelete);
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
export default ChartsMenu;
