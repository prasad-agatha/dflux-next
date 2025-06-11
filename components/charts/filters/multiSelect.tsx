import React, { FC } from "react";
import _ from "lodash";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

interface MultiFilterProps {
  chartState: any;
  renderChart: any;
  filters1: any;
  index1: any;
  data: any;
  root?: any;
}

const MultiSelect: FC<MultiFilterProps> = (props: any) => {
  const { index1, data, filters1, renderChart, chartState } = props;
  function getDropdownButtonLabel() {
    return `  ${data.field}   `;
  }
  //   function onChangeDashboard(value: any, event: any) {
  //     if (event.action === "select-option") {
  //       const keys = _.map(data.selected, "id");
  //       const result = data.selected;
  //       data.values.map((word: any) => {
  //         if (word.value === event.option.label && keys.includes(word.id)) {
  //           result.push(word);
  //         }
  //       });
  //       const test = data.selected;
  //       test.push(event.option);

  //       const a: any = filters[indexChart].filters.map((item: any, index: any) => {
  //         if (index1 === index) {
  //           return {
  //             field: item.field,
  //             open: false,
  //             type: item.type,
  //             values: item.values,
  //             selected: _.uniqBy(result, "id"),
  //             min: item.min,
  //             max: item.max,
  //           };
  //         } else {
  //           return item;
  //         }
  //       });
  //       const temp4: any = filters;
  //       temp4[indexChart] = {
  //         id: temp4[indexChart].id,
  //         filters: a,
  //         x: temp4[indexChart].x,
  //         y: temp4[indexChart].y,
  //         chartState: temp4[indexChart].chartState,
  //       };

  //       renderFiltered(temp4);
  //     } else if (event.action === "deselect-option") {
  //       const result = data.selected.filter((word: any) => word.value !== event.option.label);
  //       const a: any = filters[indexChart].filters.map((item: any, index: any) => {
  //         if (index1 === index) {
  //           return {
  //             field: item.field,
  //             type: item.type,
  //             open: false,
  //             values: item.values,
  //             selected: result,
  //             min: item.min,
  //             max: item.max,
  //           };
  //         } else {
  //           return item;
  //         }
  //       });
  //       const test = data;
  //       test.selected = value;
  //       const temp4: any = filters;
  //       temp4[indexChart] = {
  //         id: temp4[indexChart].id,
  //         filters: a,
  //         x: temp4[indexChart].x,
  //         y: temp4[indexChart].y,
  //         chartState: temp4[indexChart].chartState,
  //       };
  //       renderFiltered(temp4);
  //     }
  //   }
  function onChange(value: any, event: any) {
    if (event.action === "select-option") {
      const keys = _.map(data.selected, "id");
      const result = data.selected;
      data.values.map((word: any) => {
        if (word.value === event.option.label && keys.includes(word.id)) {
          result.push(word);
        }
      });
      const test = data.selected;
      test.push(event.option);
      const a: any = filters1?.dropdown.map((item: any, index: any) => {
        if (index1 === index) {
          return {
            field: item.field,
            fieldType: item.fieldType,
            open: false,
            type: item.type,
            values: item.values,
            selected: _.uniqBy(result, "id"),
            min: item.min,
            max: item.max,
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
        { ...filters1, dropdown: a },
        chartState.optionsCount,
        chartState.ascending,
        chartState.descending,
        chartState.sortingField
      );
      //   setFilters(a);
    } else if (event.action === "deselect-option") {
      const result = data.selected.filter((word: any) => word.value !== event.option.label);
      const a: any = filters1?.dropdown.map((item: any, index: any) => {
        if (index1 === index) {
          return {
            field: item.field,
            fieldType: item.fieldType,
            type: item.type,
            open: false,
            values: item.values,
            selected: result,
            min: item.min,
            max: item.max,
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
        { ...filters1, dropdown: a },
        chartState.optionsCount,
        chartState.ascending,
        chartState.descending,
        chartState.sortingField
      );
    }
    const test = data;
    test.selected = value;
  }
  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: 12,
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: 12,
      maxWidth: 156,
    }),
    control: (base: any) => ({
      ...base,
      minWidth: 140,
      minHeight: 32,
      width: 140,
      fontSize: 12,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      fontSize: 12,
    }),
    option: (base: any) => ({
      ...base,
      fontWeight: "normal !important",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: 200,
    }),
    dropdownButton: () => ({
      width: 140,
      height: 28,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      borderRadius: 2,
      border: "1px solid #ced4da",
      padding: 8,
      textAlign: "start",
      textTransform: "capitalize",
      fontSize: 12,
    }),
  };
  return (
    <ReactMultiSelectCheckboxes
      classNamePrefix="multi-select"
      styles={customStyles}
      options={_.uniqBy(data?.values, "label")}
      placeholderButtonLabel="Filters"
      getDropdownButtonLabel={getDropdownButtonLabel}
      value={data?.selected}
      onChange={onChange}
      // onChange={root === "dashboard" ? onChangeDashboard : onChange}
    />
  );
};
export default MultiSelect;
