import React, { FC } from "react";
// react-bootstrap
import {
  Modal,
  Form,
  Card,
  Image,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  Popover,
  Overlay,
} from "react-bootstrap";
// react button loader
import Button from "react-bootstrap-button-loader";

import * as htmlToImage from "html-to-image";

// hooks
import { useRouter } from "next/router";
//hooks
import { useRequest } from "lib/hooks";
// d3
import * as d3 from "d3";
// html to canvas
// import html2canvas from "html2canvas";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";

// react-select
import Select from "react-select";
// toast
import { toast } from "react-toastify";
// lodash
import _ from "lodash";
// rnd
import { Rnd } from "react-rnd";
// next seo
import { NextSeo } from "next-seo";
// components
import VisualizationComponent from "@components/charts/visualizationComponent";
import { PageLoading } from "components/loaders";
import { MultiSelectAll } from "components/dropdowns";
import { MultiRangeSlider, FilterInput } from "components/forms";
// services
import { DashboardService, ConnectionsService } from "services";
// constants
import {
  dataURLtoFile,
  filter_function,
  format_chartData,
  sort_ascending,
  sort_descending,
  updateChartState,
} from "@components/charts/chart_functions";
//toast configuration
toast.configure();

const dashboardService = new DashboardService();
const connections = new ConnectionsService();

const CreateDashboard: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;

  if (!project_id) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }

  const { data: chartData }: any = useRequest({
    url: `api/projects/${project_id}/charts/`,
  });
  const { data: dashboardData } = useRequest({
    url: `api/projects/${project_id}/limiteddashboards/`,
  });
  const [dashboardFilters, setDashboardFilters] = React.useState([] as any);

  const [createDashboardStates, setCreateDashboardStates] = React.useState({
    allCharts: [],
    selectChart: false,
    selectedChart: [] as any,
    charts: [] as any,
    selected: [] as any,
    publish: true,
    publishLoader: false,
    editTitle: false,
    editDesc: true,
    title: "",
    description: "",
  });

  const [divbackgroundColor, setBackgroundColor] = React.useState("#fbfbfb");

  const [render, setRender] = React.useState(false);

  // const [reDraw, setReDraw] = React.useState(false);

  const [toolTip, setToolTip] = React.useState([]) as any;

  const [disable, setDisable] = React.useState(false);

  const [desc, setDesc] = React.useState("");

  const [showSettings, setShowSettings] = React.useState(false);
  const [targetSettings, setTargetSettings] = React.useState(null);
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
  const [card, setCard] = React.useState({ cw: 0, ch: 0, g: 0 });

  React.useEffect(() => {
    setToolTip(tooltip);
    const headerWidth = document.getElementById("headerCard") as HTMLElement;
    const cw = Math.round(headerWidth.clientWidth * 0.5) - 6;
    const ch = Math.round((cw * 9) / 16);

    const g = 10;
    setCard({ cw, ch, g });
    if (chartData) {
      setCreateDashboardStates({
        ...createDashboardStates,
        allCharts: chartData.map((item: any) => {
          item["field"] = item.name;
          item["label"] = item.name;
          item["value"] = item.name;
          return item;
        }),
      });
    }
  }, [chartData]);

  const addChart = (e: any) => {
    setCreateDashboardStates({
      ...createDashboardStates,
      selectedChart: e,
    });
  };

  // Render dashboard
  const renderDashboard = () => {
    setDisable(true);
    const temp1: any = [];
    _.map(createDashboardStates.selectedChart, (o: any, index: any) => {
      const queryData = o.save_from === "query" ? o?.query?.extra?.data : o?.extra.data;
      const filters1 = [
        ...o.extra.filters.dropdown,
        ...o.extra.filters.textBox.filter((el:any) => el.filterInput !== ''),
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

      let xPosition = 0,
        yPosition = 0;
      const cardNumber = index;
      // Setting the position of each card
      if (cardNumber % 2 === 0) {
        xPosition = 0;
        yPosition = (card.ch + card.g + 70) * (cardNumber / 2);
      } else if (cardNumber % 2 !== 0) {
        xPosition = card.cw + card.g;
        yPosition = ((card.ch + card.g + 70) * (cardNumber - 1)) / 2;
      }
      temp1.push({
        id: o.id,
        x: xPosition,
        y: yPosition,
        height: card.ch,
        width:
          typeof dashboardFilters[index] === "object" ? dashboardFilters[index].width : card.cw,
        aggregate: o.extra.aggregate,
        filters: o.extra.filters,
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
        height: o.height ? o.height : null,
        width: o.width ? o.width : null,
        id: o.id ? o.id : null,
        position_x: typeof dashboardFilters[index] === "object" ? dashboardFilters[index].x : 0,
        position_y: typeof dashboardFilters[index] === "object" ? dashboardFilters[index].y : 0,
        chart: o,
        aggregate: o.extra.aggregate,
        filters: o.extra.filter ? o.extra.filters : [],
      };
    });
    setDashboardFilters(temp1);
    setCreateDashboardStates({
      ...createDashboardStates,
      selectChart: false,
      selected: createDashboardStates.selectedChart,
    });
  };
  function hasDuplicates(a: any) {
    return _.uniq(a).length !== a.length;
  }
  const saveDashboard = () => {
    const node1: any = document?.getElementById("divImage");

    setCreateDashboardStates({
      ...createDashboardStates,
      publishLoader: true,
    });
    const dashboards: any = dashboardData;
    const dashboardNames: any = [];
    _.map(dashboards, (item: any) => {
      dashboardNames.push(item.name);
    });
    if (
      !createDashboardStates.title.trim() ||
      dashboardNames.includes(createDashboardStates.title)
    ) {
      let toastText = "Dashboard name already exists";
      if (!createDashboardStates.title.trim()) toastText = "Dashboard name is required";
      toast.error(toastText, { autoClose: 4000 });
      setCreateDashboardStates({
        ...createDashboardStates,
        publishLoader: false,
      });
      return;
    } else if (_.map(createDashboardStates.selected, "id").length == 0) {
      toast.error("Please Select any chart", { autoClose: 4000 });
      setCreateDashboardStates({
        ...createDashboardStates,
        publishLoader: false,
      });
      return;
    } else if (hasDuplicates(_.map(createDashboardStates.selected, "id"))) {
      toast.error("Duplicate Charts can't be added", { autoClose: 4000 });
      setCreateDashboardStates({
        ...createDashboardStates,
        publishLoader: false,
      });
      return;
    }

    htmlToImage.toPng(node1).then(function (dataUrl) {
      const imgData = new FormData();
      const file = dataURLtoFile(dataUrl, `${createDashboardStates.title}.png`);
      imgData.append("name[]", `dashboard`);
      imgData.append("asset[]", file);

      connections.dumpJSONFile(imgData).then((res: any) => {
        const data = {
          name: createDashboardStates.title,
          description: createDashboardStates.description,
          charts: _.map(createDashboardStates.selectedChart, "id"),
          backgroundColor: divbackgroundColor,

          extra: {
            thumbnail: res[0],
            backgroundColor: divbackgroundColor,
            description: desc,
          },
        };
        setCreateDashboardStates({
          ...createDashboardStates,
          publish: false,
          publishLoader: false,
        });
        dashboardService
          .createDashboard(project_id, data)
          .then((res: any) => {
            setCreateDashboardStates({
              ...createDashboardStates,
              publish: false,
              publishLoader: false,
            });

            toast.success("Dashboard created successfully", { autoClose: 3000 });
            router.push(`/projects/${project_id}/dashboards/${res.id}`);
          })
          .catch((err) => {
            setCreateDashboardStates({
              ...createDashboardStates,
              publishLoader: false,
            });
            toast.error(err, { autoClose: 3000 });
          });
      });
    });
  };

  // const refreshDashboard = () => {
  //   document.body.click();

  //   const data = _.map(createDashboardStates.selectedChart, (o) => {
  //     const yOptions = o.data.yAxis;
  //     const queryData = o.save_from === "query" ? o?.query?.extra?.data : o?.data?.mlData;
  //     const yAxis: any = [];

  //     _.map(yOptions, (item: any, index: any) => {
  //       yAxis.push({
  //         backgroundColor:
  //           yOptions.length > 6
  //             ? "#" + (((1 << 24) * Math.random()) | 0).toString(16)
  //             : o.data.y[index].backgroundColor,
  //         data: _.map(queryData, item),
  //         sum: _.map(queryData, item).reduce((partial_sum: any, a: any) => partial_sum + a, 0),
  //       });
  //     });

  //     updateChartState(yAxis, data, yOptions, queryData, chartTypes);
  //   });
  // };
  const removeChart = (data: any) => {
    const newSelectedArr = createDashboardStates.selectedChart.filter(
      (item: any) => item.id !== data.id
    );

    {
      createDashboardStates.selected.length >= 0 ? setDisable(false) : setDisable(true);
    }

    const newArr = createDashboardStates.selected.filter((item: any) => item.id !== data.id);

    setCreateDashboardStates({
      ...createDashboardStates,
      selectedChart: newSelectedArr,
      selected: newArr,
    });
    const temp2 = dashboardFilters.filter((item: any) => item.id !== data.id);
    setDashboardFilters(temp2);
  };

  const renderDashboardFilter = (a: any, index: any, item: any) => {
    const queryData = item.save_from === "query" ? item?.query?.extra?.data : item?.extra.data;
    // console.log(a[index].filters);
    const filters1 = [
      ...a[index].filters.dropdown,
      ...a[index].filters.textBox.filter((el:any) => el.filterInput !== ''),
      ...a[index].filters.slider,
    ];

    const tempData: any = filter_function(
      [...queryData].splice(0, queryData.length),
      filters1,
      item.extra.dimension,
      item.extra.measures,
      item.extra.aggregate
    );
    if (item.extra.ascending) {
      tempData.sort(sort_ascending(item.extra.sortingField, true, parseInt, item.extra.ascending));
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

    const chartState1 = updateChartState(
      dimensionsData,
      measuresData,
      item.extra.measures,
      item.chart_type,
      queryData
    );
    a[index] = {
      id: a[index].id,
      filters: a[index].filters,
      x: a[index].x,
      y: a[index].y,
      width: a[index].width,
      height: a[index].height,
      chartState: chartState1,
      dimensionsData: dimensionsData,
      listTable: heads,
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
    const tempFilters = dashboardFilters.map((item: any, index1: any) => {
      return { x: item.x, y: item.y, id: index1 };
    });
    const closest = [...tempFilters].reduce((a: any, b: any) => {
      return distance(a) < distance(b) ? a : b;
    });
    const cn = closest.id;
    const data1 = [...dashboardFilters];
    const px = data1[index].x,
      py = data1[index].y;
    data1[index].x = data1[cn].x;
    data1[index].y = data1[cn].y;

    data1[cn].x = px;
    data1[cn].y = py;

    const tempArr = [...createDashboardStates.selectedChart];
    let a = 0,
      b = 0;
    _.filter(tempArr, (e: any, i: any) => {
      if (e.id === data1[index].id) a = i;
      if (e.id === data1[cn].id) b = i;
    });
    const tempObj = tempArr[a];
    tempArr[a] = tempArr[b];
    tempArr[b] = tempObj;

    setCreateDashboardStates({
      ...createDashboardStates,
      selectedChart: tempArr,
    });
    setDashboardFilters(data1);
    // setRender(!render);
    // setReDraw(!reDraw);
  };

  const handleClickSettings = (event: any) => {
    setShowSettings(!showSettings);
    setTargetSettings(event.target);
  };
  return (
    <>
      <NextSeo
        title={`Create Dashboard - ${process.env.CLIENT_NAME}`}
        description="Create Dashboard"
      />
      <div
        className="d-flex flex-column p-3 h-100 overflow-auto"
        style={{ backgroundColor: divbackgroundColor }}
      >
        {/* Dashboard Tool Bar */}
        <div className="d-flex px-4 justify-content-between">
          <Card className="shadow-sm p-3 w-100 mt-3" id="headerCard">
            <div className="d-flex  justify-content-between">
              <div className="d-flex align-items-center">
                {createDashboardStates.editTitle ? (
                  <Form>
                    <Form.Control
                      autoComplete="off"
                      autoFocus
                      onChange={(event: any) => {
                        const str = event.target.value;
                        const cap = str.charAt(0).toUpperCase() + str.slice(1);
                        setCreateDashboardStates({
                          ...createDashboardStates,
                          title: cap,
                        });
                      }}
                      onBlur={(event: any) => {
                        const str = event.target.value;
                        const cap = str.charAt(0).toUpperCase() + str.slice(1);
                        setCreateDashboardStates({
                          ...createDashboardStates,
                          title: cap,
                          editTitle: false,
                        });
                      }}
                      value={createDashboardStates.title}
                      className="name-input-q cursor-pointer ms-1 f-14 query-1"
                    />
                  </Form>
                ) : (
                  <h4
                    className="chart-title mt-1 mb-0 cursor-pointer"
                    onClick={() => {
                      setCreateDashboardStates({
                        ...createDashboardStates,
                        editTitle: true,
                      });
                    }}
                  >
                    {createDashboardStates.title.trim() || "Untitled dashboard"}
                  </h4>
                )}
                {desc === "" ? (
                  ""
                ) : (
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
                <Button
                  variant={disable ? "primary" : "light"}
                  className={"cursor-pointer " + (disable ? "text-white" : "disable-btn")}
                  loading={createDashboardStates.publishLoader}
                  onClick={() => saveDashboard()}
                  disabled={!disable}
                  data-update={disable}
                  id="save-btn"
                >
                  Publish
                </Button>

                <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Add chart</Tooltip>}>
                  <Image
                    src="/addChartIcon.svg"
                    width="22"
                    height="22"
                    id="add-chart"
                    className="ms-4 cursor-pointer"
                    onClick={() =>
                      setCreateDashboardStates({
                        ...createDashboardStates,
                        selectChart: !createDashboardStates.selectChart,
                        charts: createDashboardStates.selectedChart,
                      })
                    }
                  />
                </OverlayTrigger>
                {/* <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Refresh</Tooltip>}>
                    <Image
                      src="/refreshIcon.svg"
                      width="22"
                      height="22"
                      className="ms-3 cursor-pointer"
                      onClick={() => {
                        refreshDashboard();
                      }}
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
                            style={{
                              borderRadius: "4px",
                              border: "border: 0.5px solid #919EAB",
                            }}
                            value={divbackgroundColor}
                            onChange={(event: any) => {
                              setBackgroundColor(event.target.value);
                            }}
                          />
                          <InputGroup.Prepend>
                            <InputGroup.Text
                              className="p-1 border-0"
                              style={{ backgroundColor: "white" }}
                            >
                              <Image src="/charts/editColor.svg" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                        </InputGroup>
                      </div>

                      <hr className="my-4"></hr>
                      <h6 className="fw-bold f-12 black ls mt-1 mb-0 bold" style={{ opacity: 0.8 }}>
                        Properties
                      </h6>

                      <Form className="">
                        <p className="f-11 black mb-0 mt-2">Dashboard title</p>
                        <input
                          type="text"
                          name="company"
                          autoComplete="off"
                          className="form-control f-11 mt-1 image-placeholder properties-input w-100"
                          style={{ height: "28px" }}
                          value={createDashboardStates.title}
                          onChange={(e) => {
                            setCreateDashboardStates({
                              ...createDashboardStates,
                              title: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            if (createDashboardStates.title) {
                              setCreateDashboardStates({
                                ...createDashboardStates,
                                editTitle: false,
                              });
                            }
                          }}
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
                          onChange={(e) => {
                            setDesc(e.target.value);
                          }}
                        />
                      </Form>
                    </Popover.Content>
                  </Popover>
                </Overlay>
                <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Settings</Tooltip>}>
                  <Image
                    src="/settingsIcon.svg"
                    width="22"
                    height="22"
                    className="ms-3 cursor-pointer"
                    onClick={handleClickSettings}
                  />
                </OverlayTrigger>
              </div>
            </div>
          </Card>
        </div>
        <div className="px-4 my-3 df1" id="divImage">
          {/* Dashboards */}
          {createDashboardStates.selected.length > 0 ? (
            <div id="divImage" className="d-flex w-100" style={{ position: "relative" }}>
              {createDashboardStates.selected.length > 0 &&
                createDashboardStates.selected.map((item: any, index: any) => {
                  return (
                    <Rnd
                      key={index}
                      bounds="window"
                      size={{
                        width: card.cw,
                        height: card.ch + 70,
                      }}
                      // minHeight={card.ch + 70}
                      // minWidth={card.cw}
                      position={{
                        x: dashboardFilters[index].x,
                        y: dashboardFilters[index].y,
                      }}
                      className="d-flex border justify-content-center align-items-center bg-white rounded"
                      onDragStop={(e, d) => onDragStop(d, index)}
                      enableResizing={false}
                    >
                      <div
                        className="h-100 w-100 p-3 d-flex flex-column"
                        style={{ position: "relative" }}
                      >
                        <div className="chart-detail-block">
                          <div className="chart-title f-18">{item.name}</div>
                          {item.extra.description !== "" ? (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-engine">{item.extra.description}</Tooltip>
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
                                <Dropdown.Item className="menu-item list-group-item">
                                  <div
                                    onClick={() => {
                                      removeChart(item);
                                      setTimeout(() => {
                                        document?.getElementById("add-chart")?.click();
                                        document?.getElementById("dashboard-submit")?.click();
                                      }, 500);
                                    }}
                                    className="cursor-pointer color-inherit"
                                  >
                                    <div className="df1 flex-row align-items-center">
                                      <Image
                                        src="/removIcon.svg"
                                        width={20}
                                        height={20}
                                        className="me-2"
                                      />
                                      <p className="mb-0 ms-1">Remove</p>
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
                              switch (type.type) {
                                case "Dropdown":
                                  return (
                                    <div className="mt-1 me-2">
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
                                case "Textbox":
                                  return (
                                    <div className="mt-1 me-2">
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
                                case "Slider":
                                  return (
                                    <div className="mt-1 me-2 ms-1 f-12">
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
                              }
                            })}
                          </div>

                          <VisualizationComponent
                            chartState={{
                              type: item.chart_type,
                              lineWeight: item.extra?.lineWeight || 1,
                              dimension: item.extra.dimension,
                              axisTitle: item.extra?.axisTitle,
                              showLabel: item.extra?.showLabel,
                              showLegend: item.extra?.showLegend,
                              showGrids: item.extra?.showGrids,
                              showAxis: item.extra?.showAxis,
                              showAxisTitle: item.extra?.showAxisTitle,
                              measures: item.extra.measures,
                              tableData: dashboardFilters[index].tableData,
                              tableHeads: dashboardFilters[index].listTable,
                              dimensionData: dashboardFilters[index].dimensionsData,
                            }}
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
          ) : (
            <div className="text-center m-auto">
              <Image
                width={180}
                height={180}
                src="/assets/icons/summary/emptyDashboardIcon.svg"
              ></Image>
              <h5 className="fw-bold mt-2" style={{ color: "#0076FF" }}>
                Start building your dashboard
              </h5>
              <p className="mb-2 f-15 opacity-75 text-center">
                To get Started, add your first chart
              </p>
              <Button
                className="cursor-pointer text-white text-center "
                onClick={() =>
                  setCreateDashboardStates({
                    ...createDashboardStates,
                    selectChart: !createDashboardStates.selectChart,
                    charts: createDashboardStates.selectedChart,
                  })
                }
              >
                Add chart
              </Button>
            </div>
          )}
        </div>
      </div>
      {createDashboardStates.selectChart && (
        <Modal backdrop="static" keyboard={false} show={createDashboardStates.selectChart}>
          <Modal.Header className="mb-0 d-flex justify-content-center align-items-center">
            <Modal.Title
              className="f-24 mt-0 mb-0"
              style={{ color: "#495968", textAlign: "start", opacity: 0.9 }}
            >
              Add to dashboard
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 mt-3">
            <div className="d-flex flex-column">
              <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Select
                    isMulti
                    menuPlacement="top"
                    menuPosition="absolute"
                    name="charts"
                    value={createDashboardStates.selectedChart}
                    options={createDashboardStates.allCharts}
                    className="multi-select-box w-100"
                    placeholder="Select chart type"
                    classNamePrefix="Select chart type"
                    closeMenuOnSelect={false}
                    onChange={addChart}
                  />
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-0 mb-2 dflex justify-content-center align-items-center">
            <Button
              onClick={() => {
                setCreateDashboardStates({
                  ...createDashboardStates,
                  selectedChart: createDashboardStates.charts,
                  selectChart: false,
                });
              }}
              variant="text"
              className="btn ms-3 bg-white"
            >
              Cancel
            </Button>
            {createDashboardStates.selectedChart >= 0 ? (
              <Button
                variant="light"
                type="button"
                // onClick={sendInvitation}
                style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
                className="f-17 text-center"
                id="dashboard-submit"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={() => renderDashboard()}
                variant="primary"
                type="button"
                style={{ opacity: 0.9, color: "#A0A4A8", width: 117 }}
                className="text-white f-17 text-center"
                id="dashboard-submit"
              >
                Submit
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default CreateDashboard;
