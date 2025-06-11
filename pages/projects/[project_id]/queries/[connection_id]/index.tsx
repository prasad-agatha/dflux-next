// react
import React, { FC } from "react";
// next link
import Link from "next/link";
// router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "lib/hooks";
// react-bootstrap
import {
  Image,
  OverlayTrigger,
  Popover,
  ListGroup,
  Form,
  Modal,
  Button as RButton,
  Tooltip,
} from "react-bootstrap";
// react button loader component
import Button from "react-bootstrap-button-loader";
// import { useHotkeys } from "react-hotkeys-hook";
// toast
import { toast } from "react-toastify";
// react shimmer
import { ShimmerThumbnail } from "react-shimmer-effects";
// csv exporter
import { CSVLink } from "react-csv";
// components
import { DbList } from "components/lists";
import { Results } from "components/data-tables";
import { QueryEditor } from "components/editor";
import { PageLoading } from "components/loaders";
// services
import { QueryService } from "services";
// next seo
import { NextSeo } from "next-seo";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { History } from "@styled-icons/boxicons-regular/History";
import { ConnectionsService } from "services";
import { QueriesMenu } from "components/menu";
import hotkeys from "hotkeys-js";
import { checkRole } from "constants/common";
import { ToolTip } from "components/tooltips";

const connections = new ConnectionsService();
const sql_data = new QueryService();

const EditQuery: FC = () => {
  const router = useRouter();
  const { project_id, connection_id, editquery, excel, type } = router.query;

  if (!project_id && !connection_id) {
    return (
      <main className="w-100 h-75 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const [queryStates, setQueryStates] = React.useState({ executed: false, save: false });
  // response after running a query
  const [query, setQuery] = React.useState([]);
  // const [isSaved, setIsSaved] = React.useState(false);
  // const [savedQueryId, setSavedQueryId] = React.useState(editquery ? editquery : 0);
  const [tempQuery, setTempQuery] = React.useState([]);
  // query execution loader on re execution -> Executing query....!
  const [loading, setLoading] = React.useState(false);
  // error after running a query
  const [error, setError] = React.useState("");
  // save query loader
  const [save, setSave] = React.useState(false);
  // vs code theme
  const [theme, setTheme] = React.useState("vs-dark");
  // query execution loader
  const [executing, setExecuting] = React.useState(false);
  // error after execution - status on screen
  const [show, setShow] = React.useState(false);
  // create query values
  const [values, setValues] = React.useState({
    connection_id: connection_id,
    sql_query: "/* Enter a sql query */\n",
    query_name: "",
  });
  const [queryDetails, setQueryDetails] = React.useState({ queryname: "", rawsql: "" });
  const [runQuerySql, setRunQuerySql] = React.useState("");
  // saved query values
  const [editQueryValues, setEditQueryValues] = React.useState({
    query_id: null,
    user: null,
    sql_query: "",
    query_name: "",
  });

  // query update loader
  const [updateLoader, setUpdateLoader] = React.useState(false);

  const [editRawSql, setEditRawSql] = React.useState(false);
  const [tempRawSql, setTempRawSql] = React.useState("");
  const [editName, setEditName] = React.useState(false);
  const [editQueryName, setEditQueryName] = React.useState(false);
  const [tempName, setTempName] = React.useState("");
  const [dbCollapse, setDbCollapse] = React.useState(false);
  const [tablesData, setTablesData] = React.useState([]) as any;
  const [queriesStates, setQueriesStates] = React.useState({ name: "", id: 0, trigger: false });

  const { data: connData }: any = useRequest({
    url: `api/connections/${connection_id}/`,
  });

  // project summary
  const { data: projectData, mutate: queryMutate }: any = useRequest({
    url: `api/projects/${project_id}/`,
  });
  const handleInputChange = (e: any) => {
    // values
    const val = e.target.value.trim();
    // input name field
    const name = e.target.name;
    // set value to input name
    setValue({ ...value, [name]: val });
  };
  // useHotkeys("Ctrl+w", () => {
  //   runQuery();
  // });
  hotkeys("ctrl+enter", function () {
    document?.getElementById("run-button")?.click();
  });
  React.useEffect(() => {
    connections
      .getSchemas(connection_id, type === "excel" ? excel : false, type == "json" ? excel : false)
      .then((schemas) => {
        setTablesData(schemas);
      })
      .catch((e) => {
        toast.error(e.error);
      });
  }, [excel]);

  // get saved query details
  const fetchQueryData = () => {
    sql_data
      .getQueryDetails(editquery)
      .then((response: any) => {
        setQueryDetails({ queryname: response.name, rawsql: response.raw_sql });
        setEditQueryValues({
          ...editQueryValues,
          query_id: response.id,
          query_name: response.name,
          user: response.user,
          sql_query: response.raw_sql,
        });
      })
      .catch(() => {
        toast.error("Error fetching query details");
      });
  };

  // query editor onchange
  function handleEditorChange(x: any) {
    if (editquery) {
      setEditRawSql(true);
      setTempRawSql(x);
      setEditQueryValues({ ...editQueryValues, sql_query: x });
    } else {
      setValues({ ...values, sql_query: x });
    }
  }

  // query name
  function handleQueryName(event: any) {
    const str = event.target.value;
    const cap = str.charAt(0).toUpperCase() + str.slice(1);
    if (editquery) {
      setEditName(true);
      setTempName(cap);
      setEditQueryValues({ ...editQueryValues, query_name: cap });
    } else {
      setValues({ ...values, query_name: cap });
    }
  }

  // run query - inputs - connection id, sql query
  const runQuery = async () => {
    const queryrun = editquery
      ? editRawSql
        ? tempRawSql
        : editQueryValues.sql_query
      : values.sql_query;
    setExecuting(true);
    setLoading(true);
    setQuery([]);
    await sql_data
      .runQuery({
        connection_id: Number(connection_id),
        sql_query: queryrun,
      })
      .then((response: any) => {
        setRunQuerySql(queryrun);
        setShow(false);
        setQueryStates({ ...queryStates, executed: true });
        setExecuting(false);
        setQuery(response.data);
        setTempQuery(response.data);
      })
      .catch((response) => {
        setShow(true);
        setError(response.error);
        setQueryStates({ ...queryStates, executed: true });
        setExecuting(false);
      });
    setLoading(false);
  };

  // save query
  const saveQuery = (redirect?: any) => {
    setSave(true);
    if (!values.query_name.trim()) {
      toast.error("Please enter a query name to save", { autoClose: 3000 });
      setSave(false);
    } else if (runQuerySql !== values.sql_query) {
      toast.error("Please run the query before saving", { autoClose: 3000 });
      setSave(false);
    } else {
      sql_data
        .saveQuery(
          {
            connection: connection_id,
            name: values.query_name,
            raw_sql: values.sql_query,
            engine_type: type === "excel" ? "excel" : type === "json" ? "json" : "normal",
            extra: { data: query },
            excel: excel,
          },
          project_id
        )
        .then((response: any) => {
          toast.success("Query saved!", { delay: 3000 });
          if (type === "excel") {
            router.push(
              `/projects/${project_id}/queries/${connection_id}/?editquery=${response.id}&excel=${excel}&type=excel`
            );
            queryMutate();
          } else if (type === "json") {
            router.push(
              `/projects/${project_id}/queries/${connection_id}/?editquery=${response.id}&excel=${excel}&type=json`
            );
            queryMutate();
          } else {
            router.push(
              `/projects/${project_id}/queries/${connection_id}/?editquery=${response.id}&type=normal`
            );
            queryMutate();
          }

          if (redirect === "visualize") {
            router.push(`/projects/${project_id}/visualization/query/${response.id}`);
          } else if (redirect === "mlmodelling") {
            router.push(`/projects/${project_id}/modelling/${response.id}`);
          }
          setSave(false);
        })
        .catch(() => {
          setSave(false);
          toast.error("Error saving query!", { delay: 3000 });
        });
    }
  };
  const [showModel, setShowModel]: any = React.useState(false);
  const [showQueryModel, setShowQueryModel]: any = React.useState(false);
  const [value, setValue] = React.useState({
    name: "",
  });
  const [queryPrompt, setQueryPrompt] = React.useState("");
  const [queryPromptData, setQueryPromptData] = React.useState("");
  const [queryPromptLoading, setQueryPromptLoading] = React.useState(false);
  // creates simple SQL queries from given text
  const getqueryPrompt = async () => {
    setQueryPromptLoading(true);
    const domain = window.location.href.split("/projects")[0];
    try {
      const queryData = await sql_data.sqlQuery({ domain, query: queryPrompt });
      setQueryPromptData(queryData.text);
    } finally {
      setQueryPromptLoading(false);
    }
  };
  const copyToClipBoard = async (copyMe: any) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      toast.success("Copied!");
    } catch (err: any) {
      toast.error(err);
    }
  };
  // update query
  const updateQuery = (redirect?: any) => {
    const sqlname = editName ? tempName : editQueryValues.query_name;
    const sqlquery = editRawSql ? tempRawSql : editQueryValues.sql_query;
    setUpdateLoader(true);
    if (!sqlname.trim()) {
      toast.error("Please enter a query name to save", { autoClose: 3000 });
      setUpdateLoader(false);
    } else if (runQuerySql !== sqlquery) {
      toast.error("Please run the query before saving", { autoClose: 3000 });
      setUpdateLoader(false);
    } else {
      sql_data
        .updateQuery(editquery, {
          project: project_id,
          connection: connection_id,
          engine_type: type === "excel" ? "excel" : type === "json" ? "json" : "normal",
          name: sqlname,
          raw_sql: sqlquery,
          user: editQueryValues.user,
          extra: { data: editRawSql ? tempQuery : query },
        })
        .then((response: any) => {
          setUpdateLoader(false);
          toast.success("Query updated!", { delay: 3500 });
          fetchQueryData();
          if (redirect === "visualize") {
            router.push(`/projects/${project_id}/visualization/query/${response.id}`);
          } else if (redirect === "mlmodelling") {
            router.push(`/projects/${project_id}/modelling/${response.id}`);
          }
        })
        .catch(() => {
          setUpdateLoader(false);
          toast.error("Error updating query");
        });
    }
  };

  React.useEffect(() => {
    if (editquery) {
      fetchQueryData();
      connections
        .getSchemas(connection_id, type === "excel" ? excel : false, type == "json" ? excel : false)
        .then((schemas) => {
          setTablesData(schemas);
        })
        .catch((e) => {
          toast.error(e.error);
        });
    }
  }, [editquery]);

  const list: any = [];
  const arr = query?.length > 0 ? Object.keys(query[0]) : null;
  arr?.map((item) => {
    return list.push({
      field: item,
      type: typeof query[0][item],
    });
  });

  /*
  function to check for updates in query sql, name 
  returned value is stored in data-update and used in page routing.
  on true opens modal(saveChanges)
  */
  const checkUpdates = () => {
    let sqlUpdate = true;
    if (editquery) {
      const sqlquery = editRawSql ? tempRawSql : editQueryValues.sql_query;
      const namequery = editquery
        ? editName
          ? tempName
          : editQueryValues.query_name
        : values.query_name;
      const { queryname, rawsql } = queryDetails;
      sqlUpdate = rawsql !== sqlquery || queryname !== namequery;
    }

    if (queryStates.executed && !show && sqlUpdate) return true;
    return false;
  };

  // const [height, setHeight] = React.useState(400) as any;
  const popover = (
    <Popover popper id="popover-basic" className="mt-5 ms-2">
      <Popover.Content className="p-0">
        <ListGroup className="border-0">
          <ListGroup.Item
            className="menu-item"
            onClick={() => {
              document.body.click();
              setTheme("vs");
            }}
          >
            <div className="d-flex flex-row">
              <Image
                src="/newicons/query-menu/light-mode.svg"
                width={22}
                height={22}
                className="menu-item-icon"
              />
              <p className="menu-item-text mb-0">Light mode</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item
            className="menu-item"
            onClick={() => {
              document.body.click();
              setTheme("vs-dark");
            }}
          >
            <div className="d-flex flex-row">
              <Image
                src="/newicons/query-menu/dark-mode.svg"
                width={21}
                height={21}
                className="menu-item-icon"
              />
              <p className="menu-item-text mb-0">Dark mode</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item
            className="menu-item"
            onClick={() => {
              document.body.click();
              setTheme("hc-black");
            }}
          >
            <div className="d-flex flex-row">
              <Image
                src="/newicons/query-menu/high-contrast.svg"
                width={20}
                height={20}
                className="menu-item-icon"
              />
              <p className="menu-item-text mb-0">High contrast</p>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Query editor`} description="Query" />
      {!connData || !tablesData ? (
        <main className="w-75 h-50 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <>
          <div className="d-flex flex-column ms-0 me-0" style={{ height: "82vh" }}>
            <div className="h-100 px-4 mx-3 d-flex flex-column">
              {/* Header with Back and New Query */}
              <div
                className="d-flex align-items-center"
                style={{ height: "6vh", marginTop: "1vh" }}
              >
                <div style={{ width: "250px" }}>
                  <Link
                    href={
                      editquery
                        ? `/projects/${project_id}/queries`
                        : `/projects/${project_id}/datasources`
                    }
                  >
                    <a className="d-flex align-items-center">
                      <ArrowBack
                        className="me-2 query-7 cursor-pointer"
                        color="#495968"
                        width={24}
                        height={24}
                      />
                      <h6 className="m-0 cursor-pointer" style={{ color: "#495968" }}>
                        Back
                      </h6>
                    </a>
                  </Link>
                </div>
                <Button
                  className="f-14 ms-3 d-flex align-items-center"
                  onClick={() => setShowQueryModel(!showQueryModel)}
                  style={{ color: "#495968", borderColor: "#d4d4d4", background: "#fff" }}
                >
                  <Image
                    src="/noQuery.svg"
                    width={19}
                    height={19}
                    className="me-2"
                    style={{ fill: "#d4d4d4" }}
                  />
                  No Code Query
                </Button>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      Generate sql query from natural language
                    </Tooltip>
                  }
                >
                  <Image
                    src="/info.svg"
                    width={19}
                    height={19}
                    className="ms-2"
                    style={{ fill: "#d4d4d4" }}
                  />
                </OverlayTrigger>
                {userRole?.user_role === "Owner" ||
                userRole?.user_module_access[1]["Queries"] === "WRITE" ? (
                  <RButton
                    onClick={() => {
                      router.push(`/projects/${project_id}/queries/?new_query=true`);
                    }}
                    className="f-14 ls ms-auto d-flex align-items-center"
                    variant="outline-primary"
                  >
                    <PlusCircle className="me-2" width={19} height={19} />
                    New query
                  </RButton>
                ) : (
                  <>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip className="mt-3" id="tooltip-engine">
                          You didn&apos;t have access to this feature
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="light"
                        className="f-14 ms-auto d-flex align-items-center text-black-50"
                      >
                        <Image
                          src="/newicons/disabled-plus-icon.svg"
                          width={19}
                          height={19}
                          className="me-2"
                          style={{ fill: "#d4d4d4" }}
                        />
                        New query
                      </Button>
                    </OverlayTrigger>
                  </>
                )}
              </div>
              <div className="d-flex pt-1" style={{ height: "75vh" }}>
                {/* Left SideBar */}
                <div className="query-border navigation-link1" style={{ width: "250px" }}>
                  <div
                    className="d-flex flex-column h-100 justify-content-between"
                    style={{ background: "#F4F4F4" }}
                  >
                    {/* DB Columns */}
                    <div
                      className="overflow-auto h-100 query-border border-4 bg-white"
                      style={{ borderRadius: 8 }}
                    >
                      <DbList
                        tables={tablesData?.data}
                        connection={connData}
                        dbCollapse={dbCollapse}
                        setDbCollapse={setDbCollapse}
                        excel={excel}
                        excelData={tablesData?.data}
                      />
                    </div>
                    {/* Queries */}
                    <div
                      className="query-border border-4 border-top-0 bg-white df1 flex-column"
                      style={{ height: "250px", borderRadius: 8 }}
                    >
                      <div className="d-flex py-2 w-100 align-items-center border-bottom">
                        <History
                          className="ms-2"
                          width={17}
                          height={21}
                          style={{ color: "#BCC5CE" }}
                        />
                        <h2 className="f-14 mb-0 ms-3 pb-0 query-2 overflow-hidden overflow-whitespace">
                          Recent queries
                        </h2>
                      </div>
                      <div className="p-2">
                        {projectData ? (
                          <>
                            <div className="d-flex align-items-center cursor-pointer mt-1">
                              <p className="f-12 my-1 ms-0 overflow-hidden overflow-whitespace">
                                Query name
                              </p>
                              <p className="f-12 my-1 ms-auto pe-3">Last updated</p>
                            </div>
                            {projectData &&
                              projectData.queries.map((item: any, index: any) => {
                                return (
                                  <p
                                    key={index}
                                    className="text-decoration-none mb-0"
                                    style={{ color: "#495968" }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white",
                                      }}
                                      className="d-flex w-100 align-items-center justify-content-between"
                                    >
                                      <p className="f-12 w-50 my-1 ms-0 overflow-hidden overflow-whitespace">
                                        {item.name}
                                      </p>
                                      <p className="f-12 w-50 d-flex my-1 ms-auto justify-content-end">
                                        {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                        {item.updated.slice(0, 10)}
                                        <span>
                                          <QueriesMenu
                                            query={item}
                                            queryMutate={queryMutate}
                                            queriesStates={queriesStates}
                                            setQueriesStates={setQueriesStates}
                                          />
                                        </span>
                                      </p>
                                    </div>
                                  </p>
                                );
                              })}
                          </>
                        ) : (
                          <div className="text-center my-5">
                            <Image
                              src="/newicons/no-queries.svg"
                              alt="create query"
                              width="40"
                              height="40"
                              className="me-1"
                            />
                            <h6 className="fw-bold f-12 mt-2" style={{ color: "#727e94" }}>
                              No queries available
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Main */}
                <div
                  className="ms-3 w-100 h-100 d-flex flex-column"
                  style={{ gap: "1%", overflowY: "hidden" }}
                >
                  <div
                    className="query-border-1 d-flex flex-column"
                    style={{ height: queryStates.executed || loading ? "40%" : "91%" }}
                  >
                    {/* Query Header */}
                    <div className="d-flex align-items-center justify-content-between py-1">
                      <div className="d-flex px-4 align-items-center">
                        <div>
                          {editQueryName ? (
                            <Form>
                              <Form.Control
                                autoComplete="off"
                                autoFocus
                                onChange={handleQueryName}
                                onBlur={() => {
                                  setEditQueryName(false);
                                }}
                                value={
                                  editquery
                                    ? editName
                                      ? tempName
                                      : editQueryValues.query_name
                                    : values.query_name
                                }
                                className="name-input-q cursor-pointer ms-1 f-14 query-1"
                                placeholder="Untitled query"
                              />
                            </Form>
                          ) : (
                            <h6
                              onClick={() => {
                                setEditQueryName(true);
                              }}
                              className="mb-0 query-1"
                            >
                              {(editquery
                                ? editName
                                  ? tempName
                                  : editQueryValues.query_name
                                : values.query_name
                              ).trim() || "Untitled query"}
                            </h6>
                          )}
                        </div>
                      </div>

                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip-engine">Run</Tooltip>}
                      >
                        <Button
                          loading={executing}
                          spinColor="#0076FF"
                          className="ms-auto bg-white border-0"
                          variant="light"
                          onClick={runQuery}
                          id="run-button"
                        >
                          {!executing && (
                            <Image
                              src="/runIcon.svg"
                              width="18"
                              height="18"
                              className="me-1 cursor-pointer"
                            />
                          )}
                        </Button>
                      </OverlayTrigger>
                      <ToolTip
                        position={"bottom"}
                        visible={!checkRole(userRole, "queries")}
                        style={{ left: "-40%" }}
                        text="You didn't have access to this feature"
                        element={() => (
                          <Button
                            loading={editquery ? updateLoader : save}
                            spinColor="#FFFFFF"
                            onClick={editquery ? updateQuery : saveQuery}
                            className={
                              "f-14 mx-3 " +
                              (queryStates.executed && !show ? "text-white" : "disable-btn")
                            }
                            variant={queryStates.executed && !show ? "primary" : "light"}
                            disabled={!(queryStates.executed && !show)}
                            data-update={checkUpdates()}
                            id="save-btn"
                          >
                            Save
                          </Button>
                        )}
                      />

                      <OverlayTrigger
                        rootClose
                        trigger="click"
                        placement="auto-end"
                        overlay={popover}
                        transition
                      >
                        <MoreVerticalOutline className="icon-size me-4 cursor-pointer query-5" />
                      </OverlayTrigger>
                    </div>
                    {/* Monaco Query Editor */}
                    <div className="border" style={{ flex: "1", overflowY: "hidden" }}>
                      <QueryEditor
                        theme={theme}
                        defaultValue={values.sql_query}
                        editorSuggestions={tablesData?.data}
                        sqlQuery={
                          editquery
                            ? editRawSql
                              ? tempRawSql
                              : editQueryValues.sql_query
                            : values.sql_query
                        }
                        handleEditorChange={handleEditorChange}
                      />
                    </div>
                  </div>
                  {/* Results Panel */}
                  <div
                    className="query-border-1 mt-2 d-flex flex-column"
                    style={{ height: queryStates.executed || loading ? "60%" : "9%" }}
                  >
                    {/* Results Panel Header */}
                    <div className="d-flex mx-2 p-2 justify-content-between">
                      <div style={{ color: "#0076FF" }}>Results panel</div>
                      {userRole?.user_role === "Owner" ||
                      userRole?.user_module_access[1]["Queries"] === "WRITE" ? (
                        <div className="">
                          {queryStates.executed && !show ? (
                            <Button
                              className="f-14 me-2 px-1 py-1 bg-white"
                              style={{ border: "0.896907px solid #0076FF", borderRadius: 3.58763 }}
                            >
                              <CSVLink
                                filename={"data.csv"}
                                data={query}
                                style={{ textDecorationLine: "none", color: "#0076FF" }}
                                target="_blank"
                                className="d-flex align-items-center"
                              >
                                <Image
                                  src="/newicons/query-menu/export-as-csv.svg"
                                  width={19}
                                  height={19}
                                  className="me-2"
                                />
                                Export as CSV
                              </CSVLink>
                            </Button>
                          ) : null}
                          {/* {disable === true ? ( */}
                          {editquery
                            ? queryStates.executed &&
                              !show && (
                                <Button
                                  style={{ border: "0.8px solid #0076FF", borderRadius: 3.5 }}
                                  // disabled={disable}
                                  onClick={() => {
                                    // updateQuery("mlmodelling")
                                    setShowModel(!showModel);
                                  }}
                                  className="f-14 me-2 px-1 py-1 bg-white dblue"
                                >
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src="/create.svg"
                                      width="19"
                                      height="19"
                                      className="me-2"
                                    />
                                    Create model
                                  </div>
                                </Button>
                              )
                            : null}

                          {/* {disable === true ? ( */}
                          {editquery
                            ? queryStates.executed &&
                              !show && (
                                <Button
                                  style={{ border: "0.8px solid #0076FF", borderRadius: 3.5 }}
                                  // disabled={disable}
                                  onClick={() => updateQuery("visualize")}
                                  className="f-14 me-2 px-2 py-1 bg-white dblue"
                                >
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src="/newicons/query-menu/query-edit-visualize.svg"
                                      width="19"
                                      height="19"
                                      className="me-1"
                                    />
                                    Visualize
                                  </div>
                                </Button>
                              )
                            : null}
                        </div>
                      ) : (
                        <div className="">
                          {queryStates.executed && !show ? (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip className="mt-3" id="tooltip-engine">
                                  You didn&apos;t have access to this feature
                                </Tooltip>
                              }
                            >
                              <Button variant="light" className="text-black-50">
                                <Image
                                  src="/newicons/models-menu/disabled-export.svg"
                                  width={19}
                                  height={19}
                                  className="me-2"
                                  style={{ fill: "#d4d4d4" }}
                                />
                                Export as CSV
                              </Button>
                            </OverlayTrigger>
                          ) : null}
                          {editquery
                            ? queryStates.executed &&
                              !show && (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip className="mt-3" id="tooltip-engine">
                                      You didn&apos;t have access to this feature
                                    </Tooltip>
                                  }
                                >
                                  <Button variant="light" className="text-black-50">
                                    <Image
                                      src="/newicons/disabled-plus-icon.svg"
                                      width={19}
                                      height={19}
                                      className="me-2"
                                      style={{ fill: "#d4d4d4" }}
                                    />
                                    Create model
                                  </Button>
                                </OverlayTrigger>
                              )
                            : null}
                          {editquery
                            ? queryStates.executed &&
                              !show && (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip className="mt-3" id="tooltip-engine">
                                      You didn&apos;t have access to this feature
                                    </Tooltip>
                                  }
                                >
                                  <Button variant="light" className="text-black-50">
                                    <Image
                                      src="/newicons/query-menu/disabled-visualize.svg"
                                      width="19"
                                      height="19"
                                      className="me-1"
                                    />
                                    Visualize
                                  </Button>
                                </OverlayTrigger>
                              )
                            : null}
                        </div>
                      )}
                    </div>
                    {/* Results Panel Table */}
                    <div className="mx-2 overflow-auto" style={{ flex: "1" }}>
                      {show ? (
                        <div className="d-flex df1 justify-content-center align-items-center">
                          <h2 className="dblue f-16 mb-5 pb-5 pt-5">{error}</h2>
                        </div>
                      ) : queryStates.executed || loading ? (
                        <div className="d-flex flex-column">
                          {query && !loading ? (
                            <Results list={list} query={query} row={20} />
                          ) : loading ? (
                            <div className="row container mt-2">
                              {[...Array(8)].map((e: any, idx: any) => {
                                const cw = [2, 3, 4, 6].includes(idx) ? "col-2" : "col-1";
                                return (
                                  <div className={cw} key={idx}>
                                    {[...Array(9)].map((indx: any) => (
                                      <ShimmerThumbnail
                                        height={20}
                                        className="mb-1"
                                        rounded
                                        key={indx}
                                      />
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="df1 justify-content-center align-items-center bg-white border-right">
                              <h2 className="dblue f-18 mt-5 pt-5">Please check the query !!!</h2>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Model for SQL queries */}
          <Modal show={showQueryModel} backdrop="static" keyboard={false}>
            <Modal.Header className="justify-content-center align-items-center">
              <Modal.Title className="f-18 mt-0 mb-0" style={{ color: "#495968", fontWeight: 600 }}>
                Text to SQL query generator
                <Image
                  src="/close.svg"
                  width={19}
                  height={19}
                  className="me-2"
                  onClick={() => {
                    setQueryPrompt("");
                    setQueryPromptData("");
                    setShowQueryModel(!showQueryModel);
                  }}
                  style={{ fill: "#d4d4d4", position: "absolute", right: "25px", top: "18px" }}
                />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="mt-2">
              <h6 className="f-12 fw-600">Mention about your query in simple natural language</h6>
              <div className="d-flex">
                <Form.Control
                  as="textarea"
                  rows={2}
                  autoComplete="off"
                  name="name"
                  value={queryPrompt}
                  onChange={(e) => setQueryPrompt(e.target.value)}
                  placeholder="Ex: Create a SQL request to find all users who live in California and have over 1000 credits:"
                  className="w-100 f-12 sql-prompt"
                />
                <div>
                  <Button
                    loading={queryPromptLoading}
                    spinColor="#7A7C7D"
                    className={"f-14 ms-2 border-0" + (queryPromptLoading ? "" : " px-3")}
                    onClick={() => queryPrompt && getqueryPrompt()}
                    style={{ color: "#495968", background: "#DDDDDD", width: "59px" }}
                  >
                    {!queryPromptLoading && (
                      <Image src="/send.svg" width={19} height={19} style={{ fill: "#d4d4d4" }} />
                    )}
                  </Button>
                </div>
              </div>
              <h6 className="f-12 mt-3">Generated query</h6>
              <div className="d-flex">
                <div className="w-100 border rounded f-12 p-2" style={{ height: "70px" }}>
                  {queryPromptData ? (
                    <p>{queryPromptData}</p>
                  ) : (
                    <p style={{ color: "#ECECEC" }}>Your SQL query will be generated here.</p>
                  )}
                </div>

                <div className="ms-2" style={{ width: "59px" }}>
                  <Image
                    src="/copy.svg"
                    width={19}
                    height={19}
                    style={{ fill: "#445870" }}
                    onClick={() => queryPromptData && copyToClipBoard(queryPromptData)}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 mb-2 d-flex justify-content-center align-items-center">
              <button
                className="btn ms-3 bg-white"
                onClick={() => {
                  setQueryPrompt("");
                  setQueryPromptData("");
                }}
              >
                Clear
              </button>

              <Button
                type="button"
                className="text-white"
                onClick={() => {
                  if (queryPromptData) {
                    handleEditorChange(queryPromptData);
                    setQueryPrompt("");
                    setQueryPromptData("");
                    setShowQueryModel(!showQueryModel);
                  }
                }}
              >
                Add to editor
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModel}
            onHide={() => {
              setShowModel(!showModel);
            }}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header className="justify-content-center align-items-center">
              <Modal.Title className="f-24 mt-0 mb-0" style={{ color: "#495968", fontWeight: 600 }}>
                Create model
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="mt-3">
              <div>
                <Form>
                  <Form.Control
                    autoComplete="off"
                    name="name"
                    onChange={handleInputChange}
                    placeholder="Enter model name"
                    className="w-100 input-create-project mb-3"
                    height="50px"
                  />
                </Form>
              </div>
              <div>
                <select
                  className="form-select  image-placeholder"
                  id="inputGroupSelect02"
                  style={{ backgroundColor: "#EDF2F7", fontSize: 15, color: "#263238" }}
                  required
                  disabled={true}
                  placeholder={editQueryValues.query_name}
                  value={editQueryValues.query_name}
                >
                  <option value="" className="text-muted" disabled hidden selected>
                    {editQueryValues.query_name}
                  </option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 mb-2 d-flex justify-content-center align-items-center">
              <button
                className="btn ms-3 bg-white"
                onClick={() => {
                  setShowModel(!showModel);
                }}
              >
                Cancel
              </button>

              {value.name === "" ? (
                <Button
                  variant="light"
                  type="button"
                  className="text-center f-17"
                  style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
                >
                  Create
                </Button>
              ) : (
                <Link
                  href={`/projects/${project_id}/modelling/${editQueryValues?.query_id}?name=${value.name}`}
                >
                  <Button
                    variant="primary"
                    type="button"
                    className="text-white text-center f-17"
                    style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
                    // onClick={() => {
                    //   updateQuery("mlmodelling")
                    // }}
                  >
                    Create
                  </Button>
                </Link>
              )}
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default EditQuery;
