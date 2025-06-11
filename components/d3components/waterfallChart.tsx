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

const WaterfallChart: FC<IMyAppProps> = (props) => {
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

  const waterfallData: any = [];
  d3Data.map((d: any) => {
    if (d.group === xOption[0]) {
      waterfallData.push({
        name: d.category,
        value: d.data[yOption[0]],
      });
    }
  });

  const nested = d3.rollups(
    waterfallData,
    (v: any) => d3.sum(v, (d: any) => d.value),
    (d: any) => d.name
  );
  const data1: any = [];
  nested.map((item: any) => {
    const obj: any = {};
    obj.name = item[0];
    obj.value = item[1];
    data1.push(obj);
  });

  const canvas1 = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    d3.select(canvas1.current).html("");
    waterfallKey();
    // const svg = d3.select(canvas1.current);
    tooltip.style("display", "none").style("opacity", 0);
  }, [xdim, ydim, xdata, d3Data, xOption, yOption, showXAxisTitle, xAxisTitle, showAxis]);

  function waterfallKey() {
    //Setting chart dimensions
    const padding = 0.4,
      svg = d3
        .select(canvas1.current)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x: any = d3.scaleBand().range([0, xdim]).padding(padding);

    const y: any = d3.scaleLinear().range([ydim - padding, padding]);

    //function to find all the positive values
    const positive_val = data1.filter(function (d: any) {
      return d.value > 0;
    });
    //function to calculate the sum of all the positive values
    positive_val.reduce(function (sum: any, d: any) {
      return sum + d.value;
    }, 0);
    //function to adjust the length of axis ticks

    let cumulative: any = 0;
    for (let i = 0; i < data1.length; i++) {
      data1[i].start = cumulative;
      cumulative += data1[i].value;
      data1[i].end = cumulative;
      data1[i].class = data1[i].value >= 0 ? "positive" : "negative";
    }
    data1.push({
      name: "Total",
      end: cumulative,
      start: 0,
      class: "total",
      value: cumulative,
    });

    x.domain(
      data1.map(function (d: any) {
        return d.name;
      })
    );
    y.domain([
      0,
      d3.max(data1, function (d: any) {
        return d.end;
      }),
    ]);
    // X Axis
    showAxis
      ? svg
          .append("g")
          .attr("transform", "translate(0," + ydim + ")")
          .call(
            d3.axisBottom(x).tickFormat((d: any, i: any) => {
              if (d !== null) {
                const name = d.toString();
                return i % 2 !== 0 ? "" : name.length > 7 ? name.substring(0, 5) + "..." : name;
              }
            })
          )
          .selectAll("text")
          .attr("transform", "translate(0,0)rotate(-45)")
          .style("text-anchor", "end")
      : null;

    const yAxis: any = d3.axisLeft(y);
    showAxis ? svg.append("g").call(yAxis.tickFormat(d3.format(".0s"))) : null;

    const bar = svg
      .selectAll(".bar")
      .data(data1)
      .enter()
      .append("g")
      .attr("class", function (d: any) {
        return "bar " + d.class;
      })
      .attr("transform", function (d: any) {
        return "translate(" + x(d.name) + ",0)";
      });

    bar
      .append("rect")
      .attr("width", x.bandwidth())
      .attr("y", function (d: any) {
        return y(Math.max(d.start, d.end));
      })
      .attr("height", function (d: any) {
        return Math.abs(y(d.start) - y(d.end));
      });

    d3.selectAll(".bar.positive").style("fill", "#306B34");
    d3.selectAll(".bar.negative").style("fill", "#306B34");
    d3.selectAll(".total").style("fill", "#4682B4");

    if (typeof data1[0].value === "number") {
      bar
        .filter(function (d: any) {
          return d.class != "total";
        })
        .append("line")
        .attr("class", "connector")
        .attr("x1", x.bandwidth() + 5)
        .attr("y1", function (d: any) {
          return y(d.end);
        })
        .attr("x2", x.bandwidth() / (1 - padding) - 5)
        .attr("y2", function (d: any) {
          return y(d.end);
        })
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-dasharray", "3");

      bar
        .append("text")
        .attr("class", "bartext")
        .attr("x", x.bandwidth() / 2 - 7)
        .attr("y", function (d: any) {
          return y(d.end) + 5;
        })
        .attr("dy", function (d: any) {
          return (d.class == "negative" ? "" : "-") + ".75em";
        })
        .attr("font-size", "7")
        .text(function (d: any) {
          return typeof (d.end - d.start) === "number" && d.end - d.start !== 0
            ? d3.format(".2s")(d.end - d.start)
            : "";
        });
    }
    bar
      .on("mousemove", function (event, d: any) {
        tooltip
          .style("display", "block")

          .style("opacity", "1")
          .html(d.name + ": " + d.value)
          .style("left", event.pageX - 40 + "px")
          .style("top", event.pageY - 50 + "px")
          .style("background-color", "rgb(0,0,0,0.8)");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none").style("opacity", "0");
      });
    //Axis Sub-titles
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 50)
      .attr("x", 0 - ydim / 2)
      .attr("dy", ".8em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .style("font-family", "Calibri")
      .text(yOption[0])
      .style("font-size", "12");
    // X Axis Title
    showXAxisTitle
      ? svg
          .append("text")
          .attr("transform", "translate(" + xdim / 2 + " ," + (ydim + 60) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "12")
          .text(xAxisTitle)
      : null;
  }
  return (
    <div className="canvas1" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <div ref={wrapperRef}>
        <svg
          viewBox={`0 0 ${xdim + margin.right + margin.left} ${
            ydim + margin.top + margin.bottom + 60
          }`}
          ref={canvas1}
        ></svg>
      </div>
    </div>
  );
};

export default WaterfallChart;
