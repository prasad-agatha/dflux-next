import React, { FC } from "react";
// toastify
import { toast } from "react-toastify";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { Dropdown, OverlayTrigger, Image, Tooltip } from "react-bootstrap";
import { CSVLink } from "react-csv";

interface ChartMenuProps {
  edit: any;
  chartState: any;
  saveChart: any;
  updateChart: any;
  setChartState: any;
  downloadAsImage: any;
  newState: any;
  setNewState: any;
  userRole?: any;
}

//toast configuration
toast.configure();

const ChartMenu: FC<ChartMenuProps> = (props: any) => {
  const {
    edit,
    chartState,
    // saveChart,
    // updateChart,
    newState,
    setNewState,
    setChartState,
    downloadAsImage,
    userRole,
  } = props;
  return (
    <Dropdown className="p-2" id="simple-menu">
      <Dropdown.Toggle className="bg-transparent border-0 p-0" id="dropdown-basic">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip className="mt-3" id="tooltip-engine">
              More
            </Tooltip>
          }
        >
          <MoreVerticalOutline width={20} height={22} className="chart-7 px-0 mx-0" />
        </OverlayTrigger>
      </Dropdown.Toggle>
      <Dropdown.Menu className="mt-2 me-2 pb-0 pt-0" align={{ xl: "left" }}>
        {userRole?.user_role === "Owner" || userRole?.user_module_access[4]['Charts'] === 'WRITE' ? (
          <>
            <Dropdown.Item
              onClick={() => {
                if (edit) {
                  setNewState({ ...newState, dashboard: true });
                } else {
                  toast.warn("Please save the chart in order to add to the dashboard !!!!");
                  // saveChart();
                }
              }}
              className="menu-item list-group-item f-14"
            >
              <div className="df1 flex-row align-items-center">
                <Image
                  src="/newicons/chart-menu/add-to-dashboard.svg"
                  // width={20}
                  // height={20}
                  className="menu-item-icon"
                />
                <p className="ms-1 menu-item-text mb-0"> Add to dashboard</p>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14">
              <div
                onClick={() => {
                  setChartState({
                    ...chartState,
                    fullScreen: true,
                  });
                }}
                className="cursor-pointer color-inherit"
              >
                <div className="df1 flex-row align-items-center">
                  <Image
                    src="/charts/maximize1.svg"
                    // width={20} height={20}
                    className="menu-item-icon"
                  />
                  <p className="mb-0 ms-1 menu-item-text"> Maximize</p>
                </div>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14">
              <div
                onClick={() => setChartState({ ...chartState, showTable: true })}
                className="df1 flex-row align-items-center"
              >
                <Image
                  src="/newicons/chart-menu/view-as-table.svg"
                  // width={20}
                  // height={20}
                  className="menu-item-icon"
                />
                <p className="mb-0 ms-1 menu-item-text">View as table</p>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14">
              <div
                onClick={() => downloadAsImage(chartState.name.trim())}
                className="cursor-pointer color-inherit"
              >
                <div className="df1 flex-row align-items-center">
                  <Image
                    src="/newicons/chart-menu/image.svg"
                    // width={20}
                    // height={20}
                    className="menu-item-icon"
                  />
                  <p className="mb-0 ms-1 menu-item-text"> Download as image</p>
                </div>
              </div>
            </Dropdown.Item>
            {chartState.tableData?.length > 0 ? (
              <Dropdown.Item className="menu-item list-group-item f-14">
                <CSVLink
                  data={chartState.tableData}
                  filename={"chart.csv"}
                  style={{ textDecoration: "none", color: "inherit", paddingLeft: 12 }}
                  className="cursor-pointer f-12 csv d-flex p-0 m-0"
                >
                  <div className="df1 flex-row align-items-center">
                    <Image
                      src="/newicons/models-menu/export.svg"
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    <p className="mb-0 ms-1 menu-item-text">Export as CSV</p>
                  </div>
                </CSVLink>
              </Dropdown.Item>
            ) : null}
          </>
        ) : (
          <>
            <Dropdown.Item className="menu-item list-group-item f-14 disabled-item-hover">
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
                    src="/newicons/chart-menu/disabled-add-to-dashboard.svg"
                    // width={20}
                    // height={20}
                    className="menu-item-icon"
                  />
                  <p className="mb-0 ms-1 menu-item-text_disable"> Add to dashboard</p>
                </div>
              </OverlayTrigger>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14">
              <div
                onClick={() => setChartState({ ...chartState, fullScreen: true })}
                className="cursor-pointer color-inherit"
              >
                <div className="df1 flex-row align-items-center">
                  <Image
                    src="/charts/maximize1.svg"
                    //  width={20} height={20}
                    className="menu-item-icon"
                  />
                  <p className="mb-0 ms-1 menu-item-text"> Maximize</p>
                </div>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14">
              <div
                onClick={() => setChartState({ ...chartState, showTable: true })}
                className="df1 flex-row align-items-center"
              >
                <Image
                  src="/charts/table.svg"
                  // width={20} height={20}
                  className="menu-item-icon"
                />
                <p className="mb-0 ms-1 menu-item-text">View as table</p>
              </div>
            </Dropdown.Item>
            <Dropdown.Item className="menu-item list-group-item f-14 disabled-item-hover">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip className="mt-3" id="tooltip-engine">
                    You didn&apos;t have access to this feature
                  </Tooltip>
                }
              >
                <div className="cursor-pointer color-inherit">
                  <div className="df1 flex-row align-items-center">
                    <Image
                      src="/newicons/chart-menu/disabled-image.svg"
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    <p className="mb-0 ms-1 menu-item-text_disable">Download as image</p>
                  </div>
                </div>
              </OverlayTrigger>
            </Dropdown.Item>
            {chartState.tableData?.length > 0 ? (
              <Dropdown.Item
                className="menu-item list-group-item f-14 disabled-item-hover"
                style={{ paddingLeft: 9 }}
              >
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
                      // width={20}
                      // height={20}
                      className="menu-item-icon"
                    />
                    <p className="mb-0 ms-1 menu-item-text_disable">Export as CSV</p>
                  </div>
                </OverlayTrigger>
              </Dropdown.Item>
            ) : null}
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChartMenu;
