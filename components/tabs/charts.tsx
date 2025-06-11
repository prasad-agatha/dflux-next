// react
import React, { useEffect, FC } from "react";
// next link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Image, Card, Button } from "react-bootstrap";
// components
import { TriggersModal, NewChart } from "components/modals";
import { ChartsMenu } from "components/menu";
import { ToolTip } from "components/tooltips";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { ChartService } from "services";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { ArrowDropDown } from "@styled-icons/material/ArrowDropDown";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { checkRole } from "constants/common";

const charts = new ChartService();
interface IdashboardProps {
  chartData: any;
  chartMutate: () => void;
  dashboardData: any;
  search: any;
  setSearch: any;
}

const Charts: FC<IdashboardProps> = (props) => {
  const { chartData, chartMutate, dashboardData, search, setSearch } = props;
  const router = useRouter();
  const { project_id } = router.query;
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const [chartState, setChartState] = React.useState({
    name: "",
    id: 0,
    trigger: false,
    query: 0,
  });
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });
  //Base url

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const copyLink = (token: string, id: any) => {
    const text = process.env.APP_URL + `shared/chart/${id}?shr=${token}`;
    const elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    toast.success("Copied to clipboard", { autoClose: 3000 });
  };
  const shareChart = (id: any) => {
    charts
      .shareChart(id)
      .then((res) => {
        copyLink(res.shared_token, id);
      })
      .catch();
  };

  const [result, setResult] = React.useState([]);
  const [select, setSelect] = React.useState("Sort by name");

  useEffect(() => {
    if (chartData) {
      let sort: any = [];
      const tempArr = [...chartData];
      if (select === "Sort by name") {
        sort = tempArr.sort((a: any, b: any) => a.name.localeCompare(b.name));
      } else if (select === "Sort by date") {
        sort = tempArr.sort(
          (a: any, b: any) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
      }
      setResult(sort);
    }
  }, [chartData, select]);

  hotkeys("enter", function () {
    document?.getElementById("create-button")?.click();
  });

  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Charts</h4>
          <p className="mt-1 mb-0 f-16 opacity-75">
            Choose and customize charts, and add them to your dashboard.
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
            visible={!checkRole(userRole, "charts")}
            style={{ left: "-20%" }}
            text="You didn't have access to this feature"
            element={() => (
              <Button
                onClick={() => {
                  if (checkRole(userRole, "charts")) setNewState({ ...newState, chart: true });
                }}
                className={"f-14 " + (checkRole(userRole, "charts") ? "" : "disable-btn")}
                variant={checkRole(userRole, "charts") ? "outline-primary" : "light"}
                id="create-button"
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New chart
                </div>
              </Button>
            )}
          />
        </div>
      </div>

      {!chartData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[4]["Charts"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/assets/icons/summary/emptyChartsPage.svg"
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
            chartData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {chartData?.length > 0 ? (
            <div className="projects-container-p">
              <div className="my-3 flex-wrap d-flex align-items-center" style={{ gap: "0.75rem" }}>
                {/* Add New Chart Card */}
                <Card
                  onClick={() => {
                    if (checkRole(userRole, "charts")) setNewState({ ...newState, chart: true });
                  }}
                  className={
                    "p-3 chart-crd " +
                    (checkRole(userRole, "charts") ? "dblue-border" : "gray-border")
                  }
                >
                  <ToolTip
                    position={"bottom"}
                    visible={!checkRole(userRole, "charts")}
                    style={{ left: "-65%", bottom: "-20%" }}
                    text="You didn't have access to this feature"
                    element={() => (
                      <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                        <Image width="64" height="64" src="/connectSource.svg" />
                        <h6
                          className={
                            "bold mt-2 " + (checkRole(userRole, "charts") ? "dblue" : "gray")
                          }
                        >
                          New chart
                        </h6>
                      </div>
                    )}
                  />
                </Card>

                {/* Charts */}
                {result &&
                  result?.map((item: any, index: any) => {
                    const url =
                      typeof item.extra?.thumbnail === "string"
                        ? item.extra?.thumbnail
                        : item.extra?.thumbnail.asset;

                    return (
                      <Card className="p-3 shadow-sm chart-crd" key={index}>
                        <div className="d-flex align-items-center w-100 pb-2">
                          <div className="flex-grow-1">
                            <Link
                              href={`${
                                item.save_from === "query"
                                  ? `/projects/${project_id}/visualization/query/${item.query.id}?edit=${item.id}`
                                  : `/projects/${project_id}/visualization/model/${item.data_model}?edit=${item.id}`
                              }`}
                            >
                              <a className="text-decoration-none">
                                <Card.Title className="cursor-pointer mb-0 text-capitalize text-dark">
                                  <p className="mb-0 f-18">{item.name}</p>
                                </Card.Title>
                              </a>
                            </Link>
                          </div>
                          <ChartsMenu
                            chartMutate={chartMutate}
                            item={item}
                            chartState={chartState}
                            setChartState={setChartState}
                            shareChart={shareChart}
                            project_id={project_id}
                            dashboardData={dashboardData}
                            userRole={userRole}
                          />
                        </div>
                        <Link
                          href={`${
                            item.save_from === "query"
                              ? `/projects/${project_id}/visualization/query/${item.query.id}?edit=${item.id}`
                              : `/projects/${project_id}/visualization/model/${item.data_model}?edit=${item.id}`
                          }`}
                        >
                          <Image src={url} alt="img" width="260" height="130" />
                        </Link>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ) : (
            <>
              <Image
                src="/assets/icons/summary/emptyChartsPage.svg"
                alt="create chart"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No charts available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first chart</p>
              <ToolTip
                position={"bottom"}
                visible={!checkRole(userRole, "charts")}
                style={{ left: "-40%" }}
                text="You didn't have access to this feature"
                element={() => (
                  <Button
                    onClick={() => {
                      if (checkRole(userRole, "charts")) setNewState({ ...newState, chart: true });
                    }}
                    className={
                      "f-14 " + (checkRole(userRole, "charts") ? "text-white" : "disable-btn")
                    }
                    variant={checkRole(userRole, "charts") ? "primary" : "light"}
                  >
                    New chart
                  </Button>
                )}
              />
            </>
          )}
        </div>
      )}

      <NewChart newState={newState} setNewState={setNewState} />
      {chartState.trigger && (
        <TriggersModal
          triggersMutate={chartMutate}
          queriesStates={chartState}
          setQueriesStates={setChartState}
        />
      )}
    </div>
  );
};

export default Charts;
