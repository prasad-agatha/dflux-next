import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";
// passing paramsyar
interface IMyAppProps {
  xdim: any;
  ydim: any;
  xdata: any;
  margin: any;
  d3Data: any;
  xOption: any;
  yOption: any;
  tooltip: any;
  legendsVisible: any;
  showXAxisTitle: any;
  xAxisTitle: any;
  showAxis: any;
}

const ParetoChart: FC<IMyAppProps> = (props) => {
  const {
    xdim,
    ydim,
    margin,
    xdata,
    d3Data,
    xOption,
    yOption,
    tooltip,
    legendsVisible,
    showXAxisTitle,
    xAxisTitle,
    showAxis,
  } = props;
  const canvas1 = useRef(null);
  const paretoData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      paretoData.push({
        Category: d.category,
        Amount: d.data[yOption[0]],
      });
    }
  });
  useEffect(() => {
    d3.select(canvas1.current).html("");
    renderParetoChart();
    tooltip.style("display", "none").style("opacity", 0);
  }, [
    xdim,
    ydim,
    xdata,
    d3Data,
    xOption,
    yOption,
    legendsVisible,
    showXAxisTitle,
    xAxisTitle,
    showAxis,
  ]);

  function renderParetoChart() {
    const svg = d3.select(canvas1.current);

    let totalAmount = 0;
    //Calculating Cummulative Percentage (cp)
    paretoData.forEach((e: any, i: any) => {
      totalAmount = e.Amount + totalAmount;
      e.id = i + 1;
    });
    paretoData.forEach((e: any, i: any) => {
      e.tp = (e.Amount / totalAmount) * 100;
      if (i == 0) {
        e.cp = e.tp;
      } else {
        e.cp = e.tp + paretoData[i - 1].cp;
      }
    });
    //function to adjust the length of axis ticks
    // function abbrevName(element: any) {
    //   if (yOption[0] !== undefined) {
    //     element = element.toString();
    //     element = element.length > 7 ? element.substring(0, 6) + "..." : element;
    //     return element;
    //   }
    // }
    //X Scale
    const x: any = d3
      .scaleBand()
      .range([margin.left - 7, xdim])
      .domain(paretoData.map((d: any) => d.id))
      .padding(0.1);
    // Y scale
    const yBar = d3
      .scaleLinear()
      .domain([0, d3.max(paretoData.map((d: any) => d.Amount))] as number[])
      .range([ydim - 45, 10]);
    const yCP = d3
      .scaleLinear()
      .domain([0, d3.max(paretoData.map((d: any) => d.cp))] as number[])
      .range([ydim - 45, 10]);

    const colorScale = ["#3587A4", "#7BD389", "#D6D84F"];

    //Draw Bars
    const bar = svg.selectAll(".bar").data(paretoData).join("g");
    bar
      .append("rect")
      .attr("x", (d: any) => x(d.id) + 10)
      .attr("y", (d: any) => yBar(d.Amount) + 10)
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => ydim - 35 - yBar(d.Amount))
      .attr("id", (d, i) => i)
      .attr("class", "hist1")
      .style("fill", "#3587A4");

    //Draw Line
    const path: any = d3
      .line()
      .x((d: any) => x(d.id) + 10)
      .y((d: any) => yCP(d.cp) + 10);
    const line = svg
      .append("path")
      .datum(paretoData)
      .attr("d", path)
      .attr("class", "line")
      .attr("fill", "none")
      .style("stroke", "#7BD389")
      .attr("stroke-width", "3");

    //Draw Circles on line
    const circle = svg
      .selectAll(".circle")
      .data(paretoData)
      .join("g")
      .append("circle")
      .attr("cx", (d: any) => x(d.id) + 10)
      .attr("cy", (d: any) => yCP(d.cp) + 10)
      .attr("r", "4")
      .style("fill", "#D6D84F");

    //  Axis
    const xAxis = d3.axisBottom(x);
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(" + margin.left + " , " + margin.top + ")")
          .call(d3.axisLeft(yBar).ticks(4).tickFormat(d3.format(".0s")))
      : null;
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(" + (xdim + 10) + ", " + margin.top + ")")
          .call(d3.axisRight(yCP).ticks(8))
      : null;
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(" + 9 + "," + (ydim - 25) + ")")
          .call(
            xAxis.tickFormat(function (d: any, i: any) {
              const filteredTicks = paretoData.filter(function (e: any) {
                return e.id === d;
              });
              if (filteredTicks[0].Category !== null) {
                const name = filteredTicks[0].Category.toString();
                return i % 3 !== 0 ? "" : name.length > 7 ? name.substring(0, 6) + "..." : name;
              }
            })
          )
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
      : null;

    bar
      .on("mousemove", function (event, d: any) {
        tooltip
          .style("display", "block")
          .style("opacity", 1)
          .html(
            d.Category +
              "<br>" +
              yOption[0] +
              ": " +
              d.Amount +
              "<br>" +
              "Cummulative: " +
              d.cp.toFixed(2) +
              "%"
          )
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 90 + "px")
          .style("background-color", "rgb(0,0,0,0.8)");
        d3.selectAll(".hist1").style("opacity", 0.8);
        d3.select(this).select("rect").style("opacity", 1);
        d3.select(".line").style("opacity", 0.2);
        // d3.selectAll("circle").style("opacity", 0.2);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", 0);
        d3.selectAll(".hist1").style("display", "block").style("opacity", 1);
        d3.select(this).select("rect").style("display", "block").style("opacity", 1);
        d3.select(".line").style("display", "block").style("opacity", 1);
        d3.selectAll("circle").style("display", "block").style("opacity", 1);
      });
    circle
      .on("mousemove", function (event, d: any) {
        tooltip
          .style("display", "block")
          .html(
            d.Category +
              "<br>" +
              yOption[0] +
              ": " +
              d.Amount +
              "<br>" +
              "Cummulative: " +
              d.cp.toFixed(2) +
              "%"
          )
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 90 + "px")
          .style("background-color", "rgb(0,0,0,0.8)");
        d3.select(".line").style("display", "block").style("opacity", 1);
        d3.selectAll("circle").style("display", "block").style("opacity", 1);
        d3.selectAll(".hist1").style("display", "block").style("opacity", 0.2);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", "0");
        d3.select(".line").style("display", "block").style("opacity", 1);
        d3.selectAll("circle").style("display", "block").style("opacity", 1);
        d3.selectAll(".hist1").style("display", "block").style("opacity", 1);
      });
    line
      .on("mousemove", function () {
        d3.select(".line").style("display", "block").style("opacity", 1);
        d3.selectAll("circle").style("display", "block").style("opacity", 1);
        d3.selectAll(".hist1").style("display", "block").style("opacity", 0.2);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", "0");
        d3.select(".line").style("display", "block").style("opacity", 1);
        d3.selectAll("circle").style("display", "block").style("opacity", 1);
        d3.selectAll(".hist1").style("display", "block").style("opacity", 1);
      });

    //Sub-titles
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 12)
      .attr("x", 0 - ydim / 2)
      .attr("dy", ".8em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .style("font-family", "Calibri")
      .text(yOption[0])
      .style("font-size", "11");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", xdim + margin.right + 7)
      .attr("x", 0 - ydim / 2)
      .attr("dy", ".5em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .style("font-family", "Calibri")
      .text("Cummulative %")
      .style("font-size", "11");
    // X Axis Title
    showXAxisTitle
      ? svg
          .append("text")
          .attr("transform", "translate(" + (xdim / 2 + 50) + " ," + (ydim + 50) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "11")
          .text(xAxisTitle)
      : null;

    // Legend
    const legendWidth: any = xdim;
    const LEGEND_OFFSET = ydim + 65;
    const LEGEND_RECT_SIZE = 9;
    const LEGEND_H_SPACING = 145;
    const LEGEND_V_SPACING = 7;
    const LEGEND_TEXT_X_OFFSET = 2;
    const LEGEND_TEXT_Y_OFFSET = -1.7;
    const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);
    const legendData = [yOption[0], "cummulative"];
    const legendElem = svg
      .append("g")
      .attr("transform", `translate(${xdim / 2},${LEGEND_OFFSET})`)
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr("transform", (d: any, i: any) => {
        const x = (i % legendElemsPerRow) * LEGEND_H_SPACING;
        const y =
          Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
          LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow);

        return `translate(${x - 50},${y})`;
      });
    if (legendsVisible) {
      legendElem
        .append("rect")
        .attr("width", LEGEND_RECT_SIZE)
        .attr("height", LEGEND_RECT_SIZE)
        .attr("class", "legend-item")
        .style("fill", function (d: any, i: any) {
          return colorScale[i];
        });

      legendElem
        .append("text")
        .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .attr("font-size", 10)
        .text((d) => `${d}`);
    }
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg
        viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.bottom + margin.top}`}
        ref={canvas1}
      ></svg>
    </div>
  );
};

export default ParetoChart;
