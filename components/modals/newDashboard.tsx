// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react-bootstrap
import { Modal } from "react-bootstrap";
// loadash
import _ from "lodash";
// button loader
import Button from "react-bootstrap-button-loader";
// react select
// import Select from "react-select";
import CreatableSelect from "react-select/creatable";
// toast
import { toast } from "react-toastify";
// services
import { DashboardService } from "services";
//toast configuration
toast.configure();
// service instances
// const chartService = new ChartService();
const dashboardService = new DashboardService();

interface INewQueryProps {
  newState: any;
  setNewState: any;
}
const NewChart: FC<INewQueryProps> = (props) => {
  const { newState, setNewState } = props;
  const router = useRouter();

  const { project_id, edit } = router.query;

  const [selectedDashboard, setSelectedDashboard]: any = React.useState([]);

  const [allDashboards, SetAllDashboards] = React.useState<any>([]);

  const [newDashboard, setNewDashboard] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");

  const { data: dashboardsData }: any = useRequest({
    url: `api/projects/${project_id}/limiteddashboards/`,
  });

  React.useEffect(() => {
    if (dashboardsData) {
      const newArr1 = dashboardsData?.map((item: any) => {
        item["field"] = item.name;
        item["label"] = item.name;
        item["value"] = item.name;
        return item;
      });
      SetAllDashboards(newArr1);
    }
  }, [dashboardsData]);

  // const addQuery = (e: any) => {
  //   console.log(e);
  //   // setSelectedChart(allChart[e.target.value]);
  //   setSelectedDashboard(e);
  // };

  const updateDashboardChart = (chartId: any, index: any, tempData: any) => {
    // const data = _.filter(sizeParams, (o) => o.id == index);
    const data = tempData[index];
    const newObj = {
      height: parseInt(data.height, 10),
      width: parseInt(data.width, 10),
      position_x: data.position_x,
      position_y: data.position_y,
    };

    dashboardService
      .updateDashboardChart(chartId, newObj)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const components = {
    DropdownIndicator: null,
  };

  const getDashboardDetail = async (dashboard_id: any) => {
    setLoading(true);
    dashboardService
      .getDashboard(dashboard_id)
      .then((res: any) => {
        const selected = res.charts;
        const ids = _.map(selected, "chart.id");
        if (ids.includes(Number(edit))) {
          setNewState({ ...newState, dashboard: false });
          setSelectedDashboard([]);
          toast.error("This chart has already been added to the dashboard !!!");
          setLoading(false);
        } else {
          selected.push({
            extra: null,
            height: 500,
            chart: { id: Number(edit) },
            position_x: 20,
            position_y: 10,
            width: 500,
          });
          const data = {
            name: res.name,
            description: res.description,
            project: project_id,
            charts: _.map(selected, "chart.id"),

            extra: {
              thumbnail: res.extra.thumbnail,
              backgroundColor: res.extra.backgroundColor,
              description: res.extra.description,
              titleVisible: res.extra.titleVisible,
              root: "fromaddtodash",
            },
          };
          dashboardService
            .updateDashboard(res.id, data)
            .then((res) => {
              _.map(res.charts, (o, index) => {
                updateDashboardChart(o.id, index, selected);
              });
              setNewState({ ...newState, dashboard: false });
              // setSelectedDashboard([]);
              router.push(`/projects/${project_id}/dashboards/${res.id}`).then(() => {
                // window.location.reload();
                toast.success("Chart added to dashboard successfully", { autoClose: 3000 });
              });
            })
            .catch((error: any) => {
              setLoading(false);
              alert(error);
            });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        alert(error);
      });
  };

  const handleChange = (newValue: any) => {
    if (newValue) {
      if (newValue.id) {
        setSelectedDashboard(newValue);
      } else {
        setNewDashboard(true);
        setSelectedDashboard(newValue);
        setName(newValue.value);
      }
    }

    // const data: any = [];
    // for (let i = 0; i < newValue.length; i++) {
    //   if (isValid(newValue[i].value)) {
    //     data.push(newValue[i]);
    //   }
    // }
    // setTriggerState({ ...triggerState, email: data });
  };

  const createNew = () => {
    setLoading(true);
    const data = {
      backgroundColor: "#fbfbfb",
      charts: [Number(edit)],
      description: "",
      name: name.charAt(0).toUpperCase() + name.slice(1).trim(),
      extra: {
        thumbnail: "",
        backgroundColor: "#fbfbfb",
        description: "",
        titleVisible: "",
        root: "fromaddtodash",
      },
    };
    const selected = [
      {
        extra: {
          thumbnail: "res.extra.thumbnail",
          backgroundColor: "green",
          description: "",
          titleVisible: "",
        },
        height: 500,
        chart: { id: Number(edit) },
        position_x: 20,
        position_y: 10,
        width: 500,
      },
    ];
    dashboardService
      .createDashboard(project_id, data)
      .then((res: any) => {
        _.map(res.charts, (o, index) => {
          updateDashboardChart(o.id, index, selected);
        });
        setNewState({ ...newState, dashboard: false });
        router.push(`/projects/${project_id}/dashboards/${res.id}`).then(() => {
          toast.success("Chart added to dashboard successfully", { autoClose: 3000 });
        });
      })
      .catch((err) => {
        setNewState({ ...newState, dashboard: false });
        setLoading(false);
        toast.error(err, { autoClose: 3000 });
      });
  };

  return (
    <Modal
      show={newState?.dashboard}
      onHide={() => {
        setName("");
        setNewDashboard(false);
        setNewState({ ...newState, dashboard: false });
        setSelectedDashboard([]);
      }}
      size="sm"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="justify-content-between align-items-center">
        <Modal.Title className="mt-0 mb-0 f-18" style={{ color: "#495968", fontWeight: 600 }}>
          Add to dashboard
        </Modal.Title>
        {/* {edit ? (
          <div className="d-flex flex-column">
            <Button onClick={createNew} className="text-white f-14 rounded-3">
              <Image
                src="/create1.svg"
                alt="create new project"
                width="22"
                height="22"
                className="me-2"
              />
              Create new
            </Button>
          </div>
        ) : null} */}
      </Modal.Header>
      <Modal.Body className="mt-3">
        {/* <div className="d-flex">Select query:</div> */}
        <CreatableSelect
          escapeClearsValue
          components={components}
          isClearable
          isMulti={false}
          onChange={handleChange}
          options={allDashboards}
          noOptionsMessage={() => null}
          // value={selectedDashboard}
          placeholder="Select dashboard or Create new"
          style={{ height: 48, color: "#485255", opacity: 0.8 }}
          className="f-12 ls"
        />
        <div className="d-flex mt-3">
          {/* <Select
            className="w-100"
            classNamePrefix="select a dashboard"
            placeholder="Select a dashboard"
            value={selectedDashboard}
            options={allDashboards}
            name="color"
            onChange={addQuery}
          /> */}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
        {/* <Link href={`/projects/${project_id}/chart/create/${selectedQuery?.id}`}>
          <Button className="text-white" disabled={selectedQuery.length === 0}>
            New Chart
          </Button>
        </Link> */}
        <button
          className="btn ms-3 bg-white"
          onClick={() => {
            setName("");
            setNewDashboard(false);
            setNewState({ ...newState, dashboard: false });
            setSelectedDashboard([]);
          }}
        >
          Cancel
        </button>
        {selectedDashboard.length === 0 ? (
          <Button
            // loading={inviteLoader}
            variant="light"
            type="button"
            // onClick={sendInvitation}
            style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
            className="f-17 text-center"
          >
            Add
          </Button>
        ) : (
          <Button
            loading={loading}
            variant="primary"
            type="button"
            onClick={() => {
              if (newDashboard) {
                createNew();
              } else {
                getDashboardDetail(selectedDashboard.id);
              }
            }}
            style={{ opacity: 0.9, width: 117 }}
            className="text-white f-17 text-center"
          >
            Add
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default NewChart;
