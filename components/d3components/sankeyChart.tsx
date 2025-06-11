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

const SankeyChart: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, d3Data, xOption, yOption, tooltip, legendsVisible } = props;

  const radialData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      radialData.push({
        key: d.category,
        value: d.data[yOption[0]],
      });
    }
  });
  const canvas1 = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    d3.select(canvas1.current).html("");

    renderSankeyChart();
    // const svg = d3.select(canvas1.current);
    tooltip.style("display", "none").style("opacity", 0);
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, legendsVisible]);

  function renderSankeyChart() {
    draw(radialData);
    function draw(data: any) {
      const svg = d3.select(canvas1.current),
        barHeight = ydim / 2.5,
        formatNumber = d3.format(".0s");

      const color = d3.scaleOrdinal(d3.schemeTableau10),
        g = svg.append("g").attr("transform", "translate(" + xdim / 2 + "," + ydim / 2 + ")");
      const keys = data.map(function (d: any) {
        return d.key;
      });
      const numBars = keys.length;
      const extent: any = d3.extent(data, function (d: any) {
        return d.value;
      });

      const barScale = d3
        .scaleRadial()
        .domain([0, d3.max(data, (d: any) => d.value)] as number[])
        .range([0, barHeight]);
      const x = d3.scaleLinear().domain(extent).range([0, -barHeight]);

      g.selectAll("circle")
        .data(x.ticks(3))
        .join("circle")
        .attr("r", function (d) {
          return barScale(d);
        })
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width", ".5px");
      const arc: any = d3
        .arc()
        .startAngle(function (d, i) {
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function (d, i) {
          return ((i + 1) * 2 * Math.PI) / numBars;
        })
        .innerRadius(0)
        .outerRadius((d: any) => barScale(d.value));
      g.selectAll("path")
        .data(data)
        .join("path")
        .style("fill", function (d: any) {
          return color(d.key);
        })
        .attr("d", arc)
        // Tooltip
        .on("mouseover", function (d: any) {
          tooltip
            .html(d.key + " : " + d.value)
            .style("display", "block")
            .style("opacity", 1);
        })
        .on("mousemove", function (event, d: any) {
          tooltip
            .style("top", event.pageY - 45 + "px")

            .style("left", event.pageX - 35 + "px")
            .style("color", "#fff")
            .attr("stroke", "#000");
          tooltip.html(d.key + " : " + d.value);
        })
        .on("mouseout", function () {
          tooltip.style("display", "none").style("opacity", 0);
        });
      g.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5px");
      g.selectAll("line")
        .data(keys)
        .enter()
        .append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "black")
        .style("stroke-width", ".5px")
        .attr("transform", function (d, i) {
          return "rotate(" + (i * 360) / numBars + ")";
        });

      g.append("g").attr("class", "x axis").call(d3.axisLeft(x).ticks(3).tickFormat(formatNumber));
      const labelRadius = barHeight * 1.025;
      //Labels
      const labels = g.append("g").classed("labels", true);

      labels
        .append("def")
        .append("path")
        .attr("id", "label-path")
        .attr(
          "d",
          "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0"
        );

      labels
        .selectAll("text")
        .data(keys)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "7px")
        .style("fill", "#3e3e3e")
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function (d: any, i: any) {
          return (i * 100) / numBars + 50 / numBars + "%";
        })
        .text((d: any) => {
          if (typeof d === "string") {
            return d.length < 3 ? d : d.substring(0, 1) + "..";
          } else if (typeof d === "number") {
            const result = d.toString();
            return result.length > 3 ? result.substring(0, 1) + ".." : result;
          }
          return d;
        });
      //Legend
      if (legendsVisible) {
        const legendData = new Set(radialData.map((d: any) => d.key));
        d3.select("#radiallegend").html("");
        const legendSvg = d3.select("#radiallegend");
        const legendElem = legendSvg
          .selectAll("div")
          .data(legendData)
          .join("div")
          .attr("class", "radiallegend-item");

        legendElem
          .append("div")
          .attr("class", "radiallegend-item--color")
          .style("background-color", (d: any) => color(d));

        legendElem
          .append("h3")
          .attr("class", "radiallegend-item--header")
          .text((d: any) => d)
          .attr("font-size", 11);
      }
    }
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <div ref={wrapperRef}>
        <svg
          viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.bottom + margin.top}`}
          ref={canvas1}
        ></svg>
        <div id="radiallegend"></div>
      </div>
    </div>
  );
};

export default SankeyChart;
