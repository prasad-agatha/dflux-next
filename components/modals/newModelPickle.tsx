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

interface INewModelProps {
  newState: any;
  setNewState: any;
  row: any;
}
const NewModelPickle: FC<INewModelProps> = (props) => {
  const { newState, setNewState, row } = props;

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
    setSelectedQuery(e);
  };
  return (
    <Modal
      show={newState.model}
      onHide={() => {
        setNewState({ ...newState, model: false });
        setSelectedQuery([]);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="justify-content-center align-items-center">
        <Modal.Title className="mt-0 mb-0 f-24" style={{ color: "#495968", fontWeight: 600 }}>
          Predict with new data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-3">
        {/* <div className="d-flex mb-1">Select query:</div> */}
        <div className="d-flex">
          <Select
            // isDisabled={allQueries?.length === 0}
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
      <Modal.Footer className="border-0 mb-2 d-flex justify-content-center align-items-center">
        {/* <Link href={`/projects/${project_id}/modelling/${selectedQuery?.id}`}>
          <Button className="text-white" disabled={selectedQuery.length === 0}>
            New Model
          </Button>
        </Link> */}
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setNewState({ ...newState, model: false });
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
            Run
          </Button>
        ) : (
          <Link href={`/projects/${project_id}/modelling/${selectedQuery.id}/prediction/${row}`}>
            {/* //   <Link href={`/projects/${project_id}/modelling/${selectedQuery?.id}`}> */}
            <Button
              // loading={inviteLoader}
              variant="primary"
              type="button"
              // onClick={sendInvitation}
              style={{ opacity: 0.9, width: 117 }}
              className="text-white f-17 text-center"
            >
              Run
            </Button>
          </Link>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default NewModelPickle;
