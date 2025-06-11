import React, { useEffect, useRef, FC } from "react";
import * as d3 from "d3";
import { toast } from "react-toastify";
import ResizeObserver from "resize-observer-polyfill";

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
  showXAxisTitle?: any;
  xAxisTitle?: any;
  showAxis?: any;
}

const HistogramChart: FC<IMyAppProps> = (props) => {
  const {
    xdim,
    ydim,
    margin,
    xdata,
    d3Data,
    xOption,
    yOption,
    tooltip,
    setType,
    legendsVisible,
    showXAxisTitle,
    xAxisTitle,
    showAxis,
  } = props;

  const useResizeObserver = (ref: any) => {
    const [dimensions, setDimensions] = React.useState(null);
    useEffect(() => {
      const observeTarget = ref.current;
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry: any) => {
          setDimensions(entry.contentRect);
        });
      });
      resizeObserver.observe(observeTarget);
      return () => {
        resizeObserver.unobserve(observeTarget);
      };
    }, [ref]);

    return dimensions;
  };

  const canvas = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const color = "steelblue";
  tooltip.style("display", "none").style("opacity", 0);

  const checkChartType = (a: any) => {
    let check = 0;
    a.map((item: any) => {
      if (typeof item === "string") {
        check = 0;
      } else {
        check = check + 1;
      }
    });
    if (check === 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (checkChartType(xdata)) {
      setType("bar");
      toast.error(
        "Histogram chart can only be rendered on numbers, Please change measure to render this chart!!!"
      );
    } else {
      const svg = d3.select(canvas.current);
      d3.select(canvas.current).html("");
      tooltip.style("display", "none").style("opacity", 0);

      if (!dimensions) return;
      addAxis(svg);
      addBars(svg);
      addText(svg);
    }
  }, [
    xdim,
    ydim,
    margin,
    xdata,
    d3Data,
    xOption,
    yOption,
    tooltip,
    setType,
    legendsVisible,
    dimensions,
    showXAxisTitle,
    xAxisTitle,
    showAxis,
  ]);

  const data = d3Data;
  const test1: any = [];
  d3Data.map((d: any) => {
    test1.push(d.data);
  });

  const bins = d3.bin().thresholds(10)(xdata);

  const min = Math.min(...xdata);
  const xscale: any = d3
    .scaleLinear()
    .domain([
      min - min / 2,
      d3.max(data, function (d: any) {
        return d.data[xOption[0]] + 10;
      }),
    ] as number[])
    .range([margin.left, xdim + 10]); //change

  //y axis and draw

  const yscale = d3.scaleLinear();
  yscale
    .domain([
      0,
      d3.max(bins, function (d) {
        return d.length + 3;
      }), // todo
    ] as number[])
    .range([ydim, margin.top]) //change
    .nice();

  const addText = (svg: any) => {
    showXAxisTitle
      ? svg
          .append("text")
          .attr("transform", "translate(" + (xdim / 2 + 30) + " ," + (ydim + margin.top + 30) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "13px")
          .text(xAxisTitle)
      : null;
  };

  const addAxis = (svg: any) => {
    // adding y axis for left and appending to svg
    const yAxis = d3.axisLeft(yscale);
    showAxis
      ? svg.append("g").call(yAxis).attr("transform", `translate(${margin.left},${0})`)
      : null;
  };

  const addBars = (svg: any) => {
    const state = svg
      .selectAll("rect")
      // Fill with a rectangle for visualization.
      .data(bins)
      .join("rect")
      .attr("height", function () {
        return ydim - yscale(0);
      });

    state
      .attr("x", 0)
      .attr("transform", function (d: any) {
        return `translate(${xscale(d.x0)} , ${yscale(d.length)} )`;
      })
      .attr("width", function (d: any) {
        return xscale(d.x1) - xscale(d.x0) - 1;
      })

      .transition()
      .duration(function () {
        return 1000;
      })

      .attr("height", function (d: any) {
        return ydim - yscale(d.length);
      })
      .style("fill", color);
    state
      .on("mousemove", function (d: any, i: any) {
        tooltip.style("display", "block").style("opacity", 1);

        const left = d.pageX + 10;
        const top = d.pageY + 20;
        tooltip
          .style("visibility", "visible")
          .text(`Values : ${i.length}\nmin : ${i.x0}\nmax : ${i.x1}`)
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function () {
        //Remove the tooltip

        tooltip.style("display", "block").style("opacity", 0);
      });
    showAxis
      ? svg
          .append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + ydim + ")")
          .call(d3.axisBottom(xscale))
      : null;

    d3.select(".legendHolder").html("");

    svg
      .append("g")
      // translate the holder to the right side of the graph
      .attr("transform", `translate(0, ${280 + margin.top + 10})`)
      .attr("class", "legendHolder");

    const legendWidth: any = xdim;
    const LEGEND_OFFSET = ydim + margin.bottom + 40;
    const LEGEND_RECT_SIZE = 9;
    const LEGEND_H_SPACING = 145;
    const LEGEND_V_SPACING = 7;
    const LEGEND_TEXT_X_OFFSET = 2;
    const LEGEND_TEXT_Y_OFFSET = -1.7;
    const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);
    const legendData = [xOption[0]];
    const legendElem = svg
      .append("g")
      .attr("transform", `translate(${xdim / 2},${LEGEND_OFFSET})`)
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr("transform", (d: any, i: any) => {
        const x = (i % legendElemsPerRow) * LEGEND_H_SPACING;
        const y =
          Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
          LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow);

        return `translate(${x + 15},${y})`;
      });
    if (legendsVisible) {
      legendElem
        .append("rect")
        .attr("width", LEGEND_RECT_SIZE)
        .attr("height", LEGEND_RECT_SIZE)
        .attr("class", "legend-item")
        .style("fill", color);

      legendElem
        .append("text")
        .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .attr("font-size", 10)
        .text((d: any) => `${d}`);
    }
  };

  return (
    <div className="canvas" style={{ width: "auto", height: "auto", margin: "auto" }}>
      <div ref={wrapperRef}>
        <svg
          viewBox={`0 0 ${xdim + margin.left + margin.right} ${
            ydim + margin.top + margin.bottom + 50
          }`}
          ref={canvas}
        ></svg>
      </div>
    </div>
  );
};

export default HistogramChart;
