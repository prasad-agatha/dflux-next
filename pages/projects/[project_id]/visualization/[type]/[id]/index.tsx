// react
import React, { FC } from "react";
// react bootstrap
import { Modal, Accordion } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// next router
import { useRouter } from "next/router";
// lodash
import _ from "lodash";
// toasts
import { toast } from "react-toastify";
// d3
import * as d3 from "d3";
// html to image
import * as htmlToImage from "html-to-image";
// components
import { PageLoader } from "components/loaders";
// services
import { QueryService, ModelService, ChartService, ConnectionsService } from "services";
import { NewDashboard } from "components/modals";
import ChartTabs from "@components/charts/tabs";
import VisualizationComponent from "@components/charts/visualizationComponent";
import {
  chartDataFormat,
  downloadAsImage,
  filter_function,
  format_chartData,
  sort_ascending,
  sort_descending,
  dataURLtoFile,
} from "@components/charts/chart_functions";
import FiltersComponent from "@components/charts/filters";
import { QueryResults } from "@components/data-tables";
import { tableStyles } from "@constants/common";
import { ChartTitleBar } from "@components/charts";
import { useRequest } from "@lib/hooks";

//toast configuration
toast.configure();

const models = new ModelService();
const sql_data = new QueryService();
const chartService = new ChartService();
const connections = new ConnectionsService();

const Visualization: FC = () => {
  const router = useRouter();
  const { project_id, type, id, edit } = router.query;
  if (!project_id && !id && !type) {
    return <PageLoader />;
  }
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });

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

  const [chartState, setChartState] = React.useState<any>({
    data: [],
    fullScreen: false,
    showTable: false,
    measures: [],
    dimension: [],
    measuresData: [],
    dimensionData: [],
    tableName: "",
    connectionId: 0,
    options: [],
    key: "data",
    type: "bar",
    category: "chartjs",
    sortingField: "",
    showLabel: false,
    showLegend: true,
    showGrids: true,
    showAxis: true,
    showAxisTitle: true,
    axisTitle: "",
    lastUpdated: "",
    ascending: false,
    descending: false,
    tableHeads: [],
    tableData: [],
    d3Data: [],
    optionsCount: 0,
    aggregate: "None",
    sort: "Default",
    aggregateOptions: [
      { checked: false, label: "Sum" },
      { checked: false, label: "Average" },
      { checked: false, label: "Count" },
      { checked: false, label: "Minimum" },
      { checked: false, label: "Maximum" },
    ],
    name: "",
    description: "",
    editTitle: false,
    saving: false,
    lineWeight: 1,
  });

  const [newState, setNewState] = React.useState({
    dashboard: false,
  });

  const [dnd, setDnd] = React.useState<any>({});

  const [loading, setLoading] = React.useState(true);

  const [sideBar, setSideBar] = React.useState(true);

  const [toolTip, setToolTip] = React.useState([]) as any;

  const [reDraw, setRedraw] = React.useState(false);

  // const [filters, setFilters] = React.useState<any>([]);

  const [filters1, setFilters1] = React.useState<any>({ dropdown: [], textBox: [], slider: [] });

  const [d3Data, setD3Data] = React.useState<any>({});

  const [verticalBarData, setVerticalBarData] = React.useState<any>({});

  const [verticalStackData, setVerticalStackData] = React.useState<any>({});

  const [curveLineData, setCurveLineData] = React.useState<any>({});

  const [queryDetails, setQueryDetails] = React.useState<any>({});
  const [queryFilters, setQueryFilters] = React.useState<any>({});
  const [update, setUpdate] = React.useState<any>(true);
  const [thumbnail, setThumbnail] = React.useState<any>();

  // scatter type
  const [scatterData, setScatterData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // mixed chart type
  const [mixedData, setMixedData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // area chart type
  const [areaData, setAreaData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // bubble chart type
  const [bubbleData, setBubbleData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // bubble chart type
  const [pieData, setPieData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // bubble chart type
  const [polarData, setPolarData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // bubble chart type
  const [radarData, setRadarData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  React.useEffect(() => {
    // setBaseUrl(window.location.origin);
    setToolTip(tooltip);
  }, []);

  // options are decided by user so on query data updation we cannot directly update
  // hence we gave refresh button
  React.useEffect(() => {
    if (id) {
      if (edit) {
        chartService
          .getChartDetail(edit)
          .then((response: any) => {
            setDnd(response.extra.dnd);
            setThumbnail(response.extra.thumbnail);
            // setTitle(response.extra?.axisTitle || "");
            setSideBar(true);

            renderChart(
              true,
              response.extra?.axisTitle || "",
              response.extra?.showLabel,
              response.extra?.showLegend,
              response.extra?.showGrids,
              response.extra?.showAxis,
              response.extra?.showAxisTitle,
              response.extra.data,
              response.extra.dimension,
              response.extra.measures,
              response.extra.aggregate,
              response.extra.filters,
              response.extra?.optionsCount || response.extra.data.length,
              response.extra.ascending,
              response.extra.descending,
              response.extra.sortingField,
              true,
              response
            );
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        if (type === "query") {
          sql_data
            .getQueryDetails(id)
            .then((response: any) => {
              const firstRowData = response.extra.data[0];
              const firstRowKeys = Object.keys(firstRowData);
              const finalRowData: any = [];
              Object.values(firstRowData).map((item: any, index: any) => {
                if (typeof item === "string") {
                  finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
                }
              });
              Object.values(firstRowData).map((item: any, index: any) => {
                if (typeof item === "number") {
                  finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
                }
              });
              Object.values(firstRowData).map((item: any, index: any) => {
                if (typeof item === "object") {
                  finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
                }
              });
              const b: any = {};
              finalRowData.map((item: any, index: any) => {
                b[`option_${index}`] = {
                  id: `option_${index}`,
                  content: item.item,
                  type: item.type,
                };
              });
              const c = Object.keys(response?.extra.data[0]).map((item: any, index: any) => {
                return `option_${index}`;
              });

              setDnd({
                tasks: b,
                columns: {
                  Options: {
                    id: "Options",
                    title: "Available Fields",
                    taskIds: c,
                  },
                  Measure: {
                    id: "Measure",
                    title: "Dimensions",
                    taskIds: [],
                  },
                  Dimensions: {
                    id: "Dimensions",
                    title: "Measure",
                    taskIds: [],
                  },
                },
                columnOrder: ["Measure", "Options", "Dimensions"],
              });

              const updateChartState = {
                ...chartState,
                data: response.extra.data,
                lastUpdated: response.updated,
                tableName: response.excel_name,
                connectionId: response.connection,
                raw_sql: response.raw_sql,
                optionsCount: response.extra.data.length,
                lineWeight: response.extra?.lineWeight || 1,
                options: Object.keys(response?.extra.data[0]).map((item: any, index: any) => {
                  return {
                    field: item, //name,id
                    label: item,
                    value: item,
                    key: index,
                    type: typeof response.extra.data[0][item],
                  };
                }),
              };
              setChartState(updateChartState);
              setQueryDetails(updateChartState);
              setLoading(false);
            })
            .catch((error: any) => {
              toast.error(error);
            });
        } else {
          models
            .getModel(project_id, id)
            .then((response: any) => {
              const b: any = {};
              const firstRowData = response.data[0];
              const firstRowKeys = Object.keys(firstRowData);
              const finalRowData: any = [];
              Object.values(firstRowData).map((item: any, index: any) => {
                if (typeof item === "string") {
                  finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
                }
              });
              Object.values(firstRowData).map((item: any, index: any) => {
                if (typeof item === "number") {
                  finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
                }
              });
              finalRowData.map((item: any, index: any) => {
                b[`option_${index}`] = {
                  id: `option_${index}`,
                  content: item.item,
                  type: item.type,
                };
              });
              const c = Object.keys(response.data[0]).map((item: any, index: any) => {
                return `option_${index}`;
              });

              setDnd({
                tasks: b,
                columns: {
                  Options: {
                    id: "Options",
                    title: "Available Fields",
                    taskIds: c,
                  },
                  Measure: {
                    id: "Measure",
                    title: "Dimensions",
                    taskIds: [],
                  },
                  Dimensions: {
                    id: "Dimensions",
                    title: "Measure",
                    taskIds: [],
                  },
                },
                columnOrder: ["Measure", "Options", "Dimensions"],
              });

              const updateChartState = {
                ...chartState,
                data: response.data,
                optionsCount: response.data.length,
                lineWeight: response.extra?.lineWeight || 1,
                options: Object.keys(response?.data[0]).map((item: any, index: any) => {
                  return {
                    field: item, //name,id
                    label: item,
                    value: item,
                    key: index,
                    type: typeof response.data[0][item],
                  };
                }),
              };
              setChartState(updateChartState);
              setQueryDetails(updateChartState);
              setLoading(false);
            })
            .catch((error: any) => {
              toast.error(error);
            });
        }
      }
    }
  }, [id, update]);
  // save new chart on save button
  const saveChart = () => {
    setChartState({ ...chartState, saving: true });
    const node1: any = document?.getElementById("myCanvas");

    // const inputRef: any = window.document.getElementsByClassName("myCanvas")[0];
    if (!chartState.name.trim()) {
      setChartState({ ...chartState, saving: false });
      toast.error("Please enter chart name", { autoClose: 3000 });
    } else if (chartState.dimension[0] === "" || chartState.dimension.length === 0) {
      setChartState({ ...chartState, saving: false });
      toast.error("Select proper dimensions!!!", { autoClose: 3000 });
    } else if (chartState.measures.length === 0) {
      setChartState({ ...chartState, saving: false });
      toast.error("Please select proper measures!!!", { autoClose: 3000 });
    } else if (chartState.query === "undefined") {
      setChartState({ ...chartState, saving: false });
      toast.error("Chart cannot be saved without data!!!", { autoClose: 3000 });
    } else {
      htmlToImage.toPng(node1).then(function (dataUrl: any) {
        const imgData = new FormData();
        const file = dataURLtoFile(dataUrl, `${chartState.name}.png`);
        imgData.append("name[]", `chart`);
        imgData.append("asset[]", file);

        connections.dumpJSONFile(imgData).then((res: any) => {
          chartService
            .saveChart(project_id, {
              query: type === "query" ? Number(id) : null,
              data_model: type === "query" ? null : Number(id),
              save_from: type === "query" ? "query" : "data_model",
              name: chartState.name,
              chart_type: chartState.type,
              data: { dnd: dnd },
              extra: {
                thumbnail: res[0],
                filters: filters1,
                dnd: dnd,
                data: chartState.data,
                description: chartState.description,
                tableHeads: chartState.tableHeads,
                tableData: chartState.tableData,
                dimension: chartState.dimension,
                axisTitle: chartState.axisTitle,
                measures: chartState.measures,
                measuresData: chartState.measuresData,
                aggregate: chartState.aggregate,
                ascending: chartState.ascending,
                descending: chartState.descending,
                sortingField: chartState.sortingField,
                showLabel: chartState.showLabel,
                showLegend: chartState.showLegend,
                showGrids: chartState.showGrids,
                showAxis: chartState.showAxis,
                showAxisTitle: chartState.showAxisTitle,
                optionsCount: chartState.optionsCount,
                lineWeight: chartState.lineWeight,
              },
            })
            .then((response: any) => {
              setChartState({ ...chartState, saving: false });
              toast.success("Chart saved successfully", { autoClose: 3000 });

              router
                .push(`/projects/${project_id}/visualization/${type}/${id}?edit=${response.id}`)
                .then(() => {
                  window.location.reload();
                });
            })
            .catch((e: any) => {
              setChartState({ ...chartState, saving: false });
              toast.error("Error saving chart", { autoClose: 3000 });
              toast.error(e.non_field_errors[0]);
            });
        });
      });
    }
  };
  // update existing chart on save button
  const updateChart = () => {
    setChartState({ ...chartState, saving: true });
    const node1: any = document?.getElementById("myCanvas");

    // const inputRef: any = window.document.getElementsByClassName("myCanvas")[0];
    if (!chartState.name.trim()) {
      setChartState({ ...chartState, saving: false });
      toast.error("Please enter chart name", { autoClose: 3000 });
    } else if (chartState.dimension[0] === "" || chartState.dimension.length === 0) {
      setChartState({ ...chartState, saving: false });
      toast.error("Select proper dimensions!!!", { autoClose: 3000 });
    } else if (chartState.measures.length === 0) {
      setChartState({ ...chartState, saving: false });
      toast.error("Please select proper measures!!!", { autoClose: 3000 });
    } else if (chartState.query === "undefined") {
      setChartState({ ...chartState, saving: false });
      toast.error("Chart cannot be saved without data!!!", { autoClose: 3000 });
    } else {
      htmlToImage.toPng(node1).then(function (dataUrl: any) {
        const imgData = new FormData();
        const file = dataURLtoFile(dataUrl, `${chartState.name}.png`);
        imgData.append("name[]", `chart`);
        imgData.append("asset[]", file);

        connections.dumpJSONFile(imgData).then((res: any) => {
          const xtra = {
            thumbnail: { ...res[0], previous_id: thumbnail?.id || null },
            filters: filters1,
            dnd: dnd,
            data: chartState.data,
            dimension: chartState.dimension,
            axisTitle: chartState.axisTitle,
            measures: chartState.measures,
            description: chartState.description,
            tableHeads: chartState.tableHeads,
            tableData: chartState.tableData,
            measuresData: chartState.measuresData,
            aggregate: chartState.aggregate,
            ascending: chartState.ascending,
            descending: chartState.descending,
            sortingField: chartState.sortingField,
            showLabel: chartState.showLabel,
            showLegend: chartState.showLegend,
            showGrids: chartState.showGrids,
            showAxis: chartState.showAxis,
            showAxisTitle: chartState.showAxisTitle,
            optionsCount: chartState.optionsCount,
            lineWeight: chartState.lineWeight,
          };

          chartService
            .updateChart(edit, {
              query: type === "query" ? Number(id) : null,
              data_model: type === "query" ? null : Number(id),
              save_from: type === "query" ? "query" : "data_model",
              name: chartState.name,
              chart_type: chartState.type,
              project: Number(project_id),
              data: { dnd: dnd },
              extra: xtra,
            })
            .then(() => {
              setChartState({ ...chartState, saving: false });
              setUpdate(!update);
              // toast.success("Chart updated successfully", { autoClose: 3000 });
            })
            .catch((e: any) => {
              setChartState({ ...chartState, saving: false });
              toast.error("Error saving chart", { autoClose: 3000 });
              toast.error(e.non_field_errors[0]);
            });
        });
      });
    }
  };

  // React.useEffect(() => {
  //   setRedraw(!reDraw);
  // }, [sideBar]);

  /* renders charts dynamically with given data, axis(dimension, measures) and filters
   * with aggregate, counts of rows and sorting order
   * this function which will render the chart on every action of user
   * Requirements :
   * data, dimension and measures for the chart to render
   */
  const renderChart = (
    initialDetails: any,
    axisTitle: any,
    showLabel: any,
    showLegend: any,
    showGrids: any,
    showAxis: any,
    showAxisTitle: any,
    data: any,
    dimension: any,
    measures: any,
    aggregate: any,
    filters: any,
    count: any,
    ascending: any,
    descending: any,
    sortingField: any,
    render?: any,
    response?: any
  ) => {
    // final aggregate will be an one of average, sum, count, min, max or none
    const filters1 = [
      ...filters.dropdown,
      ...filters.textBox.filter((el: any) => el.filterInput !== ""),
      ...filters.slider,
    ];
    const tempData: any = filter_function(
      [...data].splice(0, count),
      filters1,
      dimension,
      measures,
      aggregate
    );
    // sorting
    // console.log(tempData);
    if (ascending) {
      // console.log(tempData.sort(sort_ascending(sortingField, true, parseInt, ascending)));
      tempData.sort(sort_ascending(sortingField, true, parseInt, ascending));
    } else if (descending) {
      // console.log(tempData.sort(sort_descending(sortingField, true, parseInt, descending)));
      tempData.sort(sort_descending(sortingField, true, parseInt, descending));
    }
    const tempData1: any = [];
    // get dimension and measures
    tempData.map((item: any) => {
      const obj: any = {};
      obj[dimension[0]] = item[dimension[0]];
      measures.map((item1: any) => {
        obj[item1] = item[item1];
      });
      tempData1.push(obj);
    });
    const measuresData = format_chartData(measures, tempData, render, response);
    const d3Object: any = [];
    tempData.map((item: any) => {
      Object.keys(item).map((item1: any) => {
        d3Object.push({ group: item1, category: item[item1], data: item });
      });
    });
    setD3Data(d3Object);

    const heads: any = [];
    const arrTable: any = tempData1?.length > 0 ? Object.keys(tempData1[0]) : [];
    [...arrTable]?.map((item: any, index: any) => {
      return heads.push({
        field: item,
        key: index,
      });
    });

    // console.log(dimension[0]);

    const dimensionsData = _.map(tempData, dimension[0]);
    // console.log(dimensionsData);
    const finalChartData: any = chartDataFormat(measuresData, measures, dimensionsData);
    // console.log(finalChartData[0]);
    // setting chart fields
    setVerticalBarData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[0] }),
      setVerticalStackData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[1] }),
      setCurveLineData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[2] }),
      setAreaData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[3] }),
      setMixedData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[4] });
    setScatterData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[5] });
    setBubbleData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[6] });
    setPieData({
      labels: measuresData[0]?.data.map((item2: any, index: any) => {
        return `${dimensionsData[index]} - ${Number(
          ((item2 / measuresData[0]?.sum) * 100).toFixed(2)
        )} %`;
      }),
      datasets: finalChartData[7],
    });
    setPolarData({
      labels: measuresData[0]?.data.map((item2: any, index: any) => {
        return `${dimensionsData[index]} - ${Number(
          ((item2 / measuresData[0]?.sum) * 100).toFixed(2)
        )} %`;
      }),
      datasets: finalChartData[8],
    });
    setRadarData({ labels: _.map(tempData, dimension[0]), datasets: finalChartData[9] });

    // setFilters(filters);
    setFilters1(filters);
    if (initialDetails) setQueryFilters(filters);
    if (render) {
      const firstRowData = response.extra.data[0];
      const firstRowKeys = Object.keys(firstRowData);
      const finalRowData: any = [];
      Object.values(firstRowData).map((item: any, index: any) => {
        if (typeof item === "string") {
          finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
        }
      });
      Object.values(firstRowData).map((item: any, index: any) => {
        if (typeof item === "number") {
          finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
        }
      });
      Object.values(firstRowData).map((item: any, index: any) => {
        if (typeof item === "object") {
          finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
        }
      });
      const b: any = {};
      finalRowData.map((item: any, index: any) => {
        b[`option_${index}`] = {
          id: `option_${index}`,
          content: item.item,
          type: item.type,
        };
      });
      // const c = Object.keys(response?.extra.data[0]).map((item: any, index: any) => {
      //   return `option_${index}`;
      // });
      // console.log(chartState);

      if (response.save_from === "query") {
        const updateChartState = {
          ...chartState,
          data: data,
          lastUpdated: response.updated,
          name: response.name,
          tableName: response.query.excel_name,
          connectionId: response.query.connection,
          raw_sql: response.query.raw_sql,
          optionsCount: count,
          dimension: dimension,
          dimensionData: _.map(tempData, dimension[0]),
          measures: measures,
          measuresData: measuresData,
          aggregate: response.extra.aggregate,
          axisTitle,
          showLabel,
          showLegend,
          showGrids,
          showAxis,
          showAxisTitle,
          lineWeight: response.extra?.lineWeight || 1,
          sort:
            ascending || descending
              ? ascending
                ? "Ascending"
                : descending
                ? "Descending"
                : "Default"
              : "Default",
          // aggregateOptions: aggregateOptions,
          ascending: ascending,
          descending: descending,
          sortingField: sortingField,
          tableHeads: heads,
          tableData: tempData1,
          options: Object.keys(response.extra.data[0]).map((item: any, index: any) => {
            return {
              field: item, //name,id
              label: item,
              value: item,
              key: index,
              type: typeof response.extra.data[0][item],
            };
          }),
          type: response.chart_type,
        };
        setChartState(updateChartState);
        if (initialDetails) setQueryDetails(updateChartState);

        setLoading(false);
      } else {
        const updateChartState = {
          ...chartState,
          data: data,
          name: response.name,
          optionsCount: count,
          dimension: dimension,
          dimensionData: _.map(tempData, dimension[0]),
          measures: measures,
          measuresData: measuresData,
          aggregate: aggregate,
          axisTitle,
          showLabel,
          showLegend,
          showGrids,
          showAxis,
          showAxisTitle,
          lineWeight: response.extra?.lineWeight || 1,
          sort:
            ascending || descending
              ? ascending
                ? "Ascending"
                : descending
                ? "Descending"
                : "Default"
              : "Default",
          // aggregateOptions: aggregateOptions,
          ascending: ascending,
          descending: descending,
          sortingField: sortingField,
          tableHeads: heads,
          tableData: tempData1,
          options: Object.keys(response?.extra.data[0]).map((item: any, index: any) => {
            return {
              field: item, //name,id
              label: item,
              value: item,
              key: index,
              type: typeof response.extra.data[0][item],
            };
          }),
          type: response.chart_type,
        };
        setChartState(updateChartState);
        if (initialDetails) setQueryDetails(updateChartState);

        setLoading(false);
      }
    } else {
      const updateChartState = {
        ...chartState,
        data: data,
        dimension: dimension,
        dimensionData: _.map(tempData, dimension[0]),
        measures: measures,
        measuresData: measuresData,
        optionsCount: count,
        aggregate: aggregate,
        // aggregateOptions: aggregateOptions,
        ascending: ascending,
        descending: descending,
        axisTitle,
        showLabel,
        showLegend,
        showGrids,
        showAxis,
        showAxisTitle,
        lineWeight: response?.extra?.lineWeight || 1,
        sort:
          ascending || descending
            ? ascending
              ? "Ascending"
              : descending
              ? "Descending"
              : "Default"
            : "Default",
        sortingField: sortingField,
        tableHeads: heads,
        tableData: tempData1,
      };
      setChartState(updateChartState);
      if (initialDetails) setQueryDetails(updateChartState);
    }
  };
  // set chart colors for measures in style from right side bar
  const handleChartColor = (e: any, index: any) => {
    setRedraw(!reDraw);

    const labels = verticalBarData.labels;
    const data = verticalBarData.datasets;
    const data1 = verticalStackData.datasets;
    const data2 = curveLineData.datasets;
    const data3 = mixedData.datasets;
    const data4 = areaData.datasets;
    const data5 = scatterData.datasets;
    const data6 = bubbleData.datasets;
    const data7 = radarData.datasets;

    data[index].backgroundColor = e.target.value;
    data[index].borderColor = e.target.value;

    data1[index].backgroundColor = e.target.value;
    data1[index].borderColor = e.target.value;

    data2[index].backgroundColor = e.target.value;
    data2[index].borderColor = e.target.value;

    data3[index].backgroundColor = e.target.value;
    data3[index].borderColor = e.target.value;

    data4[index].backgroundColor = e.target.value;
    data4[index].borderColor = e.target.value;

    data5[index].backgroundColor = e.target.value;
    data5[index].borderColor = e.target.value;

    data6[index].backgroundColor = e.target.value;
    data6[index].borderColor = e.target.value;

    data7[index].backgroundColor = e.target.value;
    data7[index].borderColor = e.target.value;

    setVerticalBarData({ labels: labels, datasets: data });
    setVerticalStackData({ labels: labels, datasets: data1 });
    setCurveLineData({ labels: labels, datasets: data2 });
    setMixedData({ labels: labels, datasets: data3 });
    setAreaData({ labels: labels, datasets: data4 });
    setScatterData({ labels: labels, datasets: data5 });
    setBubbleData({ labels: labels, datasets: data6 });
    setRadarData({ labels: labels, datasets: data7 });

    chartState.measuresData[index].backgroundColor = e.target.value;
    chartState.measuresData[index].borderColor = e.target.value;

    setChartState({ ...chartState, yRow: chartState.yRow });
  };

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Visualization`} description="charts" />
      {loading ? (
        <PageLoader />
      ) : (
        <div className={sideBar ? "chart-layout px-4 mx-3" : "chart-layout-left px-4 mx-3"}>
          <div className="chart-left">
            <ChartTitleBar
              saveChart={saveChart}
              chartState={chartState}
              setChartState={setChartState}
              reDraw={reDraw}
              setRedraw={setRedraw}
              sideBar={sideBar}
              setSideBar={setSideBar}
              edit={edit}
              type={type}
              updateChart={updateChart}
              downloadAsImage={downloadAsImage}
              filters1={filters1}
              renderChart={renderChart}
              id={id}
              newState={newState}
              setNewState={setNewState}
              userRole={userRole}
              queryDetails={queryDetails}
              queryFilters={queryFilters}
            />
            <FiltersComponent
              setFilters1={setFilters1}
              filters1={filters1}
              renderChart={renderChart}
              chartState={chartState}
            />

            <div id="myCanvas">
              <VisualizationComponent
                verticalBarData={verticalBarData}
                chartState={chartState}
                setChartState={setChartState}
                reDraw={reDraw}
                sideBar={sideBar}
                verticalStackData={verticalStackData}
                curveLineData={curveLineData}
                areaData={areaData}
                mixedData={mixedData}
                scatterData={scatterData}
                bubbleData={bubbleData}
                pieData={pieData}
                polarData={polarData}
                radarData={radarData}
                d3Data={d3Data}
                toolTip={toolTip}
              />
              {chartState.showTable ? (
                <Accordion
                  defaultActiveKey="1"
                  className="me-4"
                  style={{ backgroundColor: "#E5E8EC" }}
                >
                  <Accordion.Toggle className="border-0 px-0 w-100 border-bottom-0" eventKey="1">
                    <div className="d-flex flex-row justify-content-between justify-content-between">
                      <div className="f-13 py-2 ms-2" style={{ fontWeight: 600, color: "#0076FF" }}>
                        Results Panel
                      </div>
                      {/* <div
                        className="py-1"
                        // style={{ backgroundColor: "#E5E8EC" }}
                      >
                        <ChevronDown width={12} height={16} className="ms-2 mt-1 cursor-pointer" />
                      </div> */}
                      <div className="ms-4">
                        <button
                          className="btn f-13"
                          onClick={() => {
                            setChartState({
                              ...chartState,
                              showTable: false,
                            });
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse className="" eventKey="1">
                    <div className="model-div">
                      <QueryResults
                        row={5}
                        list={chartState.tableHeads}
                        query={chartState.tableData}
                        chart={tableStyles}
                      />
                    </div>
                  </Accordion.Collapse>
                </Accordion>
              ) : null}
            </div>
          </div>
          <div className={"chart-middle " + (sideBar ? "" : "border-1 border-start")}>
            <img
              src={sideBar ? "/collapse-img.svg" : "/expand.svg"}
              className="cursor-pointer"
              onClick={() => setSideBar(!sideBar)}
            />
          </div>
          <div className={sideBar ? "chart-right" : "d-none"}>
            <ChartTabs
              type={type}
              dnd={dnd}
              setDnd={setDnd}
              chartState={chartState}
              setChartState={setChartState}
              reDraw={reDraw}
              setRedraw={setRedraw}
              renderChart={renderChart}
              filters1={filters1}
              setFilters1={setFilters1}
              verticalBarData={verticalBarData}
              handleChartColor={handleChartColor}
            />
          </div>
        </div>
      )}
      <NewDashboard newState={newState} setNewState={setNewState} />
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
            {chartState.name}
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
            verticalBarData={verticalBarData}
            chartState={chartState}
            reDraw={reDraw}
            sideBar={sideBar}
            setChartState={setChartState}
            verticalStackData={verticalStackData}
            curveLineData={curveLineData}
            areaData={areaData}
            mixedData={mixedData}
            scatterData={scatterData}
            bubbleData={bubbleData}
            pieData={pieData}
            polarData={polarData}
            radarData={radarData}
            d3Data={d3Data}
            toolTip={toolTip}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Visualization;
