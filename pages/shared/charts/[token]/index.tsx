// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "lib/hooks";
// lodash
import _ from "lodash";
// react-bootstrap
import { Col } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// toast
import { toast } from "react-toastify";
// d3
import * as d3 from "d3";

// components
import { PageLoading } from "components/loaders";
import { InviteNavbar } from "components/navbars";
// services
import { TriggerService, ChartService } from "services";
import FiltersComponent from "@components/charts/filters";
import VisualizationComponent from "@components/charts/visualizationComponent";
import {
  chartDataFormat,
  filter_function,
  format_chartData,
  sort_ascending,
  sort_descending,
} from "@components/charts/chart_functions";
//toast configuration
toast.configure();

const triggers = new TriggerService();
const charts = new ChartService();
const SharedChartPage: FC = () => {
  const router = useRouter();
  const { token } = router.query;
  if (!token) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }
  const { data: chartData }: any = useRequest({
    url: `api/shared-charts/?token=${token}`,
  });
  // scatter type
  const [verticalBarData, setVerticalBarData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************
  // scatter type
  const [curveLineData, setCurveLineData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************
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
  // bubble chart type
  const [verticalStackData, setVerticalStackData] = React.useState<any>({}); // ************************** DON'T CHANGE *****************************

  // filters
  const [filters, setFilters] = React.useState<any>({ dropdown: [], textBox: [], slider: [] });
  const [d3Data, setD3Data] = React.useState<any>({});
  const [toolTip, setToolTip] = React.useState([]) as any;
  const [titleVisible, setTitleVisible] = React.useState(true);

  const [chartState, setChartState] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);

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
    .style("padding", "0.2rem")
    .style(" font-size", "0.7rem")
    .style(" text-align", "center")
    .style("pointer-events", "none")
    .style("text-transform", "capitalize");

  React.useEffect(() => {
    setToolTip(tooltip);
    charts
      .getSharedChartDetail(token)
      .then((response: any) => {
        loadChart(response);
      })
      .catch(() => {
        alert("Error fetching chart data");
      });
  }, []);

  // get shared chart from token
  const loadChart = (res: any) => {
    setTitleVisible(res.extra.titleVisible);
    triggers.getTriggerOutput(res.query.id).then(() => {
      if (res) {
        renderChart(
          res.extra?.axisTitle || "",
          res.extra?.showLabel,
          res.extra?.showLegend,
          res.extra?.showGrids,
          res.extra?.showAxis,
          res.extra?.showAxisTitle,
          res.extra.data,
          res.extra.dimension,
          res.extra.measures,
          res.extra.aggregate,
          res.extra.filters,
          res.extra?.optionsCount || res.extra.data.length,
          res.extra.ascending,
          res.extra.descending,
          res.extra.sortingField,
          true,
          res
        );
      }
    });
  };

  /* renders charts dynamically with given data, axis(dimension, measures) and filters
   * with aggregate, counts of rows and sorting order
   * this function which will render the chart on every action of user
   * Requirements :
   * data, dimension and measures for the chart to render
   */
  const renderChart = (
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

    const filters1 = [...filters.dropdown, ...filters.textBox, ...filters.slider];
    // takes filters and returns  combination of sort filter and aggregated data
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

    const dimensionsData = _.map(tempData, dimension[0]);
    const finalChartData = chartDataFormat(measuresData, measures, dimensionsData);
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

    setFilters(filters);
    if (render) {
      if (response.save_from === "query") {
        setChartState({
          ...chartState,
          data: data,
          name: response.name,
          tableName: response.query.excel_name,
          connectionId: response.query.connection,
          optionsCount: count,
          dimension: dimension,
          dimensionData: _.map(tempData, dimension[0]),
          measures: measures,
          measuresData: measuresData,
          aggregate: aggregate,
          ascending: ascending,
          descending: descending,
          axisTitle,
          showLabel,
          showLegend,
          showGrids,
          showAxis,
          showAxisTitle,
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
        });

        setLoading(false);
      } else {
        setChartState({
          ...chartState,
          data: data,
          name: response.name,
          optionsCount: count,
          dimension: dimension,
          dimensionData: _.map(tempData, dimension[0]),
          measures: measures,
          measuresData: measuresData,
          aggregate: aggregate,
          ascending: ascending,
          descending: descending,
          axisTitle,
          showLabel,
          showLegend,
          showGrids,
          showAxis,
          showAxisTitle,
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
        });

        setLoading(false);
      }
    } else {
      setChartState({
        ...chartState,
        dimension: dimension,
        dimensionData: _.map(tempData, dimension[0]),
        measures: measures,
        measuresData: measuresData,
        optionsCount: count,
        aggregate: aggregate,
        ascending: ascending,
        descending: descending,
        axisTitle,
        showLabel,
        showLegend,
        showGrids,
        showAxis,
        showAxisTitle,
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
      });
    }
  };

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Shared chart`} description="Shared chart" />
      <InviteNavbar />
      {loading ? (
        <main className="w-100 h-75 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <>
          <div>
            <Col xs={12} className="px-3">
              {titleVisible ? (
                <div className="d-flex">
                  <div className="ps-4">
                    <h3 className="chart-title mb-0 mt-2 cursor-pointer text-capitalize">
                      {chartData && chartData.name}
                    </h3>
                  </div>
                </div>
              ) : null}
            </Col>
            <Col sm={10} className="px-3 mb-0">
              <div className="d-flex flex-wrap  mt-2">
                {/* Filter Components on chart */}
                <FiltersComponent
                  filters1={filters}
                  setFilters1={setFilters}
                  renderChart={renderChart}
                  chartState={chartState}
                />
              </div>
              <div>
                {/* Chart canvas */}
                <VisualizationComponent
                  verticalBarData={verticalBarData}
                  chartState={chartState}
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
              </div>
            </Col>
          </div>
        </>
      )}
    </>
  );
};
export default SharedChartPage;
