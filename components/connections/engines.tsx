// react
import React, { FC } from "react";
// Papa parse
import Papa from "papaparse";
import { useRouter } from "next/router";
// XLSX
import XLSX from "xlsx";
// react bootstrap
import { Card, Image, Container, Form, Row, Col } from "react-bootstrap";
// import { Snowflake } from "@styled-icons/fa-solid/Snowflake";
// react bootstrap button loader
import Button from "react-bootstrap-button-loader";
// services
import { ConnectionsService } from "services";
import { engines } from "constants/common";
// toast
import { toast } from "react-toastify";
import Select from "react-select";
// import _ from "lodash";

//toast configuration
toast.configure();

const connections = new ConnectionsService();

interface IEngineProps {
  values: any;
  setValues: any;
  newState?: any;
  setNewState?: any;
  dsState?: any;
  setDsState?: any;
  from?: any;
  connMutate?: any;
  excelMutate?: any;
  jsonMutate?: any;
  updateTab?: any;
  setUpdateTab?: any;
  excel: any;
  setExcel: any;
  connname?: any;
  setConnName?: any;
  setStatus?: any;
  setForm_data?: any;
  setError?: any;
  error?: any;
}
const Engines: FC<IEngineProps> = (props: IEngineProps) => {
  const router = useRouter();
  const { project_id } = router.query;
  const {
    values,
    setValues,
    newState,
    setNewState,
    setDsState,
    dsState,
    from,
    connMutate,
    excelMutate,
    jsonMutate,
    updateTab,
    excel,
    setExcel,
    connname,
    setConnName,
    setUpdateTab,
    setStatus,
    setForm_data,
    setError,
    error,
  } = props;
  const [sheetName, setSheetName] = React.useState("") as any;
  const [tableName, setTableName] = React.useState("");
  const [sheetNames, setSheetNames] = React.useState([] as any);
  const [extension, setExtension] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [jsonTableName, setJSONTableName] = React.useState("" as any);
  const [googleSheetLink, setGoogleSheetLink] = React.useState("" as any);
  const [jsonModal, setJSONModal] = React.useState(false);
  const [googleSheet, setGoogleSheet] = React.useState(false);
  const [fieldInputs, setFieldInputs] = React.useState([]) as any;
  const [file, setFile] = React.useState("" as any);
  const [data, setData] = React.useState(null) as any;
  const [engineType, setEngineType] = React.useState("");

  const excelInput = React.useRef(null) as any;
  const csvInput = React.useRef(null) as any;
  const jsonInput = React.useRef(null) as any;

  const dataTypes = [
    {
      field: "int",
      label: "int",
      value: "int",
    },
    {
      field: "varchar",
      label: "varchar",
      value: "varchar",
    },
    {
      field: "date",
      label: "date",
      value: "date",
    },
    {
      field: "float",
      label: "float",
      value: "float",
    },
    {
      field: "bigint",
      label: "bigint",
      value: "bigint",
    },
  ];

  const selectSheet = (e: any) => {
    setSheetName(e.value);
    const fields = [] as any;
    for (const col of Object.keys(data[e.field][0])) {
      fields.push({
        columnName: col,
        datatype: typeof data[e.field][0][col] === "number" ? "int" : "varchar",
      });
    }
    setFieldInputs(fields);
  };

  const selectgoogleSheet = (e: any) => {
    setSheetName(e.value);
    const tempData = data.sheets.filter((ele: any) => ele.name === e.value);
    const fields = [] as any;
    for (const col of tempData[0].columns) {
      fields.push({
        columnName: col.field,
        datatype: col.type,
      });
    }
    setFieldInputs(fields);
  };
  const uploadFile = (data: any) => {
    const { data: csv_data } = data;
    const fields = [] as any;
    for (const col of Object.keys(csv_data[0])) {
      fields.push({
        columnName: col,
        datatype: typeof csv_data[0][col] === "number" ? "int" : "varchar",
      });
    }
    setFieldInputs(fields);
    setData(csv_data);
  };

  const handlefileInput = (e: any) => {
    const fileExtension = e.target.files[0].name.split(".").pop();
    if (fileExtension === "csv") {
      setFile(e.target.files[0]);
      setExtension(fileExtension);
      Papa.parse(e.target.files[0], {
        complete: uploadFile,
        header: true,
        transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
      });
      setDsState({
        ...dsState,
        testing: false,
        retesting: false,
        dbtype: "",
        tab: "select",
        stepprogress: 100,
        activeStep: dsState.activeStep + 1,
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      setExtension(fileExtension);
      const files = e.target.files;
      const f = files[0];
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = function (e: any) {
        const data = e.target.result;
        const readedData = XLSX.read(data, { type: "binary" });
        const json_data = {} as any;
        for (const sheet of readedData.SheetNames) {
          const ws = readedData.Sheets[sheet];
          const dataParse: any = XLSX.utils.sheet_to_json(ws);
          const dataHeaders: any = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          if (dataHeaders && dataHeaders.length > 0) {
            json_data[sheet] = dataParse;
          }
        }
        setData(json_data);
        const newArr = Object.keys(json_data).map((sheet: any) => {
          const item = {} as any;
          item.field = sheet;
          item.label = sheet;
          item.value = sheet;
          return item;
        });
        setSheetNames(newArr);
        setDsState({
          ...dsState,
          testing: false,
          retesting: false,
          dbtype: "",
          tab: "select",
          stepprogress: 100,
          activeStep: dsState.activeStep + 1,
        });
      };
      reader.readAsBinaryString(f);
      toast.success("Select a sheet to continue !!!");
    }
    setExcel(true);
  };
  React.useEffect(() => {
    setValues({ ...values, engine: connname });
    if (updateTab === "flatfiles")
      setEngineType(connname === "Sheets" ? "google_sheets" : connname.toLowerCase());
  }, [connname]);

  const handleChangeInput = (index: any, event: any) => {
    const values: any = [...fieldInputs];
    values[index]["datatype"] = event.value;
    setFieldInputs(values);
  };

  const handleJSONfileInput = (e: any) => {
    setFile(e.target.files[0]);
    setJSONModal(true);
    setDsState({
      ...dsState,
      testing: false,
      retesting: false,
      dbtype: "",
      tab: "select",
      stepprogress: 100,
      activeStep: dsState.activeStep + 1,
    });
  };

  const customFormData: any = new FormData();

  const datatypes = () => {
    const tempObj: any = {};
    fieldInputs.map((item: any) => {
      tempObj[item.columnName] = item.datatype;
    });
    return JSON.stringify(tempObj);
  };

  const dumpExcel = () => {
    if (extension === "csv") {
      if (tableName !== "") {
        setLoading(true);
        // toast.success("File pushed successfully");
        customFormData.append("file", file);
        customFormData.append("sheet_name", sheetName);
        customFormData.append("file_type", engineType);
        customFormData.append("table_name", tableName);
        customFormData.append("data_types", datatypes());
        connections
          .dumpExcel(customFormData, project_id)
          .then((response) => {
            setExcel(false);
            connMutate();
            excelMutate();
            jsonMutate();
            toast.success(response.msg);
            setLoading(false);
            if (from === "create") {
              setNewState({ ...newState, connection: false });
            } else if (from === "view") {
              setDsState({ ...dsState, view: false });
            }
            setSheetName("");
            setTableName("");
            setDsState({
              ...dsState,
              testing: false,
              retesting: false,
              dbtype: "",
              tab: "select",
              stepprogress: 0,
              activeStep: 0,
            });
          })
          .catch(() => {
            toast.error("Error uploading data");
            setLoading(false);
            setDsState({
              ...dsState,
              testing: false,
              retesting: false,
              dbtype: "",
              tab: "select",
              stepprogress: 0,
              activeStep: 0,
            });
          });
      } else {
        toast.error("Please enter a name to save the sheet");
      }
    } else {
      if (sheetName !== "") {
        if (tableName !== "") {
          setLoading(true);
          customFormData.append("file", file);
          customFormData.append("sheet_name", sheetName);
          customFormData.append("file_type", engineType);
          customFormData.append("table_name", tableName);
          customFormData.append("data_types", datatypes());
          connections
            .dumpExcel(customFormData, project_id)
            .then((response) => {
              setExcel(false);
              connMutate();
              excelMutate();
              jsonMutate();
              toast.success(response.msg);
              setLoading(false);
              if (from === "create") {
                setNewState({ ...newState, connection: false });
              } else if (from === "view") {
                setDsState({ ...dsState, view: false });
              }
              setSheetName("");
              setTableName("");
            })
            .catch(() => {
              toast.error("Error uploading data");
              setLoading(false);
              setDsState({
                ...dsState,
                testing: false,
                retesting: false,
                dbtype: "",
                tab: "select",
                stepprogress: 0,
                activeStep: 0,
                view: false,
              });
            });
        } else {
          toast.error("Please enter a name to save the sheet");
        }
      } else {
        toast.error("Select sheet");
      }
    }
  };

  const dumpJSON = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name[]", jsonTableName);
    formData.append("asset[]", file);
    connections
      .dumpJSONFile(formData)
      .then((response: any) => {
        connections
          .dumpJSON({ table_name: jsonTableName, json_file: response[0].asset }, project_id)
          .then(() => {
            if (from === "create") {
              setNewState({ ...newState, connection: false });
            } else if (from === "view") {
              setDsState({ ...dsState, view: false });
            }
            jsonMutate();
            setLoading(false);
            setJSONModal(false);
            setDsState({
              ...dsState,
              testing: false,
              retesting: false,
              dbtype: "",
              tab: "select",
              stepprogress: 0,
              activeStep: 0,
            });
            toast.success(`${jsonTableName} connection created`);
          })
          .catch(() => {
            setLoading(false);
            setJSONModal(false);
            setDsState({
              ...dsState,
              testing: false,
              retesting: false,
              dbtype: "",
              tab: "select",
              stepprogress: 0,
              activeStep: 0,
            });
            toast.error("Error uploading data");
          });
        toast.success(response.msg);
      })
      .catch(() => {
        setLoading(false);
        setDsState({
          ...dsState,
          testing: false,
          retesting: false,
          dbtype: "",
          tab: "select",
          stepprogress: 0,
          activeStep: 0,
        });
        toast.error("Error uploading json file");
      });
  };

  const dumpGoogleSheet = () => {
    if (tableName !== "") {
      setLoading(true);
      const capturedId: any = googleSheetLink.match(/\/d\/(.+)\//);
      customFormData.append("sheet_url", `https://docs.google.com/spreadsheets/d/${capturedId[1]}`);
      customFormData.append("sheet_name", sheetName);
      customFormData.append("file_type", engineType);
      customFormData.append("table_name", tableName);
      customFormData.append("data_types", datatypes());
      connections
        .dumpExcel(customFormData, project_id)
        .then((response) => {
          setExcel(false);
          connMutate();
          excelMutate();
          jsonMutate();
          toast.success(response.msg);
          setLoading(false);
          // toast.success("Data successfully pushed to database");
          if (from === "create") {
            setNewState({ ...newState, connection: false });
          } else if (from === "view") {
            setDsState({ ...dsState, view: false });
          }
          setSheetName("");
          setTableName("");
          setGoogleSheet(false);
          setGoogleSheetLink("");
          setEngineType("");
        })
        .catch((error) => {
          setLoading(false);
          setDsState({
            ...dsState,
            testing: false,
            retesting: false,
            dbtype: "",
            tab: "select",
            stepprogress: 0,
            activeStep: 0,
            view: false,
          });
          toast.error(error?.error);
        });
    } else {
      toast.error("Please enter a name to save the sheet");
    }
  };

  const parseSheet = () => {
    setLoading(true);
    const capturedId: any = googleSheetLink.match(/\/d\/(.+)\//);
    if (capturedId[1]) {
      connections
        .parseSheet({ sheet_url: `https://docs.google.com/spreadsheets/d/${capturedId[1]}` })
        .then((response: any) => {
          const newArr = [] as any;
          response.sheets.map((sheet: any, id: any) => {
            if (sheet.columns.length > 0) {
              newArr.push({
                field: sheet.name,
                label: sheet.name,
                value: sheet.name,
              });
            }

            setData(response);
            if (id === 0) {
              setSheetName(sheet.name);
              const fields = [] as any;
              for (const col of sheet.columns) {
                fields.push({
                  columnName: col.field,
                  datatype: ["varchar", "int", "float", "bigint", "date"].includes(col.type)
                    ? col.type
                    : "varchar",
                });
              }
              setFieldInputs(fields);
            }
          });
          setSheetNames(newArr);
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error(err);
        });
    } else {
      setLoading(false);
    }
  };

  const onClickSelect = () => {
    setJSONModal(false);
    setExcel(false);
    setSheetName("");
    setTableName("");
    if (from === "create") {
      setNewState({ ...newState, connection: false });
    } else if (from === "view") {
      setDsState({ ...dsState, view: false });
    }
    setNewState({ ...newState, invite: false });

    setDsState({
      ...dsState,
      dbtype: "",
      tab: "select",
      testing: false,
      retesting: false,
      stepprogress: 0,
      save: false,
      activeStep: 0,
    });
    setConnName("");
  };

  return (
    <>
      {/* FLAT FILES - SELECT */}
      {updateTab === "flatfiles" && (
        <>
          {/* STEPPER for FLAT FILES */}
          <div className="stepper-wrapper d-inline-flex">
            <div className="stepper-item completed" onClick={onClickSelect}>
              <div className="step-counter cursor-pointer"></div>
              <div className="step-name mx-5  cursor-pointer">Select</div>
            </div>
            <div className={"stepper-item" + (dsState.activeStep === 0 ? "" : " completed")}>
              <div className="step-counter cursor-pointer"></div>
              <div className="step-name mx-5 cursor-pointer">Upload</div>
            </div>
          </div>
          {/* INPUTS for FLAT FILES */}
          {!excel && !jsonModal && !googleSheet && (
            <>
              <div className="d-flex flex-wrap ps-3" style={{ gap: "20px 25px" }}>
                <input
                  accept=".xlsx,.xls"
                  onChange={(e: any) => {
                    handlefileInput(e);
                  }}
                  type="file"
                  className="d-none"
                  id="excelupload"
                  ref={excelInput}
                />
                <input
                  accept=".csv"
                  onChange={(e: any) => {
                    handlefileInput(e);
                  }}
                  type="file"
                  className="d-none"
                  id="csvUpload"
                  ref={csvInput}
                />
                <input
                  accept=".json"
                  onChange={handleJSONfileInput}
                  type="file"
                  className="d-none"
                  id="jsonupload"
                  ref={jsonInput}
                />

                {[
                  { type: "excel", name: "Excel" },
                  { type: "csv", name: "CSV" },
                  { type: "json", name: "JSON" },
                  { type: "google_sheets", name: "Sheets" },
                ].map((ele: any, id: any) => (
                  <Card
                    key={id}
                    style={{
                      border: engineType === ele.type ? "1px solid #0076FF" : "1px solid #FFFFFF",
                      borderRadius: "2.5",
                    }}
                    className="flex-row m-0 cursor-pointer align-items-center justify-content-center engine-container-c engines-card"
                  >
                    <label className=" cursor-pointer align-items-center d-flex">
                      <Card
                        onClick={() => {
                          setEngineType(ele.type);
                        }}
                        className="border-0 flex-row align-items-center justify-content-center excel-card"
                      >
                        <Image
                          src={`/connections/icons/${ele.name.toLowerCase()}-icon.svg`}
                          width="30"
                          height="30"
                          className="me-2"
                        />
                        {ele.name}
                      </Card>
                    </label>
                  </Card>
                ))}
              </div>
              <div className="d-flex justify-content-center align-items-center border-0 py-3">
                <button
                  className="btn bg-white"
                  onClick={() => {
                    setExcel(false);
                    setUpdateTab("databases");
                    setNewState({ ...newState, connection: false });
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
                        stepprogress1: 0,
                        save: false,
                        activeStep: 0,
                      });
                    setError({ ...error, status: false, message: "" });
                  }}
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  className="text-white text-center"
                  type="button"
                  loading={loading}
                  onClick={() => {
                    if (!engineType) toast.error("Select flat file");
                    if (engineType === "excel") excelInput.current.click();
                    if (engineType === "csv") csvInput.current.click();
                    if (engineType === "json") jsonInput.current.click();
                    if (engineType === "google_sheets") {
                      setGoogleSheet(true);
                      setEngineType("google_sheets");
                      setFieldInputs([]);
                    }
                  }}
                >
                  Create
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {/* FLAT FILES - UPLOAD */}
      <Container className="d-flex px-0 flex-column">
        {updateTab === "flatfiles" && excel && (
          <div>
            <Form>
              <Row className="d-flex my-1 pb-2 px-3">
                <Form.Group as={Col}>
                  <Form.Control
                    style={{ border: "1px solid #A0A4A8", borderRadius: "4px" }}
                    onChange={(e) => {
                      setTableName(e.target.value);
                    }}
                    placeholder="Enter table name"
                  />
                </Form.Group>
                {extension === "csv" ? null : (
                  <Form.Group as={Col}>
                    <div style={{ borderRadius: "4px" }}>
                      <Select
                        classNamePrefix="select"
                        value={{
                          field: sheetName ? sheetName : "Select a sheet",
                          value: sheetName ? sheetName : "Select a sheet",
                          label: sheetName ? sheetName : "Select a sheet",
                        }}
                        options={sheetNames}
                        name="color"
                        placeholder="Select a sheet"
                        onChange={selectSheet}
                      />
                    </div>
                  </Form.Group>
                )}
              </Row>
            </Form>
            <Row>
              {fieldInputs.length > 0 ? (
                <div className="d-flex">
                  <div className="" style={{ width: "50%" }}>
                    <p
                      className="f-16 mb-0 ps-3 text-start"
                      style={{ fontWeight: "bold", color: "#495968" }}
                    >
                      Headers
                    </p>
                  </div>
                  <div className="" style={{ width: "50%" }}>
                    <p
                      className="f-16 mb-0 ps-3 text-start"
                      style={{ fontWeight: "bold", color: "#495968" }}
                    >
                      Select data type
                    </p>
                  </div>
                </div>
              ) : null}
              <div
                style={{ overflow: "auto", height: fieldInputs.length > 0 ? "200px" : "" }}
                className="pe-0"
              >
                {fieldInputs.length > 0
                  ? fieldInputs.map((column: any, index: any) => {
                      return (
                        <div
                          className="d-flex align-items-center"
                          key={index}
                          style={{ background: index % 2 === 0 ? "#F8F8F8" : "" }}
                        >
                          <div style={{ width: "50%" }}>
                            <p className="f-16 ms-3 p-1 justify-content-center align-items-center mb-0 text-start">
                              {column.columnName}
                            </p>
                          </div>
                          <div className="mx-3" style={{ width: "45%" }}>
                            <div>
                              <div className="d-flex my-2">
                                <Select
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  }}
                                  // menuPosition="absolute"
                                  // menuPlacement="auto"
                                  className="w-100"
                                  classNamePrefix="select"
                                  options={dataTypes}
                                  name="column_type"
                                  value={{
                                    field: column.datatype,
                                    label: column.datatype,
                                    value: column.datatype,
                                  }}
                                  onChange={(event) => handleChangeInput(index, event)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </Row>

            <div className="d-flex justify-content-center align-items-center border-0 py-3">
              <button
                className="btn ms-3 bg-white"
                onClick={() => {
                  setExcel(false);
                  setSheetName("");
                  setTableName("");
                  if (from === "create") {
                    setNewState({ ...newState, connection: false });
                  } else if (from === "view") {
                    setDsState({ ...dsState, view: false });
                  }
                  setNewState({ ...newState, invite: false });

                  setDsState({
                    ...dsState,
                    dbtype: "",
                    tab: "select",
                    testing: false,
                    retesting: false,
                    stepprogress: 0,
                    save: false,
                    activeStep: 0,
                  });
                  setConnName("");
                }}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="text-white f-17 text-center"
                type="button"
                loading={loading}
                style={{ opacity: 0.9 }}
                onClick={dumpExcel}
              >
                Upload
              </Button>
            </div>
          </div>
        )}

        {updateTab === "flatfiles" && jsonModal && (
          <div>
            <Form>
              <Form.Control
                value={jsonTableName}
                style={{ border: "1px solid #A0A4A8", borderRadius: "4px" }}
                placeholder="Enter table name"
                onChange={(e) => {
                  setJSONTableName(e.target.value);
                }}
              />
              <div className="d-flex justify-content-start align-items-center border-0 py-3">
                <button
                  className="btn ms-3 bg-white"
                  onClick={() => {
                    setJSONModal(false);
                    if (from === "create") {
                      setNewState({ ...newState, connection: false });
                    } else if (from === "view") {
                      setDsState({ ...dsState, view: false });
                    }
                    setNewState({ ...newState, invite: false });
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
                    setConnName("");
                  }}
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  className="text-white f-17 text-center"
                  type="button"
                  style={{ opacity: 0.9 }}
                  loading={loading}
                  onClick={() => {
                    dumpJSON();
                  }}
                >
                  Upload
                </Button>
              </div>
            </Form>
          </div>
        )}
        {updateTab === "flatfiles" && googleSheet && (
          <div>
            {fieldInputs.length > 0 ? (
              <div>
                <Form>
                  <Row className="d-flex my-1 pb-2 px-3">
                    <Form.Group as={Col}>
                      <Form.Control
                        style={{ border: "1px solid #A0A4A8", borderRadius: "4px" }}
                        onChange={(e) => {
                          setTableName(e.target.value);
                        }}
                        placeholder="Enter table name"
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <div style={{ borderRadius: "4px" }}>
                        <Select
                          classNamePrefix="select"
                          value={{
                            field: sheetName ? sheetName : "Select a sheet",
                            value: sheetName ? sheetName : "Select a sheet",
                            label: sheetName ? sheetName : "Select a sheet",
                          }}
                          options={sheetNames}
                          name="color"
                          placeholder="Select a sheet"
                          onChange={selectgoogleSheet}
                        />
                      </div>
                    </Form.Group>
                  </Row>
                </Form>
                <Row>
                  {fieldInputs.length > 0 ? (
                    <div className="d-flex">
                      <div className="" style={{ width: "50%" }}>
                        <p
                          className="f-16 mb-0 ps-3 text-start"
                          style={{ fontWeight: "bold", color: "#495968" }}
                        >
                          Headers
                        </p>
                      </div>
                      <div className="" style={{ width: "50%" }}>
                        <p
                          className="f-16 mb-0 ps-3 text-start"
                          style={{ fontWeight: "bold", color: "#495968" }}
                        >
                          Select data type
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div style={{ overflow: "auto", height: "200px" }} className="pe-0">
                    {fieldInputs.length > 0
                      ? fieldInputs.map((column: any, index: any) => {
                          return (
                            <div
                              className="d-flex align-items-center"
                              key={index}
                              style={{ background: index % 2 === 0 ? "#F8F8F8" : "" }}
                            >
                              <div style={{ width: "50%" }}>
                                <p className="f-16 ms-3 p-1 justify-content-center align-items-center mb-0 text-start">
                                  {column.columnName}
                                </p>
                              </div>
                              <div className="mx-3" style={{ width: "45%" }}>
                                <div>
                                  <div className="d-flex my-2">
                                    <Select
                                      menuPortalTarget={document.body}
                                      menuPosition="fixed"
                                      styles={{
                                        menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                      }}
                                      // menuPosition="absolute"
                                      // menuPlacement="auto"
                                      className="w-100"
                                      classNamePrefix="select"
                                      options={dataTypes}
                                      name="column_type"
                                      value={{
                                        field: column.datatype,
                                        label: column.datatype,
                                        value: column.datatype,
                                      }}
                                      onChange={(event) => handleChangeInput(index, event)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </Row>

                <div className="d-flex justify-content-center align-items-center border-0 py-3">
                  <button
                    className="btn ms-3 bg-white"
                    onClick={() => {
                      setExcel(false);
                      setSheetName("");
                      setTableName("");
                      setFieldInputs([]);
                      setGoogleSheet(false);
                      setEngineType("");
                      if (from === "create") {
                        setNewState({ ...newState, connection: false });
                      } else if (from === "view") {
                        setDsState({ ...dsState, view: false });
                      }
                      setNewState({ ...newState, invite: false });

                      setDsState({
                        ...dsState,
                        dbtype: "",
                        tab: "select",
                        testing: false,
                        retesting: false,
                        stepprogress: 0,
                        save: false,
                        activeStep: 0,
                      });
                      setConnName("");
                    }}
                  >
                    Cancel
                  </button>
                  <Button
                    loading={loading}
                    variant="primary"
                    className="text-white f-17 text-center"
                    type="button"
                    style={{ opacity: 0.9 }}
                    onClick={dumpGoogleSheet}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            ) : (
              <Form>
                <Form.Control
                  value={googleSheetLink}
                  style={{ border: "1px solid #A0A4A8", borderRadius: "4px" }}
                  placeholder="Enter google sheet link"
                  onChange={(e) => {
                    setGoogleSheetLink(e.target.value);
                  }}
                />
                <div className="d-flex justify-content-center align-items-center border-0 py-3">
                  <Button
                    variant="outline"
                    className="ms-3 bg-white"
                    onClick={() => {
                      setGoogleSheet(false);
                      setGoogleSheetLink("");
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
                        view: false,
                      });
                      setConnName("");
                    }}
                  >
                    Cancel Sheet
                  </Button>
                  <Button
                    variant="primary"
                    className="text-white f-17 text-center"
                    type="button"
                    style={{ opacity: 0.9 }}
                    loading={loading}
                    onClick={() => {
                      parseSheet();
                    }}
                  >
                    Get Sheet Details
                  </Button>
                </div>
              </Form>
            )}
          </div>
        )}
      </Container>
      {/* DATABASES */}
      <Container className="d-flex px-0 flex-column">
        {updateTab === "databases" && (
          <div className="d-flex flex-wrap ps-3" style={{ gap: "20px 25px" }}>
            {engines.map((item: any, index: any) => {
              return (
                <Card
                  key={index}
                  className={
                    "flex-column m-0 align-items-center justify-content-center engine-container-c engines-card"
                  }
                  style={{
                    border:
                      values.engine === item.Engine ? "1px solid #0076FF" : "1px solid #FFFFFF",
                  }}
                  onClick={() => {
                    setValues({ ...values, engine: item.Engine });
                  }}
                >
                  <Image
                    width={`${item.width}`}
                    height={`${item.height}`}
                    src={values.engine === item.Engine ? item.Inactive : item.Inactive}
                  />
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
};
export default Engines;
