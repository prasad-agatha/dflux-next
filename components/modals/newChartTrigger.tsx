// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// loadash
import _ from "lodash";
// react-bootstrap
import { Modal } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// react select
import Select from "react-select";
// toast
import { toast } from "react-toastify";
// components
import { TriggersModal } from "components/modals";
//toast configuration
toast.configure();

interface INewQueryProps {
  newState: any;
  setNewState: any;
}
const NewChartTrigger: FC<INewQueryProps> = (props) => {
  const { newState, setNewState } = props;
  const router = useRouter();

  const { project_id } = router.query;

  const [selectedChart, setSelectedChart]: any = React.useState([]);

  const [allCharts, setAllCharts] = React.useState<any>([]);

  const [chartStates, setChartStates] = React.useState({
    name: "",
    id: 0,
    trigger: false,
    query: 0,
  });

  const { data: chartsData, mutate: chartMutate }: any = useRequest({
    url: `api/projects/${project_id}/limitedcharts/`,
  });

  React.useEffect(() => {
    if (chartsData) {
      const newArr1 = _.without(
        _.map(chartsData, (item) => {
          if (item.save_from === "query") {
            item["field"] = item.name;
            item["label"] = item.name;
            item["value"] = item.name;
            return item;
          } else return null;
        }),
        null
      );
      setAllCharts(newArr1);
    }
  }, [chartsData]);

  const addQuery = (e: any) => {
    setSelectedChart(e);
    setChartStates({ ...chartStates, name: e.name, id: e.id, query: e.query.id });
  };

  return (
    <Modal
      show={newState?.chartTrigger}
      onHide={() => {
        setNewState({ ...newState, chartTrigger: false });
        setSelectedChart([]);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="justify-content-center align-items-center">
        <Modal.Title className="mt-0 mb-0 f-24" style={{ color: "#495968", fontWeight: 600 }}>
          Create trigger
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-3">
        {/* <div className="d-flex">Select chart:</div> */}
        <div className="d-flex">
          <Select
            className="w-100"
            classNamePrefix="select a chart:"
            placeholder="Select chart"
            value={selectedChart}
            options={allCharts}
            name="color"
            onChange={addQuery}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        {selectedChart.length === 0 ? (
          <Button
            // loading={inviteLoader}
            variant="light"
            type="button"
            // onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
            className="f-17 text-center"
          >
            Create
          </Button>
        ) : (
          <Button
            // loading={inviteLoader}
            variant="primary"
            type="button"
            // onClick={sendInvitation}
            onClick={() => {
              setChartStates({ ...chartStates, trigger: true });
            }}
            style={{ opacity: 0.9, width: 117 }}
            className="text-white f-17 text-center"
          >
            Create
          </Button>
        )}
        {/* <Button
          className="text-white"
          disabled={selectedChart.length === 0}
          onClick={() => {
            setChartStates({ ...chartStates, trigger: true });
          }}
        >
          Create Trigger
        </Button> */}
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setNewState({ ...newState, chartTrigger: false });
            setSelectedChart([]);
          }}
        >
          Cancel
        </button>
      </Modal.Footer>
      <TriggersModal
        triggersMutate={chartMutate}
        queriesStates={chartStates}
        setQueriesStates={setChartStates}
      />
    </Modal>
  );
};
export default NewChartTrigger;
