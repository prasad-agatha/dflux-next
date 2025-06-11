import * as d3 from "d3";

export const XScale: any = (data: any, xOption: any, xdim: any, margin: any) => {
  d3.scaleBand()
    .domain(
      data.map(function (d: any) {
        return d.data[xOption];
      })
    )
    .range([margin.left, xdim])
    .padding(0.3);
};

// export const YScale: any = (test1: any, yOption: any, ydim: any, margin: any) => {
//   d3.scaleLinear()
//     .domain([
//       0,
//       d3.max(test1, function (d: any) {
//         return d3.max(keys, function (key: any) {
//           return d[key];
//         });
//       }),
//     ] as number[])
//     .range([ydim, 0])
//     .nice();
// };
