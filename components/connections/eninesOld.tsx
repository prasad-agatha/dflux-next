// react
import React, { FC } from "react";
// Papa parse
import Papa from "papaparse";
import { useRouter } from "next/router";
// XLSX
import XLSX from "xlsx";
// react bootstrap
import { Card, Image, Container, Modal, Form } from "react-bootstrap";
// styled icons
import { Microsoftexcel } from "@styled-icons/simple-icons/Microsoftexcel";
import { FileJson } from "@styled-icons/boxicons-solid/FileJson";
import { PageExportCsv } from "@styled-icons/foundation/PageExportCsv";
// import { Snowflake } from "@styled-icons/fa-solid/Snowflake";
// react bootstrap button loader
import Button from "react-bootstrap-button-loader";
// services
import { ConnectionsService } from "services";
// toast
import { toast } from "react-toastify";
import Select from "react-select";
import _ from "lodash";

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
}
const Engines: FC<IEngineProps> = (props: IEngineProps) => {
  const router = useRouter();
  const { project_id } = router.query;
  const { values, setValues, newState, setNewState, setDsState, dsState, from } = props;
  const [excel, setExcel] = React.useState(false);
  const [data, setData] = React.useState(null) as any;
  const [sheetName, setSheetName] = React.useState("") as any;
  const [tableName, setTableName] = React.useState("");
  const [sheetNames, setSheetNames] = React.useState([] as any);
  const [extension, setExtension] = React.useState("csv");
  const [loading, setLoading] = React.useState(false);
  const [fieldInputs, setFieldInputs] = React.useState([]) as any;
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
  ];
  const selectSheet = (e: any) => {
    setSheetName(e);
    const fields = [] as any;
    for (const col of Object.keys(data[e.field][0])) {
      fields.push({
        columnName: col,
        datatype: typeof data[e.field][0][col] === "number" ? "int" : "varchar",
      });
    }
    setFieldInputs(fields);
  };
  const uploadFile = (data: any) => {
    const { data: csv_data } = data;
    const fields = [] as any;
    for (const col of Object.keys(csv_data[0])) {
      // console.log(csv_data[0][col], typeof csv_data[0][col], "IN LOOP");
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
      setExtension(fileExtension);
      Papa.parse(e.target.files[0], {
        complete: uploadFile,
        header: true,
        transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
      });
    } else if (fileExtension === "xlsx") {
      setExtension(fileExtension);
      const files = e.target.files;
      const f = files[0];
      const reader = new FileReader();
      reader.onload = function (e: any) {
        const data = e.target.result;
        const readedData = XLSX.read(data, { type: "binary" });
        const json_data = {} as any;
        for (const sheet of readedData.SheetNames) {
          const ws = readedData.Sheets[sheet];
          const dataParse: any = XLSX.utils.sheet_to_json(ws);
          const dataHeaders: any = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          if (dataHeaders.length > 0 && !Object.keys(dataParse[0]).includes("__EMPTY")) {
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
      };
      reader.readAsBinaryString(f);
    }
    setExcel(true);
  };

  const [jsonTableName, setJSONTableName] = React.useState("" as any);
  const [jsonModal, setJSONModal] = React.useState(false);

  const [file, setFile] = React.useState("" as any);

  const handleJSONfileInput = (e: any) => {
    setFile(e.target.files[0]);
    setJSONModal(true);
  };

  // dumping excel file
  const dumpExcel = () => {
    setLoading(true);
    let error = false;
    // let error = [];
    if (tableName === "") {
      error = true;
    }
    if (error) {
      toast.error("Please fill all the fields");
      setLoading(false);
    } else {
      let payload = {};
      let canInsert = false;
      if (extension === "csv") {
        payload = { sheetName: sheetName.value, tableName, data, datatype: fieldInputs };
        canInsert = true;
      } else if (extension === "xlsx") {
        payload = {
          sheetName: sheetName.value,
          tableName,
          data: data[sheetName.value],
          datatype: fieldInputs,
        };
        canInsert = true;
      }
      canInsert
        ? connections
            .dumpExcel(payload, project_id)
            .then(() => {
              setExcel(false);
              toast.success("Data successfully pushed to database");
              if (from === "create") {
                setNewState({ ...newState, connection: false });
              } else if (from === "view") {
                setDsState({ ...dsState, view: false });
              }
              setSheetName("");
              setTableName("");
              setData(null);
              setLoading(false);
            })
            .catch(() => {
              toast.error("Error uploading data");
              setLoading(false);
            })
        : null;
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
            setLoading(false);
            setJSONModal(false);
            toast.success(`${jsonTableName} connection created`);
          })
          .catch((error: any) => {
            setLoading(false);
            setJSONModal(false);
            toast.error(error.error);
          });
        toast.success(response.msg);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error uploading json file");
      });
  };

  const engines = [
    {
      Engine: "postgres",
      Active: "/connections/icons/postgres2white.svg",
      Inactive: "/connections/icons/postgres2.svg",
      width: 122.67,
      height: 33.97,
    },
    {
      Engine: "mysql",
      Active: "/connections/icons/mysqlwhite.svg",
      Inactive: "/connections/icons/mysql.svg",
      width: 82.27,
      height: 42.27,
    },
    {
      Engine: "oracle",
      Active: "/connections/icons/oraclewhite.svg",
      Inactive: "/connections/icons/oracle.svg",
      width: 104.44,
      height: 13.69,
    },
    {
      Engine: "mssql",
      Active: "/connections/icons/mssql2white.svg",
      Inactive: "/connections/icons/mssql2.svg",
      width: 76,
      height: 20.86,
    },
    {
      Engine: "SNOWFLAKE",
      Inactive: "/connections/icons/Snowflake_Logo.svg",
      Active: "/connections/icons/snowflake.svg",
      width: 96,
      height: 30.86,
    },
  ];
  const handleChangeInput = (index: any, event: any) => {
    const values: any = [...fieldInputs];
    let formatData = [];
    extension === "csv" ? (formatData = data) : (formatData = data[sheetName.value]);
    const updatedData = _.filter(formatData, (row) => {
      if (event.value === "varchar") {
        row[values[index].columnName] = row[values[index].columnName].toString();
        return true;
      } else if (event.value === "int" && !isNaN(parseInt(row[values[index].columnName]))) {
        row[values[index].columnName] = parseInt(row[values[index].columnName]);
        return true;
      }
    });
    if (formatData.length === updatedData.length) {
      values[index]["datatype"] = event.value;
      setFieldInputs(values);
    } else {
      toast.error("Cannot parse to the desired data type");
    }
  };
  return (
    <>
      <Container className="d-flex flex-column">
        <div className="d-flex">
          {engines.map((item: any, index: any) => {
            return (
              <Card
                key={index}
                className="flex-column align-items-center justify-content-center engine-container-c"
                style={{ backgroundColor: values.engine === item.Engine ? "#0076FF" : "white" }}
                onClick={() => {
                  setValues({ ...values, engine: item.Engine });
                }}
              >
                <Image
                  width={`${item.width}`}
                  height={`${item.height}`}
                  src={values.engine === item.Engine ? item.Active : item.Inactive}
                />
              </Card>
            );
          })}
        </div>

        <Modal
          size="lg"
          show={excel}
          centered
          onHide={() => {
            setExcel(false);
            setSheetName("");
            setTableName("");
            if (from === "create") {
              setNewState({ ...newState, connection: false });
            } else if (from === "view") {
              setDsState({ ...dsState, view: false });
            }
          }}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            onHide={() => {
              setFieldInputs([]);
            }}
          >
            <Modal.Title>Upload</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: 300, maxHeight: 500, overflowY: "auto" }}>
            <div className="d-flex">
              <div
                className={extension === "csv" ? "d-flex justify-content-center w-100" : ""}
                style={{ width: extension === "csv" ? "100%" : "45%" }}
              >
                <Form.Group className="mb-0">
                  <Form.Label className="mb-1" style={{ fontWeight: 550 }}>
                    Table Name
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setTableName(e.target.value);
                    }}
                    placeholder="Enter table name"
                  />
                </Form.Group>
              </div>
              <div className="ms-5" style={{ width: "45%" }}>
                {extension === "xlsx" ? (
                  <div>
                    <div className="d-flex mb-1" style={{ fontWeight: 550 }}>
                      Please select sheet:
                    </div>
                    <div className="d-flex">
                      <Select
                        className="w-100"
                        classNamePrefix="select"
                        value={sheetName}
                        options={sheetNames}
                        name="color"
                        onChange={selectSheet}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <hr />
            {fieldInputs.length > 0 ? (
              <div className="d-flex">
                <div className="me-5" style={{ width: "45%" }}>
                  <h6 style={{ fontWeight: 550 }}>Headers</h6>
                </div>
                <div className="me-5" style={{ width: "45%" }}>
                  <h6 style={{ fontWeight: 550 }}>Please select data type</h6>
                </div>
              </div>
            ) : null}

            {fieldInputs.length > 0
              ? fieldInputs.map((column: any, index: any) => {
                  return (
                    <div className="d-flex" key={index}>
                      <div style={{ width: "45%" }}>
                        <p className="f-16 p-1 justify-content-center align items center">
                          {column.columnName}
                        </p>
                      </div>
                      <div className="ms-5" style={{ width: "45%" }}>
                        <div>
                          <div className="d-flex">
                            <Select
                              className="w-100"
                              classNamePrefix="select"
                              options={dataTypes}
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
          </Modal.Body>
          <Modal.Footer className="p-1 d-flex align-items-center justify-content-end">
            <Button
              className="text-white"
              onClick={() => {
                setExcel(false);
                setData(null);
                setSheetName("");
                setTableName("");
                if (from === "create") {
                  setNewState({ ...newState, connection: false });
                } else if (from === "view") {
                  setDsState({ ...dsState, view: false });
                }
              }}
            >
              Cancel
            </Button>
            <Button className="text-white" loading={loading} onClick={dumpExcel}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={jsonModal}
          onHide={() => {
            setJSONModal(!jsonModal);
          }}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>JSON Upload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>Enter Table Name</Form.Label>
              <Form.Control
                value={jsonTableName}
                onChange={(e) => {
                  setJSONTableName(e.target.value);
                }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="text-white"
              onClick={() => {
                setJSONModal(false);
                if (from === "create") {
                  setNewState({ ...newState, connection: false });
                } else if (from === "view") {
                  setDsState({ ...dsState, view: false });
                }
              }}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              loading={loading}
              onClick={() => {
                dumpJSON();
              }}
            >
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <div className="d-flex mt-3">
        <input
          accept=".xlsx,.csv"
          onChange={handlefileInput}
          type="file"
          className="d-none"
          id="excelupload"
        />
        <Card
          style={{ width: 132.6, height: 59.43 }}
          className="flex-row cursor-pointer align-items-center justify-content-center engine-container-c"
        >
          <label htmlFor="excelupload" className=" cursor-pointer align-items-center d-flex">
            <Card
              style={{ width: 132.6, height: 59.43 }}
              className="border-0 flex-row align-items-center justify-content-center"
            >
              <Microsoftexcel width="24" height="24" className=" me-2" />/
              <PageExportCsv width="24" height="24" className=" me-2 ms-2" />
            </Card>
          </label>
        </Card>
        <input
          accept=".json"
          onChange={handleJSONfileInput}
          type="file"
          className="d-none"
          id="jsonupload"
        />
        <Card
          style={{ width: 132.6, height: 59.43 }}
          className="flex-row cursor-pointer align-items-center justify-content-center engine-container-c"
        >
          <label htmlFor="jsonupload" className=" cursor-pointer align-items-center d-flex">
            <Card
              style={{ width: 132.6, height: 59.43 }}
              className="border-0 flex-row align-items-center justify-content-center"
            >
              <FileJson width="24" height="24" className=" me-2" />
              JSON
            </Card>
          </label>
        </Card>
      </div>
    </>
  );
};
export default Engines;
