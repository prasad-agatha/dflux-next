import React, { FC } from "react";
// import { Slider } from "components/forms";
import useDebounce from "lib/hooks/useDebounce";
//slider
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
interface IRangeSlider2Props {
  min: number;
  max: number;
  filters: any;
  index1: any;
  min1: any;
  max1: any;
  data: any;
  root?: any;
  indexChart?: any;
  setFilters?: any;
  renderFiltered?: any;
  item?: any;
}
const RangeSlider: FC<IRangeSlider2Props> = (props: any) => {
  const { min, max, min1, max1, filters, index1, data, root, indexChart, renderFiltered, item } =
    props;

  const [values, setValues] = React.useState({ min, max });
  const change = (value: any) => {
    setValues({ min: value[0], max: value[1] });
  };

  const [minimun, maximum] = useDebounce([values.min, values.max], 500);
  React.useEffect(() => {
    onChange([minimun, maximum]);
  }, [minimun, maximum]);

  const onChange = (value: any) => {
    if (root === "dashboard") {
      if (value[0] < value[1]) {
        const a: any = filters[indexChart].filters?.slider.map((item: any, index: any) => {
          if (index1 === index) {
            const result = data.values.filter((el: any) => {
              if (el.value >= value[0] && el.value <= value[1]) {
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
              min1: value[0],
              max1: value[1],
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
          filters: { ...filters[indexChart].filters, slider: a },
          x: temp4[indexChart].x,
          y: temp4[indexChart].y,
          chartState: temp4[indexChart].id,
        };
        renderFiltered(temp4, indexChart, item);
      }
    }
  };

  return (
    <div className="App">
      {/* <Slider
        className="slider-main-div"
        min={min}
        max={max}
        onChange={onChange}
        range={true}
        defaultValue={[min, max]}
        value={[min1, max1]}
      /> */}
      {/* <Slider
        defaultMinBudget={min}
        defaultMaxBudget={max}
        label={"Slider!"}
        max={max}
        onChange={onChange}
      /> */}
      <div className="range-input-number-main">
        <span className="pe-5">{min1}</span>
        <span className="ps-5">{max1}</span>
      </div>
      <Slider
        range
        defaultValue={[min1, max1]}
        min={min}
        max={max}
        onChange={change}
        className="chart-slider mx-1"
      />
    </div>
  );
};

export default RangeSlider;
