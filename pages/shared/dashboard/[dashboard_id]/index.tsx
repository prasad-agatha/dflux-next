// react
import React, { FC } from "react";
// react-bootstrap
import { Col, OverlayTrigger, Image, Tooltip, Card } from "react-bootstrap";
// hooks
import { useRouter } from "next/router";
// toast
import { toast } from "react-toastify";
// d3
import * as d3 from "d3";
//lodash
import _ from "lodash";
import { Rnd } from "react-rnd";
// next seo
import { NextSeo } from "next-seo";
// services
import { DashboardService } from "services";
// components
import VisualizationComponent from "@components/charts/visualizationComponent";
import { InviteNavbar } from "components/navbars";
import { PageLoading } from "components/loaders";
import { MultiSelectAll } from "components/dropdowns";
import { MultiRangeSlider, FilterInput } from "components/forms";
// constants
import {
  filter_function,
  format_chartData,
  sort_ascending,
  sort_descending,
  updateChartState,
} from "@components/charts/chart_functions";

//toast configuration
toast.configure();

const dashboardService = new DashboardService();

const SharedDashboardPage: FC = () => {
  const router = useRouter();
  const { dashboard_id } = router.query;
  const [sharedDashboardState, setsharedDashboardState] = React.useState<any>({
    selected: [],
    dashboardTitle: "",
    dashboardDescription: "",
    pageLoading: false,
    description: "",
  });
  const [sizeParams, setSizeParams] = React.useState<any>([]);

  const [titleVisible, setTitleVisible] = React.useState(false);

  const [reDraw, setReDraw] = React.useState(false);

  const [dashboardFilters, setDashboardFilters] = React.useState([] as any);

  // const [d3Data, setD3Data] = React.useState<any>({});
  const [toolTip, setToolTip] = React.useState([]) as any;

  // get shared dashboard from token
  const getSharedDashboard = async (token: any) => {
    setsharedDashboardState({ ...sharedDashboardState, pageLoading: true });
    dashboardService
      .getSharedDashboard(token)
      .then((res: any) => {
        const newArr: any = [];
        setTitleVisible(res.extra?.titleVisible);
        const temp1: any = [];
        const b: any = _.map(res?.charts, "chart");
        b?.map((item: any, index: any) => {
          const queryData =
            item.save_from === "query" ? item?.query?.extra?.data : item?.extra?.data;
          const filters1 = [
            ...item.extra.filters.dropdown,
            ...item.extra.filters.textBox.filter((el: any) => el.filterInput !== ""),
            ...item.extra.filters.slider,
          ];
          // takes filters and returns  combination of sort filter and aggregated data
          const tempData: any = filter_function(
            [...queryData].splice(0, queryData.length),
            filters1,
            item.extra?.dimension,
            item.extra?.measures,
            item.extra.aggregate
          );
          // sorting
          if (item.extra?.ascending) {
            // console.log(tempData.sort(sort_ascending(sortingField, true, parseInt, ascending)));
            tempData.sort(
              sort_ascending(item.extra?.sortingField, true, parseInt, item.extra?.ascending)
            );
          } else if (item.extra?.descending) {
            // console.log(tempData.sort(sort_descending(sortingField, true, parseInt, descending)));
            tempData.sort(
              sort_descending(item.extra?.sortingField, true, parseInt, item.extra?.descending)
            );
          }
          const tempData1: any = [];
          // get dimension and measures
          tempData.map((item2: any) => {
            const obj: any = {};
            obj[item.extra?.dimension[0]] = item2[item.extra?.dimension[0]];
            item.extra?.measures.map((item1: any) => {
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
          const dimensionsData = _.map(tempData, item.extra?.dimension[0]);
          const measuresData = format_chartData(item.extra?.measures, tempData, true, item);
          const { cw, ch, xPosition, yPosition } = getDimensions(index);
          // positioning filters on chart
          temp1.push({
            id: item.id,
            filters: item.extra?.filters,
            x: xPosition,
            y: yPosition,
            width: cw,
            height: ch,
            chartState: updateChartState(
              dimensionsData,
              measuresData,
              item.extra?.measures,
              item.chart_type,
              queryData
            ),
            dimensionsData: dimensionsData,
            listTable: heads,
            tableData: tempData1,
          });
          const obj: any = {};
          obj["width"] = cw;
          obj["height"] = ch;
          obj["position_x"] = xPosition;
          obj["position_y"] = yPosition;
          obj["id"] = item.id;
          newArr.push(obj);
        });
        setSizeParams(newArr);
        setDashboardFilters(temp1);
        setsharedDashboardState({
          ...sharedDashboardState,
          dashboardDescription: res.description,
          dashboardTitle: res.name,
          selected: res.charts,
          pageLoading: false,
          description: res.extra?.description,
        });
      })
      .catch();
  };

  React.useEffect(() => {
    //  reload
  }, [reDraw]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shr = urlParams.get("shr");

    if (shr) {
      getSharedDashboard(shr);
    }
  }, [dashboard_id]);

  React.useEffect(() => {
    setToolTip(
      d3
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
        .style("text-transform", "capitalize")
    );
    //text
  }, []);
  const chartStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#fff",
  };

  /*
   * renders dashboard on changing filter values
   */
  const renderDashboardFilter = (a: any, index: any, item: any) => {
    const queryData =
      item.chart.save_from === "query" ? item.chart?.query?.extra?.data : item.chart?.extra?.data;
    const filters1 = [
      ...a[index].extra.filters.dropdown,
      ...a[index].extra.filters.textBox.filter((el: any) => el.filterInput !== ""),
      ...a[index].extra.filters.slider,
    ];
    // takes filters and returns  combination of sort filter and aggregated data
    const tempData: any = filter_function(
      [...queryData].splice(0, queryData.length),
      filters1,
      item.chart.extra?.dimension,
      item.chart.extra?.measures,
      item.chart.extra.aggregate
    );
    // sorting
    if (item.chart.extra?.ascending) {
      // console.log(tempData.sort(sort_ascending(sortingField, true, parseInt, ascending)));
      tempData.sort(
        sort_ascending(item.chart.extra?.sortingField, true, parseInt, item.chart.extra?.ascending)
      );
    } else if (item.chart.extra?.descending) {
      // console.log(tempData.sort(sort_descending(sortingField, true, parseInt, descending)));
      tempData.sort(
        sort_descending(
          item.chart.extra?.sortingField,
          true,
          parseInt,
          item.chart.extra?.descending
        )
      );
    }
    const tempData1: any = [];
    // get dimension and measures
    tempData.map((item2: any) => {
      const obj: any = {};
      obj[item.chart.extra?.dimension[0]] = item2[item.chart.extra?.dimension[0]];
      item.chart.extra?.measures.map((item1: any) => {
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
    const dimensionsData = _.map(tempData, item.chart.extra?.dimension[0]);
    const measuresData = format_chartData(item.chart.extra?.measures, tempData, true, item.chart);
    const chartState1 = updateChartState(
      dimensionsData,
      measuresData,
      item.chart.extra?.measures,
      item.chart.chart_type,
      queryData
    );
    const { cw, ch, xPosition, yPosition } = getDimensions(index);
    // positioning filters on chart
    a[index] = {
      id: a[index].id,
      filters: a[index].filters,
      x: xPosition,
      y: yPosition,
      width: cw,
      height: ch,
      chartState: chartState1,
      dimensionsData: dimensionsData,
      listTable: heads,
      tableData: tempData1,
    };

    setDashboardFilters(a);
    setReDraw(!reDraw);
  };

  // on dragging - Rnd - setting new position
  const onDragStop = (d: any, index: any) => {
    const data = sizeParams;
    data[index].position_x = d.x;
    data[index].position_y = d.y;
    setSizeParams((preV: any) => [...preV, data]);
  };

  const getDimensions = (index: any) => {
    /* making the cards responsive by calculating width, height and positions of cards
    from main-wrapper div */
    let xPosition = 0,
      yPosition = 0;
    const wrapper = document.getElementsByClassName("main-wrapper") as HTMLCollection;
    const wrapperWidth = wrapper[0]?.clientWidth - 80;
    const cw = Math.round(wrapperWidth * 0.5) - 5;
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

  return (
    <>
      <NextSeo
        title={`Shared dashboard - ${process.env.CLIENT_NAME}`}
        description="Shared dashboard"
      />
      <InviteNavbar />
      {sharedDashboardState.pageLoading ? (
        <main className="w-100 h-75 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <div>
          <Col className="my-3 px-3">
            <div className="ps-4 px-4 d-flex align-items-center">
              {titleVisible ? (
                <Card className="shadow-sm p-3 w-100 mt-3">
                  <div className="d-flex align-items-center">
                    <h4 className="chart-title mt-1 mb-0 cursor-pointer text-capitalize">
                      {sharedDashboardState.dashboardTitle}
                    </h4>

                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-engine">
                          {sharedDashboardState.description
                            ? sharedDashboardState.description
                            : "Please add a description"}
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
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="p-0 mb-2 d-flex">
              <div className="ps-4 d-flex align-items-center">
                <h6 className="project-description mb-0 cursor-pointer">
                  {sharedDashboardState.dashboardDescription}
                </h6>
              </div>
            </div>

            <div className=" mx-4" style={{ position: "relative" }}>
              {sharedDashboardState.selected.length > 0 &&
                sharedDashboardState.selected.map((item: any, index: any) => {
                  const { width, height, x, y, filters, chartState } = dashboardFilters[index];
                  const { dropdown, textBox, slider } = filters;
                  // const dh = item?.extra?.filter ? 400 : 300;
                  const { cw, ch } = getDimensions(index);
                  return (
                    <Rnd
                      // size={{ width, height }}
                      // minHeight={250}
                      // minWidth={300}
                      size={{
                        width: cw,
                        height: ch + 70,
                      }}
                      position={{ x, y }}
                      style={chartStyle}
                      // default={{ x: 0, y: 0, width: 400, height: dh }}
                      onDragStop={(e, d) => onDragStop(d, index)}
                      // onResizeStop={(e, direction, ref) => onResizeStop(ref, index)}
                      enableResizing={false}
                      disableDragging={true}
                      key={index}
                    >
                      <div
                        className="h-100 w-100 p-3 d-flex flex-column"
                        style={{ position: "relative" }}
                      >
                        <div className="chart-detail-block">
                          <div className="chart-title f-18">{item.chart.name}</div>
                          {item.chart.extra.description !== "" && (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-engine">
                                  {item.chart.extra?.description}
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
                        <div className="child-box mt-1">
                          <div className="d-flex flex-wrap my-auto">
                            {/* Filter Components on chart */}
                            {[...dropdown, ...textBox, ...slider]?.map((type: any, index1: any) => {
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
                                      index1={index1 - dropdown.length - textBox.length}
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
                                      index1={index1 - dropdown.length}
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

                          {/* Chart canvas */}
                          <VisualizationComponent
                            chartState={{
                              type: item.chart.chart_type,
                              dimension: item.chart.extra?.dimension,
                              axisTitle: item.chart.extra?.axisTitle,
                              showLabel: item.chart.extra?.showLabel,
                              showLegend: item.chart.extra?.showLegend,
                              showGrids: item.chart.extra?.showGrids,
                              showAxis: item.chart.extra?.showAxis,
                              showAxisTitle: item.chart.extra?.showAxisTitle,
                              measures: item.chart.extra?.measures,
                              tableData: dashboardFilters[index].tableData,
                              tableHeads: dashboardFilters[index].listTable,
                              dimensionData: dashboardFilters[index].dimensionsData,
                              lineWeight: item.chart.extra?.lineWeight || 1,
                            }}
                            // reDraw={reDraw}
                            verticalBarData={chartState}
                            verticalStackData={chartState}
                            curveLineData={chartState}
                            areaData={chartState}
                            mixedData={chartState}
                            scatterData={chartState}
                            bubbleData={chartState}
                            pieData={chartState}
                            polarData={chartState}
                            radarData={chartState}
                            d3Data={chartState.datasets}
                            toolTip={toolTip}
                            root="dashboard"
                            width={width}
                            height={height}
                          />
                        </div>
                      </div>
                    </Rnd>
                  );
                })}
            </div>
          </Col>
        </div>
      )}
    </>
  );
};
export default SharedDashboardPage;
