//react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
import { Button, Image } from "react-bootstrap";
// services
import { TriggerService } from "services";
// components
import { Spinner } from "react-bootstrap";

import { ListTable } from "components/data-tables";
import { TriggersMenu } from "components/menu";
import { TriggerDetails, TriggersModal } from "components/modals";
// lodash
import _ from "lodash";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
import hotkeys from "hotkeys-js";
import { useRequest } from "@lib/hooks";

//toast configuration
toast.configure();

const Trigger = new TriggerService();

interface ITriggersProps {
  chartTriggerData: any;
  chartTriggerMutate: any;
  setSearch: any;
  search: any;
}

const Triggers: FC<ITriggersProps> = (props) => {
  const { chartTriggerData, chartTriggerMutate, setSearch, search } = props;

  const router = useRouter();
  const { project_id } = router.query;
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const [detailsState, setDetailsState] = React.useState({ id: 0, viewtrigger: false });

  const [chartState, setChartState] = React.useState({
    name: "",
    id: 0,
    trigger: false,
    query: 0,
  });
  // const [newState, setNewState] = React.useState({
  //   query: false,
  //   model: false,
  //   chart: false,
  //   chartTrigger: false,
  //   connection: false,
  //   invite: false,
  // });
  const [viewTriggerState, setViewTriggerState] = React.useState({
    disabled: true,
    id: 0,
    name: "",
    chartName: "",
    description: "",
    minute: "*",
    hour: "*",
    day_of_week: "*",
    day_of_month: "*",
    month_of_year: "*",
    update: false,
    tab: "hourly",
    radioHour: "",
    radioMinute: "",
    radioMonth: "",
    radioDaily: "",
    users: [],
    email: [],
    months: [],
    weeks: [] as any,
    periodicTask: 0,
    minDisable: true,
    hrDisable: true,
    everyMonthDisable: true,
    specificMonthDisable: true,
    defaultEveryDayTime: "0:0",
    defaultEveryWeekDayTime: "0:0",
    defaultEveryWeekEndTime: "0:0",
    defaultWeeklyTime: "0:0",
    defaultEveryMonthTime: "0:0",
    defaultSpecificMonthTime: "0:0",
    evrydayField: true,
    weekdayField: true,
    weekendField: true,
    frequency: "",
  });

  const updateTrigger = () => {
    if (viewTriggerState.name === "") {
      alert("Workflow Name cannot be empty");
    } else {
      setViewTriggerState({
        ...viewTriggerState,
        disabled: true,
        update: true,
      });
      setDetailsState({ ...detailsState, viewtrigger: false });
      Trigger.updateChartTrigger(viewTriggerState.id, {
        chart: detailsState.id,
        name: viewTriggerState.name,
        email: _.map(viewTriggerState.email, "value"),
        description: viewTriggerState.description,
        cron_expression: {
          minute: viewTriggerState.minute,
          hour: viewTriggerState.hour,
          day_of_week: viewTriggerState.day_of_week,
          day_of_month: viewTriggerState.day_of_month,
          month_of_year: viewTriggerState.month_of_year,
        },
        extra: viewTriggerState,
        timezone: "UTC",
        project: Number(project_id),
        periodic_task: viewTriggerState.periodicTask,
      })
        .then(() => {
          setViewTriggerState({
            ...viewTriggerState,
            name: "",
            description: "",
            radioHour: "",
            radioMinute: "",
            radioMonth: "",
            email: [],
            weeks: [],
            months: [],
            update: false,
            disabled: true,
          });
          setDetailsState({ ...detailsState, viewtrigger: false });
          toast.success("Trigger updated");
          chartTriggerMutate();
        })
        .catch(() => {
          setViewTriggerState({
            ...viewTriggerState,
            update: false,
          });
          setDetailsState({ ...detailsState, viewtrigger: false });
          toast.error("Error in updating trigger");
        });
    }
  };

  const deleteTrigger = (triggerId: any) => {
    Trigger.deleteChartTrigger(triggerId)
      .then(() => {
        toast.success("Trigger deleted successfully");
        chartTriggerMutate();
      })
      .catch(() => {
        toast.error("Error deleting trigger");
      });
  };

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  // const data1 = {
  //   nodes: chartTriggerData?.filter((item: any) =>
  //     item.name.toLowerCase().includes(search.toLowerCase())
  //   ),
  // };

  const columns = [
    {
      // connection name
      name: "NAME",
      sortable: true,
      center: false,
      selector: "name",
      style: { cursor: "auto" },
      // cell: (row: any) => (
      //   <a className="text-decoration-none">
      //     <div className="df1">
      //       <p
      //         className="mb-0"
      //         style={{
      //           // fontFamily: "Metropolis",
      //           fontSize: 14,
      //           fontStyle: "normal",
      //           letterSpacing: 0.1,
      //           color: "#707683",
      //         }}
      //         onClick={() => {
      //           const newArr: any = [];

      //           _.map(row.email, (item) => {
      //             const obj: any = {};
      //             obj["label"] = item;
      //             obj["value"] = item;

      //             newArr.push(obj);
      //           });
      //           let a: any = [];
      //           a = row?.cron_expression.month_of_year.split(",");
      //           const b: any = [];
      //           months?.map((item: any) => {
      //             if (a.includes(item.value)) {
      //               b.push(item);
      //             }
      //           });
      //           setViewTriggerState({
      //             ...viewTriggerState,
      //             email: newArr,
      //             id: row?.id,
      //             name: row?.name,
      //             chartName: row?.chart_name,
      //             frequency: row?.extra.frequency,
      //             description: row?.description,
      //             minute: row?.cron_expression.minute,
      //             hour: row?.cron_expression.hour,
      //             day_of_week: row?.cron_expression.day_of_week,
      //             day_of_month: row?.cron_expression.day_of_month,
      //             month_of_year: row?.cron_expression.month_of_year,
      //             periodicTask: row?.periodic_task,
      //             tab: row?.extra?.tab,
      //             radioHour: row?.extra?.radioHour,
      //             radioMinute: row?.extra?.radioMinute,
      //             radioMonth: row?.extra?.radioMonth,
      //             radioDaily: row?.extra?.radioDaily,
      //             users: row?.extra?.users,
      //             weeks: row?.cron_expression?.day_of_week.split(","),
      //             months: b,
      //             minDisable: row?.extra?.minDisable,
      //             hrDisable: row?.extra?.hrDisable,
      //             everyMonthDisable: row?.extra?.everyMonthDisable,
      //             specificMonthDisable: row?.extra?.specificMonthDisable,
      //             defaultEveryDayTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             defaultEveryWeekDayTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             defaultEveryWeekEndTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             defaultWeeklyTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             defaultEveryMonthTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             defaultSpecificMonthTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      //             evrydayField: row?.extra?.evrydayField,
      //             weekdayField: row?.extra?.weekdayField,
      //             weekendField: row?.extra?.weekendField,
      //           });
      //           setDetailsState({
      //             ...detailsState,
      //             id: row.chart,
      //             viewtrigger: true,
      //           });
      //         }}
      //       >
      //         {row.name}
      //       </p>
      //     </div>
      //   </a>
      // ),
    },
    {
      // connection name
      name: "CHART NAME",
      sortable: true,
      center: false,
      selector: "chart_name",
      style: { cursor: "auto" },
    },
    {
      // connection name
      name: "FREQUENCY",
      sortable: true,
      center: false,
      selector: "frequency",
      style: { cursor: "auto" },
      cell: (row: any) => {
        return <>{row.extra.frequency?.charAt(0).toUpperCase() + row.extra.frequency?.slice(1)}</>;
      },
    },
    {
      // connection name
      name: "CREATED BY",
      sortable: true,
      center: false,
      // width: '100px',
      selector: "created_by",
      style: { cursor: "auto" },
      cell: (row: any) => {
        return (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.email}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.email}
              </p>
            </OverlayTrigger>
          </>
        );
      },
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
      cell: (row: any) => (
        <TriggersMenu
          row={row}
          deleteTrigger={deleteTrigger}
          detailsState={detailsState}
          setDetailsState={setDetailsState}
          viewTriggerState={viewTriggerState}
          setViewTriggerState={setViewTriggerState}
          userRole={userRole}
        />
      ),
    },
  ];
  hotkeys("enter", function () {
    document?.getElementById("create-button")?.click();
  });
  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-between">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Triggers</h4>
          <p className="mt-1 f-16 opacity-75">
            Set triggers to update charts, reports, and dashboards with real-time data.
          </p>
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
        {userRole?.user_role === "Owner" ||
        userRole?.user_module_access[5]["Triggers"] === "WRITE" ? (
          <div className="ms-3 mt-4">
            <Button
              id="create-button"
              onClick={() => {
                setChartState({ ...chartState, trigger: true });
              }}
              variant="outline-primary"
              className="f-14 ls"
            >
              <div className="d-flex w-100 align-items-center">
                <PlusCircle className="me-2" width={24} height={24} />
                New trigger
              </div>
            </Button>
          </div>
        ) : (
          <div className="ms-3 mt-4">
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
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={24} height={24} />
                  New trigger
                </div>
              </Button>
            </OverlayTrigger>
          </div>
        )}

        {/* <div>
          <Button
            onClick={() => {
              setNewState({ ...newState, chartTrigger: true });
            }}
            className="f-14"
            variant="outline-primary"
          >
            New Trigger
          </Button>
        </div> */}
      </div>

      {!chartTriggerData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[5]["Triggers"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/assets/icons/summary/emptyTrigger.svg"
              alt="create chart"
              width="70"
              height="80"
              className="me-1"
            />
            <h6 className="fw-bold f-14 mt-3 noneaccess">
              You didn&apos;t have access to this feature
            </h6>
          </div>
        </>
      ) : (
        <div
          className={`p-0 d-flex ${
            chartTriggerData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {chartTriggerData?.length > 0 ? (
            <div className="projects-container-p">
              <ListTable columns={columns} data={chartTriggerData} />
            </div>
          ) : (
            <>
              <Image
                src="/assets/icons/summary/emptyTrigger.svg"
                alt="create trigger"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No triggers available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Create your first trigger</p>
              {userRole?.user_role === "Owner" ||
              userRole?.user_module_access[5]["Triggers"] === "WRITE" ? (
                <Button
                  className="text-white f-15 text-center ls"
                  onClick={() => {
                    setChartState({ ...chartState, trigger: true });
                  }}
                  style={{ color: "#0076FF", width: 190 }}
                >
                  New trigger
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
                    <div className="d-flex w-100 align-items-center">New trigger</div>
                  </Button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      )}

      {/* <div className="projects-container-p">
        <ListTable columns={columns} data={chartTriggerData} />
      </div> */}
      <TriggerDetails
        detailsState={detailsState}
        setDetailsState={setDetailsState}
        viewTriggerState={viewTriggerState}
        setViewTriggerState={setViewTriggerState}
        updateTrigger={updateTrigger}
        userRole={userRole}
      />
      {/* <NewChartTrigger newState={newState} setNewState={setNewState} /> */}
      <TriggersModal
        triggersMutate={chartTriggerMutate}
        queriesStates={chartState}
        setQueriesStates={setChartState}
      />
    </div>
  );
};
export default Triggers;
