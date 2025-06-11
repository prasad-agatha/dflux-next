// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
// import { useRequest } from "@lib/hooks";
// next link
import Link from "next/link";
// react-bootstrap
import { Modal, Image } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// react select
import Select from "react-select";
// toast
import { toast } from "react-toastify";
// styled icons
import styled from "styled-components";
import { Mysql, Microsoftsqlserver, Oracle } from "@styled-icons/simple-icons";
//toast configuration
toast.configure();

const OracleRed = styled(Oracle)`
  color: #f80000;
`;

interface INewQueryProps {
  newState: any;
  setNewState: any;
  allConnections: any;
  loading: any;
}
const NewQuery: FC<INewQueryProps> = (props) => {
  const { newState, setNewState, allConnections, loading } = props;

  const router = useRouter();

  const { project_id } = router.query;

  const [selectedConnection, setSelectedConnection]: any = React.useState([]);

  const selectConnection = (e: any) => {
    setSelectedConnection(e);
  };

  // const customStyles = {
  //   // option: (provided, state) => ({
  //   //   ...provided,
  //   //   borderBottom: "1px dotted pink",
  //   //   color: state.isSelected ? "red" : "blue",
  //   //   padding: 20,
  //   // }),
  //   control: () => ({
  //     // none of react-select's styles are passed to <Control />
  //     height: 50,
  //   }),
  //   // singleValue: (provided, state) => {
  //   //   const opacity = state.isDisabled ? 0.5 : 1;
  //   //   const transition = "opacity 300ms";

  //   //   return { ...provided, opacity, transition };
  //   // },f
  // };
  const checkType = (type: any) => {
    switch (type) {
      case "excel":
        return (
          <Image src="/connections/icons/excel-icon.svg" width="48" height="32" className="me-2" />
        );
      case "csv":
        return (
          <Image src="/connections/icons/csv-icon.svg" width="48" height="32" className="me-2" />
        );
      case "google_sheets":
        return (
          <Image src="/connections/icons/sheets-icon.svg" width="48" height="32" className="me-2" />
        );
      case "postgres":
        return (
          <Image src="/connections/icons/postgres.svg" width="48" height="32" className="me-2" />
        );
      case "mysql":
        return <Mysql width="64" height="32" className="me-2" />;
      case "mssql":
        return <Microsoftsqlserver width="52" height="32" className="me-2" />;
      case "oracle":
        return <OracleRed width="64" height="32" className="me-2" />;
      case "json":
        return (
          <Image src="/connections/icons/json-icon.svg" width="48" height="32" className="me-2" />
        );
    }
  };

  const formatOptionLabel = ({ label, datasource }: any) => (
    <div className="text-center d-flex justify-content-between align-items-center">
      <div
        className="mb-0"
        style={{ fontFamily: "Metropolis", fontSize: 16, fontStyle: "normal", color: "#495968" }}
      >
        {label}
      </div>
      <div className="ms-5 text-black">{checkType(datasource)}</div>
    </div>
  );

  return (
    <Modal
      show={newState?.query}
      onHide={() => {
        setNewState({ ...newState, query: false });
        setSelectedConnection([]);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="d-flex justify-content-center align-items-center">
        <Modal.Title className="mt-0 mb-0 f-24" style={{ color: "#495968", fontWeight: 600 }}>
          Create query
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-3">
        {/* <div className="d-flex">Select connection:</div> */}
        <div className="d-flex">
          <Select
            tabSelectsValue
            className="w-100"
            placeholder="Select connection"
            classNamePrefix="Select connection"
            value={selectedConnection}
            options={allConnections}
            name="color"
            loadingMessage={() => "Loading datasources"}
            isLoading={loading}
            onChange={selectConnection}
            formatOptionLabel={formatOptionLabel}
            // styles={customStyles}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 d-flex justify-content-center align-items-center">
        {/* <Button className="text-white" disabled={selectedQuery.length === 0}>
            Create
          </Button> */}
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setNewState({ ...newState, query: false });
            setSelectedConnection([]);
          }}
        >
          Cancel
        </button>
        {selectedConnection.length === 0 ? (
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
          <Link
            href={
              selectedConnection.type === "normal"
                ? `/projects/${project_id}/queries/${selectedConnection?.id}`
                : `/projects/${project_id}/queries/${selectedConnection?.connection}?type=${selectedConnection.type}&excel=${selectedConnection.id}`
            }
          >
            <Button
              // loading={inviteLoader}
              variant="primary"
              type="button"
              onClick={() => {
                setNewState({ ...newState, query: false });
                setSelectedConnection([]);
              }}
              style={{ opacity: 0.9, width: 117 }}
              className="text-white f-17 text-center"
            >
              Create
            </Button>
          </Link>
        )}
      </Modal.Footer>
      {/* <Modal.Footer>
        <Link href={`/projects/${project_id}/queries/${selectedQuery?.id}`}>
          <Button className="text-white" disabled={selectedQuery.length === 0}>
            New Query
          </Button>
        </Link>
      </Modal.Footer> */}
    </Modal>
  );
};
export default NewQuery;
