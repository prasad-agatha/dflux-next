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
  showAxis: any;
  xAxisTitle: any;
}

const BumpChart: FC<IMyAppProps> = (props) => {
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
    showAxis,
    xAxisTitle,
    showXAxisTitle,
  } = props;
  const css = `
            .active,.click-active{
                // stroke:#000;
                stroke-width: 2;
                opacity: 1;
                stroke-opacity: 1;
                z-index: 1000;
            }
            path.click-active {
                stroke-width: 3;
            }    
            path.active {
                stroke-width: 3;
            }
        `;
  const bumpData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      bumpData.push({
        name: d.category,
        year: d.data[yOption[0]],
        profit: d.data[yOption[1]],
      });
    }
    return bumpData;
  });
  const canvas11 = useRef(null);
  tooltip.style("display", "none").style("opacity", 0);

  useEffect(() => {
    d3.select(canvas11.current).html("");
    if (xOption[0].length >= 1 && yOption.length >= 2 && bumpData.length > 0) {
      drawBumpChart();
    }
    tooltip.style("display", "none").style("opacity", 0);
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, legendsVisible]);

  function drawBumpChart() {
    const svg = d3
      .select(canvas11.current)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    bumpData.sort(function (a: any, b: any) {
      if (b["year"] != a["year"]) {
        return b["year"] - a["year"];
      }
      if (b["profit"] != a["profit"]) {
        return b["profit"] - a["profit"];
      }
    });

    // Calculate rank/position
    let pos = 1;
    bumpData[0].position = pos;
    for (let k = 1; k < bumpData.length; k++) {
      if (bumpData[k - 1].year != bumpData[k].year) {
        pos = 1;
      } else {
        pos++;
      }
      bumpData[k].position = pos;
    }
    // adding a class for color coding and links
    bumpData.forEach(function (d: any) {
      // Todo : Handle Date Object?
      if (typeof d.name == "string") {
        return (d["class"] =
          // "class-" +
          // d["name"].toLowerCase().replace(/ /g, "-").replace(/\./g, "").replace(/\\!/g, ""));
          "class-" +
          d["name"]
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/[\W_]+/g, ""));
      } else {
        return (d["class"] =
          "class-" +
          d["name"]
            .toString()
            .replace(/\./g, "")
            .replace(/[\W_]+/g, ""));
      }
    });

    // Scales
    const xScale: any = d3
      .scaleBand()
      .domain(bumpData.map((d: any) => shortName(d.year)).reverse())
      .range([20, xdim]);
    const min: any = d3.min(bumpData, function (d: any) {
        return d["position"];
      }),
      max: any = d3.max(bumpData, function (d: any) {
        return d["position"];
      });
    const yScale: any = d3.scaleLinear().domain([min, max]).range([10, ydim]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // Axis
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale).ticks(max - min);
    showAxis
      ? svg
          .append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(-" + 20 + "," + (ydim) + ")")
          .call(xAxis)
          .selectAll("text")
          .attr("transform", function (d: any) {
            const textTick = d.toString();
            if (textTick.length > 3) {
              return "translate(0,0)rotate(-45)";
            } else return "";
          })
          .style("text-anchor", "end")
      : null;
svg.selectAll('g').selectAll('.xaxis').select('path').remove()
    showAxis
      ? svg
          .append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .call(yAxis)
      : null;

    // Y Axis Title
    svg
      .append("text")
      .text("Rank")
      .attr("text-anchor", "middle")
      .attr("class", "y-title")
      .attr("font-size", "10")
      .attr("y", 0 - 21)
      .attr("x", 0 - ydim / 2)
      .attr("transform", "rotate(-90)");

    // X Axis Title
    showXAxisTitle
      ? svg
          .append("text")
          .text(xAxisTitle)
          .attr("text-anchor", "middle")
          .attr("class", "x-title")
          .attr("font-size", "10")
          .attr("x", xdim / 2)
          .attr("y", ydim + 55)
      : null;

    // Connector lines
    const clubs: any = new Set(bumpData.map((d: any) => d.name));
    colorScale.domain(clubs);
    clubs.forEach(function (club: any) {
      const currData = bumpData.filter(function (d: any) {
        if (d["name"] == club) {
          return d;
        }
      });
      const line: any = d3
        .line()
        .x((d: any) => xScale(shortName(d.year)))
        .y(function (d: any) {
          return yScale(d["position"]);
        });

      svg
        .append("path")
        .datum(currData)
        .attr("class", function () {
          if (typeof club == "string") {
            return (
              // "class-" +
              // club.toLowerCase().replace(/ /g, "-").replace(/\./g, "").replace(/\\!/g, "")
              "class-" +
              club
                .toLowerCase()
                .replace(/\./g, "")
                .replace(/[\W_]+/g, "")
            );
          } else {
            const pathstr = club.toString();
            return "class-" + pathstr.toLowerCase();
          }
        })
        .attr("style", "fill:none !important")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.1)
        .attr("stroke", () => colorScale(club))
        .attr("d", line);
    });
    // Nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(bumpData)
      .join("circle")
      .attr("class", "point")
      .attr("cx", function (d: any) {
        return xScale(shortName(d.year));
      })
      .attr("cy", function (d: any) {
        return yScale(d["position"]);
      })
      .attr("fill", (d: any) => colorScale(d.name))
      .attr("class", function (d: any) {
        if (typeof d.name == "string") {
          return d["name"]
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/[\W_]+/g, "");
        } else {
          const circlestr = d["name"].toString();
          return "class-" + circlestr.toLowerCase();
        }
      })
      .attr("r", 7)
      .attr("stroke-width", 2.5);

    // Tooltips
    svg
      .selectAll("circle")
      .on("mouseover", function (event, d: any) {
        svg.selectAll("." + d["class"]).classed("active", true);
        node
          .attr("stroke", (d: any) => {
            const clicked: any = svg.selectAll("." + d["class"]);
            if (clicked._groups[0].length > 0) {
              return clicked.attr("class").includes("active") ? "#000" : "none";
            } else return "none";
          })
          .attr("opacity", (d: any) => {
            const clicked: any = svg.selectAll("." + d["class"]);
            if (clicked._groups[0].length > 0) {
              return !clicked.attr("class").includes("active") ? 0.2 : 1;
            } else return 1;
          });
        const tooltip_str =
          xOption[0] +
          ": " +
          d["name"] +
          "<br/>" +
          yOption[0] +
          ": " +
          d["year"] +
          "<br/>" +
          yOption[1] +
          ": " +
          d["profit"] +
          "<br/>" +
          "Rank: " +
          d["position"];

        tooltip.html(tooltip_str).style("display", "block").style("opacity", "1");
      })
      .on("mousemove", function (event) {
        tooltip.style("top", event.pageY - 110 + "px").style("left", event.pageX - 30 + "px");
      })
      .on("mouseout", function (event, d: any) {
        svg.selectAll("." + d["class"]).classed("active", false);
        node
          .attr("stroke", (d: any) => {
            const clicked: any = svg.selectAll("." + d["class"]);
            if (clicked._groups[0].length > 0) {
              return clicked.attr("class").includes("active") ? "#000" : "none";
            } else return "none";
          })
          .attr("opacity", 1);
        tooltip.style("display", "none").style("opacity", "0");
      })
      .on("click", function (event, d: any) {
        svg.selectAll("." + d["class"]).classed("click-active", function () {
          // toggle state
          return !d3.select(this).classed("click-active");
        });
        node.attr("stroke", (d: any) => {
          const clicked: any = svg.selectAll("." + d["class"]);
          if (clicked._groups[0].length > 0) {
            return clicked.attr("class").includes("click-active") ? "#000" : "none";
          } else return "none";
        });
      });
    // Legend
    if (legendsVisible) {
      const legendWidth: any = xdim;
      const LEGEND_OFFSET = ydim + margin.bottom - 80;
      const LEGEND_RECT_SIZE = 6;
      const LEGEND_H_SPACING = 108;
      const LEGEND_V_SPACING = 9;
      const LEGEND_TEXT_X_OFFSET = 2;
      const LEGEND_TEXT_Y_OFFSET = 1;
      const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);
      //   const legendData = bumpData.map((d: any) => {
      //     if (bumpData.length != 0) {
      //       const name = new Set(d.name);
      //       return name;
      //     }
      //   });
      const legendElem = svg
        .append("g")
        .attr("transform", `translate(30,${LEGEND_OFFSET})`)
        .selectAll("g")
        .data(clubs)
        .join("g")
        .attr("transform", (d: any, i: any) => {
          const x = (i % legendElemsPerRow) * LEGEND_H_SPACING;
          const y =
            Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow);

          return `translate(${x},${y})`;
        });

      legendElem
        .append("rect")
        .attr("width", LEGEND_RECT_SIZE)
        .attr("height", LEGEND_RECT_SIZE)
        .attr("class", "legend-item")
        .style("fill", function (d: any) {
          return colorScale(d);
        });

      legendElem
        .append("text")
        .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .attr("font-size", 10)
        .text((d) => `${d}`);
    }

    // clipping length -- for axis text
    function shortName(name: any) {
      let changedName: any = name.toString();
      if (changedName.length > 7) {
        changedName = changedName.substring(0, 6) + "...";
      }
      return changedName;
    }
  }
  return (
    <div className="canvas11" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <svg
        viewBox={`0 0 ${xdim + margin.left + margin.right} ${ydim + margin.top + margin.bottom}`}
        ref={canvas11}
      ></svg>
      <style>{css}</style>
    </div>
  );
};

export default BumpChart;
