import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";

// passing params
interface IMyAppProps {
  xdim: any;
  ydim: any;
  xdata: any;
  ydata: any;
  margin: any;
  d3Data: any;
  xOption: any;
  yOption: any;
  tooltip: any;
}

const BarChart: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, ydata, d3Data, xOption, yOption, tooltip } = props;

  const canvas = useRef(null);

  useEffect(() => {
    const svg = d3.select(canvas.current);
    d3.select(canvas.current).html("");
    addAxis(svg);
    addBars(svg);
    addText(svg);
  }, [xdim, ydim, xdata, ydata, d3Data, xOption, yOption]);

  const data = d3Data;
  const keys = yOption;

  const z: any = d3.scaleOrdinal().range(["#0076FF", "#33435C", "#16F088", "#B22222", "#b3b3ff"]);

  const test1: any = [];
  d3Data.map((d: any) => {
    test1.push(d.data);
  });

  // for y- axis
  const yscale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(test1, function (d: any) {
        return d3.max(keys, function (key: any) {
          return d[key];
        });
      }),
    ] as number[])
    .range([ydim, 0])
    .nice();
  // for x-axis
  const xscale: any = d3
    .scaleBand()
    .domain(
      data.map(function (d: any) {
        return d.data[xOption];
      })
    )
    .range([margin.left, xdim])
    .padding(0.3);

  // Another scale for subgroup positions
  const xSubgroup = d3.scaleBand().domain(keys).range([0, xscale.bandwidth()]).padding(0.2);

  const addAxis = (svg: any) => {
    // adding x axis for bottom and appending to svg
    const xAxis = d3.axisBottom(xscale);

    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${ydim + margin.top})`)
      .selectAll("text")
      .attr("text-anchor", "start")
      .attr("transform", `rotate(45)`);

    // adding y axis for left and appending to svg
    const yAxis = d3.axisLeft(yscale);

    svg.append("g").call(yAxis).attr("transform", `translate(${margin.left},${margin.top})`);
  };

  const addText = (svg: any) => {
    svg
      .append("text")
      .attr("transform", "translate(" + xdim / 2 + " ," + (ydim + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text(xOption);
  };

  const addBars = (svg: any) => {
    // Show the bars
    const state = svg
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d: any) {
        return "translate(" + xscale(d.data[xOption]) + ",10)";
      });
    state
      .selectAll("rect")
      .data(function (d: any) {
        return keys.map(function (key: any) {
          return { key: key, value: d.data[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d: any) {
        return xSubgroup(d.key);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("fill", function (d: any) {
        return z(d.key);
      })

      // setting up y coordinates and height position to 0 for transition
      .attr("y", function () {
        return yscale(0);
      })
      .attr("height", function () {
        return ydim - yscale(0);
      })

      // setting up tooltip and interactivity
      .on("mouseover", function (d: any, i: any) {
        //Get this bar's x/y values, then augment for the tooltip
        tooltip.style("display", "block").style("opacity", 1);

        const left = d.pageX + 10;
        const top = d.pageY + 20;
        tooltip
          .html("<strong> </strong>" + i.key + "</br>" + "<strong> </strong>" + i.value)
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function () {
        //Remove the tooltip
        tooltip.style("display", "none").style("opacity", 0);
      })
      .transition()
      .duration(function () {
        return 1000;
      })
      .attr("y", function (d: any) {
        return yscale(d.value);
      })
      .attr("height", function (d: any) {
        return ydim - yscale(d.value);
      });

    state
      .selectAll("text")
      .data(function (d: any) {
        return keys.map(function (key: any) {
          return {
            key: key,
            value: d.data[key],
          };
        });
      })
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "label-multiple-bar")
      .style("opacity", 1)

      .style("font-family", "sans-serif")
      .style("font-size", "10")
      .attr("x", function (d: any, i: any) {
        return xSubgroup.bandwidth() * (i + 0.9);
      })
      .attr("y", function (d: any) {
        return yscale(d.value) - 2;
      })
      .text(function (d: any) {
        const value: any = d.value;
        return value;
      });

    d3.select(".legendHolder").html("");

    const legendHolder = svg
      .append("g")
      // translate the holder to the right side of the graph
      .attr("transform", `translate(0, ${ydim + margin.top + 50})`)
      .attr("class", "legendHolder");

    const legend = legendHolder
      .selectAll(".legend")
      .data(keys.slice().reverse())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d: any, i: any) {
        return "translate(" + -40 * i + "," + 0 + ")";
      })
      .attr("width", 36);

    legend
      .append("rect")
      .attr("x", function (d: any, i: any) {
        return ydim - 30 * i;
      })
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", z);

    legend
      .append("text")
      .attr("x", function (d: any, i: any) {
        return ydim - 30 * i + 20;
      })
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function (d: any) {
        return d;
      });
  };

  return (
    <div className="canvas" style={{ width: "800px", height: "600px", margin: "auto" }}>
      <svg
        viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.bottom + margin.top}`}
        preserveAspectRatio="xMinYMin"
        width="100%"
        height="100%"
        ref={canvas}
      ></svg>
    </div>
  );
};

export default BarChart;
