//react
import React, { useEffect, FC } from "react";
// next link
import Link from "next/link";
// react-bootstrap
import { Button, Image, Card } from "react-bootstrap";
// services
import { DashboardService } from "services";
// components// toast
import { toast } from "react-toastify";
// moment
// import Moment from "moment";
import { DashboardsMenu } from "@components/menu";
import { useRouter } from "next/router";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { Spinner } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { ArrowDropDown } from "@styled-icons/material/ArrowDropDown";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { checkRole } from "constants/common";
import { ToolTip } from "components/tooltips";
// service instanace
const dashboardService = new DashboardService();

interface IdashboardProps {
  project_id: any;
  dashboardData: any;
  setSearch: any;
  search: any;
  dashboardMutate: () => void;
}

const Dashboards: FC<IdashboardProps> = (props) => {
  const { project_id, dashboardData, dashboardMutate, setSearch, search } = props;
  const router = useRouter();

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  //function for coopying to clipboard
  const copyLink = (token: string, id: any) => {
    const text = process.env.APP_URL + `shared/dashboard/${id}?shr=${token}`;
    const elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    toast.success("Copied to clipboard", { autoClose: 3000 });
  };
  const shareDashboard = (id: any) => {
    dashboardService
      .shareDashboard(id)
      .then((res) => {
        copyLink(res.shared_token, id);
      })
      .catch();
  };

  const deleteDashboard = (id: any) => {
    dashboardService
      .deleteDashboard(id)
      .then(() => {
        dashboardMutate();
        toast.success("Dashboard deleted successfully", { autoClose: 3000 });
      })
      .catch((err: any) => {
        toast.error(err.error, { autoClose: 3000 });
      });
  };

  hotkeys("enter", function () {
    document?.getElementById("create-button")?.click();
  });
  const [result, setResult] = React.useState([]);
  const [select, setSelect] = React.useState("Sort by name");

  useEffect(() => {
    if (dashboardData) {
      let sort: any = [];
      const tempArr = [...dashboardData];
      if (select === "Sort by name") {
        sort = tempArr.sort((a: any, b: any) => a.name.localeCompare(b.name));
      } else if (select === "Sort by date") {
        sort = tempArr.sort(
          (a: any, b: any) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
      }
      setResult(sort);
    }
  }, [dashboardData, select]);
  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-between">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Dashboards</h4>
          <p className="mt-1 mb-0 f-16 opacity-75">
            View and analyze key metrics, charts, and reports.
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
            visible={!checkRole(userRole, "dashboards")}
            style={{ left: "-1%" }}
            text="You didn't have access to this feature"
            element={() => (
              <Button
                onClick={() => {
                  if (checkRole(userRole, "dashboards"))
                    router.push(`/projects/${project_id}/dashboards/create`);
                }}
                className={"f-14 " + (checkRole(userRole, "dashboards") ? "" : "disable-btn")}
                variant={checkRole(userRole, "dashboards") ? "outline-primary" : "light"}
                id="create-button"
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New dashboard
                </div>
              </Button>
            )}
          />
        </div>
      </div>

      {!dashboardData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[6]["Dashboards"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/assets/icons/summary/emptyDashboardsPage.svg"
              alt="create chart"
              width="70"
              height="80"
              className="me-1"
            />
            <h6 className="fw-bold f-14 mt-2 noneaccess">You didn&apos;t have access to this feature</h6>
          </div>
        </>
      ) : (
        userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[7]["Dashboards"] === "NONE"? (
          <>
            <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
              <Image
                src="/assets/icons/summary/emptyDashboardsPage.svg"
                alt="create chart"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold f-14 mt-2 noneaccess">You didn&apos;t have access to this feature</h6>
            </div>
          </>
        ) :
        <div
          className={`p-0 d-flex ${
            dashboardData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {dashboardData?.length > 0 ? (
            <div className="projects-container-p">
              <div className="my-3 flex-wrap d-flex align-items-center" style={{ gap: "0.75rem" }}>
                {/* Add New Dashboard Card */}
                <Card
                  onClick={() => {
                    if (checkRole(userRole, "dashboards"))
                      router.push(`/projects/${project_id}/dashboards/create`);
                  }}
                  className={
                    "p-3 chart-crd " +
                    (checkRole(userRole, "dashboards") ? "dblue-border" : "gray-border")
                  }
                >
                  <ToolTip
                    position={"bottom"}
                    visible={!checkRole(userRole, "dashboards")}
                    style={{ left: "-65%", bottom: "-20%" }}
                    text="You didn't have access to this feature"
                    element={() => (
                      <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                        <Image width="64" height="64" src="/connectSource.svg" />
                        <h6
                          className={
                            "bold mt-2 " + (checkRole(userRole, "dashboards") ? "dblue" : "gray")
                          }
                        >
                          New dashboard
                        </h6>
                      </div>
                    )}
                  />
                </Card>

                {/* Dashboards */}
                {result &&
                  result?.map((item: any, index: any) => {
                    const url =
                      typeof item.extra?.thumbnail === "string"
                        ? item.extra?.thumbnail
                        : item.extra?.thumbnail.asset;
                    return (
                      <Card className="p-3 shadow-sm chart-crd" key={index}>
                        <div className="d-flex w-100 pb-2">
                          <div className="flex-grow-1">
                            <Link href={`/projects/${project_id}/dashboards/${item.id}`}>
                              <a className="text-decoration-none">
                                <Card.Title className="cursor-pointer  text-capitalize text-dark">
                                  <p className="mb-0 f-18">{item.name}</p>
                                </Card.Title>
                              </a>
                            </Link>
                          </div>
                          <DashboardsMenu
                            project_id={project_id}
                            item={item}
                            shareDashboard={shareDashboard}
                            deleteDashboard={deleteDashboard}
                            userRole={userRole}
                          />
                        </div>
                        <Link href={`/projects/${project_id}/dashboards/${item.id}`}>
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
                src="/assets/icons/summary/emptyDashboardsPage.svg"
                alt="create model"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No dashboards available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first dashboard</p>
              <ToolTip
                position={"bottom"}
                visible={!checkRole(userRole, "dashboards")}
                style={{ left: "-16%" }}
                text="You didn't have access to this feature"
                element={() => (
                  <Button
                    onClick={() => {
                      if (checkRole(userRole, "dashboards"))
                        router.push(`/projects/${project_id}/dashboards/create`);
                    }}
                    className={
                      "f-14 " + (checkRole(userRole, "dashboards") ? "text-white" : "disable-btn")
                    }
                    variant={checkRole(userRole, "dashboards") ? "primary" : "light"}
                  >
                    New dashboard
                  </Button>
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboards;
