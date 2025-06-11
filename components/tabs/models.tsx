import React, { FC } from "react";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
// momentP
// import Moment from "moment";
// components
import { ListTable } from "components/data-tables";
import { ModelMenu } from "components/menu";
import { NewModel } from "components/modals";
// services
import { ModelService } from "services";
// toast
import { toast } from "react-toastify";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { Spinner } from "react-bootstrap";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";
import { ToolTip } from "@components/tooltips";
import { checkRole } from "@constants/common";

const model = new ModelService();

interface IModelsProps {
  progressM?: any;
  modelsData: any;
  modelsMutate: () => void;
  project_id: any;
  setSearch: any;
  search: any;
}

const Models: FC<IModelsProps> = (props) => {
  const { progressM, modelsData, modelsMutate, project_id, setSearch, search } = props;
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const handleSearch = (event: any) => {
    setSearch(event.target.value);

    // if (event.target.value.length <= 3) {
    //   setSearch(event.target.value);
    // }
  };

  // const data1 = {
  //   nodes: modelsData?.filter((item: any) =>
  //     item.name.toLowerCase().includes(search.toLowerCase())
  //   ),
  // };
  const columns = [
    {
      // connection name
      name: "NAME",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "name",
    },
    {
      // connection name
      name: "MODEL TYPE",
      sortable: true,
      center: false,
      selector: "extra.modelling",
      style: { cursor: "auto" },
    },
    {
      // connection name
      name: "ALGORITHM NAME",
      sortable: true,
      center: false,
      cell: (row: any) => {
        if (row.extra.modelling !== "Timeseries") {
          return (
            row.other_params.model_type?.substring(0, 1).toUpperCase() +
            row.other_params.model_type.substring(1).replace(/_/g, " ")
          );
        }
        // return row.other_params.model_type;
      },
      style: { cursor: "auto" },
    },
    // {
    //   // connection name
    //   name: "QUERY",
    //   sortable: true,
    //   center: false,
    //   selector: "other_params.query_name",
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
      // option - menu
      name: "OPTIONS",
      center: true,
      width: "10%",
      // style: { cursor: "auto" },
      cell: (row: any) => <ModelMenu row={row} deleteModel={deleteModel} userRole={userRole} />,
    },
  ];

  const deleteModel = async (id: any) => {
    model
      .deleteModel(project_id, id)
      .then(() => {
        toast.success("Model deleted");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
    modelsMutate();
  };
  hotkeys("enter", function () {
    document?.getElementById("model-button")?.click();
  });
  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-between">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Models</h4>
          <p className="mt-1 mb-0 f-16 opacity-75">
            Easily apply models to your project with an interface guiding you through the
            preprocessing, model
          </p>
          <p className="f-16 opacity-75">selection, and model execution stages.</p>
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
            visible={!checkRole(userRole, "models")}
            style={{ left: "-15%" }}
            text="You didn't have access to this feature"
            element={() => (
              <Button
                id="model-button"
                onClick={() => {
                  if (checkRole(userRole, "models")) {
                    setNewState({ ...newState, model: true });
                  }
                }}
                className={"ls text-nowrap " + (checkRole(userRole, "models") ? "" : "disable-btn")}
                variant={checkRole(userRole, "models") ? "outline-primary" : "light"}
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New model
                </div>
              </Button>
            )}
          />
        </div>
      </div>

      {!modelsData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[3]["Models"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/assets/icons/summary/emptyModel.svg"
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
        userRole?.user_module_access[4]["Models"] === "NONE" ? (
          <>
            <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
              <Image
                src="/assets/icons/summary/emptyModel.svg"
                alt="create chart"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">You didn&apos;t have access to this feature</h6>
            </div>
          </>
        ) :
        <div
          className={`p-0 d-flex ${
            modelsData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {modelsData?.length > 0 ? (
            <div className="projects-container-p">
              <ListTable progress={progressM} columns={columns} data={modelsData} />
            </div>
          ) : (
            <>
              <Image
                src="/assets/icons/summary/emptyModel.svg"
                alt="create model"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No models available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first model</p>
              {userRole?.user_role === "Owner" ||
              userRole?.user_module_access[3]["Models"] === "WRITE" ? (
                <Button
                  className="cursor-pointer text-white text-center ls"
                  onClick={() => {
                    setNewState({ ...newState, model: true });
                  }}
                  style={{ color: "#0076FF", width: 190 }}
                >
                  New model
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
                    <div className="d-flex w-100 align-items-center">Create model</div>
                  </Button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      )}

      {/* <div className="projects-container-p">
        <ListTable progress={progressM} columns={columns} data={modelsData} />
      </div> */}
      <NewModel newState={newState} setNewState={setNewState} />
    </div>
  );
};
export default Models;
