import React, { FC } from "react";
import { Image } from "react-bootstrap";
// react-chartjs-2
import {
  Bar,
  HorizontalBar,
  Line,
  Scatter,
  Bubble,
  Pie,
  Doughnut,
  Polar,
  Radar,
} from "react-chartjs-2";
// toasts
import { toast } from "react-toastify";
// import Chart from "chart.js";
import "chartjs-plugin-datalabels";
import {
  Histogram,
  BumpChart,
  PackedBubble,
  ParetoChart,
  TreeMap,
  WaffleChart,
  HeatMap,
  BoxPlot,
  WaterfallChart,
  Map,
  SankeyChart,
} from "@components/d3components";
import { tableStyles } from "@constants/common";
import { QueryResults } from "@components/data-tables";
import { worldCountries } from "constants/common";

interface ChartProps {
  chartState?: any;
  setChartState?: any;
  reDraw?: any;
  toolTip?: any;
  verticalBarData?: any;
  verticalStackData?: any;
  curveLineData?: any;
  areaData?: any;
  mixedData?: any;
  scatterData?: any;
  bubbleData?: any;
  pieData?: any;
  polarData?: any;
  radarData?: any;
  d3Data?: any;
  root?: any;
  height?: any;
  width?: any;
  sideBar?: any;
}
const VisualizationComponent: FC<ChartProps> = (props) => {
  const {
    chartState,
    setChartState,
    toolTip,
    verticalBarData,
    verticalStackData,
    curveLineData,
    areaData,
    mixedData,
    scatterData,
    bubbleData,
    pieData,
    polarData,
    radarData,
    d3Data,
    root,
    height,
    width,
  } = props;

  // React.useEffect(() => {
  //   setRe(!!sideBar);
  // }, [sideBar]);
  // checks if a chart requires both x and y axis to render
  const checkOptions: any = (x: any, y: any) => {
    if (x.length === 0 || y.length === 0) {
      return true;
    } else {
      return false;
    }
  };
  // checks values for sting or int type
  const checkType: any = (a: any) => {
    let check = 0;
    a.map((item: any) => {
      if (typeof item === "string") {
        check = 0;
      } else {
        check = check + 1;
      }
    });
    if (check === 0) {
      return true;
    } else {
      return false;
    }
  };
  // renders chart canvas by chart type
  const chart: any = (typeOfChart: string) => {
    if (checkOptions(chartState.dimension, chartState.measures, chartState.dimensionData)) {
      return (
        <div
          style={{ height: "60vh" }}
          className="d-flex flex-column justify-content-center align-items-center w-100 mt-5"
        >
          <h4 style={{ fontSize: 32, fontWeight: 700, color: "#0076FF" }}>
            Build visuals with your data.
          </h4>
          <h6 style={{ fontSize: 18, fontWeight: 400 }}>
            Please add proper measure and dimensions.
          </h6>
          <Image
            src="/dummyChart.svg"
            alt="create chart"
            width="286"
            height="221"
            className="me-1 mt-3"
          />
        </div>
      );
    } else {
      switch (typeOfChart) {
        // vertical bar type
        case "bar":
          return (
            <>
              <Bar
                data={verticalBarData}
                //redraw={true}
                // width={sideBar ? 800 : 1200}
                // height={"100%"}
                options={{
                  layout: {
                    padding: {
                      top: -20,
                      bottom: 0,
                      right: 30,
                      left: -20,
                    },
                  },
                  plugins: {
                    // labels: row,
                    datalabels: {
                      borderWidth: 1,
                      // listeners: { click: () => console.log("hello") },
                      offset: 3,
                      display: chartState.showLabel,
                      align: "end",
                      anchor: "end",
                      clamp: true,
                      clip: true,
                      borderRadius: 4,
                      formatter: Math.round,
                      font: {
                        family: "Inter",
                        weight: "bold",
                        size: 9,
                      },
                      padding: 6,
                    },
                  },
                  animation: { animateRotate: true, animateScale: true },
                  tooltips: {
                    axis: "xy",
                    titleFontSize: 12,
                    titleFontStyle: "bold",
                    bodyFontSize: 10,
                    bodyFontStyle: "normal",
                  },
                  responsive: true,
                  events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
                  scales: {
                    xAxes: [
                      {
                        display: chartState.showAxis,
                        stacked: false,
                        ticks: {
                          showLabelBackdrop: true,
                          callback: function (value: any) {
                            if (value !== null) {
                              if (value.length > 8) {
                                return `${value.substr(0, 8)}...`;
                              } else {
                                return value;
                              }
                            }
                          },
                        },
                        gridLines: {
                          display: chartState.showGrids,
                        },
                        scaleLabel: {
                          display: chartState.showAxisTitle,
                          labelString: chartState.axisTitle,
                          fontSize: 20,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        display: chartState.showAxis,
                        stacked: false,
                        gridLines: {
                          display: chartState.showGrids,
                        },
                        scaleLabel: {
                          display: chartState.showAxisTitle,
                          // labelString: `${y
                          //   .map((item: any) => {
                          //     return item?.value;
                          //   })
                          //   .join()}`,
                          fontSize: 16,
                        },
                        ticks: { showLabelBackdrop: false, beginAtZero: true },
                      },
                    ],
                  },
                  maintainAspectRatio: true,
                  title: {
                    display: true,
                    fontSize: 24,
                    fullWidth: true,
                    fontStyle: "italic",
                    fontColor: "#0076FF",
                    position: "top",
                    // text: `${x} Vs ${y
                    //   .map((item: any) => {
                    //     return item?.value;
                    //   })
                    //   .join()}`,
                  },
                  legend: {
                    display: chartState.showLegend,
                    position: "bottom",
                    rtl: false,
                  },
                }}
              />
            </>
          );
        // vertical stacked bar type
        case "bar1":
          return (
            <Bar
              data={verticalStackData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    borderWidth: 1,
                    // listeners: { click: () => console.log("hello") },
                    offset: 3,
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    clamp: true,
                    clip: true,
                    borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 9,
                    },
                    padding: 6,
                  },
                },
                animation: { animateRotate: true, animateScale: true },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                responsive: true,
                events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
                scales: {
                  xAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: true,
                      ticks: {
                        showLabelBackdrop: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: true,
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        // labelString: `${y
                        //   .map((item: any) => {
                        //     return item?.value;
                        //   })
                        //   .join()}`,
                        fontSize: 16,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      ticks: { showLabelBackdrop: false, beginAtZero: true },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 24,
                  fullWidth: true,
                  fontStyle: "italic",
                  fontColor: "#0076FF",
                  position: "top",
                  // text: `${x} Vs ${y
                  //   .map((item: any) => {
                  //     return item?.value;
                  //   })
                  //   .join()}`,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // horizontal stacked bar type
        case "bar2":
          return (
            <HorizontalBar
              data={verticalStackData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    borderWidth: 1,
                    // listeners: { click: () => console.log("hello") },
                    offset: 3,
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    clamp: true,
                    clip: true,
                    borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 9,
                    },
                    padding: 6,
                  },
                },
                animation: { animateRotate: true, animateScale: true },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                responsive: true,
                events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
                scales: {
                  xAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: true,
                      ticks: {
                        showLabelBackdrop: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        // labelString: `${y
                        //   .map((item: any) => {
                        //     return item?.value;
                        //   })
                        //   .join()}`,
                        fontSize: 16,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      ticks: { showLabelBackdrop: false, beginAtZero: true },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 24,
                  fullWidth: true,
                  fontStyle: "italic",
                  fontColor: "#0076FF",
                  position: "top",
                  // text: `${x} Vs ${y
                  //   .map((item: any) => {
                  //     return item?.value;
                  //   })
                  //   .join()}`,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        case "horizontalBar":
          return (
            <HorizontalBar
              data={verticalBarData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  datalabels: {
                    borderWidth: 1,
                    // listeners: { click: () => console.log("hello") },
                    offset: 3,
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    clamp: true,
                    clip: true,
                    borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 9,
                    },
                    padding: 6,
                  },
                },
                animation: { animateRotate: true, animateScale: true },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                responsive: true,
                events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
                scales: {
                  xAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: false,
                      ticks: {
                        showLabelBackdrop: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: chartState.showAxis,
                      stacked: false,
                      scaleLabel: {
                        display: true,
                        // labelString: `${y
                        //   .map((item: any) => {
                        //     return item?.value;
                        //   })
                        //   .join()}`,
                        fontSize: 16,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      ticks: { showLabelBackdrop: false, beginAtZero: true },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // curve type
        case "curve":
          return (
            <Line
              data={curveLineData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                elements: {
                  line: {
                    borderWidth: chartState.lineWeight,
                    fill: false,
                    tension: 0.4,
                  },
                },
                responsive: true,
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        showLabelBackdrop: true,
                        beginAtZero: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: true,
                        // labelString: y,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // line type
        case "line":
          return (
            <Line
              data={curveLineData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    // color: "#FFFFFF",
                    align: "end",
                    anchor: "end",
                    // backgroundColor: "#0076FF",
                    // borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                elements: {
                  line: {
                    borderWidth: chartState.lineWeight,
                    fill: false,
                    tension: 0.1,
                  },
                },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                responsive: true,
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        showLabelBackdrop: true,
                        beginAtZero: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: true,
                        // labelString: y,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // area type
        case "area":
          return (
            <Line
              data={areaData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    // color: "#FFFFFF",
                    align: "end",
                    anchor: "end",
                    // backgroundColor: "#0076FF",
                    // borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                  // filler: {
                  // propagate: true,
                  // areas: [
                  //   {
                  //     from: 0,
                  //     to: 2,
                  //   },
                  //   {
                  //     from: 3,
                  //     to: 5,
                  //   },
                  // ],
                  // },
                },
                elements: {
                  line: {
                    fill: true,
                    borderWidth: chartState.lineWeight,
                    tension: 0.1,
                    backgroundColor: "#0076FF",
                  },
                },
                // spanGaps: true,
                tooltips: {
                  axis: "xy",
                  intersect: true,
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                responsive: true,
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        showLabelBackdrop: true,
                        beginAtZero: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: true,
                        // labelString: y,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                      stacked: true,
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // scatter type
        case "scatter":
          // if (typeof xValues[0] === "string") {
          if (checkType(chartState.dimensionData)) {
            setChartState({ ...chartState, type: "bar" });
            toast.error(
              "Scatter chart can only be rendered on numbers, Please change dimension of type number!!!"
            );
          } else {
            return (
              <Scatter
                data={scatterData}
                //redraw={!sideBar}
                options={{
                  layout: {
                    padding: {
                      top: -20,
                      bottom: 0,
                      right: 30,
                      left: -20,
                    },
                  },
                  plugins: {
                    // labels: row,
                    datalabels: {
                      display: false,
                      // color: "#FFFFFF",
                      align: "end",
                      anchor: "end",
                      // backgroundColor: "#0076FF",
                      // borderRadius: 4,
                      formatter: Math.round,
                      font: {
                        family: "Inter",
                        weight: "bold",
                        size: 8,
                      },
                      padding: 6,
                    },
                  },
                  showLines: false,
                  elements: {
                    line: {
                      // borderWidth: lineWeight,
                      borderWidth: 0,
                      borderColor: "transparent",
                      fill: false,
                      tension: 0.1,
                    },
                  },
                  responsive: true,
                  tooltips: {
                    axis: "xy",
                    titleFontSize: 12,
                    titleFontStyle: "bold",
                    bodyFontSize: 10,
                    bodyFontStyle: "normal",
                  },
                  scales: {
                    xAxes: [
                      {
                        ticks: {
                          showLabelBackdrop: true,
                          beginAtZero: true,
                          callback: function (value: any) {
                            if (value !== null) {
                              if (value.length > 8) {
                                return `${value.substr(0, 8)}...`;
                              } else {
                                return value;
                              }
                            }
                          },
                        },
                        display: chartState.showAxis,
                        scaleLabel: {
                          display: chartState.showAxisTitle,
                          labelString: chartState.axisTitle,
                          fontSize: 20,
                        },
                        gridLines: {
                          display: chartState.showGrids,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                        display: chartState.showAxis,
                        scaleLabel: {
                          display: true,
                          // labelString: y,
                          fontSize: 20,
                        },
                        gridLines: {
                          display: chartState.showGrids,
                        },
                      },
                    ],
                  },
                  maintainAspectRatio: true,
                  title: {
                    display: true,
                    fontSize: 20,
                  },
                  legend: {
                    display: chartState.showLegend,
                    position: "bottom",
                    rtl: false,
                  },
                }}
              />
            );
          }
          break;
        // scatter type
        case "bubble":
          if (checkType(chartState.dimensionData)) {
            setChartState({ ...chartState, type: "bar" });
            toast.error(
              "Bubble chart can only be rendered on numbers, Please change dimension of type number!!!"
            );
            // alert(
            //   "Bubble chart can only be rendered on numbers, Please change measure to render bubble chart!!!"
            // );
            return null;
          } else {
            return (
              <Bubble
                data={bubbleData}
                //redraw={!sideBar}
                options={{
                  layout: {
                    padding: {
                      top: -20,
                      bottom: 0,
                      right: 30,
                      left: -20,
                    },
                  },
                  plugins: {
                    // labels: row,
                    datalabels: {
                      display: false,
                      // color: "#FFFFFF",
                      align: "end",
                      anchor: "end",
                      // backgroundColor: "#0076FF",
                      // borderRadius: 4,
                      formatter: Math.round,
                      font: {
                        family: "Inter",
                        weight: "bold",
                        size: 8,
                      },
                      padding: 6,
                    },
                  },
                  showLines: false,
                  responsive: true,
                  tooltips: {
                    axis: "xy",
                    titleFontSize: 12,
                    titleFontStyle: "bold",
                    bodyFontSize: 10,
                    bodyFontStyle: "normal",
                  },
                  scales: {
                    xAxes: [
                      {
                        ticks: {
                          showLabelBackdrop: true,
                          beginAtZero: true,
                          callback: function (value: any) {
                            if (value !== null) {
                              if (value.length > 8) {
                                return `${value.substr(0, 8)}...`;
                              } else {
                                return value;
                              }
                            }
                          },
                        },
                        display: chartState.showAxis,
                        scaleLabel: {
                          display: chartState.showAxisTitle,
                          labelString: chartState.axisTitle,
                          fontSize: 20,
                        },
                        gridLines: {
                          display: chartState.showGrids,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                        display: chartState.showAxis,
                        scaleLabel: {
                          display: true,
                          // labelString: y,
                          fontSize: 20,
                        },
                        gridLines: {
                          display: chartState.showGrids,
                        },
                      },
                    ],
                  },
                  maintainAspectRatio: true,
                  title: {
                    display: true,
                    fontSize: 20,
                  },
                  legend: {
                    display: chartState.showLegend,
                    position: "bottom",
                    rtl: false,
                  },
                }}
              />
            );
          }
        // mixed type (line & bar)
        case "mixed":
          return (
            <Bar
              data={mixedData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  datalabels: {
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                elements: {
                  line: {
                    borderWidth: chartState.lineWeight,
                    fill: false,
                    tension: 0.1,
                  },
                },
                responsive: true,
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        showLabelBackdrop: true,
                        beginAtZero: true,
                        callback: function (value: any) {
                          if (value !== null) {
                            if (value.length > 8) {
                              return `${value.substr(0, 8)}...`;
                            } else {
                              return value;
                            }
                          }
                        },
                      },
                      display: chartState.showAxis,
                      stacked: false,
                      scaleLabel: {
                        display: chartState.showAxisTitle,
                        labelString: chartState.axisTitle,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                      stacked: false,
                      display: chartState.showAxis,
                      scaleLabel: {
                        display: true,
                        // labelString: y,
                        fontSize: 20,
                      },
                      gridLines: {
                        display: chartState.showGrids,
                      },
                    },
                  ],
                },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // pie type
        case "pie":
          return (
            <Pie
              data={pieData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                responsive: true,
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                  callbacks: {
                    label: function (tooltipItem: any, data: any) {
                      const dataset = data.datasets[tooltipItem.datasetIndex];
                      const currentValue = dataset.data[tooltipItem.index];
                      const percentage = dataset.percentage[tooltipItem.index];
                      // const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
                      return currentValue + " (" + percentage + "%)";
                    },
                    // title: function (tooltipItem: any, data: any) {
                    //   return data.labels[tooltipItem[0].index];
                    // },
                  },
                },
                // scales: {
                //   xAxes: [
                //     {
                //       display: chartState.showAxis,
                //       ticks: {
                //         showLabelBackdrop: true,
                //         beginAtZero: true,
                //         callback: function (value: any) {
                //           if (value.length > 8) {
                //             return `${value.substr(0, 8)}...`;
                //           } else {
                //             return value;
                //           }
                //         },
                //       },
                //       scaleLabel: {
                //         display: chartState.showAxisTitle,
                //         labelString: chartState.axisTitle,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //     },
                //   ],
                //   yAxes: [
                //     {
                //       display: chartState.showAxis,
                //       scaleLabel: {
                //         display: true,
                //         // labelString: y,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //     },
                //   ],
                // },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },

                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  fullWidth: false,
                  labels: { usePointStyle: true, fontSize: 8, boxWidth: 5 },
                  rtl: false,
                },
              }}
            />
          );
        // doughnut type
        case "doughnut":
          return (
            <Doughnut
              data={pieData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                responsive: true,
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                cutoutPercentage: 80,
                // scales: {
                //   xAxes: [
                //     {
                //       display: chartState.showAxis,
                //       ticks: {
                //         showLabelBackdrop: true,
                //         beginAtZero: true,
                //         callback: function (value: any) {
                //           if (value.length > 8) {
                //             return `${value.substr(0, 8)}...`;
                //           } else {
                //             return value;
                //           }
                //         },
                //       },
                //       scaleLabel: {
                //         display: chartState.showAxisTitle,
                //         labelString: chartState.axisTitle,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //     },
                //   ],
                //   yAxes: [
                //     {
                //       display: chartState.showAxis,
                //       scaleLabel: {
                //         display: true,
                //         // labelString: y,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //     },
                //   ],
                // },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                  callbacks: {
                    label: function (tooltipItem: any, data: any) {
                      const dataset = data.datasets[tooltipItem.datasetIndex];
                      const currentValue = dataset.data[tooltipItem.index];
                      const percentage = dataset.percentage[tooltipItem.index];
                      // const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
                      return currentValue + " (" + percentage + "%)";
                    },
                    // title: function (tooltipItem: any, data: any) {
                    //   return data.labels[tooltipItem[0].index];
                    // },
                  },
                },

                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  fullWidth: false,
                  labels: { usePointStyle: true, fontSize: 8, boxWidth: 5 },
                  rtl: false,
                },
              }}
            />
          );
        // polar type
        case "polarArea":
          return (
            <Polar
              type="polarArea"
              data={polarData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    // color: "#FFFFFF",
                    align: "end",
                    anchor: "end",
                    // backgroundColor: "#0076FF",
                    // borderRadius: 4,
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                responsive: true,
                scale: { display: false },
                showLines: false,
                hover: {
                  mode: "dataset",
                },
                // scales: {
                //   display: false,
                //   xAxes: [
                //     {
                //       display: chartState.showAxis,
                //       scaleLabel: {
                //         display: chartState.showAxisTitle,
                //         labelString: chartState.axisTitle,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //       ticks: {
                //         showLabelBackdrop: true,
                //         beginAtZero: true,
                //         callback: function (value: any) {
                //           if (value.length > 8) {
                //             return `${value.substr(0, 8)}...`;
                //           } else {
                //             return value;
                //           }
                //         },
                //       },
                //     },
                //   ],
                //   yAxes: [
                //     {
                //       display: chartState.showAxis,
                //       scaleLabel: {
                //         display: true,
                //         // labelString: y,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //       ticks: {
                //         beginAtZero: true,
                //       },
                //     },
                //   ],
                // },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                  callbacks: {
                    label: function (tooltipItem: any, data: any) {
                      const dataset = data.datasets[tooltipItem.datasetIndex];
                      const currentValue = dataset.data[tooltipItem.index];
                      const percentage = dataset.percentage[tooltipItem.index];
                      // const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
                      return currentValue + " (" + percentage + "%)";
                    },
                    // title: function (tooltipItem: any, data: any) {
                    //   return data.labels[tooltipItem[0].index];
                    // },
                  },
                },

                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  fullWidth: false,
                  labels: { usePointStyle: true, fontSize: 8, boxWidth: 5 },
                  rtl: false,
                },
              }}
            />
          );
        // radar type
        case "radar":
          return (
            <Radar
              data={radarData}
              //redraw={!sideBar}
              options={{
                layout: {
                  padding: {
                    top: -20,
                    bottom: 0,
                    right: 30,
                    left: -20,
                  },
                },
                elements: {
                  line: {
                    // borderWidth: lineWeight,
                    fill: false,
                    tension: 0.1,
                  },
                },
                responsive: true,
                plugins: {
                  // labels: row,
                  datalabels: {
                    display: chartState.showLabel,
                    align: "end",
                    anchor: "end",
                    formatter: Math.round,
                    font: {
                      family: "Inter",
                      weight: "bold",
                      size: 8,
                    },
                    padding: 6,
                  },
                },
                // scales: {
                //   xAxes: [
                //     {
                //       display: chartState.showAxis,
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //       scaleLabel: {
                //         display: chartState.showAxisTitle,
                //         labelString: chartState.axisTitle,
                //         fontSize: 20,
                //       },
                //       ticks: {
                //         showLabelBackdrop: true,
                //         beginAtZero: true,
                //         callback: function (value: any) {
                //           if (value.length > 8) {
                //             return `${value.substr(0, 8)}...`;
                //           } else {
                //             return value;
                //           }
                //         },
                //       },
                //     },
                //   ],
                //   yAxes: [
                //     {
                //       display: chartState.showAxis,
                //       scaleLabel: {
                //         display: true,
                //         // labelString: y,
                //         fontSize: 20,
                //       },
                //       gridLines: {
                //         display: chartState.showGrids,
                //       },
                //       ticks: {
                //         beginAtZero: true,
                //       },
                //     },
                //   ],
                // },
                scale: { display: true, ticks: { display: false }, animate: true },
                maintainAspectRatio: true,
                title: {
                  display: true,
                  fontSize: 20,
                },
                tooltips: {
                  axis: "xy",
                  titleFontSize: 12,
                  titleFontStyle: "bold",
                  bodyFontSize: 10,
                  bodyFontStyle: "normal",
                },
                legend: {
                  display: chartState.showLegend,
                  position: "bottom",
                  rtl: false,
                },
              }}
            />
          );
        // table type
        case "table":
          return (
            <div className="me-4 mt-3">
              <QueryResults
                row={10}
                list={chartState.tableHeads}
                query={chartState.tableData}
                chart={tableStyles}
              />
            </div>
          );

        case "histogram":
          // if (typeof xValues[0] === "string") {
          if (checkType(chartState.dimensionData)) {
            setChartState({ ...chartState, type: "bar" });
            toast.error(
              "Histogram chart can only be rendered on numbers, Please change dimension to render this chart!!!"
            );
          } else {
            return (
              <Histogram
                xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 600}
                ydim={root == "dashboard" ? parseInt(height, 10) - 40 : 300}
                margin={
                  root == "dashboard"
                    ? {
                        top: 80,
                        right: 30,
                        bottom: 50,
                        left: 60,
                      }
                    : {
                        top: 10,
                        right: 30,
                        bottom: 20,
                        left: 50,
                      }
                }
                xdata={chartState.dimensionData}
                d3Data={d3Data}
                xOption={chartState.dimension}
                yOption={chartState.measures}
                tooltip={toolTip}
                legendsVisible={chartState.showLegend}
                showXAxisTitle={chartState.showAxisTitle}
                xAxisTitle={chartState.axisTitle}
                showAxis={chartState.showAxis}
              />
            );
          }
          break;
        case "treeMap":
          return (
            <TreeMap
              xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 750}
              ydim={root == "dashboard" ? parseInt(height, 10) - 50 : 380}
              margin={{
                top: 10,
                right: 30,
                bottom: 20,
                left: 50,
              }}
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              legendsVisible={chartState.showLegend}
            />
          );

        case "heatMap":
          return (
            <HeatMap
              xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 750}
              ydim={root == "dashboard" ? parseInt(height, 10) + 50 : 500}
              margin={
                root == "dashboard"
                  ? {
                      top: 70,
                      right: 30,
                      bottom: 10,
                      left: 50,
                    }
                  : {
                      top: 20,
                      right: 30,
                      bottom: 20,
                      left: 70,
                    }
              }
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              legendsVisible={chartState.showLegend}
              showXAxisTitle={chartState.showAxisTitle}
              xAxisTitle={chartState.axisTitle}
              showAxis={chartState.showAxis}
            />
          );

        case "waffle":
          // if (typeof xValues[0] === "string") {
          if (checkType(chartState.dimensionData)) {
            setChartState({ ...chartState, type: "bar" });
            toast.error("Dimension should be a number for waffle chart");
          } else {
            return (
              <WaffleChart
                xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 480}
                ydim={root == "dashboard" ? parseInt(height, 10) - 20 : 300}
                margin={{
                  top: 5,
                  right: 30,
                  bottom: 0,
                  left: 25,
                }}
                xdata={chartState.dimensionData}
                d3Data={d3Data}
                xOption={chartState.dimension}
                yOption={chartState.measures}
                tooltip={toolTip}
                legendsVisible={chartState.showLegend}
              />
            );
          }
          break;
        case "packedBubble":
          return (
            <PackedBubble
              xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 700}
              ydim={root == "dashboard" ? parseInt(height, 10) - 90 : 360}
              margin={{
                top: 5,
                right: 30,
                bottom: 20,
                left: 25,
              }}
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              legendsVisible={chartState.showLegend}
            />
          );

        case "boxPlot":
          return (
            <BoxPlot
              xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 1100}
              ydim={root == "dashboard" ? parseInt(height, 10) - 80 : 520}
              // margin={{
              //   top: 10,
              //   right: 30,
              //   bottom: 0,
              //   left: 50,
              // }}
              margin={
                root == "dashboard"
                  ? {
                      top: 10,
                      right: 30,
                      bottom: 50,
                      left: 50,
                    }
                  : {
                      top: 10,
                      right: 30,
                      bottom: 70,
                      left: 50,
                    }
              }
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              showXAxisTitle={chartState.showAxisTitle}
              xAxisTitle={chartState.axisTitle}
              showAxis={chartState.showAxis}
            />
          );

        case "paretoChart":
          return (
            <ParetoChart
              xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 700}
              ydim={root == "dashboard" ? parseInt(height, 10) - 100 : 360}
              margin={{
                top: 20,
                right: 30,
                bottom: 70,
                left: 60,
              }}
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              legendsVisible={chartState.showLegend}
              showXAxisTitle={chartState.showAxisTitle}
              xAxisTitle={chartState.axisTitle}
              showAxis={chartState.showAxis}
            />
          );

        case "waterfallChart":
          return (
            <WaterfallChart
              xdim={root == "dashboard" ? parseInt(width, 10) - 30 : 680}
              ydim={root == "dashboard" ? parseInt(height, 10) - 60 : 330}
              margin={{
                top: 30,
                right: 30,
                bottom: 20,
                left: 60,
              }}
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              showXAxisTitle={chartState.showAxisTitle}
              xAxisTitle={chartState.axisTitle}
              showAxis={chartState.showAxis}
            />
          );

        case "sankey":
          return (
            <SankeyChart
              xdim={root == "dashboard" ? parseInt(width, 10) - 20 : 700}
              ydim={root == "dashboard" ? parseInt(height, 10) - 130 : 380}
              margin={{
                top: 0,
                right: 30,
                bottom: 0,
                left: 50,
              }}
              xdata={chartState.dimensionData}
              d3Data={d3Data}
              xOption={chartState.dimension}
              yOption={chartState.measures}
              tooltip={toolTip}
              legendsVisible={chartState.showLegend}
            />
          );

        case "bump":
          if (chartState.measures.length === 1 || chartState.dimension.length === 0) {
            toast.error("Please add another measure to render bump chart!!");
            return (
              <div
                style={{ height: "60vh" }}
                className="d-flex flex-column align-items-center mt-5 justify-content-center"
              >
                <h4 style={{ fontSize: 32, fontWeight: 700, color: "#0076FF" }}>
                  Build visuals with your data.
                </h4>
                <h6 style={{ fontSize: 18, fontWeight: 400 }}>
                  Please add proper measure and dimensions.
                </h6>
                <Image
                  src="/dummyChart.svg"
                  alt="create chart"
                  width="286"
                  height="221"
                  className="me-1 mt-3"
                />
              </div>
            );
          } else {
            return (
              <BumpChart
                xdim={root == "dashboard" ? parseInt(width, 10) - 0 : 650}
                ydim={root == "dashboard" ? parseInt(height, 10) - 190 : 310}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 150,
                  left: 30,
                }}
                xdata={chartState.dimensionData}
                d3Data={d3Data}
                xOption={chartState.dimension}
                yOption={chartState.measures}
                tooltip={toolTip}
                legendsVisible={chartState.showLegend}
                showXAxisTitle={chartState.showAxisTitle}
                xAxisTitle={chartState.axisTitle}
                showAxis={chartState.showAxis}
              />
            );
          }

        case "map":
          if (!worldCountries.includes(chartState.dimensionData[0])) {
            setChartState({ ...chartState, type: "bar" });
            toast.error("World map requires countries to be rendered");
          } else {
            return (
              <Map
                xdim={750}
                ydim={350}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 90,
                  left: 50,
                }}
                xdata={chartState.dimensionData}
                d3Data={d3Data}
                xOption={chartState.dimension}
                yOption={chartState.measures}
                tooltip={toolTip}
                legendsVisible={chartState.showLegend}
              />
            );
          }
          // default:
          //   <p>Default</p>;
          break;
      }
    }
  };

  return <div className="myCanvas">{chart(chartState.type)}</div>;
};

export default VisualizationComponent;
