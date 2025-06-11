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

const HeatMap: FC<IMyAppProps> = (props) => {
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

  const heatmapData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      heatmapData.push({
        group: d.category,
        variable: d.data[yOption[0]], // x selected name // x- name
        value: d.data[yOption[1]], // y value
      });
    }
  });
  const canvas1 = useRef(null);
  tooltip.style("display", "none").style("opacity", 0);
  // .style("text-transform", "capitalize")

  useEffect(() => {
    d3.select(canvas1.current).html("");
    renderHeatmap(heatmapData);
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

  function renderHeatmap(data: any) {
    const min: any = d3.min(data, (d: any) => d.value);
    const max: any = d3.max(data, (d: any) => d.value);
    const lowColor: any = "#CAF0F8";
    const highColor: any = "#03045E";

    const colorScale: any = d3.scaleLinear().domain([min, max]).range([lowColor, highColor]);

    // append the svg object to the body of the page
    const svg = d3.select(canvas1.current).append("svg");

    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    const myGroups: any = data.map((d: any) => d.group);
    const myVars: any = data.map((d: any) => d.variable);

    // Build X scales and axis:
    const x: any = d3.scaleBand().range([margin.left, xdim]).domain(myGroups).padding(0.1);
    const xAxis = d3.axisBottom(x).tickFormat((d: any, i: any) => {
      if (d !== null && d.length !== 0) {
        const name = d.toString();
        return i % 2 !== 0 ? "" : name.length > 7 ? name.substring(0, 5) + "..." : name;
      }
    });

    //function to adjust the length of axis ticks - X Axis
    showAxis
      ? svg
          .append("g")
          .attr("transform", `translate(${0}, ${ydim - ydim / 2 + 60})`)
          .call(xAxis)
          .selectAll("text")
          .attr("transform", `rotate(-45)`)
          .style("text-anchor", "end")
          .style("font-size", 11)
      : null;

    // Build Y scales and Y axis
    const y: any = d3
      .scaleBand()
      .range([ydim - 190, margin.top])
      .domain(myVars)
      .padding(0.1);
    const yAxis = d3.axisLeft(y);
    showAxis
      ? svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${0})`)
          .style("font-size", 11)
          .call(
            yAxis.tickFormat((d: any, i: any) => {
              if (yOption.length > 0 && d !== null && d.length !== 0) {
                const yname = d.toString();
                return i % 4 !== 0 ? "" : yname.length > 7 ? yname.substring(0, 5) + "..." : yname;
              }
            })
          )
      : null;
    //Tooltip
    const mouseover = function () {
      tooltip.style("display", "block").style("opacity", 1);
    };
    const mousemove = function (event: any, d: any) {
      tooltip
        .style("display", "block")
        .style("opacity", 1)
        .html(
          xOption[0] +
            ": " +
            d.group +
            "<br>" +
            yOption[0] +
            ": " +
            d.variable +
            "<br>" +
            yOption[1] +
            ": " +
            d.value
        )
        .style("left", event.x - 50 + "px")
        .style("top", event.y - 80 + "px");
    };
    const mouseleave = function () {
      tooltip.style("display", "none").style("opacity", 0);
    };

    //Add rects for heatmap
    svg
      .selectAll()
      .data(data, function (d: any) {
        return d.group + ":" + d.variable;
      })
      .join("rect")
      .attr("x", function (d: any) {
        return x(d.group);
      })
      .attr("y", function (d: any) {
        return y(d.variable);
      })
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d: any) {
        return colorScale(d.value);
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //x-axis title
    showXAxisTitle
      ? svg
          .append("text")
          .attr("transform", "translate(" + xdim / 1.75 + " ," + (ydim - 103) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "12")
          .text(xAxisTitle)
      : null;
    //y-axis title
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 8)
      .attr("x", 0 - ydim / 3)
      .attr("dy", ".8em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .style("font-family", "Calibri")
      .text(yOption[0])
      .style("font-size", "11");
    if (legendsVisible && yOption[0] !== undefined) {
      //Legend
      const key: any = svg.append("svg").attr("class", "legend1");

      const legend1 = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend1
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(min))
        .attr("stop-opacity", 1);

      legend1
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(max))
        .attr("stop-opacity", 1);

      d3.select(".legend1")
        .append("rect")
        .attr("width", "20")
        .attr("height", "400")
        .style("fill", "url(#gradient)")
        .attr("transform", `translate(${xdim / 2 - 130}, ${ydim - 40})rotate(-90)`);
      //Axis for legend
      const maxValue: any = d3.max(data, function (d: any) {
        return d.value;
      });
      const legendScale = d3.scaleLinear().range([390, 0]).domain([maxValue, 0]);

      const legendAxis = d3.axisTop(legendScale).ticks(4).tickFormat(d3.format(".0s"));
      key
        .append("g")
        .attr("class", "legendAxis")
        .attr("transform", `translate(${xdim / 2 - 130}, ${ydim - 60})`)
        .call(legendAxis)
        .select(".domain")
        .remove();
    }
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg viewBox={`0 0 ${xdim + margin.left + margin.right} ${480}`} ref={canvas1}></svg>
    </div>
  );
};

export default HeatMap;
