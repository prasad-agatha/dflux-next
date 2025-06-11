import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Modal, Tabs, Tab } from "react-bootstrap";
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
  jsonMutate?: any;
  excelMutate?: any;
  connname?: any;
  setConnName?: any;
  updateTab?: any;
  setUpdateTab?: any;
}

const connections = new ConnectionsService();

const ConnectionsModal: FC<ICreateConnectionProps> = (props) => {
  const {
    newState,
    setNewState,
    connname,
    connMutate,
    jsonMutate,
    excelMutate,
    setConnName,
    updateTab,
    setUpdateTab,
  } = props;
  const router = useRouter();
  const { project_id } = router.query;
  // modal states
  const [dsState, setDsState] = React.useState({
    activeStep: 0,
    dbtype: "",
    tab: "select",
    stepprogress: 0,
    stepprogress1: 0,
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
    setDsState({
      ...dsState,
      testing: true,
      retesting: true,
    });
    if (values.engine === "SNOWFLAKE") {
      connections
        .testSnowFlake(valuesSnowFlake)
        .then(() => {
          setStatus("Success");
          setDsState({
            ...dsState,
            testing: false,
            retesting: false,
            dbtype: "",
            tab: "configure",
            stepprogress: 100,
            stepprogress1: 100,
            activeStep: dsState.activeStep + 1,
          });
        })
        .catch((res: any) => {
          setStatus(res?.error);
          toast.error(res?.error);

          setDsState({
            ...dsState,
            testing: false,
            retesting: false,
            dbtype: "",
            tab: "test",
            stepprogress: 100,
            stepprogress1: 0,
            activeStep: dsState.activeStep + 1,
          });
        });
    } else {
      connections
        .testConnection(values)
        .then(() => {
          setStatus("Success");

          setDsState({
            ...dsState,
            testing: false,
            retesting: false,
            dbtype: "",
            tab: "configure",
            stepprogress: 100,
            stepprogress1: 100,
            activeStep: dsState.activeStep + 1,
          });
        })
        .catch((res: any) => {
          setStatus(res?.error);
          toast.error(res?.error);

          setDsState({
            ...dsState,
            testing: false,
            retesting: false,
            dbtype: "",
            tab: "test",
            stepprogress: 100,
            stepprogress1: 0,
            activeStep: dsState.activeStep + 1,
          });
        });
    }
  };

  const testConnection = async () => {
    setError({ ...error, status: false, message: "" });

    if (values.engine === "SNOWFLAKE") {
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
    setExcel(false);
    setUpdateTab("databases");
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
      // <div className="d-flex justify-content-between flex-column">
      //   <div className="d-flex justify-content-center align-items-center flex-column mb-4"></div>
      <Engines
        values={values}
        setValues={setValues}
        newState={newState}
        setNewState={setNewState}
        from={"create"}
        connMutate={connMutate}
        excelMutate={excelMutate}
        jsonMutate={jsonMutate}
        updateTab={updateTab}
        dsState={dsState}
        setDsState={setDsState}
        excel={excel}
        setExcel={setExcel}
        connname={connname}
        setConnName={setConnName}
        setUpdateTab={setUpdateTab}
        setStatus={setStatus}
        setForm_data={setForm_data}
        setError={setError}
        error={error}
      />
      // </div>
    );
  };

  const configureConnector = () => {
    return (
      // <div className="d-flex justify-content-center">
      <Details
        values={values}
        handleChange={handleChange}
        form_data={form_data}
        error={error}
        valuesSnowFlake={valuesSnowFlake}
      />
      // </div>
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
        // closeButton
        className=" flex-row justify-content-center align-items-center p-3 mt-2 mb-2"
        color="black"
      >
        <h2 className="dialog-title-create-connections f-20 mb-0">Create new data source</h2>
      </Modal.Header>
      <Modal.Body
        className="align-items-center py-2 text-center"
        // style={{
        //   minHeight: 365,
        // }}
      >
        <Tabs
          activeKey={updateTab}
          onSelect={(k: any) => {
            setUpdateTab(k);
            if (k === "flatfiles") {
              setDsState({
                ...dsState,
                dbtype: "",
                tab: "select",
                stepprogress: 0,
                activeStep: 0,
              });
            }
          }}
          defaultActiveKey={updateTab}
          id="charttabs"
          variant="pills"
          className="datasource-tab d-flex mb-1 justify-content-center d-inline-flex border-0"
          style={{ gap: "60px" }}
        >
          <hr className="mb-0" />

          <Tab eventKey="flatfiles" title="Flat files">
            {dsState.tab === "select" ? selectConnector() : null}
          </Tab>
          <Tab eventKey="databases" title="Databases">
            <div>
              <div className="stepper-wrapper d-inline-flex">
                <div
                  className="stepper-item completed"
                  onClick={() => {
                    setDsState({
                      ...dsState,
                      dbtype: "",
                      tab: "select",
                      stepprogress: 0,
                      activeStep: 0,
                    });
                  }}
                >
                  <div className="step-counter cursor-pointer"></div>
                  <div className="step-name mx-5 cursor-pointer">Select</div>
                </div>
                <div
                  className={
                    "stepper-item" +
                    (dsState.tab === "test" || dsState.tab === "configure" ? " completed" : "")
                  }
                >
                  <div className="step-counter cursor-pointer"></div>
                  <div className="step-name mx-5 cursor-pointer">Test</div>
                </div>
                <div className={"stepper-item" + (dsState.tab === "configure" ? " completed" : "")}>
                  <div className="step-counter cursor-pointer"></div>
                  <div className="step-name mx-5 cursor-pointer">Configure</div>
                </div>
              </div>
              <div className="d-flex mt-1 mb-1 justify-content-center">
                {status === "Default" ? null : status !== "Success" ? (
                  <h6 style={{ color: "#FF6B6B" }}>
                    This connection has failed. Please try again.
                  </h6>
                ) : (
                  <h6 style={{ color: "#0DBD49" }}> Connection is successful.</h6>
                )}
              </div>

              {dsState.tab === "select" ? selectConnector() : configureConnector()}
            </div>
            <div className="d-flex justify-content-center align-items-center border-0 py-3">
              <button
                className="btn ms-3 bg-white"
                onClick={() => {
                  if (dsState.tab === "select") {
                    setNewState({ ...newState, connection: false });
                  } else {
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
                    setStatus("Default");
                    setForm_data({
                      dbname: "",
                      username: "",
                      password: "",
                      host: "",
                      port: "",
                      name: "",
                    });
                    setDsState({
                      ...dsState,
                      dbtype: "",
                      tab: "select",
                      testing: false,
                      retesting: false,
                      stepprogress: 0,
                      stepprogress1: 0,
                      save: false,
                      activeStep: 0,
                    });
                    setError({ ...error, status: false, message: "" });
                    setConnName("");
                  }
                }}
              >
                Cancel
              </button>
              {dsState.tab === "select" ? (
                <Button
                  onClick={() => {
                    values.engine === ""
                      ? toast.error("Select database engine")
                      : setDsState({
                          ...dsState,
                          dbtype: "",
                          tab: "test",
                          stepprogress: 100,
                          activeStep: dsState.activeStep + 1,
                        });
                  }}
                  className="configure-b f-16"
                >
                  Create
                </Button>
              ) : status === "Default" ? (
                <Button
                  type="submit"
                  onClick={testConnection}
                  loading={dsState.testing}
                  className="test-b f-16"
                >
                  Test connection
                </Button>
              ) : status !== "Success" ? (
                <Button
                  onClick={testConnection}
                  loading={dsState.retesting}
                  className="test-b f-16"
                >
                  Re - Test
                </Button>
              ) : (
                <Button loading={dsState.save} onClick={saveConnection} className="test-b f-16">
                  Configure
                </Button>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};
export default ConnectionsModal;
