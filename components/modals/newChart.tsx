// react
import React, { FC } from "react";
// next link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react-bootstrap
import { Modal } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// react select
import Select from "react-select";
// toast
import { toast } from "react-toastify";
//toast configuration
toast.configure();

interface INewQueryProps {
  newState: any;
  setNewState: any;
}
const NewChart: FC<INewQueryProps> = (props) => {
  const { newState, setNewState } = props;
  const router = useRouter();

  const { project_id } = router.query;

  const [selectedQuery, setSelectedQuery]: any = React.useState([]);

  const [allQueries, SetAllQueries] = React.useState<any>([]);

  const { data: queriesData }: any = useRequest({
    url: `api/project/${project_id}/queries/`,
  });

  React.useEffect(() => {
    if (queriesData) {
      const newArr1 = queriesData?.map((item: any) => {
        item["field"] = item.name;
        item["label"] = item.name;
        item["value"] = item.name;
        return item;
      });
      SetAllQueries(newArr1);
    }
  }, [queriesData]);

  const addQuery = (e: any) => {
    // setSelectedChart(allChart[e.target.value]);
    setSelectedQuery(e);
  };

  return (
    <Modal
      show={newState?.chart}
      onHide={() => {
        setNewState({ ...newState, chart: false });
        setSelectedQuery([]);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="justify-content-center align-items-center">
        <Modal.Title className="mt-0 mb-0 f-24" style={{ color: "#495968", fontWeight: 600 }}>
          Create chart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-3">
        {/* <div className="d-flex">Select query:</div> */}
        <div className="d-flex">
          <Select
            className="w-100"
            classNamePrefix="select a query"
            placeholder="Select query"
            value={selectedQuery}
            options={allQueries}
            name="color"
            onChange={addQuery}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        {/* <Link href={`/projects/${project_id}/chart/create/${selectedQuery?.id}`}>
          <Button className="text-white" disabled={selectedQuery.length === 0}>
            New Chart
          </Button>
        </Link> */}
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setNewState({ ...newState, chart: false });
            setSelectedQuery([]);
          }}
        >
          Cancel
        </button>
        {selectedQuery.length === 0 ? (
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
          <Link href={`/projects/${project_id}/visualization/query/${selectedQuery?.id}`}>
            <Button
              // loading={inviteLoader}
              variant="primary"
              type="button"
              // onClick={sendInvitation}
              style={{ opacity: 0.9, width: 117 }}
              className="text-white f-17 text-center"
            >
              Create
            </Button>
          </Link>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default NewChart;
