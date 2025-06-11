// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
import { ListGroup, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
// hooks
import { useRequest } from "@lib/hooks";
// components
import { DashboardHeader } from "components/toolbars";
import { SaveChanges } from "@components/modals";
import { renderPage } from "constants/common";

const DashboardLayout: FC = ({ children }) => {
  const [menu, setMenu] = React.useState(true);
  const router = useRouter();
  const { project_id } = router.query;
  // projects data
  const { data: projects }: any = useRequest({
    url: `api/projects/`,
  });
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  React.useEffect(() => {
    setMenu(true);
  }, [router.pathname]);

  const listItems = [
    { title: "Project summary", path: ["/"] },
    { title: "Data sources", path: ["/datasources"] },
    { title: "Queries", path: ["/queries"] },
    { title: "Notebook", path: ["/notebook"] },
    { title: "Models", path: ["/models"] },
    {
      title: "Charts",
      path: ["/chart", "/visualization"],
    },
    { title: "Triggers", path: ["/triggers"] },
    { title: "Dashboards", path: ["/dashboards"] },
    { title: "Members", path: ["/members"] },
  ];

  const isActive = (path: any, idx: any) => {
    let classname = "";
    if (idx === 0) {
      classname = router?.pathname == "/projects/[project_id]" ? "active-tab" : "";
    } else {
      path.map((ele: any) => {
        if (router?.pathname?.startsWith(`/projects/[project_id]${ele}`)) classname = "active-tab";
      });
    }
    return classname;
  };
  const [newState, setNewState] = React.useState("");
  // check for unsaved changes
  const checkPage = (path: any) => {
    renderPage(router, path, project_id, setNewState, true);
  };
  // discard changes
  const onDiscard = () => {
    router.push(newState);
    setNewState("");
  };
  // save unsaved changes
  const onSave = () => {
    // let routing = false;
    // let routingFor = [
    //   "/projects/[project_id]/dashboards/[dashboard_id]",
    //   "/projects/[project_id]/dashboards/create",
    // ];
    const save = document.getElementById("save-btn") as HTMLButtonElement;
    if (save) save.click();
    // routingFor.map((ele: any) => {
    //   if (router.pathname.startsWith(ele)) routing = true;
    // });
    // // router to pages after saving
    // if (routing) router.push(newState);
    setNewState("");
  };

  return (
    <React.Fragment>
      <div>
        <DashboardHeader
          projects={projects}
          menu={menu}
          setMenu={setMenu}
          project_id={project_id}
          setNewState={setNewState}
        />
        <div className="navigation-link1">
          {menu &&
            (router.pathname === "/projects" ||
            router.pathname === "/profile" ||
            router.pathname === "/sampledatasets" ||
            router.pathname === "/admin" ||
            router.pathname === "/contactsales" ||
            router.pathname === "/supportrequest" ||
            router.pathname === "/signup/verify/[token]" ||
            router.pathname === "/project/invitation/[token]" ? null : (
              <ListGroup
                horizontal={true}
                className="d-flex ps-3 header-home justify-content-around navigation-link"
              >
                <ListGroup.Item
                  className={`text-decoration-none nav-tab ${
                    router?.pathname == "/projects" ? "active-tab" : ""
                  }`}
                >
                  <div onClick={() => checkPage(["/projects"])} className="cursor-pointer">
                    <Image
                      src="/newicons/home.svg"
                      width={30}
                      height={30}
                      className="me-2 testsvg"
                    />
                  </div>
                </ListGroup.Item>
                {listItems.map((ele: any, idx: any) => {
                  return (
                    <ListGroup.Item
                      className={
                        "fw-bold f-14 text-decoration-none nav-tab " + isActive(ele.path, idx)
                      }
                      key={idx}
                    >
                      {ele.title === "Project summary" ? (
                        <div onClick={() => checkPage(ele.path)} className="cursor-pointer">
                          <a className={`text-decoration-none nav-tab `}>{ele.title}</a>
                        </div>
                      ) : userRole?.user_role !== "Owner" &&
                        userRole?.user_module_access[idx - 1][ele.title] === "NONE" ? (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <a className={`text-decoration-none nav-tab `}>{ele.title}</a>
                        </OverlayTrigger>
                      ) : (
                        <div onClick={() => checkPage(ele.path)} className="cursor-pointer">
                          <a className={`text-decoration-none nav-tab `}>{ele.title}</a>
                        </div>
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ))}
          {/* {router.pathname === "/projects" ||
          router.pathname === "/profile" ||
          router.pathname === "/admin" ||
          router.pathname === "/contactsales" ||
          router.pathname === "/supportrequest" ||
          router.pathname === "/signup/verify/[token]" ||
          router.pathname === "/project/invitation/[token]" ||
          router.pathname.includes("/projects/[project_id]/dashboards/[dashboard_id]") ||
          router.pathname.includes("/projects/[project_id]/visualization/[type]/[id]") ||
          router.pathname.includes("/projects/[project_id]/ml-modelling") ||
          router.pathname.includes(
            "/projects/[project_id]/modelling/[query_id]/prediction/[model_id]"
          ) ||
          router.pathname.includes("/projects/[project_id]/modelling/[query_id]/view/[model_id]") ||
          router.pathname.includes("/projects/[project_id]/modelling/[query_id]") ||
          router.pathname.includes("/projects/[project_id]/dashboards/create") ? null : (
            
          )} */}
        </div>
      </div>
      <div
        className={
          !menu ||
          router.pathname === "/projects" ||
          router.pathname === "/profile" ||
          router.pathname === "/sampledatasets" ||
          router.pathname === "/admin" ||
          router.pathname === "/contactsales" ||
          router.pathname === "/supportrequest" ||
          router.pathname === "/signup/verify/[token]" ||
          router.pathname === "/project/invitation/[token]"
            ? "dashboard-no-project-layout"
            : "dashboard-collapse-wrapper"
        }
      >
        <div className="main-wrapper">
          <>{children}</>
        </div>
      </div>
      <SaveChanges newState={newState} onSave={onSave} onDiscard={onDiscard} />
    </React.Fragment>
  );
};

export default DashboardLayout;
