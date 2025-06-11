import React, { FC } from "react";
import { Dropdown, OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import _ from "lodash";
import { toast } from "react-toastify";

interface FiltersProps {
  chartState: any;
  filters1: any;
  setFilters1: any;
}

const FiltersDropdown: FC<FiltersProps> = (props) => {
  // dropdown to choose filter types
  const { chartState, filters1, setFilters1 } = props;
  return (
    <Dropdown id="simple-menu" className="ms-auto me-1">
      <Dropdown.Toggle
        className="bg-transparent border-0 ms-auto me-2 float-right p-0"
        id="dropdown-basic"
      >
        <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Filter</Tooltip>}>
          <Image src="/charts/addtoDB.svg" width={18} height={18} className="chart-6" />
        </OverlayTrigger>
      </Dropdown.Toggle>
      <Dropdown.Menu className="py-0 filters-dropdown" align="right">
        <Dropdown.Item
          disabled={filters1.dropdown.length !== 0}
          className="menu-item f-12 list-group-item"
          onClick={() => {
            if (chartState.dimension.length === 0) {
              toast.error("Please add a measure to apply filters!!!");
            } else {
              const temp: any = [..._.map(chartState.data, chartState.dimension[0])];
              const value: any = chartState.dimension[0];
              const type = chartState.options.filter((item: any) => {
                if (item.value === value) {
                  return item.type;
                }
              });
              setFilters1({
                ...filters1,
                dropdown: [
                  ...filters1.dropdown,
                  {
                    field: chartState.dimension[0],
                    fieldType: type[0]?.type,
                    open: false,
                    type: "Dropdown",
                    filterInput: null,
                    max: Math.max(...temp),
                    min: Math.min(...temp),

                    max1: Math.max(...temp),
                    min1: Math.min(...temp),
                    values: [
                      ..._.map(
                        _.map(chartState.data, chartState.dimension[0]),
                        (label: any, index: any) => {
                          const obj = {} as any;
                          obj.id = index;
                          obj.value = label;
                          obj.label = label;
                          return obj;
                        }
                      ),
                    ],
                    selected: [
                      ..._.map(
                        _.map(chartState.data, chartState.dimension[0]),
                        (label: any, index: any) => {
                          const obj = {} as any;
                          obj.id = index;
                          obj.value = label;
                          obj.label = label;
                          return obj;
                        }
                      ),
                    ],
                  },
                ],
              });
            }
          }}
        >
          Dropdown
        </Dropdown.Item>
        <Dropdown.Item
          disabled={filters1.textBox.length !== 0}
          className="menu-item f-12 list-group-item"
          onClick={() => {
            if (chartState.dimension.length === 0) {
              toast.error("Please add a measure to apply filters!!!");
            } else {
              const temp: any = [..._.map(chartState.data, chartState.dimension[0])];
              const value: any = chartState.dimension[0];
              const type = chartState.options.filter((item: any) => {
                if (item.value === value) {
                  return item.type;
                }
              });
              setFilters1({
                ...filters1,
                textBox: [
                  ...filters1.textBox,
                  {
                    field: chartState.dimension[0],
                    fieldType: type[0]?.type,
                    open: false,
                    type: "Textbox",
                    max: Math.max(...temp),
                    min: Math.min(...temp),

                    max1: Math.max(...temp),
                    min1: Math.min(...temp),
                    values: [
                      ..._.map(
                        _.map(chartState.data, chartState.dimension[0]),
                        (label: any, index: any) => {
                          const obj = {} as any;
                          obj.id = index;
                          obj.value = label;
                          obj.label = label;
                          return obj;
                        }
                      ),
                    ],
                    selected: [],
                    filterInput: type[0]?.type === "number" ? Math.min(...temp) : "",
                  },
                ],
              });
            }
          }}
        >
          Textbox
        </Dropdown.Item>
        <Dropdown.Item
          disabled={filters1.slider.length !== 0}
          className="menu-item f-12 list-group-item"
          onClick={() => {
            if (chartState.dimension.length === 0) {
              toast.error("Please add a measure to apply filters!!!");
            } else if (typeof chartState.dimensionData[0] !== "number") {
              toast.error("Slider filter can be applied only on numbers!!!");
            } else {
              const temp: any = [..._.map(chartState.data, chartState?.dimension[0])];
              const value: any = chartState.dimension[0];
              const type = chartState.options.filter((item: any) => {
                if (item.value === value) {
                  return item.type;
                }
              });
              setFilters1({
                ...filters1,
                slider: [
                  ...filters1.slider,
                  {
                    field: chartState.dimension[0],
                    fieldType: type[0]?.type,
                    open: false,
                    type: "Slider",
                    filterInput: null,
                    max: Math.max(...temp),
                    min: Math.min(...temp),

                    max1: Math.max(...temp),
                    min1: Math.min(...temp),
                    values: [
                      ..._.map(
                        _.map(chartState.data, chartState.dimension[0]),
                        (label: any, index: any) => {
                          const obj = {} as any;
                          obj.id = index;
                          obj.value = label;
                          obj.label = label;
                          return obj;
                        }
                      ),
                    ],
                    selected: [
                      ..._.map(
                        _.map(chartState.data, chartState.dimension[0]),
                        (label: any, index: any) => {
                          const obj = {} as any;
                          obj.id = index;
                          obj.value = label;
                          obj.label = label;
                          return obj;
                        }
                      ),
                    ],
                  },
                ],
              });
            }
          }}
        >
          Slider
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default FiltersDropdown;
