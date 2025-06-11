// react
import React, { FC } from "react";
import { useRequest } from "@lib/hooks";
// next link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Card, Image, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";
// toast
import { toast } from "react-toastify";
import { ArrowRight } from "@styled-icons/bootstrap/ArrowRight";
import { Mysql, Microsoftsqlserver, Oracle } from "@styled-icons/simple-icons";
import { CreateProject, TriggersModal } from "components/modals";
import CreateJupiter from "@components/modals/createJupiter";
import { NotebookService, ProjectsService } from "services";


//toast configuration
toast.configure();
const projectsAPI = new ProjectsService();
const notebookService = new NotebookService();

const OracleRed = styled(Oracle)`
  color: #f80000;
`;

interface IProjectSummaryProps {
  newState: any;
  setNewState: any;
  projectData: any;
  projectMutate: any;
  getQueries: any;
}

const ProjectSummary: FC<IProjectSummaryProps> = (props) => {
  const { newState, setNewState, projectData, projectMutate, getQueries } = props;
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
  // create modal
  const [createProject, setCreateProject] = React.useState(false);

  const [createJupiter, setCreateJupiter] = React.useState(false);

  const [notebookData, setNoteBookData] = React.useState([]);

  // useEffect - To load the project title and description
  React.useEffect(() => {
    if (project_id) {
      const getNotebooks = async () => {
        const projectData = await projectsAPI.getProjectData(project_id);
        if (projectData?.token) {
          notebookService
            .getNotebooks(projectData?.token)
            .then((data:any) => setNoteBookData(data.notebooks || []))
            .catch((error: any) => {
              toast.error(error);
            });
        }
      };
      getNotebooks()
    }
  }, [project_id]);
  const notebooks =
    typeof notebookData !== undefined
      ? notebookData.filter((notebook: any, id: any) => id < 5)
      : [];
  const connections = projectData?.data_sources
    ? projectData?.data_sources.filter((notebook: any, id: any) => id < 5)
    : [];

  return (
    <>
      {!projectData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : (
        <div>
          <div className="d-flex align-items-center py-2">
            <div className="summary-1 mt-4">
              <h4 className="fw-bold mb-2"> {projectData && projectData.name}</h4>
              <p className="mt-2 mb-0 f-16 opacity-75">{projectData && projectData.description}</p>
            </div>
            <div className="d-flex ms-auto">
              <Button onClick={() => setCreateProject(!createProject)} className="text-white">
                <Image
                  src="/create1.svg"
                  alt="create new project"
                  width="22"
                  height="22"
                  className="me-2"
                />
                New project
              </Button>
            </div>
          </div>
          {/* <div className="my-4">
            <div
              style={{
                fontSize: 26,
                fontFamily: "Inter",
                fontWeight: "bold",
                fontStyle: "normal",
                opacity: 0.8,
                color: "black",
              }}
              className="d-flex justify-content-between"
            >
              {projectData && projectData.name}
              <Button
                onClick={() => {
                  setCreateProject(!createProject);
                }}
                style={{
                  fontSize: 13,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontStyle: "normal",
                  color: "white",
                  fontFeatureSettings: "normal",
                  backgroundColor: "#0795FF",
                  borderRadius: 6,
                }}
                className=""
              >
                <Image
                  src="/create1.svg"
                  alt="create new project"
                  width="22"
                  height="22"
                  className="me-2"
                />
                Create Project
              </Button>
            </div>
            <div
              style={{
                fontSize: 18,
                fontFamily: "Inter",
                fontWeight: 500,
                fontStyle: "normal",
                opacity: 0.8,
                color: "black",
              }}
            >
              {projectData && projectData.description}
            </div>
          </div> */}
          <div className="row mt-3">
            {/* Project Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[7]["Members"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-2 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/project.svg"
                        alt="project"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Project</h6>
                    </div>
                    {/* <ProjectsMenu id={projectData?.id} /> */}
                    {/* <div className="ms-auto">
                    <Image
                      src="/deleteNew.svg"
                      width={20}
                      alt="Delete"
                      height={20}
                      className="me-2 cursor-pointer"
                      onClick={() => {
                        setProjectDelete(!projectDelete);
                      }}
                    />
                    <DeleteProject
                      projectDelete={projectDelete}
                      setProjectDelete={setProjectDelete}
                      id={projectData?.id}
                    />
                  </div> */}
                    {/* <Delete
                    width={20}
                    height={20}
                    className="me-2"
                    onClick={() => {
                      // setProjectDelete(!projectDelete);

                      <DeleteProject
                        projectDelete={projectDelete}
                        setProjectDelete={setProjectDelete}
                        id={projectData?.id}
                      />;
                    }}
                  /> */}
                  </Card.Header>

                  <Card.Body className="px-4" style={{ height: 225 }}>
                    <div className="d-flex align-items-center">
                      <h6 className="w-50 f-14" style={{ fontWeight: 600, color: "#27272E" }}>
                        Project name
                      </h6>
                      <p className="mini-heading-2 overflow-hidden overflow-whitespace">
                        {projectData?.name}
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <h6 className="w-50 f-14" style={{ fontWeight: 600, color: "#27272E" }}>
                        Created on
                      </h6>
                      <p className="mini-heading-2">
                        {/* {Moment(projectData?.created).format("MMM Do YYYY")} */}
                        {/* {Moment(projectData?.created).format("MM/DD/YYYY")} */}
                        {projectData?.created}
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <h6 className="w-50 f-14" style={{ fontWeight: 600, color: "#27272E" }}>
                        Members
                      </h6>
                      <p className="mini-heading-2">{projectData.users_count}</p>
                    </div>
                  </Card.Body>
                  {userRole?.user_role === "Owner" ||
                  userRole?.user_module_access[7]["Members"] === "WRITE" ? (
                    <Card.Footer
                      style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                      onClick={() => {
                        setNewState({ ...newState, invite: true });
                      }}
                      className="detail-card-footer align-items-center mb-1 mt-1 df1 cursor-pointer text-center"
                    >
                      <Image
                        alt="add user"
                        src="/create.svg"
                        width="24"
                        height="24"
                        className="mt-1 me-2"
                      />
                      <h6 className="dblue f-14 bold mb-0 mt-1 ms-2">Add members</h6>
                    </Card.Footer>
                  ) : (
                    <>
                      <Card.Footer
                        style={{
                          borderRadius: 12,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        }}
                        className="detail-card-footer align-items-center mb-1 mt-1 df1 cursor-pointer text-center"
                      >
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              alt="add user"
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="mt-1 me-2"
                            />
                            <h6 className="f-14 bold mb-0 mt-1" style={{ color: "#D4D4D4" }}>
                              Add members
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </Card.Footer>
                    </>
                  )}
                </Card>
              </div>
            ) : null}
            {/* Data Sources Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[0]["Data sources"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-3 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/data-sources.svg"
                        alt="data sources"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Data sources</h6>
                    </div>
                    <h6 className="last-updated ms-auto">Created on</h6>
                  </Card.Header>
                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.data_sources.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.data_sources.length !== 0 ? (
                        connections
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) =>
                            ["INTERNAL", "internal"].includes(item.connection_type) ? null : (
                              <div
                                style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                                className="d-flex align-items-center px-3"
                                key={index}
                              >
                                {item.engine == "postgres" ? (
                                  <Image
                                    src="/connections/icons/postgres.svg"
                                    width="34"
                                    height="28"
                                    className="me-2"
                                  />
                                ) : // <PostgreSQL width="28" height="28" className="me-2" />
                                null}
                                {item.engine == "mysql" ? (
                                  <Mysql width="34" height="28" className="me-2" />
                                ) : null}
                                {item.engine == "mssql" ? (
                                  <Microsoftsqlserver width="34" height="28" className="me-2" />
                                ) : null}
                                {item.engine == "oracle" ? (
                                  <OracleRed width="34" height="28" className="me-2" />
                                ) : null}

                                {item.connection_type === "SNOWFLAKE" ? (
                                  <Image
                                    src="/assets/icons/summary/snowflakeLogo.svg"
                                    width="34"
                                    height="28"
                                    className="me-2"
                                  />
                                ) : null}
                                {item.engine === "json" ? (
                                  <Image
                                    src="/connections/icons/json-icon.svg"
                                    width="30"
                                    height="30"
                                    className="me-2"
                                  />
                                ) : null}
                                {item.file_type === "google_sheets" ? (
                                  <Image
                                    src="/connections/icons/sheets-icon.svg"
                                    width="30"
                                    height="30"
                                    className="me-2"
                                  />
                                ) : null}
                                {item.file_type === "excel" ? (
                                  <Image
                                    src="/connections/icons/excel-icon.svg"
                                    width="30"
                                    height="30"
                                    className="me-2"
                                  />
                                ) : null}
                                {item.file_type === "csv" ? (
                                  <Image
                                    src="/connections/icons/csv-icon.svg"
                                    width="30"
                                    height="30"
                                    className="me-2"
                                  />
                                ) : null}
                                <p className="mini-heading-1 my-1 ms-1 overflow-hidden overflow-whitespace">
                                  {item.name ? item.name : item.tablename}
                                </p>
                                <p className="mini-heading-2 my-1 ms-auto">
                                  {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                  {item.created}
                                </p>
                              </div>
                            )
                          )
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyDatasource1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>

                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[0]["Data sources"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          setNewState({ ...newState, connection: true });
                        }}
                        className="d-flex cursor-pointer align-items-center mt-1 mb-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">Connect data source</h6>
                      </div>
                    ) : (
                      <div className="d-flex cursor-pointer align-items-center mt-1 mb-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-1" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="me-1"
                            />
                            <h6 className="f-14 bold mb-0" style={{ color: "#D4D4D4" }}>
                              Connect data source
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}

                    <div>
                      {projectData.data_sources.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/datasources`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Queries Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[1]["Queries"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-4 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/query.svg"
                        alt="queries"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Queries</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>

                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.queries.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.queries.length !== 0 ? (
                        projectData?.queries
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <Link
                              href={{
                                pathname: `/projects/${project_id}/queries/${item.connection}/`,
                                query: {
                                  editquery: item.id,
                                  excel: item.excel,
                                },
                              }}
                              key={index}
                            >
                              <a className="text-decoration-none">
                                <div
                                  style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                                  className="d-flex align-items-center px-4 cursor-pointer"
                                >
                                  <p className="mini-heading-1 my-1 ms-0 overflow-hidden overflow-whitespace">
                                    {item.name}
                                  </p>
                                  <p className="mini-heading-2 my-1 ms-auto">
                                    {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                    {item.created}
                                  </p>
                                </div>
                              </a>
                            </Link>
                          ))
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyQuery1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[1]["Queries"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          setNewState({ ...newState, query: true });
                          getQueries();
                        }}
                        className="d-flex align-items-center cursor-pointer mt-1 mb-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">New query</h6>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center cursor-pointer mt-1 mb-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="me-1"
                            />
                            <h6 className="f-14 bold mb-0" style={{ color: "#D4D4D4" }}>
                              New query
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}

                    <div>
                      {projectData.queries.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/queries`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Notebook Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[2]["Notebook"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-5 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/notebook.svg"
                        alt="notebooks"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Notebooks</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>

                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      notebookData.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {notebookData.length !== 0 ? (
                        notebooks
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <div
                              onClick={() => {
                                window.open(item.notebook_url);
                              }}
                              style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                              className="d-flex align-items-center px-4 cursor-pointer"
                              key={index}
                            >
                              <p className="mini-heading-1 my-1 ms-0 overflow-hidden overflow-whitespace">
                                {item.notebook_name}
                              </p>
                              <p className="mini-heading-2 my-1 ms-auto">
                                {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                {item.created}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyNotebooks.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[2]["Notebook"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          // setNewState({ ...newState, query: true });
                          setCreateJupiter(!createJupiter);
                        }}
                        className="d-flex align-items-center cursor-pointer mt-1 mb-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">New notebooks</h6>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center cursor-pointer mt-1 mb-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src="/newicons/disabled-plus-icon.svg"
                              width="24"
                              height="24"
                              className="me-1"
                            />
                            <h6 className="f-14 bold mb-0" style={{ color: "#D4D4D4" }}>
                              New notebooks
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}
                    <div>
                      {notebookData.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/notebook`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Models Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[3]["Models"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-6 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/model.svg"
                        alt="dashboards"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Models</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>
                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.models.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.models.length !== 0 ? (
                        projectData?.models
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <div
                              style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                              className="d-flex align-items-center px-4"
                              key={index}
                            >
                              <p className="mini-heading-1 my-1 ms-0 overflow-hidden overflow-whitespace">
                                {item.name}
                              </p>
                              <p className="mini-heading-2 my-1 ms-auto">
                                {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                {item.created}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="d-flex justify-content-center mt-3 mb-4 align-items-center">
                          <Image
                            src="/assets/icons/summary/emptyModel1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[3]["Models"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          setNewState({ ...newState, model: true });
                        }}
                        className="d-flex align-items-center cursor-pointer mb-1 mt-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">New model</h6>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center cursor-pointer mb-1 mt-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="me-1"
                            />
                            <h6 className="f-14 bold mb-0" style={{ color: "#D4D4D4" }}>
                              New model
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}

                    <div>
                      {projectData.models.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/models`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Charts Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[4]["Charts"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-7 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/chart.svg"
                        alt="dashboards"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Charts</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>
                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.charts.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.charts.length !== 0 ? (
                        projectData?.charts
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <Link
                              key={index}
                              href={`${
                                item.save_from === "query"
                                  ? `/projects/${project_id}/visualization/query/${item.query.id}?edit=${item.id}`
                                  : `/projects/${project_id}/visualization/model/${item.data_model}?edit=${item.id}`
                              }`}
                            >
                              <a className="text-decoration-none">
                                <div
                                  style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                                  className="d-flex align-items-center px-4"
                                >
                                  <p className="mini-heading-1 my-1 ms-0 overflow-hidden overflow-whitespace">
                                    {item.name}
                                  </p>
                                  <p className="mini-heading-2 my-1 ms-auto">
                                    {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                    {item.created}
                                  </p>
                                </div>
                              </a>
                            </Link>
                          ))
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyChart1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[4]["Charts"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          setNewState({ ...newState, chart: true });
                        }}
                        className="d-flex align-items-center cursor-pointer mt-1 mb-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">New chart</h6>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center cursor-pointer mt-1 mb-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="me-1"
                            />
                            <h6 className="f-14 bold mb-0 mt-1" style={{ color: "#D4D4D4" }}>
                              New chart
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}
                    <div>
                      {projectData.charts.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/chart`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Triggers Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[5]["Triggers"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-8 p-0">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/trigger.svg"
                        alt="dashboards"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Triggers</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>

                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.chart_triggers.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.chart_triggers.length !== 0 ? (
                        projectData?.chart_triggers
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <div
                              style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                              className="d-flex align-items-center px-4"
                              key={index}
                            >
                              <p className="mini-heading-1 my-1 ms-0 overflow-hidden overflow-whitespace">
                                {item.name}
                              </p>
                              <p className="mini-heading-2 my-1 ms-auto">
                                {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                {item.created}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyTrigger1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    {userRole?.user_role === "Owner" ||
                    userRole?.user_module_access[5]["Triggers"] === "WRITE" ? (
                      <div
                        onClick={() => {
                          setChartState({ ...chartState, trigger: true });
                        }}
                        className="d-flex align-items-center cursor-pointer mb-1 mt-1"
                      >
                        <Image src="/create.svg" width="24" height="24" className="me-1" />
                        <h6 className="dblue f-14 bold mb-0 ms-2">New trigger</h6>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center cursor-pointer mb-1 mt-1">
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip className="mt-3" id="tooltip-engine">
                              You didn&apos;t have access to this feature
                            </Tooltip>
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              alt="add user"
                              src="/newicons/disabled-plus-icon.svg"
                              width="29"
                              height="29"
                              className="mt-1 me-2"
                            />
                            <h6 className="f-14 bold mb-0 mt-1" style={{ color: "#D4D4D4" }}>
                              New trigger
                            </h6>
                          </div>
                        </OverlayTrigger>
                      </div>
                    )}
                    <div>
                      {projectData.chart_triggers.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/triggers`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
            {/* Dashboards Information */}
            {userRole?.user_role === "Owner" ||
            userRole?.user_module_access[6]["Dashboards"] !== "NONE" ? (
              <div className="col-md-4 mb-3">
                <Card className="detail-card summary-9">
                  <Card.Header
                    style={{ borderRadius: 12 }}
                    className="d-flex bg-white justify-content-between align-items-center border-0 mb-2 mt-3"
                  >
                    <div className="d-flex">
                      <Image
                        src="/newicons/dashboard.svg"
                        alt="dashboards"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <h6 className="detail-title">Dashboards</h6>
                    </div>
                    <h6 className="last-updated me-2 ms-auto">Created on</h6>
                  </Card.Header>
                  <Card.Body
                    style={{ height: 225 }}
                    className={
                      projectData.dashboards.length === 0
                        ? "p-0 d-flex justify-content-center align-items-center"
                        : "p-0"
                    }
                  >
                    <div className="d-flex flex-column">
                      {projectData.dashboards.length !== 0 ? (
                        projectData?.dashboards
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.created).getTime() - new Date(a.created).getTime()
                          )
                          .map((item: any, index: number) => (
                            <Link
                              key={index}
                              href={`/projects/${project_id}/dashboards/${item.id}`}
                            >
                              <a className="text-decoration-none">
                                <div
                                  style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white" }}
                                  className="d-flex align-items-center px-4"
                                >
                                  <p className="mini-heading-1 ms-0 my-1 overflow-hidden overflow-whitespace">
                                    {item.name}
                                  </p>
                                  <p className="mini-heading-2 my- ms-auto">
                                    {/* {Moment(item.created).format("MM/DD/YYYY, HH:MM A")} */}
                                    {item.created}
                                  </p>
                                </div>
                              </a>
                            </Link>
                          ))
                      ) : (
                        <div>
                          <Image
                            src="/assets/icons/summary/emptyDashboard1.svg"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer
                    style={{ borderRadius: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    className="detail-card-footer align-items-center df1 justify-content-between text-center"
                  >
                    <div>
                      {userRole?.user_role === "Owner" ||
                      userRole?.user_module_access[6]["Dashboards"] === "WRITE" ? (
                        <Link href={`/projects/${projectData?.id}/dashboards/create`}>
                          <div className="d-flex align-items-center cursor-pointer mt-1 mb-1">
                            <Image src="/create.svg" width="24" height="24" className="me-2" />
                            <h6 className="f-14 bold mb-0 ms-2" style={{ color: "#0076FF" }}>
                              New dashboard
                            </h6>
                          </div>
                        </Link>
                      ) : (
                        <div className="d-flex align-items-center cursor-pointer mt-1 mb-1">
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip className="mt-3" id="tooltip-engine">
                                You didn&apos;t have access to this feature
                              </Tooltip>
                            }
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                alt="add user"
                                src="/newicons/disabled-plus-icon.svg"
                                width="29"
                                height="29"
                                className="mt-1 me-2"
                              />
                              <h6 className="f-14 bold mb-0 mt-1" style={{ color: "#D4D4D4" }}>
                                New dashboard
                              </h6>
                            </div>
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                    <div>
                      {projectData.dashboards.length === 0 ? (
                        <a className="d-flex" style={{ cursor: "default" }}>
                          <h6 className="bold f-14 mb-0 dgrey">View all</h6>
                          <ArrowRight className="ms-2" color={"#F0F0F0"} width="18" height="18" />
                        </a>
                      ) : (
                        <Link href={`/projects/${project_id}/dashboards`}>
                          <a className="d-flex">
                            <h6 className="bold f-14 mb-0 dblue">View all</h6>
                            <ArrowRight className="ms-2" color={"#0076FF"} width="18" height="18" />
                          </a>
                        </Link>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ) : null}
          </div>
          <CreateProject
            createProject={createProject}
            setCreateProject={setCreateProject}
            projectsMutate={projectMutate}
          />
          <CreateJupiter
            createJupiter={createJupiter}
            setCreateJupiter={setCreateJupiter}
            projectsMutate={projectMutate}
          />
          <TriggersModal
            triggersMutate={projectMutate}
            queriesStates={chartState}
            setQueriesStates={setChartState}
          />
        </div>
      )}
    </>
  );
};
export default ProjectSummary;
