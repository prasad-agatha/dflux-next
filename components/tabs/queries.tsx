//react
import React, { FC, useEffect } from "react";
// next link
import Link from "next/link";
// router
import { useRouter } from "next/router";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
// components
import { ListTable } from "components/data-tables";
import { QueriesMenu } from "components/menu";
import { TriggersModal, NewQuery } from "components/modals";
// styled icons
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { ConnectionsService } from "services";
import { Spinner } from "react-bootstrap";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { ToolTip } from "components/tooltips";
import { checkRole } from "constants/common";

const connections = new ConnectionsService();

interface IQueriesProps {
  data: any;
  queryMutate: any;
  setSearch: any;
  search: any;
}

const Queries: FC<IQueriesProps> = (props) => {
  const { data, queryMutate, setSearch, search } = props;

  const router = useRouter();
  const { project_id, new_query } = router.query;
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  useEffect(() => {
    if (checkRole(userRole, "queries") && new_query === "true") {
      setNewState({ ...newState, query: true });
      getQueries();
    }
  }, [new_query]);
  const [queriesStates, setQueriesStates] = React.useState({ name: "", id: 0, trigger: false });
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });

  const [allConnections, setAllConnections] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const getQueries = async () => {
    setLoading(true);
    let newArr: any = [];
    let newArr1: any = [];
    let newArr2: any = [];
    await connections.getConnectionsData(project_id).then((response: any) => {
      newArr = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.name;
          item["label"] = item.name;
          item["value"] = item.name;
          item["type"] = "normal";
          item["datasource"] = item.engine;
          return item;
        }
      });
    });
    await connections.getExcelsData(project_id).then((response: any) => {
      newArr1 = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.tablename;
          item["label"] = item.tablename;
          item["value"] = item.tablename;
          item["type"] = "excel";
          item["datasource"] = item.file_type;
          return item;
        }
      });
    });
    await connections.getJsonsData(project_id).then((response: any) => {
      newArr2 = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.tablename;
          item["label"] = item.tablename;
          item["value"] = item.tablename;
          item["type"] = "json";
          item["datasource"] = item.engine;
          return item;
        }
      });
    });
    const connections1 = [...newArr, ...newArr1, ...newArr2];
    setAllConnections(connections1);
    setLoading(false);
  };

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  hotkeys("enter", function () {
    document?.getElementById("query-button")?.click();
  });
  // const data1 = {
  //   nodes: data?.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())),
  // };

  // columns data
  const columns = [
    {
      // query name
      name: "NAME",
      sortable: true,
      center: false,
      selector: "name",
      cell: (row: any) => (
        <Link
          href={{
            pathname: `/projects/${project_id}/queries/${row.connection}/`,
            query: {
              editquery: row.id,
              excel: row.excel,
              type: row.engine_type,
            },
          }}
          // href={
          //   row.connection_type === "EXTERNAL"
          //     ? `/projects/${project_id}/queries/${row.connection}/?editquery=${row.id}`
          //     : `/projects/${project_id}/queries/${row.connection}/?editquery=${row.id}?excel=${row.excel}`
          // }
        >
          <a className="text-decoration-none">
            <div className="df1 link-text">
              <p className="mb-0 f-14 ls" style={{ color: "#707683" }}>
                {row.name}
              </p>
            </div>
          </a>
        </Link>
      ),
    },
    {
      // connection name
      name: "DATA CONNECTION",
      sortable: true,
      center: false,
      selector: "connection_name",
      style: { cursor: "auto" },
      cell: (row: any) => <>{row.connection_name ? row.connection_name : row.excel_name}</>,
    },
    {
      // project name
      name: "CREATED BY",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "created_by",
    },

    {
      // connection name
      name: "CREATED ON",
      sortable: true,
      center: false,
      selector: "created",
      style: { cursor: "auto" },
      cell: (row: any) => <>{row.created}</>,
    },
    {
      // connection name
      name: "LAST MODIFIED ON",
      sortable: true,
      center: false,
      selector: "updated",
      style: { cursor: "auto" },
      cell: (row: any) => <>{row.updated}</>,
    },
    {
      // option - menu
      name: "OPTIONS",
      center: true,
      width: "10%",
      cell: (row: any) => {
        return (
          <QueriesMenu
            query={row}
            queryMutate={queryMutate}
            queriesStates={queriesStates}
            setQueriesStates={setQueriesStates}
            userRole={userRole}
          />
        );
      },
    },
  ];

  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-center">
        {/* <div
          className="mt-3"
          style={{
            fontFamily: "Metropolis",
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 600,
            letterSpacing: 0.1,
            color: "#0076FF",
          }}
        >
          Queries
        </div> */}

        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Queries</h4>
          <p className="mt-1 f-16 opacity-75">Create a new query or update a saved query.</p>
        </div>

        <div className="ms-auto">
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
            visible={!checkRole(userRole, "queries")}
            style={{ left: "-15%" }}
            text="You didn't have access to this feature"
            element={() => (
              <Button
                id="query-button"
                onClick={() => {
                  if (checkRole(userRole, "queries")) {
                    setNewState({ ...newState, query: true });
                    getQueries();
                  }
                }}
                className={
                  "ls text-nowrap " + (checkRole(userRole, "queries") ? "" : "disable-btn")
                }
                variant={checkRole(userRole, "queries") ? "outline-primary" : "light"}
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New query
                </div>
              </Button>
            )}
          />
        </div>
      </div>

      {!data ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[1]["Queries"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/newicons/no-queries.svg"
              alt="create chart"
              width="70"
              height="80"
              className="me-1"
            />
            <h6 className="fw-bold f-14 mt-2 noneaccess">
              You didn&apos;t have access to this feature
            </h6>
          </div>
        </>
      ) : (
        <div
          className={`p-0 d-flex ${
            data?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {data?.length > 0 ? (
            <div className="mt-2 projects-container-p">
              <ListTable columns={columns} data={data} />
            </div>
          ) : (
            <>
              <Image
                src="/newicons/no-queries.svg"
                alt="create query"
                width="110"
                height="110"
                className="me-1"
                style={{ marginBottom: "-10px" }}
              />
              <h6 className="fw-bold mt-0 title">No queries available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first query</p>
              {userRole?.user_role === "Owner" ||
              userRole?.user_module_access[1]["Queries"] === "WRITE" ? (
                <Button
                  className="cursor-pointer text-white text-center ls"
                  onClick={() => {
                    setNewState({ ...newState, query: true });
                    getQueries();
                  }}
                  style={{ color: "#0076FF", width: 190 }}
                >
                  Create query
                </Button>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <Button
                    style={{ borderColor: "#d4d4d4", backgroundColor: "#fff", color: "#d4d4d4" }}
                    className="f-14 ls"
                  >
                    <div className="d-flex w-100 align-items-center">Create query</div>
                  </Button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      )}

      {/* <div className="mt-2 projects-container-p">
        <ListTable columns={columns} data={data} />
      </div> */}
      <TriggersModal
        triggersMutate={queryMutate}
        queriesStates={queriesStates}
        setQueriesStates={setQueriesStates}
      />
      <NewQuery
        newState={newState}
        setNewState={setNewState}
        allConnections={allConnections}
        loading={loading}
      />
    </div>
  );
};
export default Queries;
