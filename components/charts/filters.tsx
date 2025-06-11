import React, { FC } from "react";
import MultiSelectAll from "components/charts/filters/multiSelect";
import RangeSlider from "components/charts/filters/slider";
import TextBox from "./filters/textBox";

interface FilterProps {
  filters1: any;
  setFilters1: any;
  chartState: any;
  renderChart: any;
}

const FiltersComponent: FC<FilterProps> = (props) => {
  const { filters1, setFilters1, chartState, renderChart } = props;

  // const filters2 = [...filters1.dropdown, ...filters1.textBox, ...filters1.slider];

  return (
    <div className="d-flex flex-wrap align-items-center">
      {[...filters1?.dropdown, ...filters1.textBox, ...filters1.slider]?.map(
        (item: any, index1: any) => {
          switch (item.type) {
            case "Dropdown":
              return (
                <div className="mt-3 p-1">
                  {/* <p className="mb-0">{type.field}</p> */}
                  <MultiSelectAll
                    index1={index1}
                    data={item}
                    chartState={chartState}
                    filters1={filters1}
                    renderChart={renderChart}
                    //   setFilters={setFilters}
                    //   renderFiltered={renderFiltered}
                  />
                </div>
              );
            case "Textbox":
              return (
                <div className="p-1">
                  <p className="mb-0 f-12"> {item.field}</p>
                  <TextBox
                    index1={index1 - filters1?.dropdown.length}
                    filters1={filters1}
                    setFilters1={setFilters1}
                    chartState={chartState}
                    data={item}
                    renderChart={renderChart}
                    // renderFiltered={renderFiltered}
                  />
                </div>
              );

            case "Slider":
              return (
                <div className="p-1">
                  <RangeSlider
                    min={item.min}
                    max={item.max}
                    min1={item.min1}
                    max1={item.max1}
                    filters1={filters1}
                    index1={index1 - filters1?.dropdown.length - filters1?.textBox.length}
                    chartState={chartState}
                    // setFilters={setFilters}
                    data={item}
                    renderChart={renderChart}
                    // renderFiltered={renderFiltered}
                  />
                </div>
              );
          }
        }
      )}
    </div>
  );
};
export default FiltersComponent;
