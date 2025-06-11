// react
import React, { useEffect, FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Image, Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
//components
import ConnectionPaper from "components/paper";
import ExcelPaper from "components/excelpaper";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { Dropdown } from "react-bootstrap";
import { ArrowDropDown } from "@styled-icons/material/ArrowDropDown";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { ToolTip } from "components/tooltips";
import { checkRole } from "constants/common";

interface IDataSourcesProps {
  newState: any;
  setNewState: any;
  connData: any;
  connMutate: any;
  excelData: any;
  excelMutate: any;
  jsonData: any;
  jsonMutate: any;
  connname: any;
  setConnName: any;
  setUpdateTab: any;
  setSearch: any;
  search: any;
}
const DataSources: FC<IDataSourcesProps> = (props) => {
  const {
    newState,
    setNewState,
    connData,
    connMutate,
    excelData,
    excelMutate,
    jsonData,
    jsonMutate,
    setConnName,
    setUpdateTab,
    setSearch,
    search,
  } = props;
  const router = useRouter();
  const { project_id } = router.query;
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const engines = [
    {
      Engine: "postgres",
      type: "db",
      Inactive: "/connections/icons/postgres2.svg",
      width: 122.67,
      height: 33.97,
    },
    {
      Engine: "mysql",
      type: "db",
      Inactive: "/connections/icons/mysql.svg",
      width: 82.27,
      height: 42.27,
    },
    {
      Engine: "oracle",
      type: "db",
      Inactive: "/connections/icons/oracle.svg",
      width: 104.44,
      height: 13.69,
    },
    {
      Engine: "mssql",
      type: "db",
      Inactive: "/connections/icons/mssql2.svg",
      width: 76,
      height: 20.86,
    },
    {
      Engine: "SNOWFLAKE",
      type: "db",
      Inactive: "/connections/icons/Snowflake_Logo.svg",
      width: 96,
      height: 30.86,
    },
    {
      Engine: "JSON",
      type: "flat-file",
      width: 0,
      height: 0,
    },
    {
      Engine: "Excel",
      type: "flat-file",
      width: 0,
      height: 0,
    },
    {
      Engine: "CSV",
      type: "flat-file",
      width: 0,
      height: 0,
    },
    {
      Engine: "Sheets",
      type: "flat-file",
    },
  ];
  const [sortedConnData, setSortedConnData] = React.useState([]);
  const [sortedexcelData, setSortedExcelData] = React.useState([]);
  const [sortedjsonData, setSortedJsonData] = React.useState([]);
  const [select, setSelect] = React.useState("Sort by name");
  {
    userRole?.user_role === "Owner" || userRole?.user_module_access[0]["Data sources"] === "WRITE"
      ? hotkeys("enter", function () {
          document?.getElementById("create-button")?.click();
        })
      : null;
  }

  useEffect(() => {
    if (connData && excelData && jsonData) {
      let sort: any = [],
        excelsort: any = [],
        jsonsort: any = [];
      const tempArr = [...connData],
        exceltempArr = [...excelData];
      const jsontempArr = [...jsonData];
      if (select === "Sort by name") {
        sort = tempArr.sort((a: any, b: any) => a.name.localeCompare(b.name));
        excelsort = exceltempArr.sort((a: any, b: any) => a.tablename.localeCompare(b.tablename));
        jsonsort = jsontempArr.sort((a: any, b: any) => a.tablename.localeCompare(b.tablename));
      } else if (select === "Sort by date") {
        sort = tempArr.sort(
          (a: any, b: any) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        excelsort = exceltempArr.sort(
          (a: any, b: any) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        jsonsort = jsontempArr.sort(
          (a: any, b: any) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
      }
      setSortedConnData(sort);
      setSortedExcelData(excelsort);
      setSortedJsonData(jsonsort);
    }
  }, [connData, excelData, jsonData, select, userRole, project_id]);
  return (
    <>
      {userRole?.user_role !== "Owner" &&
      userRole?.user_module_access[0]["Data sources"] === "NONE" ? (
        <>
                  {/* <div className="d-flex justify-content-center align-items-center"> */}
          <div className="container-fluid d-flex flex-column px-1">
          <div className="d-flex flex-column mt-5 pt-5">
          <div className="d-flex p-5 m-5 justify-content-center align-items-center flex-column">
            <Image
              src="/Databases.svg"
              alt="create chart"
              width="70"
              height="80"
              className="me-1"
            />
            <h6 className="fw-bold f-14 mt-2 noneaccess">
              You didn&apos;t have access to this feature
            </h6>
          </div>
          </div>
          </div>
        </>
      ) : (
        <div className="container-fluid d-flex flex-column px-1">
          <div className="d-flex flex-column">
            <div>
              <div className="d-flex justify-content-between">
                <div className="summary-1 mt-4">
                  <h4 className="mb-2 title">Data sources</h4>
                  <p className="mt-1 mb-0 f-16 opacity-75">
                    Connect your project to any type of data connector - be it flat files,
                    databases, or SaaS applications.
                  </p>
                </div>
                <div className="ms-auto mt-4">
                  <Dropdown
                    onSelect={(value: any) => {
                      setSelect(value);
                    }}
                  >
                    <Dropdown.Toggle className="w-100 bg-white border br-10" id="dropdown-basic">
                      <div className="w-100 d-flex justify-content-between align-items-center">
                        <div>
                          <small className="sort text-dark-grey fw-normal">{select}</small>
                        </div>
                        <ArrowDropDown size="25" className="sort text-light-grey"></ArrowDropDown>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item eventKey="Sort by name">Sort by name</Dropdown.Item>

                      <Dropdown.Item eventKey="Sort by date">Sort by date</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="ms-3">
                  <input
                    className="form-control search mt-4"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
                <div className="ms-3 mt-4">
                  <ToolTip
                    position={"bottom"}
                    visible={!checkRole(userRole, "data_sources")}
                    style={{ left: "1%" }}
                    text="You didn't have access to this feature"
                    element={() => (
                      <Button
                        id="create-button"
                        onClick={() => {
                          if (checkRole(userRole, "data_sources"))
                            setNewState({ ...newState, connection: true });
                        }}
                        className={
                          "ls text-nowrap " +
                          (checkRole(userRole, "data_sources") ? "" : "disable-btn")
                        }
                        variant={checkRole(userRole, "data_sources") ? "outline-primary" : "light"}
                      >
                        <div className="d-flex w-100 align-items-center">
                          <PlusCircle className="me-2" width={24} height={24} />
                          New data source
                        </div>
                      </Button>
                    )}
                  />
                </div>
              </div>
              <div className="my-4 flex-wrap d-flex">
                {/* Add New Data Source Card */}
                {userRole?.user_role === "Owner" ||
                userRole?.user_module_access[0]["Data sources"] === "WRITE" ? (
                  <Card
                    onClick={() => {
                      setNewState({ ...newState, connection: true });
                    }}
                    className="p-2 cursor-pointer datasource-card"
                    style={{ background: "rgba(0, 118, 255, 0.05)", border: "1px dashed #1F97FF" }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
                      <Image width="64" height="64" src="/Databases.svg" />
                      <h6 className="fw-normal m-0 mt-2 dblue">Create a new data source</h6>
                    </div>
                  </Card>
                ) : (
                  <Card
                    className="p-2 cursor-pointer datasource-card"
                    style={{ background: "#fff", border: "1px dashed #d4d4d4" }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip className="mt-3" id="tooltip-engine">
                            You didn&apos;t have access to this feature
                          </Tooltip>
                        }
                      >
                        <div className="d-flex flex-column align-items-center">
                          <Image width="64" height="64" src="/Databases.svg" />
                          <h6 className="fw-normal m-0 mt-2" style={{ color: "#d4d4d4" }}>
                            New data source
                          </h6>
                        </div>
                      </OverlayTrigger>
                    </div>
                  </Card>
                )}
                {/* Data Source Cards */}
                {sortedConnData &&
                  sortedConnData?.map((item: any, index: any) =>
                    !["INTERNAL", "internal"].includes(item.connection_type) ? (
                      <ConnectionPaper
                        key={index}
                        item={item}
                        index={index}
                        project_Id={project_id}
                        connMutate={connMutate}
                        userRole={userRole}
                      />
                    ) : null
                  )}
                {sortedexcelData &&
                  sortedexcelData?.map((item: any, index: any) => (
                    <ExcelPaper
                      key={index}
                      item={item}
                      index={index}
                      project_Id={project_id}
                      excelMutate={excelMutate}
                    />
                  ))}
                {sortedjsonData &&
                  sortedjsonData?.map((item: any, index: any) => (
                    <ExcelPaper
                      key={index}
                      item={item}
                      index={index}
                      project_Id={project_id}
                      excelMutate={excelMutate}
                      json={true}
                      jsonMutate={jsonMutate}
                    />
                  ))}
              </div>

              <div className="summary-1">
                <h4 className="mb-2 f-24 ls" style={{ fontWeight: 600, color: "#495968" }}>
                  Available data connectors
                </h4>
              </div>
              {/* Engines Available */}
              <div className="my-4 flex-wrap d-flex">
                {engines.map((item: any, index: any) => {
                  return (
                    <Card
                      key={index}
                      className="paper-container-c"
                      style={{ backgroundColor: "white" }}
                    >
                      {item.type === "db" ? (
                        <div className="d-flex flex-row align-items-center">
                          <div className="name-c f-18">
                            <Image
                              width="130"
                              height="56"
                              className="me-2"
                              src={item.Engine ? item.Inactive : item.Inactive}
                            />
                          </div>
                        </div>
                      ) : null}
                      {item.Engine === "postgres" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <p className="last-c f-14 mb-0">Datasource: Postgres </p>
                          <p className="date-c mt-1 f-14 mb-0">Datasource type: Databases</p>
                        </div>
                      ) : item.Engine === "mysql" ? (
                        <div className="d-flex flex-column mt-2 mb-2  ">
                          <p className="last-c f-14 mb-0">Datasource: Mysql </p>
                          <p className="date-c mt-1 f-14 mb-0">Datasource type: Databases</p>
                        </div>
                      ) : item.Engine === "oracle" ? (
                        <div className="d-flex flex-column mt-2 mb-2  ">
                          <p className="last-c f-14 mb-0">Datasource: Oracle </p>
                          <p className="date-c mt-1 f-14 mb-0">Datasource type: Databases</p>
                        </div>
                      ) : item.Engine === "mssql" ? (
                        <div className="d-flex flex-column mt-2 mb-2  ">
                          <p className="last-c f-14 mb-0">Datasource: Mssql </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Databases</p>
                        </div>
                      ) : item.Engine === "SNOWFLAKE" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <p className="last-c f-14 mb-0">Datasource: Snowflake </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Databases</p>
                        </div>
                      ) : item.Engine === "JSON" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <Image
                            src="/connections/icons/json-icon.svg"
                            width="60"
                            height="56"
                            className="me-2 mb-1"
                          />
                          <p className="last-c f-14 mb-0">Datasource: JSON </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Flat files</p>
                        </div>
                      ) : item.Engine === "Excel" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <Image
                            src="/connections/icons/excel-icon.svg"
                            width="60"
                            height="56"
                            className="me-2 mb-1"
                          />
                          <p className="last-c f-14 mb-0">Datasource: Excel </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Flat files</p>
                        </div>
                      ) : item.Engine === "CSV" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <Image
                            src="/connections/icons/csv-icon.svg"
                            width="60"
                            height="56"
                            className="me-2 mb-1"
                          />
                          <p className="last-c f-14 mb-0">Datasource: CSV </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Flat files</p>
                        </div>
                      ) : item.Engine === "Sheets" ? (
                        <div className="d-flex flex-column mt-2 mb-2 ">
                          <Image
                            src="/connections/icons/sheets-icon.svg"
                            width="60"
                            height="56"
                            className="me-2 mb-1"
                          />
                          <p className="last-c f-14 mb-0">Datasource: Sheets </p>
                          <p className="date-c f-14 mt-1 mb-0">Datasource type: Flat files</p>
                        </div>
                      ) : null}
                      {userRole?.user_role === "Owner" ||
                      userRole?.user_module_access[0]["Data sources"] === "WRITE" ? (
                        <div className="d-flex align-items-center pt-2">
                          <Button
                            onClick={() => {
                              if (item.Engine === "postgres") {
                                setNewState({ ...newState, connection: true });
                                setConnName("postgres");
                              } else if (item.Engine === "mysql") {
                                setNewState({ ...newState, connection: true });
                                setConnName("mysql");
                              } else if (item.Engine === "oracle") {
                                setNewState({ ...newState, connection: true });
                                setConnName("oracle");
                              } else if (item.Engine === "mssql") {
                                setNewState({ ...newState, connection: true });
                                setConnName("mssql");
                              } else if (item.Engine === "SNOWFLAKE") {
                                setNewState({ ...newState, connection: true });
                                setConnName("SNOWFLAKE");
                              } else if (item.Engine === "JSON") {
                                setNewState({ ...newState, connection: true });
                                setConnName("flatfiles");
                                setUpdateTab("flatfiles");
                              } else if (item.Engine === "Excel") {
                                setNewState({ ...newState, connection: true });
                                setConnName("flatfiles");
                                setUpdateTab("flatfiles");
                              } else if (item.Engine === "CSV") {
                                setNewState({ ...newState, connection: true });
                                setConnName("flatfiles");
                                setUpdateTab("flatfiles");
                              } else if (item.Engine === "Sheets") {
                                setNewState({ ...newState, connection: true });
                                setConnName("flatfiles");
                                setUpdateTab("flatfiles");
                              }
                            }}
                            variant="outline-primary"
                            style={{ fontWeight: 600 }}
                            className="w-100 ls"
                          >
                            Connect
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center pt-2">
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip className="mt-3" id="tooltip-engine">
                                You didn&apos;t have access to this feature
                              </Tooltip>
                            }
                          >
                            <Button
                              style={{ fontWeight: 600, borderColor: "#d4d4d4", color: "#d4d4d4" }}
                              className="f-14 ls w-100 bg-white"
                            >
                              Connect
                            </Button>
                          </OverlayTrigger>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataSources;
