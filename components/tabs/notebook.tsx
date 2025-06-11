//react
import React, { FC } from "react";
import { Button, Image, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
// components
import { ListTable } from "components/data-tables";
import { CreateJupiter } from "components/modals";
// import { ProjectsService } from "services";
// import { toast } from "react-toastify";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { useRouter } from "next/router";
import { ToolTip } from "@components/tooltips";
import { checkRole } from "@constants/common";
// const projectsAPI = new ProjectsService();

interface IQueriesProps {
  notebookData: any;
  notebookMutate: any;
}

const Notebooks: FC<IQueriesProps> = (props) => {
  const { notebookData, notebookMutate } = props;
  // projectsAPI
  //   .getProjectData(project_id)
  //   .then((response) => {
  //     setToken(response.token);
  //   })
  //   .catch((error: any) => {
  //     toast.error(error);
  //   });

  // const { data: projectData, mutate: projectMutate }: any = useRequest({
  //   url: `api/projects/${project_id}/`,
  // });s
  // console.log(token);
  // // project summary
  // const { data: projectData, mustate: projectMutate }: any = useRequest({
  //   url: `http://3.108.4.113:8888/tree/projects/${token}/notebooks`,
  // });

  // const [queriesStates, setQueriesStates] = React.useState({ name: "", id: 0, trigger: false });
  const router = useRouter();
  const { project_id } = router.query;
  const [createJupiter, setCreateJupiter] = React.useState(false);
  const [search, setSearch]: any = React.useState("");

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const data1 = {
    nodes: notebookData?.filter((item: any) =>
      item.notebook_name.toLowerCase().includes(search.toLowerCase())
    ),
  };
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  // columns data
  const columns = [
    {
      // Notebook name
      name: "NAME",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "notebook_name",
    },
    // {
    //   // project name
    //   name: "CREATED BY",
    //   sortable: true,
    //   center: false,
    //   selector: "created_by",
    // },

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
      // Notebook link
      name: "ACTION",
      sortable: true,
      center: false,
      selector: "notebook_url",

      cell: (row: any) => (
        <button
          onClick={() => {
            window.open(row.notebook_url);
          }}
          id={row.notebook_url}
          className="btn btn-outline-primary text-center f-14"
        >
          View notebook
        </button>
        // <Link href={``}>
        //   <a className="text-decoration-none">
        //     <Button
        //       className="f-14 ms-2"
        //       variant="outline-primary"
        //       onClick={() => {
        //         window.open(row.notebook_url);
        //       }}
        //       id={row.notebook_url}
        //     >
        //       Open Notebook
        //     </Button>
        //   </a>
        // </Link>
      ),

      // cell: (row: any) => (
      //   // <Link href={row.notebook_url}>
      //     {/* onClick={window.open(row.notebook_url)} */}
      //     {/* <a className="text-decoration-none">
      //       <div className="df1 link-text text-dark"> */}
      //         <Button
      //           className="mb-0 font-weight-bold"
      //           onClick={() => {
      //             window.open(row.notebook_url);
      //           }}
      //         >
      //           {row.notebook_url}
      //         </Button>
      //       {/* </div>
      //     </a> */}
      //   // </Link>
      // ),
    },
  ];
  hotkeys("enter", function () {
    document?.getElementById("notebook-button")?.click();
  });
  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-between">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Notebooks</h4>
          <p className="mt-1 f-16 opacity-75">
            Use the integrated notebook-style environment to extend your analysis using either
            Python or R.
          </p>
        </div>

        <div className="ms-auto">
          <input
            className="form-control search mt-4"
            type="text"
            placeholder="Search "
            aria-label="Search"
            onChange={handleSearch}
          />
        </div>
        <div className="ms-3 mt-4">
          <ToolTip
            position={"bottom"}
            visible={!checkRole(userRole, "notebook")}
            style={{ left: "-4%" }}
            text="You didn't have access to this feature"
            element={() => (
              <Button
                id="notebook-button"
                onClick={() => {
                  if (checkRole(userRole, "notebook")) {
                    setCreateJupiter(!createJupiter);
                  }
                }}
                className={
                  "ls text-nowrap " + (checkRole(userRole, "notebook") ? "" : "disable-btn")
                }
                variant={checkRole(userRole, "notebook") ? "outline-primary" : "light"}
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New notebook
                </div>
              </Button>
            )}
          />
        </div>
      </div>
      {!notebookData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[2]["Notebook"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image src="/notebook.svg" alt="create chart" width="70" height="80" className="me-1" />
            <h6 className="fw-bold f-14 mt-2 noneaccess">You didn&apos;t have access to this feature</h6>
          </div>
        </>
      ) : (
        userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[3]["Notebook"] === "NONE" ? (
          <>
            <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
              <Image
                src="/notebook.svg"
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
            notebookData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {notebookData?.length > 0 ? (
            <div className="projects-container-p">
              <ListTable columns={columns} data={data1.nodes} />
            </div>
          ) : (
            <>
              <Image
                src="/notebook.svg"
                alt="create notebook"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No notebooks available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first notebook</p>
              {userRole?.user_role === "Owner" ||
              userRole?.user_module_access[2]["Notebook"] === "WRITE" ? (
                <Button
                  className="cursor-pointer text-white text-center ls"
                  onClick={() => {
                    setCreateJupiter(!createJupiter);
                  }}
                  style={{ color: "#0076FF", width: 190 }}
                >
                  New notebook
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
                    <div className="d-flex w-100 align-items-center">Create notebook</div>
                  </Button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      )}

      <CreateJupiter
        createJupiter={createJupiter}
        setCreateJupiter={setCreateJupiter}
        projectsMutate={notebookMutate}
      />
    </div>
  );
};
export default Notebooks;
