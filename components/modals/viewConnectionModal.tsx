import React, { FC } from "react";
// next router
// import { useRouter } from "next/router";
// react-bootstrap
import { Modal, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
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

interface IViewConnectionProps {
  item?: any;
  values: any;
  setValues: any;
  connMutate: any;
  dsState: any;
  setDsState: any;
  valuesSnowflake?: any;
  setValuesSnowflake?: any;
}

const connections = new ConnectionsService();

const ViewConnection: FC<IViewConnectionProps> = (props) => {
  const {
    values,
    setValues,
    item,
    connMutate,
    dsState,
    setDsState,
    valuesSnowflake,
    setValuesSnowflake,
  } = props;

  // test connection button
  const [status, setStatus] = React.useState("Default");
  const [error, setError] = React.useState({ status: false, message: "" });
  const [form_data, setForm_data] = React.useState({
    dbname: "",
    username: "",
    password: "",
    host: "",
    port: "",
    name: "",
  });
  const [excel, setExcel] = React.useState(false);
  const handleChange = (e: any) => {
    const val = e.target.value;
    const name = e.target.name;
    setValues({ ...values, [name]: val });
    setValuesSnowflake({ ...valuesSnowflake, [name]: val });
  };
  const testConnect = () => {
    if (values.engine === "SNOWFLAKE" || valuesSnowflake.connection_type === "SNOWFLAKE") {
      connections
        .testSnowFlake(valuesSnowflake)
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
          toast.error(res?.error);
          setStatus(res?.error);
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
    if (values === "SNOWFLAKE" || valuesSnowflake.connection_type === "SNOWFLAKE") {
      testConnect();
    } else {
      if (
        values.dbname.length === 0 ||
        values.engine.length === 0 ||
        values.host.length === 0 ||
        values.name.length === 0 ||
        values.password.length === 0 ||
        values.port.length === 0 ||
        values.project.toString().length === 0 ||
        values.username.length === 0
      ) {
        setError({ ...error, status: true, message: "Empty inputs are not allowed" });
      } else {
        testConnect();
      }
    }
  };

  const updateConnection = (id: any) => {
    setDsState({ ...dsState, testing: false, retesting: false, save: true });
    connections
      .updateConnection(id, values)
      .then(() => {
        setError({ ...error, status: false, message: "" });
        setDsState({ ...dsState, view: !dsState.view, save: false });
        toast.success("Connection updated!", { delay: 3500 });
        setStatus("Default");
        connMutate();
      })
      .catch(() => {
        toast.error("Error updating connection");
      });
  };

  const selectConnector = () => {
    return (
      <div className="d-flex justify-content-around flex-column">
        <h6 className="select-db-connections">Choose database type</h6>
        <Engines
          values={values}
          setValues={setValues}
          dsState={dsState}
          setDsState={setDsState}
          from={"view"}
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
          valuesSnowFlake={valuesSnowflake}
        />
      </div>
    );
  };

  return (
    <Modal
      className="modal-static dialog-c"
      size="lg"
      show={dsState.view}
      centered
      onHide={() => {
        setError({ ...error, status: false, message: "" });
        setDsState({ ...dsState, view: false, save: false });
        setForm_data({
          dbname: "",
          username: "",
          password: "",
          host: "",
          port: "",
          name: "",
        });
        setStatus("Default");
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className=" flex-row justify-content-center align-items-center p-3 mt-2 mb-2"
        // closeButton
        closeLabel="Cancel"
        color="black"
      >
        <h2 className="dialog-title-create-connections f-20 mb-0">Edit connection</h2>
      </Modal.Header>
      <Modal.Body className="py-2" style={{ height: 320 }}>
        <div className="d-flex flex-column mt-4 pt-2">
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
                style={{ border: "5px solid #0076FF", backgroundColor: "#0076FF" }}
                className="progress-div"
              ></div>

              <ProgressBar now={dsState.stepprogress} className="progress-baar" />
              <div
                style={{
                  border:
                    dsState.tab === "test" || dsState.tab === "configure"
                      ? "5px solid #0076FF"
                      : "3px solid #C6D0DB",
                  backgroundColor:
                    dsState.tab === "test" || dsState.tab === "configure" ? "#0076FF" : "#FFFFFF",
                }}
                className="progress-div"
              ></div>
              <ProgressBar now={dsState.stepprogress1} className="progress-baar" />
              <div
                style={{
                  border:
                    dsState.tab === "configure" || dsState.tab === "test"
                      ? "5px solid #0076FF"
                      : "3px solid #C6D0DB",
                  backgroundColor:
                    dsState.tab === "configure" || dsState.tab === "test" ? "#0076FF" : "#FFFFFF",
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
                className="dblue cursor-pointer mb-1 mt-2 ms-5 ps-5"
              >
                Select
              </h6>
            </OverlayTrigger>
            <h6
              className="mb-1 mt-2 ps-4"
              onClick={() => {
                setDsState({
                  ...dsState,
                  dbtype: "",
                  tab: "test",
                  stepprogress1: 0,
                  activeStep: 0,
                });
              }}
              style={{
                color:
                  dsState.tab === "test" || dsState.tab === "configure" ? "#0076FF" : "#C6D0DB",
              }}
            >
              Test
            </h6>
            <h6
              className="mb-1 mt-2 pe-5 me-5"
              style={{
                color:
                  dsState.tab === "configure" || dsState.tab === "test" ? "#0076FF" : "#C6D0DB",
              }}
            >
              Configure
            </h6>
          </div>
          <div className="d-flex mt-1 mb-1 justify-content-center">
            {status === "Default" ? null : status !== "Success" ? (
              <h6 style={{ color: "#FF6B6B" }}>This connection has failed. Please try again.</h6>
            ) : (
              <h6 style={{ color: "#0DBD49" }}>Connection update successful.</h6>
            )}
          </div>
        </div>
        {dsState.tab === "select" ? (
          <input
            className="form-control mt-4"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        ) : null}

        <div className="df1 align-items-center">
          {dsState.tab === "select" ? selectConnector() : configureConnector()}
        </div>
      </Modal.Body>
      <Modal.Footer className="dflex justify-content-center align-items-center pt-1 border-0">
        <button
          className="btn ms-3 bg-white"
          type="button"
          onClick={() => {
            setError({ ...error, status: false, message: "" });
            setForm_data({
              dbname: "",
              username: "",
              password: "",
              host: "",
              port: "",
              name: "",
            });
            setStatus("Default");
            setDsState({
              ...dsState,
              dbtype: "",
              tab: "",
              testing: false,
              retesting: false,
              stepprogress: 0,
              stepprogress1: 0,
              save: false,
              activeStep: 0,
              view: false,
            });
          }}
        >
          Cancel
        </button>
        {dsState.tab === "select" ? (
          <Button
            onClick={() => {
              values.engine === ""
                ? alert("Select database engine")
                : setDsState({
                    ...dsState,
                    stepprogress: 100,
                    activeStep: dsState.activeStep + 1,
                    tab: "test",
                  });
            }}
            className="configure-b f-16"
          >
            Configure
          </Button>
        ) : status === "Default" ? (
          <Button onClick={testConnection} loading={dsState.testing} className="test-b f-16">
            Test connection
          </Button>
        ) : status !== "Success" ? (
          <Button onClick={testConnection} loading={dsState.retesting} className="test-b f-16">
            Re - test
          </Button>
        ) : (
          <Button
            loading={dsState.saveC}
            onClick={() => {
              updateConnection(item.id);
            }}
            className="test-b f-16"
          >
            Update connection
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default ViewConnection;
