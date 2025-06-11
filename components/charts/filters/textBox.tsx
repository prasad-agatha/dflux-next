import React, { FC } from "react";
import { Form } from "react-bootstrap";

interface FilterInputProps {
  filters1: any;
  data: any;
  index1: any;
  chartState: any;
  renderChart: any;
  setFilters1: any;
}

const TextBox: FC<FilterInputProps> = ({
  filters1,
  setFilters1,
  data,
  index1,
  chartState,
  renderChart,
}) => {
  return (
    <Form.Control
      type={typeof data.values[0].value === "number" ? "number" : "text"}
      placeholder={`Enter ${data.field}`}
      className="px-2 f-12 chart-filters"
      style={{ borderRadius: 2 }}
      value={data.filterInput}
      onChange={(event: any) => {
        const value =
          typeof data.values[0].value === "number"
            ? Number(event.target.value)
            : event.target.value;
        const a: any = filters1?.textBox.map((item: any, index: any) => {
          if (index1 === index) {
            const result = data.values.filter((el: any) => {
              if (value === el.value) {
                return true;
              }
            });

            return {
              field: item.field,
              fieldType: item.fieldType,
              open: false,
              type: item.type,
              values: item.values,
              selected: result,
              min: item.min,
              max: item.max,
              min1: item.min,
              max1: item.max1,
              filterInput: value,
            };
          } else {
            return item;
          }
        });
        setFilters1({ ...filters1, textBox: a });
        // setFilters(a);
        // renderChart(
        //   chartState.data,
        //   chartState.dimension,
        //   chartState.measures,
        //   chartState.aggregateOptions,
        //   a,
        //   chartState.optionsCount,
        //   chartState.ascending,
        //   chartState.descending,
        //   chartState.sortingField
        // );
      }}
      onBlur={(event: any) => {
        const value =
          typeof data.values[0].value === "number"
            ? Number(event.target.value)
            : event.target.value;
        const a: any = filters1.textBox.map((item: any, index: any) => {
          if (index1 === index) {
            const result = data.values.filter((el: any) => {
              if (value === el.value) {
                return true;
              }
            });

            return {
              field: item.field,
              fieldType: item.fieldType,
              open: false,
              type: item.type,
              values: item.values,
              selected: result,
              min: item.min,
              max: item.max,
              min1: item.min,
              max1: item.max1,
              filterInput: value,
            };
          } else {
            return item;
          }
        });
        renderChart(
          false,
          chartState.axisTitle,
          chartState.showLabel,
          chartState.showLegend,
          chartState.showGrids,
          chartState.showAxis,
          chartState.showAxisTitle,
          chartState.data,
          chartState.dimension,
          chartState.measures,
          chartState.aggregate,
          { ...filters1, textBox: a },
          chartState.optionsCount,
          chartState.ascending,
          chartState.descending,
          chartState.sortingField
        );
      }}
      min={filters1?.textBox.map((item: any) => {
        return item.min;
      })}
      max={filters1?.textBox.map((item: any) => {
        return item.max;
      })}
    />
  );
};

export default TextBox;
