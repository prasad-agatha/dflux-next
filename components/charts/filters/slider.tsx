import React, { FC } from "react";
// import Slider from "./sliderComponent";
import useDebounce from "lib/hooks/useDebounce";
//slider
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface IRangeSlider2Props {
  min: number;
  max: number;
  filters1: any;
  index1: any;
  min1: any;
  max1: any;
  chartState: any;
  renderChart: any;
  data: any;
  root?: any;
  indexChart?: any;
}
const RangeSlider: FC<IRangeSlider2Props> = (props: any) => {
  const { min, max, min1, max1, filters1, index1, data, chartState, renderChart } = props;
  const [values, setValues] = React.useState({ min, max });
  const change = (value: any) => {
    setValues({ min: value[0], max: value[1] });
  };

  const [minimun, maximum] = useDebounce([values.min, values.max], 500);
  React.useEffect(() => {
    onChange([minimun, maximum]);
  }, [minimun, maximum]);

  const onChange = (value: any) => {
    if (value[0] < value[1]) {
      const a: any = filters1.slider.map((item: any, index: any) => {
        if (index1 === index) {
          const result = data.values.filter((el: any) => {
            if (el.value >= value[0] && el.value <= value[1]) {
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
            min1: value[0],
            max1: value[1],
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
        { ...filters1, slider: a },
        chartState.optionsCount,
        chartState.ascending,
        chartState.descending,
        chartState.sortingField
      );
    }
  };
  return (
    <>
      {/* <Slider
        className="slider-main-div"
        min={min}
        max={max}
        onChange={onChange}
        range={true}
        defaultValue={[min, max]}
        value={[min1, max1]}
      /> */}
      <p className="mb-1 f-12 text-capitalize">
        {data.field} {min1} - {max1}
      </p>
      {/* <Slider
        name={data.field}
        defaultMinBudget={min}
        defaultMaxBudget={max}
        label={"Slider!"}
        max={max}
        min={min}
        onChange={onChange}
      /> */}
      <Slider
        range
        defaultValue={[min1, max1]}
        min={min}
        max={max}
        onChange={change}
        className="chart-slider mx-1"
      />
    </>
  );
};

export default RangeSlider;
