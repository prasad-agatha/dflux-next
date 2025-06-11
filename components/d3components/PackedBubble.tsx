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
}

const PackedBubble: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, d3Data, xOption, yOption, tooltip, legendsVisible } = props;

  const packedData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      packedData.push({
        country: yOption[0], // x selected data // age //wage -y
        continent: d.category, // y selected data // name x
        gdp: d.data[yOption[0]], // y value
      });
    }
  });

  const canvas1 = useRef(null);
  //Data preparation for legend
  const continents = [] as any;

  packedData.forEach((e: any) => {
    continents.push(e.continent);
  });
  //Packed Bubble Chart
  useEffect(() => {
    d3.select(canvas1.current).html("");
    renderBubbleChart();
    tooltip.style("display", "none").style("opacity", 0);
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, legendsVisible]);

  function renderBubbleChart() {
    const svg = d3.select(canvas1.current);
    const g = svg.append("g").attr("transform", "translate(20,0)"),
      nodePadding = 1.5;
    // const max:any = d3.max(packedData, (d: any) => d.gdp)
    const scale = d3
      .scaleLinear()
      .domain([0, d3.max(packedData, (d: any) => d.gdp)] as number[])
      .range([5, 25] as number[]);
    const simulation = d3
      .forceSimulation()
      .force(
        "forceX",
        d3
          .forceX()
          .strength(0.03)
          .x(xdim / 2)
      )
      .force(
        "forceY",
        d3
          .forceY()
          .strength(0.1)
          .y(ydim / 2)
      )
      .force(
        "center",
        d3
          .forceCenter()
          .x(xdim / 2)
          .y(ydim / 2)
      )
      .force("charge", d3.forceManyBody().strength(-15));

    const color: any = d3
      .scaleOrdinal()
      .domain(packedData.map((d: any) => d.continent))
      .range(d3.schemeCategory10);
    const drag: any = d3.drag();
    //update the simulation based on the data
    simulation
      .nodes(packedData)
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.5)
          .radius(function (d: any) {
            return scale(d.gdp) + nodePadding;
          })
          .iterations(1)
      )
      .on("tick", function () {
        node
          .attr("cx", function (d: any) {
            return (d.x = Math.max(scale(d.gdp), Math.min(xdim - scale(d.gdp), d.x)));
          })
          .attr("cy", function (d: any) {
            return (d.y = Math.max(scale(d.gdp), Math.min(ydim - scale(d.gdp), d.y)));
          });
      });
    const node = g
      .append("g")
      .attr("class", "node")
      .selectAll("circle")
      .data(packedData)
      .join("circle")
      .attr("r", function (d: any) {
        return scale(d.gdp);
      })
      .style("fill", function (d: any) {
        return color(d.continent);
      })
      .attr("cx", function (d: any) {
        return d.x;
      })
      .attr("cy", function (d: any) {
        return d.y;
      })
      .call(drag)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
      return d.fx, d.fy;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
      return d.fx, d.fy;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
      return d.fx, d.fy;
    }

    node
      .on("mouseover", function (event, d: any) {
        tooltip
          .style("display", "block")
          .style("opacity", 1)

          .html(d.continent + " : " + d.gdp)
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 50 + "px")
          .style("background-color", "rgb(0,0,0,0.7)");
      })
      .on("mousemove", function (event, d: any) {
        tooltip
          .style("display", "block")
          .style("opacity", 1)

          .html(d.continent + " : " + d.gdp)
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 50 + "px")
          .style("background-color", "rgb(0,0,0,0.7)");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", 0);
      });

    //Adding a legend
    if (legendsVisible) {
      const legendData = Array.from(new Set(packedData.map((d: any) => d.continent)));
      d3.select("#pblegend").html("");
      const legendSvg = d3.select("#pblegend");
      const legendElem = legendSvg
        .selectAll("div")
        .data(legendData)
        .join("div")
        .attr("class", "pblegend-item");

      if (legendData[0] !== null) {
        legendElem
          .append("div")
          .attr("class", "pblegend-item--color")
          .style("background-color", (d: any) => color(d));

        legendElem
          .append("h3")
          .attr("class", "pblegend-item--header")
          .text((d: any) => d)
          .attr("font-size", 11);
      }
    }
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg
        viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.bottom + margin.top}`}
        ref={canvas1}
      ></svg>
      <div id="pblegend"></div>
    </div>
  );
};

export default PackedBubble;
