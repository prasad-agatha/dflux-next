import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";
import topo from "../d3components/worldData";
import { Image } from "react-bootstrap";
import { worldCountries } from "constants/common";
// passing params
interface IMyAppProps {
  xdim: any;
  ydim: any;
  xdata: any;
  margin: any;
  d3Data: any;
  xOption: any;
  yOption: any;
  setType?: any;
  tooltip: any;
  legendsVisible: any;
}

const WorldMap: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, d3Data, xOption, yOption, tooltip, setType, legendsVisible } =
    props;

  const canvas1 = useRef(null);
  const [show, setShow] = React.useState(false);
  tooltip.style("display", "none").style("opacity", 0);
  const mapData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      mapData.push({
        name: d.category,
        value: d.data[yOption[0]],
      });
    }
  });
  useEffect(() => {
    d3.select(canvas1.current).html("");
    // renderWorldMap(mapData);
    if (xOption.length != 0 || yOption.length != 0) {
      if (worldCountries.includes(mapData[0].name)) {
        renderWorldMap(mapData);
      } else {
        setShow(true);
      }
    } else {
      setShow(true);
      setType("bar");
    }
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, topo, setType, legendsVisible]);

  function renderWorldMap(data: any) {
    const lowColor: any = "#D8973C";
    const highColor: any = "#330C2F";
    const svg = d3.select(canvas1.current);
    svg.selectAll("g").remove();
    svg.selectAll("svg").remove();

    // Map and projection
    const projection: any = d3
      .geoEquirectangular()
      .scale(xdim / 2 / Math.PI)
      .rotate([352, 0, 0])
      .translate([xdim / 2 + 30, ydim / 2 + 10]);

    const minVal: any = d3.min(data, (d: any) => d.value),
      maxVal: any = d3.max(data, (d: any) => d.value);

    const colorScale = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor]);

    const path: any = d3.geoPath().projection(projection);

    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr("class", "background")
      .attr("width", xdim)
      .attr("height", ydim)
      .attr("d", path)

      // set the color of each country
      .attr("fill", function (d: any) {
        d.total = data.filter((item: any) => {
          return item.name === d.properties.name;
        })[0];
        d.total = d.total ? d.total.value : "N/A";
        if (d.total == "N/A") {
          return "#ccc";
        } else return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function () {
        return "Country";
      })
      .attr("name", function (d: any) {
        return d.name;
      })
      .style("opacity", 1)
      .on("mouseover", function (d: any, i: any) {
        d3.select(this).style("stroke", "black");

        tooltip.style("display", "block").style("opacity", 1);

        tooltip
          .html(i.properties.name + ": " + i.total)
          .style("left", `${d.pageX + 10}px`)
          .style("top", `${d.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        d3.select(this).style("stroke", "none");

        tooltip.style("display", "block").style("opacity", 0);
      });

    if (legendsVisible && yOption[0] !== undefined) {
      //Legend
      const key: any = svg.append("svg").attr("class", "legend");

      const legend = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient1")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(minVal))
        .attr("stop-opacity", 1);

      legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(maxVal))
        .attr("stop-opacity", 1);

      d3.select(".legend")
        .append("rect")
        .attr("width", "15")
        .attr("height", "400")
        .style("fill", "url(#gradient1)")
        .attr("transform", `translate(${xdim / 2 - 110}, ${ydim + 90})rotate(-90)`);
      //Axis for legend
      const maxValue: any = d3.max(data, function (d: any) {
        return d.value;
      });
      const legendScale = d3.scaleLinear().range([390, 0]).domain([maxValue, 0]);

      const legendAxis = d3.axisTop(legendScale).ticks(4).tickFormat(d3.format(".0s"));
      key
        .append("g")
        .attr("class", "legendAxis")
        .attr("font-size", 11)
        .attr("transform", `translate(${xdim / 2 - 110}, ${ydim + 75})`)
        .call(legendAxis)
        .select(".domain")
        .remove();
    }
  }

  return (
    <>
      {show ? (
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
      ) : (
        <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
          <svg
            viewBox={`0 0 ${xdim + margin.left + margin.right} ${
              ydim + margin.bottom + margin.top
            }`}
            ref={canvas1}
          ></svg>
        </div>
      )}
    </>
  );
};

export default WorldMap;
