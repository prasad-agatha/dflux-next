// react
import React, { FC } from "react";
// react tour
import dynamic from "next/dynamic";
// next link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react-bootstrap
import { Image, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
// icons
import { CaretBackCircle, CaretForwardCircle } from "@styled-icons/ionicons-outline";
// components
import { CreateProject } from "components/modals";
import { HelpCircle } from "@styled-icons/boxicons-regular/HelpCircle";
import { projectSummarySteps, chartSteps, querySteps } from "constants/common";
// services

export interface IDashboardSideBarProps {
  setCollapse: any;
  collapse: boolean;
}
const Tour: any = dynamic(() => import("reactour"), { ssr: false });

const DashboardSideBar: FC<IDashboardSideBarProps> = ({ setCollapse, collapse }) => {
  const router = useRouter();
  const { project_id } = router.query;

  // create modal
  const [createProject, setCreateProject] = React.useState(false);

  // projects data
  const { data: projects, mutate: projectsMutate }: any = useRequest({
    url: `api/projects/`,
  });

  const [optionsTour, setOptionsTour] = React.useState(false);

  const firstSteps = [
    {
      selector: ".first-step",
      content: "Select Measure",
    },
    {
      selector: ".second-step",
      content: "Select Dimensions to be rendered. Multiple options can be selected",
    },
  ];
  const [queryTour, setQueryTour] = React.useState(false);
  const [chartTour, setChartTour] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  return (
    <div className="sidebar d-flex justify-content-between flex-column h-100">
      <div>
        <Card className="border-0 mb-1">
          <Card.Body
            onClick={() => {
              setCreateProject(!createProject);
            }}
            className={
              !collapse
                ? "sidebar dblue d-flex cursor-pointer align-items-center justify-items-center bold pe-0 p-2 ps-3"
                : "sidebar dblue d-flex cursor-pointer  justify-content-center p-2"
            }
          >
            <Image src="/create.svg" alt="create new project" width="22" height="22" />
            {!collapse ? (
              <p className="mb-0 ms-2 f-14 overflow-hidden overflow-whitespace">New Project</p>
            ) : null}
          </Card.Body>
        </Card>
        <Card className="d-flex border-0">
          <Card.Body className="sidebar p-0">
            <div className="d-flex border-0 p-0 flex-row bold">
              <div
                className={`projects-text d-flex bold flex-row align-items-center border-0 ${
                  !collapse ? "px-3 py-2" : " p-1 pt-0 mb-0 mt-0"
                }`}
              >
                <Link href="/projects">
                  <div className="cursor-pointer d-flex">
                    <Image
                      className={` ${!collapse ? "me-2" : "ms-3 me-0"} `}
                      alt="projects"
                      width="20"
                      height="20"
                      src="/projects.svg"
                    />
                    {!collapse ? (
                      <p className="mb-0 ms-2 f-14 overflow-hidden overflow-whitespace">Projects</p>
                    ) : null}
                  </div>
                </Link>
                <div
                  onClick={() => {
                    setCollapse(!collapse);
                  }}
                  className="cursor-pointer"
                >
                  {!collapse ? (
                    <CaretBackCircle width={22} height={22} className="ms-4" />
                  ) : (
                    <CaretForwardCircle width={16} height={16} />
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className=" border-0">
          {projects?.map((item: any, index: number) => (
            <Link key={index} href={`/projects/${item.id}/`}>
              <a className="text-decoration-none">
                <Card.Body
                  className={`project-link d-flex ${
                    item.id === Number(project_id) ? "project-active" : ""
                  } ${!collapse ? "ps-5 p-3" : "ps-0 p-0 py-1 justify-content-center"}`}
                >
                  {collapse ? (
                    <OverlayTrigger overlay={<Tooltip id="tooltip-engine">{item.name}</Tooltip>}>
                      <div
                        className="project-icon d-flex border text-light justify-content-center align-items-center p-2"
                        style={{
                          backgroundColor: item.id === Number(project_id) ? "#0076FF" : "#495968",
                        }}
                      >
                        <p className="mb-0">{item.name.charAt(0)}</p>
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <p className="mb-0 overflow-hidden overflow-whitespace">{item.name}</p>
                  )}
                </Card.Body>
              </a>
            </Link>
          ))}
        </Card>
      </div>
      {router.pathname === "/projects/[project_id]/chart/create/[query_id]" ||
      router.pathname === "/projects/[project_id]/visualization/[type]/[id]" ||
      router.pathname === "/projects/[project_id]" ||
      router.pathname === "/projects/[project_id]/queries/[connection_id]" ? (
        <div className="d-flex px-3 justify-content-center" style={{ alignItems: "end" }}>
          <HelpCircle
            className="cursor-pointer mb-3"
            color="rgb(31, 51, 102, 0.5)"
            width={32}
            height={32}
            onClick={() => {
              if (router.pathname === "/projects/[project_id]/visualization/[type]/[id]") {
                setChartTour(true);
              } else if (router.pathname === "/projects/[project_id]/queries/[connection_id]") {
                setQueryTour(true);
              } else if (router.pathname === "/projects/[project_id]") {
                setIsTourOpen(true);
              }
            }}
          />
        </div>
      ) : null}
      <CreateProject
        createProject={createProject}
        setCreateProject={setCreateProject}
        projectsMutate={projectsMutate}
      />
      <Tour
        rounded={8}
        startAt={0}
        steps={firstSteps}
        isOpen={optionsTour}
        onRequestClose={() => setOptionsTour(false)}
      />
      <Tour
        rounded={8}
        startAt={0}
        steps={chartSteps}
        isOpen={chartTour}
        onRequestClose={() => setChartTour(false)}
      />
      <Tour
        rounded={8}
        startAt={0}
        steps={projectSummarySteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
      <Tour
        rounded={8}
        startAt={0}
        steps={querySteps}
        isOpen={queryTour}
        onRequestClose={() => setQueryTour(false)}
      />
    </div>
  );
};
export default DashboardSideBar;
