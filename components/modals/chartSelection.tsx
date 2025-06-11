// react
import React, { FC } from "react";
// react-bootstrap
import { Modal, Form } from "react-bootstrap";
// react bootstrap button loader
import Button from "react-bootstrap-button-loader";
// react-select
import Select from "react-select";
import _ from "lodash";

interface IChartProps {
  viewDashboardStates: any;
  setViewDashboardStates: any;
  selectedChart: any;
  allCharts: any;
  renderDashboard: any;
  dashboardFilters: any;
}
const ChartSelection: FC<IChartProps> = ({
  viewDashboardStates,
  setViewDashboardStates,
  selectedChart,
  allCharts,
  renderDashboard,
  dashboardFilters,
}) => {
  const [initialCharts, setInitialCharts]: any = React.useState([]);
  React.useEffect(() => {
    const arr: any = [];
    _.forEach(dashboardFilters, (e: any, idx: any) => {
      arr.push({ ...selectedChart[idx], index: e.index });
    });

    setInitialCharts(_.sortBy(arr, ["index"]));
  }, [selectedChart]);

  const addChart = (ele: any) => {
    setInitialCharts(ele);
  };
  return (
    <Modal
      show={viewDashboardStates.selectChart}
      onHide={() =>
        setViewDashboardStates({
          ...viewDashboardStates,
          selectChart: false,
        })
      }
    >
      <Modal.Header className="mb-0 d-flex justify-content-center align-items-center">
        <Modal.Title
          className="mt-0 mb-0 f-24"
          style={{ color: "#495968", textAlign: "start", opacity: 0.9 }}
        >
          Add to dashboard
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 mt-3">
        <div className="d-flex flex-column">
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select a chart</Form.Label>
              <Select
                isMulti
                menuPlacement="top"
                menuPosition="absolute"
                name="charts"
                value={initialCharts}
                options={allCharts}
                className="multi-select-box w-100"
                placeholder="Select chart type"
                classNamePrefix="Select chart type"
                closeMenuOnSelect={false}
                onChange={addChart}
              />
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        <Button
          onClick={() => {
            setViewDashboardStates({
              ...viewDashboardStates,
              selectChart: false,
            });
          }}
          variant="text"
          className="btn ms-3 bg-white"
        >
          Cancel
        </Button>
        {viewDashboardStates.selectedChart > 0 ? (
          <Button
            variant="light"
            type="button"
            // onClick={sendInvitation}
            className="text-center f-17"
            id="dashboard-submit"
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
          >
            Submit
          </Button>
        ) : (
          <Button
            // loading={createLoader}
            onClick={() => {
              const tempArr: any = [];
              _.map(initialCharts, (e: any) => {
                const { index, ...other } = e;
                if (index) {
                  //
                }
                tempArr.push(other);
              });
              renderDashboard(tempArr);
            }}
            variant="primary"
            className="text-white text-center f-17"
            id="dashboard-submit"
            type="button"
            // onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
          >
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default ChartSelection;
