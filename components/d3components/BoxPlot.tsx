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
  showXAxisTitle: any;
  xAxisTitle: any;
  showAxis: any;
}

const BoxPlot: FC<IMyAppProps> = (props) => {
  const {
    xdim,
    ydim,
    margin,
    xdata,
    d3Data,
    xOption,
    yOption,
    tooltip,
    showXAxisTitle,
    xAxisTitle,
    showAxis,
  } = props;

  const waffleData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      waffleData.push({
        Species: d.category,
        Sepal_Length: d.data[yOption[0]],
      });
    }
  });

  const canvas1 = useRef(null);

  useEffect(() => {
    d3.select(canvas1.current).html("");
    renderBubbleChart();
    tooltip.style("display", "none").style("opacity", 0);
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, showXAxisTitle, xAxisTitle, showAxis]);

  function renderBubbleChart() {
    const svg = d3.select(canvas1.current);

    let q1: any;
    let median: any;
    let q3: any;
    let interQuantileRange: any;
    let min: any;
    let max: any;

    const sumstat = d3.rollups(
      waffleData,
      function (v) {
        q1 = d3.quantile(
          v
            .map(function (g: any) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.25
        );
        median = d3.quantile(
          v
            .map(function (g: any) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.5
        );
        q3 = d3.quantile(
          v
            .map(function (g: any) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.75
        );
        interQuantileRange = q3 - q1;
        min = q1 - 1.5 * interQuantileRange;
        max = q3 + 1.5 * interQuantileRange;
        return {
          q1: q1,
          median: median,
          q3: q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max,
        };
      },
      (d: any) => d.Species
    );
    // X scale
    const x: any = d3
      .scaleBand()
      .range([50, xdim])
      .domain(waffleData.map((d: any) => d.Species))
      .paddingInner(1)
      .paddingOuter(0.5);
    // Y scale
    const y = d3
      .scaleLinear()
      .domain([d3.min(sumstat.map((d) => d[1].min)), d3.max(sumstat.map((d) => d[1].max))])
      .range([ydim - 40, margin.top]);
    const yAxis = d3.axisLeft(y).tickFormat(d3.format(".0s"));
    // Y Axis
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(yAxis)
      : null;

    // rectangle for the main box
    const boxWidth = 50;
    const box = svg
      .selectAll("boxes")
      .data(sumstat)
      .join("rect")
      .attr("x", function (d: any) {
        return x(d[0]) - boxWidth / 2;
      })
      .attr("y", function (d) {
        return y(d[1].q3);
      })
      .attr("height", function (d) {
        return y(d[1].q1) - y(d[1].q3);
      })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#007EA7");
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(" + 0 + "," + (ydim - 10) + ")")
          .call(
            d3.axisBottom(x).tickFormat((d: any) => {
              if (d !== null) {
                if (d.length > 9) {
                  return d.substring(0, 7) + "...";
                } else return d;
              }
            })
          )
          .selectAll("text")
          .attr("text-anchor", "end")
          .attr("transform", `rotate(-45)`)
      : null;
    // median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .join("line")
      .attr("x1", function (d) {
        return x(d[0]) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d[0]) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d[1].median);
      })
      .attr("y2", function (d) {
        return y(d[1].median);
      })
      .attr("stroke", "black")
      .style("width", 80);
    // main vertical line
    svg
      .selectAll("vertLines")
      .data(sumstat)
      .join("line")
      .attr("x1", function (d: any) {
        return x(d[0]);
      })
      .attr("x2", function (d: any) {
        return x(d[0]);
      })
      .attr("y1", function (d: any) {
        return y(d[1].min);
      })
      .attr("y2", function (d: any) {
        return y(d[1].max);
      })
      .attr("stroke", "black")
      .attr("stroke-dasharray", "5,5");
    // individual points with jitter
    const jitterWidth = 50;
    svg
      .selectAll("points")
      .data(waffleData)
      .enter()
      .append("circle")
      .attr("cx", function (d: any) {
        return x(d.Species) - jitterWidth / 2 + Math.random() * jitterWidth;
      })
      .attr("cy", function (d: any) {
        return y(d.Sepal_Length);
      })
      .attr("r", 4)
      .style("fill", "white")
      .attr("stroke", "black");
    // X Axis Title
    if (showXAxisTitle) {
      svg
        .append("text")
        .attr("transform", "translate(" + (xdim / 2 + 40) + " ," + (ydim + margin.top + 45) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "11")
        .text(xAxisTitle);
    } else return null;

    // Y Axis Title
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 2)
      .attr("x", 0 - ydim / 2)
      .attr("dy", ".8em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .style("font-family", "Calibri")
      .text(yOption[0])
      .style("font-size", "11");

    box
      .on("mouseover", function (event, d) {
        tooltip.style("display", "block").style("opacity", 1);

        tooltip
          .html(
            d[0] +
              "<br>" +
              "q1: " +
              d[1].q1 +
              "<br>" +
              "q3: " +
              d[1].q3 +
              "<br>" +
              "Median: " +
              d[1].median
          )
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 95 + "px")
          .style("background-color", "rgb(0,0,0,0.7)");
      })
      .on("mousemove", function (event, d) {
        tooltip
          .style("display", "block")
          .style("opacity", 1)

          .html(
            d[0] +
              "<br>" +
              "q1: " +
              d[1].q1 +
              "<br>" +
              "q3: " +
              d[1].q3 +
              "<br>" +
              "Median: " +
              d[1].median
          )
          .style("left", event.pageX - 60 + "px")
          .style("top", event.pageY - 95 + "px")
          .style("background-color", "rgb(0,0,0,0.7)");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", 0);
      });
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg
        viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.top + margin.bottom}`}
        ref={canvas1}
      ></svg>
    </div>
  );
};

export default BoxPlot;
