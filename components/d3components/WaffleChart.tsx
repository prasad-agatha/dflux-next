import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";
import { toast } from "react-toastify";

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
  setType?: any;
  legendsVisible?: any;
}

const WaffleChart: FC<IMyAppProps> = (props) => {
  const { xdim, ydim, margin, xdata, d3Data, xOption, yOption, tooltip, legendsVisible, setType } =
    props;

  const waffleData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      waffleData.push({
        name: d.category,
        value: d.data[yOption[0]],
      });
    }
  });
  const canvas = useRef(null);
  const wrapperRef = useRef(null);

  tooltip.style("display", "none").style("opacity", 0);

  useEffect(() => {
    d3.select(canvas.current).html("");
    tooltip.style("display", "none").style("opacity", 0);
    if (typeof waffleData[0].value === "number") {
      renderWaffleChart();
    } else {
      // setType("bar");
      toast.error("Dimension should be a number for waffle chart");
    }
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, setType, legendsVisible]);

  function renderWaffleChart() {
    const svg = d3.select(canvas.current);
    svg.selectAll("g").remove();
    let total = 0;

    const widthSquares = 20;
    const heightSquares = 5;
    const squareSize = 25;
    let squareValue = 0;
    const gap = 1;
    let theData: any = [];

    const color = d3.scaleOrdinal(d3.schemeTableau10);
    //total
    total = d3.sum(waffleData, function (d: any) {
      return d.value;
    });

    //value of a square
    squareValue = total / (widthSquares * heightSquares);

    //remap data
    waffleData?.forEach(function (d: any, i: any) {
      if (waffleData.length != 0) {
        d.fill = color(i);
        d.population = d.value;
        d.units = Math.floor(d.value / squareValue);
        if (yOption[0] !== undefined) {
          theData = theData.concat(
            Array(d.units + 1)
              .join()
              .split("")
              .map(function () {
                return {
                  squareValue: squareValue,
                  units: d.units,
                  population: d.value,
                  fill: d.fill,
                  groupIndex: i,
                };
              })
          );
        }
      }
    });

    svg
      .append("svg")

      .append("g")
      .selectAll("div")
      .data(theData)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      .attr("fill", function (d: any) {
        return d.fill;
      })
      .attr("x", function (d: any, i: any) {
        //group n squares for column
        const col = Math.floor(i / heightSquares);
        return col * squareSize + col * gap;
      })
      .attr("y", function (d, i) {
        const row = i % heightSquares;
        return heightSquares * squareSize - (row * squareSize + row * gap);
      })

      .on("mouseover", function (d: any, i: any) {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);
        tooltip.style("display", "block").style("opacity", 1);

        tooltip
          .html(
            "" +
              waffleData[i.groupIndex].name +
              "<br>" +
              yOption[0] +
              ":" +
              i.population +
              " , " +
              i.units +
              "%"
          )
          .style("left", `${d.pageX + 10}px`)
          .style("top", `${d.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
        tooltip.style("display", "block").style("opacity", 0);
      });

    svg
      .append("text")
      .attr("transform", "translate(" + xdim / 2 + " ," + (ydim - 120) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", 15)
      .text(xOption[0]);

    //Legend
    d3.select("#wafflelegend").html("");
    const legendSvg = d3.select("#wafflelegend");
    const legendElem = legendSvg
      .selectAll("div")
      .data(
        waffleData.map((d: any) => {
          if (waffleData.length != 0) {
            return d.name;
          }
        })
      )
      .enter()
      .append("div")
      .attr("class", "wafflelegend-item");

    if (legendsVisible) {
      legendElem
        .append("div")
        .attr("class", "wafflelegend-item--color")
        .style("background-color", (d: any) => color(d));

      legendElem
        .append("h3")
        .attr("class", "wafflelegend-item--header")
        .text((d, i) => `${d} (${waffleData[i].units}%)`)
        .attr("font-size", 11);
    }
  }

  return (
    <div className="canvas" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <div ref={wrapperRef}>
        <svg viewBox={`0 0 ${xdim + margin.left + margin.right} ${200}`} ref={canvas}></svg>
      </div>
      <div id="wafflelegend"></div>
    </div>
  );
};

export default WaffleChart;
