import React, { FC } from "react";
import { Form } from "react-bootstrap";

interface FilterInputProps {
  filters: any;
  data: any;
  renderFiltered: any;
  index1: any;
  root?: any;
  indexChart?: any;
  item?: any;
}

const FilterInput: FC<FilterInputProps> = ({
  filters,
  data,
  index1,
  renderFiltered,
  root,
  indexChart,
  item,
}) => {
  const [temp, setTemp] = React.useState(data.filterInput);
  const inputStyle = {
    borderRadius: 2,
  };
  return (
    <Form.Control
      className="px-2 f-12 chart-filters"
      type={typeof data.values[0].value === "number" ? "number" : "text"}
      placeholder={`Enter ${data.field}`}
      style={inputStyle}
      value={root === "dashboard" ? temp : data.filterInput}
      onChange={(event: any) => {
        if (root === "dashboard") {
          setTemp(event.target.value);
          const value =
            typeof data.values[0].value === "number"
              ? Number(event.target.value)
              : event.target.value;
          const a: any = filters[indexChart].filters?.textBox.map((item: any, index: any) => {
            if (index1 === index) {
              const result = data.values.filter((el: any) => {
                if (value === el.value) {
                  return true;
                }
              });

              return {
                field: item.field,
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
          const temp4: any = filters;
          temp4[indexChart] = {
            id: temp4[indexChart].id,
            filters: { ...filters[indexChart].filters, textBox: a },
            x: a[indexChart].x,
            y: a[indexChart].y,
            chartState: temp4[indexChart].chartState,
          };
        }
      }}
      onBlur={(event: any) => {
        if (root === "dashboard") {
          const value =
            typeof data.values[0].value === "number"
              ? Number(event.target.value)
              : event.target.value;
          const a: any = filters[indexChart].filters?.textBox.map((item: any, index: any) => {
            if (index1 === index) {
              const result = data.values.filter((el: any) => {
                if (value === el.value) {
                  return true;
                }
              });

              return {
                field: item.field,
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
          const temp4: any = filters;
          temp4[indexChart] = {
            width: temp4[indexChart].width,
            height: temp4[indexChart].height,
            id: temp4[indexChart].id,
            filters: { ...filters[indexChart].filters, textBox: a },
            x: temp4[indexChart].x,
            y: temp4[indexChart].y,
            chartState: temp4[indexChart].chartState,
          };
          renderFiltered(temp4, indexChart, item);
        }
      }}
    />
  );
};

export default FilterInput;
