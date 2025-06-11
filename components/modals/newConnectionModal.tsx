import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Modal, Image, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// toast
import { toast } from "react-toastify";
// components
import { Engines } from "components/connections";
import { Details } from "components/forms";
// services
import { ConnectionsService } from "services";
//toast configuration
toast.configure();

interface ICreateConnectionProps {
  newState: any;
  setNewState: any;
  connMutate?: any;
  excelMutate?: any;
}

const connections = new ConnectionsService();

const NewConnectionsModal: FC<ICreateConnectionProps> = (props) => {
  const { newState, setNewState, connMutate, excelMutate } = props;
  const router = useRouter();
  const { project_id } = router.query;
  // DS State
  const [dsState, setDsState] = React.useState({
    activeStep: 0,
    dbtype: "",
    tab: "select",
    stepprogress: 0,
    testing: false,
    retesting: false,
    save: false,
  });
  const [error, setError] = React.useState({ status: false, message: "" });
  const [excel, setExcel] = React.useState(false);

  // test connection button
  const [status, setStatus] = React.useState("Default");
  // save connection loader
  const [values, setValues] = React.useState({
    dbname: "",
    engine: dsState.dbtype,
    host: "",
    name: "",
    password: "",
    port: "",
    project: project_id,
    username: "",
  });
  const [valuesSnowFlake, setValuesSnowFlake] = React.useState({
    dbname: "",
    username: "",
    password: "",
    schema: "",
    warehouse: "",
    account: "",
    name: "",
    connection_type: "",
  });

  const [form_data, setForm_data] = React.useState({
    dbname: "",
    username: "",
    password: "",
    host: "",
    port: "",
    name: "",
  });

  const handleChange = (e: any) => {
    const val = e.target.value;
    const name = e.target.name;
    setValuesSnowFlake({ ...valuesSnowFlake, [name]: val });
    setValues({ ...values, [name]: val });
  };
  const testConnect = () => {
    if (values.engine === "SNOWFLAKE") {
      connections
        .testSnowFlake(valuesSnowFlake)
        .then(() => {
          setStatus("Success");
          setDsState({ ...dsState, testing: false, retesting: false });
        })
        .catch((res: any) => {
          setStatus(res?.error);
          toast.error(res?.error);
          setDsState({ ...dsState, testing: false, retesting: false });
        });
    } else {
      connections
        .testConnection(values)
        .then(() => {
          setStatus("Success");
          setDsState({ ...dsState, testing: false, retesting: false });
        })
        .catch((res: any) => {
          setStatus(res?.error);
          toast.error(res?.error);
          setDsState({ ...dsState, testing: false, retesting: false });
        });
    }
  };

  const testConnection = async () => {
    if (values.engine === "SNOWFLAKE") {
      setDsState({ ...dsState, testing: true, retesting: true });
      testConnect();
    } else {
      if (
        values.dbname.length === 0 ||
        values.engine.length === 0 ||
        values.host.length === 0 ||
        values.name.length === 0 ||
        values.password.length === 0 ||
        values.port.length === 0 ||
        values.project.length === 0 ||
        values.username.length === 0
      ) {
        setError({ ...error, status: true, message: "Empty inputs are not allowed" });
      } else {
        setDsState({ ...dsState, testing: true, retesting: true });
        testConnect();
      }
    }
  };
  const saveConnection = () => {
    setDsState({ ...dsState, testing: false, retesting: false, save: true });
    connections
      .createConnection(values.engine === "SNOWFLAKE" ? valuesSnowFlake : values, project_id)
      .then(() => {
        connMutate();
        toast.success("New connection created!", { delay: 3500 });
        setValues({
          dbname: "",
          engine: dsState.dbtype,
          host: "",
          name: "",
          password: "",
          port: "",
          project: project_id,
          username: "",
        });
        setDsState({
          ...dsState,
          dbtype: "",
          tab: "select",
          stepprogress: 0,
          save: false,
          testing: false,
          retesting: false,
        });
        setStatus("Default");
        setNewState({ ...newState, connection: false });
        if (connMutate !== "home" && connMutate !== "refresh") {
          connMutate();
        } else if (connMutate === "refresh") {
          location.reload();
        }
      })
      .catch(() => {
        toast.error("Error creating connections");
      });
  };
  // cancel
  const cancelDialog = () => {
    setError({ ...error, status: false, message: "" });
    setNewState({ ...newState, connection: false });
    setValuesSnowFlake({
      dbname: "",
      username: "",
      password: "",
      schema: "",
      warehouse: "",
      account: "",
      name: "",
      connection_type: "",
    });
    setValues({
      dbname: "",
      engine: dsState.dbtype,
      host: "",
      name: "",
      password: "",
      port: "",
      project: project_id,
      username: "",
    }),
      setStatus("Default"),
      setForm_data({
        dbname: "",
        username: "",
        password: "",
        host: "",
        port: "",
        name: "",
      }),
      setDsState({
        ...dsState,
        dbtype: "",
        tab: "select",
        testing: false,
        retesting: false,
        stepprogress: 0,
        save: false,
      });
  };
  const selectConnector = () => {
    return (
      <div className="d-flex justify-content-between flex-column">
        <div className="d-flex justify-content-center align-items-center flex-column mb-5">
          <h2 className="dblue cursor-pointer f-20">Select connector</h2>

          <h6 className="select-db-connections ">
            Select your database type and quickly connect to your data source
          </h6>
        </div>
        <Engines
          values={values}
          setValues={setValues}
          newState={newState}
          setNewState={setNewState}
          from={"create"}
          connMutate={connMutate}
          excelMutate={excelMutate}
          excel={excel}
          setExcel={setExcel}
        />
      </div>
    );
  };

  const configureConnector = () => {
    return (
      <div className="d-flex justify-content-center py-2">
        <Details
          values={values}
          handleChange={handleChange}
          form_data={form_data}
          error={error}
          valuesSnowFlake={valuesSnowFlake}
        />
      </div>
    );
  };

  return (
    <Modal
      className="modal-static dialog-c"
      size="lg"
      show={newState?.connection}
      centered
      onHide={cancelDialog}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className=" flex-row align-items-center p-3"
        closeButton
        closeLabel="Cancel"
        color="black"
      >
        <h2 className="dialog-title-create-connections f-20 mb-0">Create new data source</h2>
      </Modal.Header>
      <Modal.Body className="d-flex align-self-center py-2" style={{ height: 390 }}>
        <div className="d-flex flex-column pt-2">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-row">
              <div
                onClick={() => {
                  setDsState({
                    ...dsState,
                    dbtype: "",
                    tab: "select",
                    stepprogress: 0,
                    activeStep: 0,
                  });
                }}
                style={{ border: "3px solid #0076FF", backgroundColor: "#0076FF" }}
                className="progress-div"
              ></div>

              <ProgressBar now={dsState.stepprogress} className="progress-barr" />
              <div
                style={{
                  border: dsState.tab === "configure" ? "3px solid #0076FF" : "3px solid #C6D0DB",
                  backgroundColor: dsState.tab === "configure" ? "#0076FF" : "#FFFFFF",
                }}
                className="progress-div"
              ></div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-around mb-1">
            <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Change engine!</Tooltip>}>
              <h6
                onClick={() => {
                  setDsState({
                    ...dsState,
                    dbtype: "",
                    tab: "select",
                    stepprogress: 0,
                    activeStep: 0,
                  });
                }}
                className="dblue cursor-pointer mb-1 mt-2 "
              >
                Select connector
              </h6>
            </OverlayTrigger>
            <h6
              className="mb-1 mt-2"
              style={{ color: dsState.activeStep === 0 ? "#C6D0DB" : "#0076FF" }}
            >
              Configure connector
            </h6>
          </div>
          <div className="df1 align-items-center">
            {dsState.tab === "select" ? selectConnector() : configureConnector()}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="align-self-center pt-1 border-0">
        {dsState.tab === "select" ? (
          <Button
            onClick={() => {
              values.engine === ""
                ? alert("Select database engine")
                : setDsState({
                    ...dsState,
                    dbtype: "",
                    tab: "configure",
                    stepprogress: 100,
                    activeStep: dsState.activeStep + 1,
                  });
            }}
            className="configure-b f-16"
          >
            Configure connector
          </Button>
        ) : status === "Default" ? (
          <Button onClick={testConnection} loading={dsState.testing} className="test-b f-16">
            Test connection
          </Button>
        ) : status !== "Success" ? (
          <div className="d-flex">
            <Button disabled className="failed-b f-16 bg-light border-0">
              <Image src="/failed.svg" className="me-2" width="22" height="22" />
              Connection failed
            </Button>
            <Button onClick={testConnection} loading={dsState.retesting} className="test-b f-16">
              Re - test
            </Button>
          </div>
        ) : (
          <div className="d-flex">
            <Button disabled className="success-b f-16 bg-light border-0">
              <Image src="/success.svg" className="me-2" width="22" height="22" />
              Success
            </Button>
            <Button loading={dsState.save} onClick={saveConnection} className="test-b f-16">
              Save connection
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default NewConnectionsModal;
