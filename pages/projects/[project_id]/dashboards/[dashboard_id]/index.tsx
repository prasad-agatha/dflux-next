// react
import React, { FC } from "react";
// react-bootstrap
import {
  Col,
  Modal,
  Form,
  Card,
  Image,
  Dropdown,
  OverlayTrigger,
  Popover,
  Overlay,
  Tooltip,
  InputGroup,
} from "react-bootstrap";
// react bootstrap button loader
import Button from "react-bootstrap-button-loader";
import * as htmlToImage from "html-to-image";

// hooks
import { useRouter } from "next/router";
// next seo
import { NextSeo } from "next-seo";
//external
import { toast } from "react-toastify";
//lodash
import _ from "lodash";
// rnd
import { Rnd } from "react-rnd";
import CreatableSelect from "react-select/creatable";
// d3
import * as d3 from "d3";
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
// services
import { ChartService, DashboardService, ConnectionsService } from "services";
// components
import VisualizationComponent from "@components/charts/visualizationComponent";
import { PageLoader } from "components/loaders";
import { PageLoading } from "components/loaders";
import { MultiSelectAll } from "components/dropdowns";
import { MultiRangeSlider, FilterInput } from "components/forms";
import { useRequest } from "@lib/hooks";

// constants
import {
  dataURLtoFile,
  filter_function,
  format_chartData,
  sort_ascending,
  sort_descending,
  updateChartState,
} from "@components/charts/chart_functions";
import { checkRole } from "constants/common";
import { ToolTip } from "@components/tooltips";
import { ChartSelection } from "@components/modals";
//toast configuration
toast.configure();
// service instances
const chartService = new ChartService();
const dashboardService = new DashboardService();
const connections = new ConnectionsService();

const EditDashboard: FC = () => {
  const router = useRouter();
  // id's
  const { project_id, dashboard_id } = router.query;
  if (!project_id && !dashboard_id) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  const { data: dashboardData } = useRequest({
    url: `api/projects/${project_id}/limiteddashboards/`,
  });
  const [divbackgroundColor, setBackgroundColor] = React.useState<any>();

  const [dashboardFilters, setDashboardFilters] = React.useState([] as any);

  const [allCharts, setAllCharts] = React.useState([]);
  // const [showUpdate, setshowUpdate] = React.useState(false);
  const [viewDashboardStates, setViewDashboardStates] = React.useState({
    // allCharts: [],
    selectChart: false,
    selectedChart: [] as any,
    selected: [] as any,
    // publish: false,
    publishLoader: false,
    // editTitle: false,
    // editDesc: false,
    // title: "",
    // description: "",
    shareLoader: false,
  });
  const [chartState, setChartState] = React.useState({
    showLegend: true,
    showLabel: false,
    type: "",
    dimension: [],
    measures: [],
    tableData: [],
    tableHeads: [],
    dimensionData: [],
    fullScreen: false,
    item: { chart: { name: "" } },
    index: 0,
  });
  const [edit, setEdit] = React.useState(true);
  // charts selected into dashboard
  const [selectedChart, setSelectedChart]: any = React.useState([]);
  // old charts selected
  const [selected, setSelected]: any = React.useState<any>([]);
  // base url
  const [editdashboardTitle, setEditDashboardTitle] = React.useState(false);
  const [dashboardTitle, setDashboardTitle] = React.useState<any>();
  // const [lastUpdated, setLastUpdated] = React.useState<any>();
  const [dashboardDescription, setDashboardDescription] = React.useState<any>();
  const [dashboardDetails, setDashboardDetails] = React.useState<any>();

  const [render, setRender] = React.useState(false);
  // const [d3Data, setD3Data] = React.useState<any>({});
  const [toolTip, setToolTip] = React.useState([]) as any;

  // const [showNav, setShowNav] = React.useState(false);
  const [titleVisible, setTitleVisible] = React.useState(false);
  const [desc, setDesc] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [targetSettings, setTargetSettings] = React.useState(null);
  const [error, setError] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  const [errorMessage, setErrorMessage] = React.useState("");
  const [triggerState, setTriggerState] = React.useState({
    email: [],
    users: [],
  });
  const [text, setText] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState<any>();
  const [fromaddtodash, setFromaddtodash] = React.useState("");
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("background-color", " #313639")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("border-radius", "8px")
    .style("color", "#f9f9f9")
    .style("padding", "0.5rem")
    .style(" font-size", "0.7rem")
    .style(" text-align", "center")
    .style("pointer-events", "none")
    .style("text-transform", "capitalize");
  // email validation
  const isValid = (email: any) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  };
  const components = {
    DropdownIndicator: null,
  };
  const handleChange = (newValue: any) => {
    const data: any = [];
    for (let i = 0; i < newValue.length; i++) {
      if (isValid(newValue[i].value)) {
        data.push(newValue[i]);
      }
    }
    setTriggerState({ ...triggerState, email: data });
  };
  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };
  const handleClickSettings = (event: any) => {
    setShowSettings(!showSettings);
    setTargetSettings(event.target);
  };

  const getDashboardDetail = async () => {
    dashboardService
      .getDashboard(dashboard_id)
      .then((res: any) => {
        setDashboardDetails({
          title: res.name,
          bgColor: res?.extra.backgroundColor,
          description: res.extra.description,
          charts: _.map(res.charts, "chart.id"),
        });
        setDashboardTitle(res.name);
        // setLastUpdated(res.updated);
        setFromaddtodash(res.extra.root);
        setDashboardDescription(res.description);
        setBackgroundColor(res?.extra.backgroundColor);
        setDesc(res.extra.description);
        setThumbnail(res.extra.thumbnail);
        // setEdit(res.extra.edit);
        setSelected(res.charts);
        const temp1: any = [];
        const b: any = _.map(res?.charts, "chart");
        const newSelected = b?.map((item: any, index: any) => {
          const queryData =
            item.save_from === "query" ? item?.query?.extra?.data : item?.extra.data;
          const filters1 = [
            ...item.extra.filters.dropdown,
            ...item.extra.filters.textBox.filter((el: any) => el.filterInput !== ""),
            ...item.extra.filters.slider,
          ];
          const tempData: any = filter_function(
            [...queryData].splice(0, queryData.length),
            filters1,
            item.extra.dimension,
            item.extra.measures,
            item.extra.aggregate
          );
          if (item.extra.ascending) {
            tempData.sort(
              sort_ascending(item.extra.sortingField, true, parseInt, item.extra.ascending)
            );
          } else if (item.extra.descending) {
            tempData.sort(
              sort_descending(item.extra.sortingField, true, parseInt, item.extra.descending)
            );
          }
          const tempData1: any = [];
          tempData.map((item2: any) => {
            const obj: any = {};
            obj[item.extra.dimension[0]] = item2[item.extra.dimension[0]];
            item.extra.measures.map((item1: any) => {
              obj[item1] = item2[item1];
            });
            tempData1.push(obj);
          });
          const heads: any = [];
          const arrTable: any = tempData1?.length > 0 ? Object.keys(tempData1[0]) : [];
          [...arrTable]?.map((item: any, index: any) => {
            return heads.push({
              field: item,
              key: index,
            });
          });
          const dimensionsData = _.map(tempData, item.extra.dimension[0]);
          const measuresData = format_chartData(item.extra.measures, tempData, true, item);
          const { cw, ch, xPosition, yPosition } = getDimensions(index);
          temp1.push({
            index,
            id: item.id,
            filters: item.extra.filters,
            x: xPosition,
            y: yPosition,
            width: cw,
            height: ch,
            aggregate: item.extra.aggregate,
            chartState: updateChartState(
              dimensionsData,
              measuresData,
              item.extra.measures,
              item.chart_type,
              queryData
            ),
            dimensionsData: dimensionsData,
            listTable: heads,
            tableData: tempData1,
          });
          item["field"] = item.name;
          item["label"] = item.name;
          item["value"] = item.name;
          item["aggregate"] = item.extra.aggregate;
          item["width"] = cw;
          item["height"] = ch;
          item["position_x"] = xPosition;
          item["position_y"] = yPosition;
          return item;
        });
        setDashboardFilters(temp1);

        setSelectedChart(newSelected);
        setTitleVisible(res.extra.titleVisible);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllCharts = async () => {
    chartService
      .getProjectCharts(project_id)
      .then((res: any) => {
        const newArr = res?.map((item: any) => {
          item["field"] = item.name;
          item["label"] = item.name;
          item["value"] = item.name;
          return item;
        });
        setAllCharts(newArr);
      })
      .catch(() => {
        toast.error("Error fetching charts list");
      });
  };
  const getDimensions = (index: any) => {
    /* making the cards responsive by calculating width, height and positions of cards
    from main-wrapper div */
    let xPosition = 0,
      yPosition = 0;
    const wrapper = document.getElementsByClassName("main-wrapper") as HTMLCollection;
    const wrapperWidth = wrapper[0].clientWidth - 80;
    const cw = Math.round(wrapperWidth * 0.5) - 7;
    const ch = Math.round((cw * 9) / 16);
    const g = 10;
    if (index % 2 === 0) {
      xPosition = 0;
      yPosition = (ch + g + 70) * (index / 2);
    } else if (index % 2 !== 0) {
      xPosition = cw + g;
      yPosition = ((ch + g + 70) * (index - 1)) / 2;
    }
    return {
      cw,
      ch,
      g,
      xPosition,
      yPosition,
    };
  };
  React.useEffect(() => {
    setToolTip(tooltip);
  }, []);
  React.useEffect(() => {
    getAllCharts();
    shareDashboard1();
    getDashboardDetail();
  }, [dashboard_id]);
  React.useEffect(() => {
    //text
  }, [render]);

  //function for copying to clipboard
  const copyLink = (token: string) => {
    const text = process.env.APP_URL + `shared/dashboard/${dashboard_id}?shr=${token}`;
    const elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);

    toast.success("Copied to clipboard", { autoClose: 3000 });
    setViewDashboardStates({
      ...viewDashboardStates,
      shareLoader: false,
    });
  };

  const copy = (token: string) => {
    const text = process.env.APP_URL + `shared/dashboard/${dashboard_id}?shr=${token}`;
    setText(text);
  };

  const shareDashboard = () => {
    dashboardService
      .shareDashboard(dashboard_id)
      .then((res) => {
        copyLink(res.shared_token);
        copy(res.shared_token);
      })
      .catch();
  };
  const shareDashboard1 = () => {
    dashboardService
      .shareDashboard(dashboard_id)
      .then((res) => {
        copy(res.shared_token);
      })
      .catch();
  };

  const renderDashboard = (charts: any) => {
    const tempArr: any = [];
    _.map(charts, (e: any) => {
      const { index, ...other } = e;
      if (index) {
        //
      }
      tempArr.push(other);
    });

    setSelectedChart(tempArr);
    const temp1: any = [];
    const data = _.map(charts, (o: any, index: any) => {
      const queryData = o.save_from === "query" ? o?.query?.extra?.data : o?.data?.mlData;
      const filters1 = [
        ...o.extra.filters.dropdown,
        ...o.extra.filters.textBox.filter((el: any) => el.filterInput !== ""),
        ...o.extra.filters.slider,
      ];
      const tempData: any = filter_function(
        [...queryData].splice(0, queryData.length),
        filters1,
        o.extra.dimension,
        o.extra.measures,
        o.extra.aggregate
      );
      if (o.extra.ascending) {
        tempData.sort(sort_ascending(o.extra.sortingField, true, parseInt, o.extra.ascending));
      } else if (o.extra.descending) {
        tempData.sort(sort_descending(o.extra.sortingField, true, parseInt, o.extra.descending));
      }
      const tempData1: any = [];
      tempData.map((item: any) => {
        const obj: any = {};
        obj[o.extra.dimension[0]] = item[o.extra.dimension[0]];
        o.extra.measures.map((item1: any) => {
          obj[item1] = item[item1];
        });
        tempData1.push(obj);
      });
      const heads: any = [];
      const arrTable: any = tempData1?.length > 0 ? Object.keys(tempData1[0]) : [];
      [...arrTable]?.map((item: any, index: any) => {
        return heads.push({
          field: item,
          key: index,
        });
      });
      const dimensionsData = _.map(tempData, o.extra.dimension[0]);
      const measuresData = format_chartData(o.extra.measures, tempData, true, o);
      const { cw, ch, xPosition, yPosition } = getDimensions(index);
      temp1.push({
        index,
        id: o.id,
        filters: o.extra.filters,
        x: xPosition,
        y: yPosition,
        width: cw,
        height: ch,
        chartState: updateChartState(
          dimensionsData,
          measuresData,
          o.extra.measures,
          o.chart_type,
          queryData
        ),
        dimensionsData: dimensionsData,
        listTable: heads,
        tableData: tempData1,
      });
      return {
        height: ch,
        width: cw,
        id: o.id ? o.id : null,
        position_x: xPosition,
        position_y: yPosition,
        chart: o,
        filters: o.extra.filter ? o.extra.filters : [],
      };
    });
    setDashboardFilters(temp1);
    setSelected(data);
    // setshowUpdate(true);
    setViewDashboardStates({
      ...viewDashboardStates,
      selectChart: false,
      // publish: true,
    });
  };

  const updateDashboard = () => {
    const node1: any = document?.getElementById("divImage");
    setViewDashboardStates({
      ...viewDashboardStates,
      publishLoader: true,
    });
    const dashboards: any = dashboardData;
    const dashboardNames: any = [];
    _.map(
      _.filter(dashboards, (e: any) => e.id !== Number(dashboard_id)),
      (item: any) => {
        dashboardNames.push(item.name);
      }
    );
    if (!dashboardTitle.trim() || dashboardNames.includes(dashboardTitle)) {
      let toastText = "Dashboard name already exists";
      if (!dashboardTitle.trim()) toastText = "Dashboard name is required";
      toast.error(toastText, { autoClose: 4000 });
      setViewDashboardStates({
        ...viewDashboardStates,
        publishLoader: false,
      });
      return;
    } else if (_.map(selected, "chart.id").length == 0) {
      toast.error("Please add any chart", { autoClose: 4000 });
      setViewDashboardStates({
        ...viewDashboardStates,
        publishLoader: false,
      });
      return;
    }

    htmlToImage.toPng(node1).then(function (dataUrl) {
      const imgData = new FormData();
      const file = dataURLtoFile(dataUrl, `${dashboardTitle}.png`);
      imgData.append("name[]", `dashboard`);
      imgData.append("asset[]", file);

      connections.dumpJSONFile(imgData).then((res: any) => {
        const arr = _.clone(selected);
        _.forEach(dashboardFilters, (e: any, idx: any) => {
          arr[idx].index = e.index;
        });
        const data = {
          name: dashboardTitle,
          description: dashboardDescription,
          project: project_id,
          charts: _.map(_.sortBy(arr, ["index"]), "chart.id"),

          extra: {
            thumbnail: { ...res[0], previous_id: thumbnail?.id || null },
            backgroundColor: divbackgroundColor,
            description: desc,
            titleVisible: titleVisible,
          },
        };

        dashboardService
          .updateDashboard(dashboard_id, data)
          .then((res: any) => {
            // setshowUpdate(true);
            if (res) {
              setViewDashboardStates({
                ...viewDashboardStates,
                // publish: false,
                publishLoader: false,
              });
              setDashboardDetails({
                title: res.name,
                bgColor: res?.extra.backgroundColor,
                description: res.extra.description,
                charts: _.map(res.charts, "chart.id"),
              });
              toast.success("Dashboard Updated", { autoClose: 3000 });
            }
          })
          .catch(() => {
            setViewDashboardStates({
              ...viewDashboardStates,
              publishLoader: false,
            });
          });
      });
    });
  };

  const deleteDashboard = (id: any) => {
    dashboardService
      .deleteDashboard(id)
      .then(() => {
        toast.success("Dashboard deleted successfully", { autoClose: 3000 });
        router.push(`/projects/${project_id}/dashboards/create`);
      })
      .catch((err: any) => {
        toast.error(err.error, { autoClose: 3000 });
      });
  };
  const removeChart = (data: any) => {
    const newSeletedArr = selectedChart.filter((item: any) => item.id !== data.chart.id);
    setSelectedChart(newSeletedArr);
    const newArr = selected.filter((item: any) => item.id !== data.id);
    setSelected(newArr);

    const temp2 = dashboardFilters.filter((item: any) => item.id !== data.id);
    setDashboardFilters(temp2);
    renderDashboard(newSeletedArr);
  };

  const sendInvitation = () => {
    if (triggerState === null || triggerState.email?.length === 0) {
      setError(true);
      setErrorMessage("This field is required");
    } else {
      // setInviteLoader(true);
      dashboardService
        .newSharedDashboard({
          emails: _.map(triggerState.email, "value"),
          name: dashboardTitle,
          url: text,
        })
        .then(() => {
          // setInviteLoader(false);
          setTriggerState({
            ...triggerState,
            email: [],
          });
          setShow(!show);

          toast.success("Dashboard shared successfully", { autoClose: 1000 });
        })
        .catch(() => {
          toast.error("Error sending sharing", { autoClose: 1000 });
          // setInviteLoader(false);
        });
    }
  };

  const renderDashboardFilter = (a: any, index: any, item: any) => {
    const queryData =
      item.chart.save_from === "query" ? item.chart?.query?.extra?.data : item.chart?.extra.data;
    const filters1 = [
      ...a[index].filters.dropdown,
      ...a[index].filters.textBox.filter((el: any) => el.filterInput !== ""),
      ...a[index].filters.slider,
    ];
    const tempData: any = filter_function(
      [...queryData].splice(0, queryData.length),
      filters1,
      item.chart.extra.dimension,
      item.chart.extra.measures,
      item.chart.extra.aggregate
    );
    if (item.chart.extra.ascending) {
      tempData.sort(
        sort_ascending(item.chart.extra.sortingField, true, parseInt, item.chart.extra.ascending)
      );
    } else if (item.chart.extra.descending) {
      tempData.sort(
        sort_descending(item.chart.extra.sortingField, true, parseInt, item.chart.extra.descending)
      );
    }
    const tempData1: any = [];
    tempData.map((item2: any) => {
      const obj: any = {};
      obj[item.chart.extra.dimension[0]] = item2[item.chart.extra.dimension[0]];
      item.chart.extra.measures.map((item1: any) => {
        obj[item1] = item2[item1];
      });
      tempData1.push(obj);
    });
    const heads: any = [];
    const arrTable: any = tempData1?.length > 0 ? Object.keys(tempData1[0]) : [];
    [...arrTable]?.map((item: any, index: any) => {
      return heads.push({
        field: item,
        key: index,
      });
    });
    const dimensionsData = _.map(tempData, item.chart.extra.dimension[0]);
    const measuresData = format_chartData(item.chart.extra.measures, tempData, true, item.chart);

    const chartState1 = updateChartState(
      dimensionsData,
      measuresData,
      item.chart.extra.measures,
      item.chart.chart_type,
      queryData
    );
    a[index] = {
      index: a[index].index,
      id: a[index].id,
      filters: a[index].filters,
      x: a[index].x,
      y: a[index].y,
      width: a[index].width,
      height: a[index].height,
      chartState: chartState1,
      listTable: heads,
      dimensionsData: dimensionsData,
      tableData: tempData1,
    };

    setDashboardFilters(a);
    setRender(!render);
  };
  /*
  the function is called when the rnd component card is dragged
  it swaps the positions of cards in the source and destination
  Argument d contains the information of card (width, height, positons and filters etc) 
  Argument index is the number of each card
  */
  const onDragStop = (d: any, index: any) => {
    function distance(p: any) {
      return Math.sqrt(Math.pow(d.x - p.x, 2) + Math.pow(d.y - p.y, 2));
    }
    const tempArr = _.clone(dashboardFilters);
    const tempFilters = tempArr.map((item: any, index1: any) => {
      return { x: item.x, y: item.y, id: index1 };
    });
    const closest = [...tempFilters].reduce((a: any, b: any) =>
      distance(a) < distance(b) ? a : b
    );
    const cn = closest.id;
    const data1 = [...dashboardFilters];
    const px = data1[index].x,
      py = data1[index].y,
      pindex = data1[index].index;

    data1[index].x = data1[cn].x;
    data1[index].y = data1[cn].y;
    data1[index].index = data1[cn].index;
    data1[cn].x = px;
    data1[cn].y = py;
    data1[cn].index = pindex;
    setDashboardFilters(data1);
    setRender(!render);
  };
  /*
  function to check for updates in dashboard 
  returned value is stored in data-update and used in page routing.
  on true opens modal(saveChanges)
  */
  const checkUpdates = () => {
    const { title, bgColor, description, charts } = dashboardDetails;
    const arr = _.clone(selected);
    _.forEach(dashboardFilters, (e: any, idx: any) => {
      arr[idx].index = e.index;
    });

    if (
      title.trim() !== dashboardTitle.trim() ||
      bgColor !== divbackgroundColor ||
      desc !== description ||
      !_.isEqual(charts, _.map(_.sortBy(arr, ["index"]), "chart.id"))
    )
      return true;
    return false;
  };
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Edit dashboard`} description="Edit dashboard" />
      {loading ? (
        <PageLoader />
      ) : (
        <div
          className="d-flex flex-column p-3 h-100 overflow-auto"
          style={{ backgroundColor: divbackgroundColor }}
        >
          {/* Dashboard Tool Bar */}
          <div className="d-flex px-4 justify-content-between">
            <Card className="shadow-sm p-3 w-100 headerCard" id="headerCard1">
              <div className="d-flex  justify-content-between">
                <div className="d-flex align-items-center">
                  {editdashboardTitle ? (
                    <Form.Control
                      autoComplete="off"
                      autoFocus
                      id="name"
                      type="text"
                      className="ms-2 mb-1"
                      value={dashboardTitle}
                      onChange={(e: any) => {
                        const str = e.target.value;
                        const cap = str.charAt(0).toUpperCase() + str.slice(1);
                        setDashboardTitle(cap);
                        // setshowUpdate(true);
                      }}
                      onBlur={() => setEditDashboardTitle(!editdashboardTitle)}
                    />
                  ) : (
                    <h4
                      className="chart-title mb-0 cursor-pointer"
                      onClick={() => {
                        if (!edit) setEditDashboardTitle(!editdashboardTitle);
                      }}
                    >
                      {dashboardTitle.trim() || "Untitled dashboard"}
                    </h4>
                  )}
                  {desc === "" ? null : (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-engine">
                          {desc ? desc : "Please add a description"}
                        </Tooltip>
                      }
                    >
                      <Image
                        className="mb-0 ms-2 cursor-pointer"
                        width={20}
                        height={20}
                        src="/info.svg"
                      />
                    </OverlayTrigger>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  {fromaddtodash === "fromaddtodash" ? (
                    <Button
                      variant="primary"
                      className={
                        "text-white cursor-pointer " +
                        (checkRole(userRole, "dashboards") ? "" : "d-none")
                      }
                      onClick={() => {
                        setFromaddtodash("");
                        updateDashboard();
                      }}
                      spinColor="white"
                      type="button"
                      loading={viewDashboardStates.publishLoader}
                      data-update={checkUpdates()}
                      id="save-btn"
                    >
                      Save
                    </Button>
                  ) : edit ? (
                    <Button
                      variant="primary"
                      className={
                        "text-white cursor-pointer " +
                        (checkRole(userRole, "dashboards") ? "" : "d-none")
                      }
                      onClick={() => setEdit(!edit)}
                      type="button"
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className={
                        "text-white cursor-pointer " +
                        (checkRole(userRole, "dashboards") ? "" : "d-none")
                      }
                      onClick={updateDashboard}
                      spinColor="white"
                      type="button"
                      loading={viewDashboardStates.publishLoader}
                      data-update={checkUpdates()}
                      id="save-btn"
                    >
                      Save
                    </Button>
                  )}
                  <ToolTip
                    position={"top"}
                    visible={true}
                    style={{ left: checkRole(userRole, "dashboards") ? "8%" : "-130%" }}
                    text={
                      checkRole(userRole, "dashboards")
                        ? "Add chart"
                        : "You didn't have access to this feature"
                    }
                    element={() => (
                      <Image
                        src={
                          edit || !checkRole(userRole, "dashboards")
                            ? "/newicons/dashboard-menu/disabled-add-chart.svg"
                            : "/addChartIcon.svg"
                        }
                        width="22"
                        height="22"
                        className="ms-4 cursor-pointer"
                        onClick={() => {
                          return edit || !checkRole(userRole, "dashboards")
                            ? null
                            : setViewDashboardStates({
                                ...viewDashboardStates,
                                selectChart: !viewDashboardStates.selectChart,
                              });
                        }}
                        id="add-chart"
                      />
                    )}
                  />

                  <Overlay
                    show={show}
                    rootClose={true}
                    onHide={() => setShow(!show)}
                    target={target}
                    containerPadding={20}
                    placement="bottom"
                  >
                    <Popover className="mt-3 ml-15" id="popover-contained">
                      <Popover.Title className="fw-bold f-13 ls black" style={{ opacity: 0.8 }}>
                        Share dashboard
                      </Popover.Title>
                      <Popover.Content>
                        <div className="d-flex flex-column">
                          <div className="mb-0">
                            <Form.Label className="fw-bold f-13 ls black" style={{ opacity: 0.8 }}>
                              URL
                            </Form.Label>

                            <Form.Row>
                              <Form.Group as={Col}>
                                <InputGroup>
                                  <Form.Control
                                    autoComplete="off"
                                    name="url"
                                    placeholder="URL"
                                    className="border-right-0 border f-12 ls mb-0 mr-0"
                                    value={text}
                                    readOnly
                                    data-autoselect
                                    style={{ color: "#7F8F9E" }}
                                  />
                                  <InputGroup.Prepend>
                                    <InputGroup.Text
                                      onClick={() => {
                                        shareDashboard();
                                        setViewDashboardStates({
                                          ...viewDashboardStates,
                                          shareLoader: true,
                                        });
                                      }}
                                      className="cursor-pointer border-0"
                                      style={{
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                      }}
                                    >
                                      <Image className="py-1" src="/copy.svg" />
                                    </InputGroup.Text>
                                  </InputGroup.Prepend>
                                </InputGroup>
                              </Form.Group>
                            </Form.Row>

                            <Form style={{ backgroundColor: "white" }}>
                              <p className="f-12 ls black my-2 mt-2 p-0" style={{ opacity: 0.8 }}>
                                Email address
                              </p>
                              <CreatableSelect
                                components={components}
                                isClearable
                                isMulti
                                onChange={handleChange}
                                options={triggerState.users}
                                noOptionsMessage={() => null}
                                value={triggerState.email}
                                placeholder="Enter email"
                                type="email"
                                className="f-12 ls"
                                style={{ height: 48, color: "#485255", opacity: 0.8 }}
                              />
                              {error ? (
                                <span
                                  id="error"
                                  style={{ color: "red", fontSize: "12px", marginLeft: "2px" }}
                                >
                                  {errorMessage}
                                </span>
                              ) : null}
                            </Form>
                            {userRole?.user_role === "Owner" ||
                            userRole?.user_module_access[6]["Dashboards"] === "WRITE" ? (
                              !edit ? (
                                <Button variant="light" className="mt-4 ls w-100">
                                  <p className="disabled-item mb-0">Share</p>
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  className="text-white mt-4 w-100 f-14"
                                  type="button"
                                  onClick={sendInvitation}
                                  style={{ opacity: 0.9 }}
                                >
                                  Share
                                </Button>
                              )
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip className="mt-3" id="tooltip-engine">
                                    You didn&apos;t have access to this feature
                                  </Tooltip>
                                }
                              >
                                <Button variant="light" className="mt-4 ls w-100">
                                  <p className="disabled-item mb-0">Share</p>
                                </Button>
                              </OverlayTrigger>
                            )}
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover>
                  </Overlay>

                  <ToolTip
                    position={"top"}
                    visible={true}
                    style={{ left: checkRole(userRole, "dashboards") ? "8%" : "-130%" }}
                    text={
                      checkRole(userRole, "dashboards")
                        ? "Share"
                        : "You didn't have access to this feature"
                    }
                    element={() => (
                      <Image
                        src={
                          edit && checkRole(userRole, "dashboards")
                            ? "/shareIcon.svg"
                            : "/newicons/dashboard-menu/disabled-share.svg"
                        }
                        width="22"
                        height="22"
                        className="ms-3 cursor-pointer"
                        onClick={
                          edit && checkRole(userRole, "dashboards") ? handleClick : () => null
                        }
                      />
                    )}
                  />

                  {/* <OverlayTrigger
                      overlay={<Tooltip id="tooltip-engine">Last updated: {lastUpdated}</Tooltip>}
                    >
                      <Image
                        src="/refreshIcon.svg"
                        width="22"
                        height="22"
                        className="ms-3 cursor-pointer"
                      />
                    </OverlayTrigger> */}
                  <Overlay
                    show={showSettings}
                    rootClose={true}
                    onHide={() => setShowSettings(!showSettings)}
                    target={targetSettings}
                    containerPadding={20}
                    placement="bottom"
                  >
                    <Popover className="mt-3 ml-25" id="popover-contained" style={{ width: 248 }}>
                      <Popover.Title className="fw-bold f-13 ls black" style={{ opacity: 0.8 }}>
                        Settings
                      </Popover.Title>
                      <Popover.Content>
                        <p className="my-2 fw-bold f-12 ls black" style={{ opacity: 0.8 }}>
                          Color settings
                        </p>

                        <div className="d-flex mt-1 flex-row justify-content-between">
                          <p
                            className="f-12 my-1"
                            style={{ color: "#4f4f4f", textAlign: "start", opacity: 0.8 }}
                          >
                            Background
                          </p>

                          <InputGroup className="card-border" style={{ width: "51px" }}>
                            <Form.Control
                              type="color"
                              className="p-1 border-0 cursor-pointer"
                              value={divbackgroundColor}
                              onChange={(event) => setBackgroundColor(event.target.value)}
                            />
                            <InputGroup.Prepend>
                              <InputGroup.Text className="p-1 border-0 bg-white">
                                <Image src="/charts/editColor.svg" />
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                          </InputGroup>
                        </div>

                        <hr className="my-4"></hr>
                        <h6
                          className="fw-bold f-12 black ls mt-1 mb-0 bold"
                          style={{ opacity: 0.8 }}
                        >
                          Properties
                        </h6>

                        <Form>
                          <p className="f-11 black mb-0 mt-2">Dashboard title</p>
                          <input
                            type="text"
                            name="company"
                            autoComplete="off"
                            className="form-control f-11 mt-1 image-placeholder properties-input w-100"
                            style={{ height: "28px" }}
                            value={dashboardTitle}
                            onChange={(e) => setDashboardTitle(e.target.value)}
                            onBlur={() => setEditDashboardTitle(!editdashboardTitle)}
                          />

                          <p className="f-11 black mb-0 mt-3">Dashboard description</p>
                          <textarea
                            className="form-control f-11 mt-1 image-placeholder properties-input w-100"
                            rows={2}
                            value={desc}
                            autoComplete="off"
                            name=""
                            id=""
                            placeholder="Enter the description"
                            onChange={(e) => setDesc(e.target.value)}
                          />
                        </Form>
                      </Popover.Content>
                    </Popover>
                  </Overlay>
                  <ToolTip
                    position={"top"}
                    visible={true}
                    style={{ left: checkRole(userRole, "dashboards") ? "10%" : "-190%" }}
                    text={
                      checkRole(userRole, "dashboards")
                        ? "Settings"
                        : "You didn't have access to this feature"
                    }
                    element={() => (
                      <Image
                        src={
                          edit || !checkRole(userRole, "dashboards")
                            ? "/newicons/dashboard-menu/disabled-settings.svg"
                            : "/settingsIcon.svg"
                        }
                        width="22"
                        height="22"
                        className="ms-3 cursor-pointer"
                        onClick={
                          edit || !checkRole(userRole, "dashboards")
                            ? () => null
                            : handleClickSettings
                        }
                      />
                    )}
                  />

                  <Dropdown id="simple-menu">
                    <Dropdown.Toggle className="bg-transparent border-0" id="dropdown-basic">
                      <ToolTip
                        position={"top"}
                        visible={true}
                        style={{ left: checkRole(userRole, "dashboards") ? "-30%" : "-500%" }}
                        text={
                          checkRole(userRole, "dashboards")
                            ? "More"
                            : "You didn't have access to this feature"
                        }
                        element={() => (
                          <Image
                            src={
                              edit || !checkRole(userRole, "dashboards")
                                ? "/newicons/dashboard-menu/disabled-more.svg"
                                : "/moreIcon.svg"
                            }
                            width="24"
                            height="24"
                            className="cursor-pointer"
                          />
                        )}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="right" className="mt-2 me-1 pb-0 pt-0">
                      {userRole?.user_role !== "Owner" ? (
                        <Dropdown.Item
                          className="menu-item disabled-item-hover d-none"
                          style={{ color: "#d4d4d4" }}
                        >
                          <div className="d-flex align-items-center">
                            <Image src="/newicons/disabled-delete.svg" className="menu-item-icon" />
                            <p className="menu-item-text_disable mb-0">Delete</p>
                          </div>
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          className={
                            "menu-item " +
                            (edit || !checkRole(userRole, "dashboards") ? "d-none" : "")
                          }
                          onClick={() => deleteDashboard(dashboard_id)}
                        >
                          <div className="d-flex align-items-center">
                            <Image src="/newicons/delete.svg" className="menu-item-icon" />
                            <p className="menu-item-text mb-0">Delete</p>
                          </div>
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Card>
          </div>
          {/* Dashboards */}
          <div className="px-4 my-3" style={{ flex: "1" }} id="divImage">
            <div id="divImage" className="d-flex w-100" style={{ position: "relative" }}>
              {selected.length > 0 &&
                selected.map((item: any, index: any) => {
                  const { cw, ch } = getDimensions(index);
                  return (
                    <Rnd
                      size={{
                        width: cw,
                        height: ch + 70,
                      }}
                      // minHeight={ch + 70}
                      // minWidth={cw}
                      position={{
                        x: dashboardFilters[index].x,
                        y: dashboardFilters[index].y,
                      }}
                      bounds="window"
                      className="d-flex border justify-content-center align-items-center bg-white rounded"
                      onDragStop={(e, d) => onDragStop(d, index)}
                      key={index}
                      enableResizing={false}
                      disableDragging={edit ? true : false}
                    >
                      <div
                        className="h-100 w-100 p-3 d-flex flex-column"
                        style={{ position: "relative" }}
                      >
                        <div className="chart-detail-block">
                          <div className="chart-title f-18">{item.chart.name}</div>
                          {item.chart.extra.description !== "" ? (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-engine">
                                  {item.chart.extra.description}
                                </Tooltip>
                              }
                            >
                              <Image
                                className="mb-0 ms-2 cursor-pointer"
                                width={20}
                                height={20}
                                src="/info.svg"
                              />
                            </OverlayTrigger>
                          ) : null}

                          <div className="close-icon me-2 ms-auto">
                            <Dropdown id="simple-menu">
                              <Dropdown.Toggle
                                className="bg-transparent border-0 float-right p-0"
                                id="dropdown-basic"
                              >
                                <OverlayTrigger
                                  overlay={<Tooltip id="tooltip-engine">More</Tooltip>}
                                >
                                  <MoreVerticalOutline className="icon-size chart-7" />
                                </OverlayTrigger>
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="right">
                                {edit ? (
                                  <>
                                    <Dropdown.Item className="menu-item list-group-item disabled-item-hover">
                                      <div className="cursor-pointer color-inherit">
                                        <div className="df1 flex-row align-items-center">
                                          <Image
                                            className="cursor-pointer menu-item-icon"
                                            // width={20}
                                            // height={20}
                                            src="/newicons/chart-menu/disabled-edit.svg"
                                          />
                                          <p className="mb-0 ms-2 menu-item-text_disable">
                                            Explore
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="menu-item list-group-item disabled-item-hover">
                                      <div className="cursor-pointer color-inherit">
                                        <div className="df1 flex-row align-items-center">
                                          <Image
                                            src="/removIcon.svg"
                                            // width={20}
                                            // height={20}
                                            className="menu-item-icon"
                                          />
                                          <p className="mb-0 ms-1 menu-item-text_disable">Remove</p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </>
                                ) : (
                                  <>
                                    <Dropdown.Item className="menu-item list-group-item">
                                      <div
                                        onClick={() =>
                                          router.push(
                                            `${
                                              item.chart.save_from === "query"
                                                ? `/projects/${project_id}/visualization/query/${item.chart.query.id}?edit=${item.chart.id}`
                                                : `/projects/${project_id}/visualization/model/${item.chart.data_model}?edit=${item.chart.id}`
                                            }`
                                          )
                                        }
                                        className="cursor-pointer color-inherit"
                                      >
                                        <div className="df1 flex-row align-items-center">
                                          <Image
                                            className="cursor-pointer menu-item-icon"
                                            // width={20}
                                            // height={20}
                                            src="/newicons/chart-menu/edit.svg"
                                          />
                                          <p className="mb-0 ms-2 menu-item-text"> Explore</p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="menu-item list-group-item">
                                      <div
                                        onClick={() => {
                                          removeChart(item);
                                          // setshowUpdate(true);
                                          // settimeout lets the positions of charts updated after remove is clicked
                                          // setTimeout(() => {
                                          //   document?.getElementById("add-chart")?.click();
                                          //   document?.getElementById("dashboard-submit")?.click();
                                          // }, 500);
                                        }}
                                        className="cursor-pointer color-inherit"
                                      >
                                        <div className="df1 flex-row align-items-center">
                                          <Image
                                            src="/removIcon.svg"
                                            // width={20}
                                            // height={20}
                                            className="menu-item-icon"
                                          />
                                          <p className="mb-0 ms-1 menu-item-text">Remove</p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </>
                                )}
                                <Dropdown.Item className="menu-item list-group-item f-14">
                                  <div
                                    onClick={() => {
                                      setChartState({
                                        showLegend: true,
                                        showLabel: false,
                                        type: item.chart.chart_type,
                                        dimension: item.chart.extra.dimension,
                                        measures: item.chart.extra.measures,
                                        tableData: dashboardFilters[index].tableData,
                                        tableHeads: dashboardFilters[index].listTable,
                                        dimensionData: dashboardFilters[index].dimensionsData,
                                        fullScreen: true,
                                        item,
                                        index,
                                      });
                                    }}
                                    className="cursor-pointer color-inherit"
                                  >
                                    <div className="df1 flex-row align-items-center">
                                      <Image
                                        src="/charts/maximize1.svg"
                                        // width={20}
                                        // height={20}
                                        className="menu-item-icon"
                                      />
                                      <p className="mb-0 ms-1 menu-item-text"> Maximize</p>
                                    </div>
                                  </div>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="child-box mt-1">
                          <div className="d-flex flex-wrap my-auto">
                            {[
                              ...dashboardFilters[index].filters.dropdown,
                              ...dashboardFilters[index].filters.textBox,
                              ...dashboardFilters[index].filters.slider,
                            ]?.map((type: any, index1: any) => {
                              if (type.type === "Dropdown") {
                                return (
                                  <div className="mt-1 me-2" key={index1}>
                                    <MultiSelectAll
                                      filters={dashboardFilters}
                                      index1={index1}
                                      data={type}
                                      renderFiltered={renderDashboardFilter}
                                      root={"dashboard"}
                                      indexChart={index}
                                      item={item}
                                    />
                                  </div>
                                );
                              } else if (type.type === "Slider") {
                                return (
                                  <div className="mt-1 me-2 ms-1 f-12" key={index1}>
                                    <p className="mb-0">{type.field}</p>
                                    <MultiRangeSlider
                                      min={type.min}
                                      max={type.max}
                                      min1={type.min1}
                                      max1={type.max1}
                                      filters={dashboardFilters}
                                      setFilters={setDashboardFilters}
                                      index1={
                                        index1 -
                                        dashboardFilters[index].filters.dropdown.length -
                                        dashboardFilters[index].filters.textBox.length
                                      }
                                      data={type}
                                      renderFiltered={renderDashboardFilter}
                                      root={"dashboard"}
                                      indexChart={index}
                                      item={item}
                                    />
                                  </div>
                                );
                              } else if (type.type === "Textbox") {
                                return (
                                  <div className="mt-1 me-2" key={index1}>
                                    <FilterInput
                                      filters={dashboardFilters}
                                      index1={
                                        index1 - dashboardFilters[index].filters.dropdown.length
                                      }
                                      data={type}
                                      renderFiltered={renderDashboardFilter}
                                      root={"dashboard"}
                                      indexChart={index}
                                      item={item}
                                    />
                                  </div>
                                );
                              }
                            })}
                          </div>

                          <VisualizationComponent
                            chartState={{
                              axisTitle: item.chart.extra.axisTitle,
                              showLabel: item.chart.extra.showLabel,
                              showLegend: item.chart.extra.showLegend,
                              showGrids: item.chart.extra.showGrids,
                              showAxis: item.chart.extra.showAxis,
                              showAxisTitle: item.chart.extra.showAxisTitle,
                              type: item.chart.chart_type,
                              dimension: item.chart.extra.dimension,
                              measures: item.chart.extra.measures,
                              tableData: dashboardFilters[index].tableData,
                              tableHeads: dashboardFilters[index].listTable,
                              dimensionData: dashboardFilters[index].dimensionsData,
                              lineWeight: item.chart.extra?.lineWeight || 1,
                            }}
                            // reDraw={reDraw}
                            verticalBarData={dashboardFilters[index].chartState}
                            verticalStackData={dashboardFilters[index].chartState}
                            curveLineData={dashboardFilters[index].chartState}
                            areaData={dashboardFilters[index].chartState}
                            mixedData={dashboardFilters[index].chartState}
                            scatterData={dashboardFilters[index].chartState}
                            bubbleData={dashboardFilters[index].chartState}
                            pieData={dashboardFilters[index].chartState}
                            polarData={dashboardFilters[index].chartState}
                            radarData={dashboardFilters[index].chartState}
                            d3Data={dashboardFilters[index].chartState.datasets}
                            toolTip={toolTip}
                            root="dashboard"
                            width={dashboardFilters[index].width}
                            height={dashboardFilters[index].height}
                          />
                        </div>
                      </div>
                    </Rnd>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {viewDashboardStates.selectChart && (
        <ChartSelection
          viewDashboardStates={viewDashboardStates}
          setViewDashboardStates={setViewDashboardStates}
          selectedChart={selectedChart}
          allCharts={allCharts}
          renderDashboard={renderDashboard}
          dashboardFilters={dashboardFilters}
        />
      )}

      {chartState.fullScreen && (
        <Modal
          show={chartState.fullScreen}
          onHide={() => {
            setChartState({
              ...chartState,
              fullScreen: false,
            });
          }}
          dialogClassName="modal-90w"
        >
          <Modal.Header>
            <>
              {chartState.item?.chart.name}
              <p
                className="cursor-pointer me-3 mb-0"
                onClick={() => {
                  setChartState({
                    ...chartState,
                    fullScreen: false,
                  });
                }}
              >
                Close
              </p>
            </>
          </Modal.Header>
          <Modal.Body className="py-0 pe-3 ps-3">
            <VisualizationComponent
              chartState={chartState}
              // reDraw={reDraw}
              verticalBarData={dashboardFilters[chartState.index].chartState}
              verticalStackData={dashboardFilters[chartState.index].chartState}
              curveLineData={dashboardFilters[chartState.index].chartState}
              areaData={dashboardFilters[chartState.index].chartState}
              mixedData={dashboardFilters[chartState.index].chartState}
              scatterData={dashboardFilters[chartState.index].chartState}
              bubbleData={dashboardFilters[chartState.index].chartState}
              pieData={dashboardFilters[chartState.index].chartState}
              polarData={dashboardFilters[chartState.index].chartState}
              radarData={dashboardFilters[chartState.index].chartState}
              d3Data={dashboardFilters[chartState.index].chartState.datasets}
              toolTip={toolTip}
              root="dashboard"
              width={dashboardFilters[chartState.index].width}
              height={dashboardFilters[chartState.index].height}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
export default EditDashboard;
