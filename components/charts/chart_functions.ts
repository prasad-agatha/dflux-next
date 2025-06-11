import { pieColors } from "@constants/common";
import _ from "lodash";
import * as htmlToImage from "html-to-image";

const colors = ["#FF6E54", "#FFA600", "#003F5C", "#444E86", "#955196", "#DD5182"];

export const filter_function = (
  data: any,
  filters: any,
  dimension: any,
  measures: any,
  finalAggregate: any
) => {
  let tempData: any = [];
  const filtered: any = [...filters];
  if (filters.length === 0) {
    tempData = data;
  } else {
    data.map((item: any) => {
      const keys = _.map(filters[0].selected, "value");

      if (filtered[0].type === "Dropdown" && keys.includes(item[filtered[0].field])) {
        tempData.push(item);
      } else if (
        filtered[0].type === "Slider" &&
        item[filtered[0].field] >= filtered[0].min1 &&
        item[filtered[0].field] <= filtered[0].max1
      ) {
        tempData.push(item);
      } else if (
        filters[0].type === "Textbox" &&
        item[filtered[0].field] === filtered[0].filterInput
      ) {
        tempData.push(item);
      }
    });

    filtered.shift();
    filtered.map((item: any) => {
      const keys = _.map(item.selected, "value");
      const dataKeys = _.map(tempData, item.field);
      const intersectedKeys = _.intersection(keys, dataKeys);
      tempData = _.filter(tempData, (el) => {
        return _.includes(intersectedKeys, el[item.field]);
      });
    });
  }
  const tempOptions = [...dimension, ...measures];
  // filtered out data from entire data with all options - tempData
  const tempOptionsData = _.map(tempData, (ele) => {
    const t = _.pick(ele, ...tempOptions);
    return t;
  });
  const filteredArrays: any = {};
  let aggregatedData1: any = [];
  // filtered out data from entire data with only user selected options - tempOptionsData

  // here we will reduce the entire data
  // using the dimension such that the
  // repeated items is assigned as an array of objetcs
  // in format of key, values pairs
  aggregatedData1 = Object.values(
    tempOptionsData.reduce((acc: any, item: any) => {
      const temp1 = item[dimension[0]];
      if (acc[temp1]) {
        //  acc[temp1][yOptions.y[0]] = acc[temp1][yOptions.y[0]] + item[yOptions.y[0]];
        measures.map((item1: any) => {
          acc[temp1][item1] += item[item1];
        });
      } else {
        filteredArrays[temp1] = [...tempData].filter((item4: any) => item4[dimension[0]] === temp1);
        acc[temp1] = item;
      }
      return acc;
    }, {})
  );
  const avg: any = [];
  // // here we will aggregate the entire data

  Object.entries(filteredArrays).map(([k, v]: any) => {
    tempOptionsData.filter((item: any) => {
      if (item[dimension[0]] == k) {
        measures.map((item3: any) => {
          const temp = v.map((item4: any) => {
            return item4[item3];
          });
          switch (finalAggregate) {
            case "Sum":
              item[item3] = item[item3] + 0;
              break;
            case "Average":
              item[item3] = item[item3] / v.length;
              break;
            case "Count":
              item[item3] = v.length;
              break;
            case "Maximum":
              item[item3] = Math.max(...temp);
              break;
            case "Minimum":
              item[item3] = Math.min(...temp);
              break;
            default:
              break;
          }
        });
        avg.push(item);
      }
    });
  });
  const sortedArray: any = finalAggregate !== "None" ? [...aggregatedData1] : [...tempData];

  return sortedArray;
};

export const format_chartData = (measures: any, finalData: any, render: any, response: any) => {
  const yAxis: any = [];
  _.map(measures, (item: any, index: any) => {
    yAxis.push({
      backgroundColor: render
        ? response.extra.measuresData[index].backgroundColor
        : measures.length > 6
        ? "#" + (((1 << 24) * Math.random()) | 0).toString(16)
        : colors[index],
      data: _.map(finalData, item),
      sum: _.map(finalData, item).reduce((partial_sum: any, a: any) => partial_sum + a, 0),
    });
  });

  return yAxis;
};

export const sort_ascending = (field: any, reverse: any, primer: any, sort_boolean: boolean) => {
  const key = primer
    ? function (x: any) {
        return primer(x[field]);
      }
    : function (x: any) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a: any, b: any) {
    if (sort_boolean) {
      return (a = key(a)), (b = key(b)), reverse * (+(a < b) - +(b < a));
    } else {
      return (a = key(a)), (b = key(b));
    }
  };
};

export const sort_descending = (field: any, reverse: any, primer: any, sort_boolean: boolean) => {
  const key = primer
    ? function (x: any) {
        return primer(x[field]);
      }
    : function (x: any) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a: any, b: any) {
    if (sort_boolean) {
      return (a = key(a)), (b = key(b)), reverse * (+(a > b) - +(b > a));
    } else {
      return (a = key(a)), (b = key(b));
    }
  };
};

export const chartDataFormat = (measuresData: any, measures: any, dimensionData: any) => {
  const datasets: any = [];
  const datasets1: any = [];
  const datasets2: any = [];
  const datasets3: any = [];
  const datasets4: any = [];
  const datasets5: any = [];
  const datasets6: any = [];
  const datasets7: any = [];
  const datasets8: any = [];
  const datasets9: any = [];
  // mapping label, backgroundcolor, and it's data

  // datasets for chart to render
  // mapping label, backgroundcolor, and it's data
  measuresData.map((item: any, index: any) => {
    const vstackedObj: any = {
      label: measures[index],
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      data: item.data,
      stacked: index % 2 === 0 ? "Stack 1" : "Stack 2",
      borderWidth: 1,
    };
    datasets.push(vstackedObj);
  });
  measuresData.map((item: any, index: any) => {
    const obj: any = {
      // taking labels from
      label: measures[index],
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      data: item.data,
      borderWidth: 1,
      // fill: index === 0 ? 1 : 0,
      // future area type charts case
      // fill: type === "area" ? false : true,
    };
    datasets1.push(obj);
  });
  // datasets for curve and line charts
  measuresData.map((item: any, index: any) => {
    const curveLineObj: any = {
      // taking labels from
      label: measures[index],
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      data: item.data,
    };
    datasets2.push(curveLineObj);
  });
  // datasets for area chart
  // mapping label, backgroundcolor, and it's data
  measuresData.map((item: any, index: any) => {
    const areaObj: any = {
      // taking labels from
      label: measures[index],
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      data: item.data,
      // y axes stacked have to be true
      fill: index === 0 ? true : true,
      // fill: "start",
      // future area type charts case
      // fill: type === "area" ? false : true,
    };
    datasets3.push(areaObj);
  });

  // datasets for mixed chart
  measuresData.map((item: any, index: any) => {
    const lineObj: any = {
      type: index % 2 === 0 ? "line" : "bar",
      label: measures[index],
      data: item.data,
      // fill: index % 2 === 0 ? true : false,
      borderColor: item.backgroundColor,
      backgroundColor: item.backgroundColor,
    };
    datasets4.push(lineObj);
  });
  // scatter type
  measuresData.map((item: any, index: any) => {
    const scatterObj: any = {
      label: measures[index],
      // data: item.data,
      data: item.data.map((item1: any) => {
        return { x: dimensionData[index], y: item1 };
      }),
      borderColor: item.backgroundColor,
      backgroundColor: item.backgroundColor,
    };
    datasets5.push(scatterObj);
  });
  //datasets for bubble chart type
  measuresData.map((item: any, index: any) => {
    const bubbleObj: any = {
      label: measures[index],
      data: item.data.map((item1: any) => {
        return { x: dimensionData[index], y: item1, r: item1 };
      }),
      borderColor: item.backgroundColor,
      backgroundColor: item.backgroundColor,
    };
    datasets6.push(bubbleObj);
  });

  // datasets for chart to render
  // mapping label, backgroundcolor, and it's data
  // ybgColorData.map((item: any, index: any) => {
  const pieObj: any = {
    label: measuresData[0]?.data[0],
    backgroundColor: pieColors,
    borderColor: pieColors,
    borderWidth: 1,
    hoverBorderWidth: 10,
    data: measuresData[0]?.data,
    percentage: measuresData[0]?.data.map((item2: any) => {
      return Number(((item2 / measuresData[0]?.sum) * 100).toFixed(2));
    }),
  };
  // });
  datasets7.push(pieObj);

  // datasets for chart to render
  // mapping label, backgroundcolor, and it's data
  // ybgColorData.map((item: any, index: any) => {
  const polarObj: any = {
    label: measuresData[0]?.data[0],
    backgroundColor: pieColors,
    borderColor: pieColors,
    borderWidth: 1,
    data: measuresData[0]?.data,
    percentage: measuresData[0]?.data.map((item2: any) => {
      return Number(((item2 / measuresData[0]?.sum) * 100).toFixed(2));
    }),
  };
  // });
  datasets8.push(polarObj);

  // datasets for chart to render
  // mapping label, backgroundcolor, and it's data
  measuresData.map((item: any, index: any) => {
    const radarObj: any = {
      // taking labels from
      label: measures[index],
      backgroundColor: item.backgroundColor,
      borderColor: item.backgroundColor,
      data: item.data,
      // fill: index === 0 ? "origin" : true,
      fill: false,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
    };
    datasets9.push(radarObj);
  });

  return [
    datasets,
    datasets1,
    datasets2,
    datasets3,
    datasets4,
    datasets5,
    datasets6,
    datasets7,
    datasets8,
    datasets9,
  ];
};

export const updateChartState = (
  rowX: any,
  rowY: any,
  yAxis: any,
  chartType: any,
  response: any
) => {
  const barDatasets: any = [];
  const mixedDatasets: any = [];
  const stackedDatasets: any = [];
  const curveLineDatasets: any = [];
  const areaDatasets: any = [];
  const scatterDatasets: any = [];
  const bubbleDatasets: any = [];
  const radarDatasets: any = [];
  const pieDatasets: any = [];
  const polarDatasets: any = [];
  let pieObj: any = {};
  let polarObj: any = {};
  const d3Object: any = [];
  switch (chartType) {
    case "bar":
      // datasets for bar chart
      rowY.map((item: any, index: any) => {
        const barObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          borderWidth: 1,
        };
        barDatasets.push(barObj);
      });
      return {
        labels: rowX,
        datasets: barDatasets,
      };
    case "horizontalBar":
      // datasets for bar chart
      rowY.map((item: any, index: any) => {
        const barObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          borderWidth: 1,
        };
        barDatasets.push(barObj);
      });
      return {
        labels: rowX,
        datasets: barDatasets,
      };
    case "bar1":
      // datasets for chart to render
      // mapping label, backgroundcolor, and it's data
      rowY.map((item: any, index: any) => {
        const stackedObj: any = {
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          stacked: index % 2 === 0 ? "Stack 1" : "Stack 2",
          borderWidth: 1,
        };
        stackedDatasets.push(stackedObj);
      });
      return {
        // x labels || x options data
        labels: rowX,
        // y labels && y bgColor && y option's data
        datasets: stackedDatasets,
      };
    case "bar2":
      // datasets for chart to render
      // mapping label, backgroundcolor, and it's data
      rowY.map((item: any, index: any) => {
        const stackedObj: any = {
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          stacked: index % 2 === 0 ? "Stack 1" : "Stack 2",
          borderWidth: 1,
        };
        stackedDatasets.push(stackedObj);
      });
      return {
        // x labels || x options data
        labels: rowX,
        // y labels && y bgColor && y option's data
        datasets: stackedDatasets,
      };
    case "curve":
      // datasets for curve and line charts
      rowY.map((item: any, index: any) => {
        const curveLineObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
        };
        curveLineDatasets.push(curveLineObj);
      });
      return {
        labels: rowX,
        datasets: curveLineDatasets,
      };
    case "line":
      // datasets for curve and line charts
      rowY.map((item: any, index: any) => {
        const curveLineObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
        };
        curveLineDatasets.push(curveLineObj);
      });
      return {
        labels: rowX,
        datasets: curveLineDatasets,
      };
    case "mixed":
      rowY.map((item: any, index: any) => {
        const lineObj: any = {
          type: index % 2 === 0 ? "line" : "bar",
          label: yAxis[index],
          data: item.data,
          // fill: index % 2 === 0 ? true : false,
          borderColor: item.backgroundColor,
          backgroundColor: item.backgroundColor,
        };
        mixedDatasets.push(lineObj);
      });
      return {
        labels: rowX,
        datasets: mixedDatasets,
      };
    case "area":
      // mapping label, backgroundcolor, and it's data
      rowY.map((item: any, index: any) => {
        const areaObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          // y axes stacked have to be true
          fill: index === 0 ? true : true,
          // fill: "start",
          // future area type charts case
          // fill: type === "area" ? false : true,
        };
        areaDatasets.push(areaObj);
      });
      return {
        // x labels || x options data
        labels: rowX,
        // y labels && y bgColor && y option's data
        datasets: areaDatasets,
      };
    case "scatter":
      rowY.map((item: any, index: any) => {
        const a = item.data;
        const scatterObj: any = {
          label: yAxis[index],
          // data: item.data,
          data: a.map((item1: any) => {
            return { x: rowX[index], y: item1 };
          }),
          borderColor: item.backgroundColor,
          backgroundColor: item.backgroundColor,
        };
        scatterDatasets.push(scatterObj);
      });
      return {
        labels: rowX,
        datasets: scatterDatasets,
      };
    case "bubble":
      rowY.map((item: any, index: any) => {
        const bubbleObj: any = {
          label: yAxis[index],
          data: item.data.map((item1: any) => {
            return { x: rowX[index], y: item1, r: item1 };
          }),
          borderColor: item.backgroundColor,
          backgroundColor: item.backgroundColor,
        };
        bubbleDatasets.push(bubbleObj);
      });

      return {
        labels: rowX,
        datasets: bubbleDatasets,
      };
    case "pie":
      // mapping label, backgroundcolor, and it's data
      pieObj = {
        label: rowY[0].data[0],
        backgroundColor: pieColors,
        borderColor: pieColors,
        borderWidth: 1,
        hoverBorderWidth: 10,
        data: rowY[0].data,
        percentage: rowY[0].data.map((item2: any) => {
          return Number(((item2 / rowY[0].sum) * 100).toFixed(2));
        }),
      };
      pieDatasets.push(pieObj);
      return {
        // x labels || x options data
        labels: rowY[0].data.map((item2: any, index: any) => {
          return `${rowX[index]} - ${Number(((item2 / rowY[0].sum) * 100).toFixed(2))} %`;
        }),
        // y labels && y bgColor && y option's data
        datasets: pieDatasets,
      };
    case "doughnut":
      // mapping label, backgroundcolor, and it's data
      pieObj = {
        label: rowY[0].data[0],
        backgroundColor: pieColors,
        borderColor: pieColors,
        borderWidth: 1,
        hoverBorderWidth: 10,
        data: rowY[0].data,
        percentage: rowY[0].data.map((item2: any) => {
          return Number(((item2 / rowY[0].sum) * 100).toFixed(2));
        }),
      };
      pieDatasets.push(pieObj);
      return {
        // x labels || x options data
        labels: rowY[0].data.map((item2: any, index: any) => {
          return `${rowX[index]} - ${Number(((item2 / rowY[0].sum) * 100).toFixed(2))} %`;
        }),
        // y labels && y bgColor && y option's data
        datasets: pieDatasets,
      };
    case "polarArea":
      // mapping label, backgroundcolor, and it's data
      // ybgColorData.map((item: any, index: any) => {
      polarObj = {
        label: rowY[0].data[0],
        backgroundColor: pieColors,
        borderColor: pieColors,
        borderWidth: 1,
        data: rowY[0].data,
        percentage: rowY[0].data.map((item2: any) => {
          return Number(((item2 / rowY[0].sum) * 100).toFixed(2));
        }),
      };
      // });
      polarDatasets.push(polarObj);
      return {
        // x labels || x options data
        labels: rowY[0].data.map((item2: any, index: any) => {
          return `${rowX[index]} - ${Number(((item2 / rowY[0].sum) * 100).toFixed(2))} %`;
        }),
        // y labels && y bgColor && y option's data
        datasets: polarDatasets,
      };
    case "radar":
      // mapping label, backgroundcolor, and it's data
      rowY.map((item: any, index: any) => {
        const radarObj: any = {
          // taking labels from
          label: yAxis[index],
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          data: item.data,
          // fill: index === 0 ? "origin" : true,
          fill: false,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
        };
        radarDatasets.push(radarObj);
      });
      return {
        // x labels || x options data
        labels: rowX,
        // y labels && y bgColor && y option's data
        datasets: radarDatasets,
      };
    case "histogram":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "treeMap":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "boxPlot":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "waffle":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "heatMap":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "packedBubble":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "paretoChart":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "waterfallChart":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "sankey":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "bump":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "map":
      response.map((item: any) => {
        Object.keys(item).map((item1: any) => {
          d3Object.push({ group: item1, category: item[item1], data: item });
        });
      });
      return { labels: [], datasets: d3Object };
    case "table":
      return { labels: [], datasets: [] };
  }
};

// download as image
export const downloadAsImage = (name: any) => {
  // const inputRef: any = window.document.getElementsByClassName("myCanvas")[0];
  // html2canvas(inputRef).then((canvas) => {
  //   const imgData = canvas.toDataURL("image/png");
  //   const a = document.createElement("a");
  //   a.href = imgData;
  //   a.download = "chart.png";
  //   a.click();
  // });

  const node: any = document.getElementById("myCanvas");
  const chartName = name ? `${name}.png` : "chart.png";
  htmlToImage.toPng(node).then(function (dataUrl: any) {
    const link = document.createElement("a");
    link.download = chartName;
    link.href = dataUrl;
    link.click();
  });
};

// image src url to file
export const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
