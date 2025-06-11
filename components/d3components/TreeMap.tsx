import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";

// passing params
interface IMyAppProps {
  xdim: any;
  ydim: any;
  xdata: any;
  margin: any;
  d3Data: any;
  xOption: any;
  yOption: any;
  tooltip: any;
  legendsVisible?: any;
}

const TreeMap: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, d3Data, xOption, yOption, tooltip, legendsVisible } = props;

  const canvas1 = useRef(null);
  tooltip.style("display", "none").style("opacity", 0);

  const treeData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      treeData.push(d.data);
    }
  });

  const nested = d3.groups(
    treeData,
    (d: any) => d[xOption[0]],
    (d: any) => d[xOption[1]]
  );

  const treeArray: any = [];

  nested.forEach((e: any) => {
    const obj: any = {};
    obj.name = e[0];
    const childrenArray: any = [];
    e[1].forEach((el: any) => {
      const objC: any = {};
      objC.name = el[0];
      objC.value = el[1][0][yOption[0]];
      childrenArray.push(objC);
    });
    obj.children = childrenArray;
    treeArray.push(obj);
  });
  const dataobj = {
    name: "total",
    children: treeArray,
  };
  // let legendData:any = []
  useEffect(() => {
    d3.select(canvas1.current).html("");
    tooltip.style("display", "none").style("opacity", 0);
    if (dataobj.children.length > 0) {
      return renderTreemap();
    }
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, tooltip, legendsVisible]);

  function renderTreemap() {
    const svg = d3.select(canvas1.current);

    svg.selectAll("g").remove();
    const treemap: any = (data: any) =>
      d3
        .treemap()
        .size([xdim, ydim - 60])
        .paddingTop(0.1)
        .paddingInner(0.8)
        .paddingOuter(0.5)
        .round(true)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a: any, b: any) => b.value - a.value)
      );

    const root = treemap(dataobj);
    // create 'g' element nodes based on data
    const nodes = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create color scheme and fader
    const fader = (color: any) => d3.interpolateRgb(color, "#fff")(0.3);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10.map(fader));
    // add treemap rects
    nodes
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", function (d: any) {
        return d.x0;
      })
      .attr("y", function (d: any) {
        return d.y0;
      })
      .attr("width", function (d: any) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d: any) {
        return d.y1 - d.y0;
      })
      .attr("fill", (d: any) => {
        return colorScale(d.parent.data.name);
      })
      .on("mousemove", (event: any, d: any) => {
        tooltip.style("display", "block").style("opacity", 1);
        if (xOption.length === 2) {
          tooltip
            .html(d.parent.data.name + "<br>" + d.data.name + " : " + d.data.value)
            .style("left", event.pageX - 50 + "px")
            .style("top", event.pageY - 60 + "px");
        }
        if (xOption.length === 1) {
          tooltip
            .html(d.parent.data.name + " : " + d.data.value)
            .style("left", event.pageX - 50 + "px")
            .style("top", event.pageY - 60 + "px");
        }
      })
      .on("mouseout", () => {
        tooltip.style("display", "none").style("opacity", 0);
      });

    const legendData = treeArray.map((d: any) => {
      return d.name;
    });
    d3.select("#treelegend").html("");
    const legendSvg = d3.select("#treelegend");
    const legendElem = legendSvg
      .selectAll("div")
      .data(legendData)
      .enter()
      .append("div")
      .attr("class", "treelegend-item");

    if (legendsVisible) {
      if (legendData[0] !== null) {
        legendElem
          .append("div")
          .attr("class", "treelegend-item--color")
          .style("background-color", (d: any) => colorScale(d));

        legendElem
          .append("h3")
          .attr("class", "treelegend-item--header")
          .text((d: any) => d)
          .attr("font-size", 11);
      }
    }
  }

  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim}`} ref={canvas1}></svg>
      <div id="treelegend"></div>
    </div>
  );
};

export default TreeMap;
