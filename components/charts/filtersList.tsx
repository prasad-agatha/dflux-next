import React, { FC } from "react";
import { Image } from "react-bootstrap";
import _ from "lodash";
// react select
import Select, { components, ControlProps, OptionProps, ValueContainerProps } from "react-select";
import { Container2, Title } from "constants/common";

interface FiltersProps {
  filters1: any;
  setFilters1: any;
  chartState: any;
  editFilter: any;
  setEditFilter: any;
  renderChart: any;
}

interface ColourOption {
  readonly field: string;
  readonly value: string;
  readonly label: string;
}

const AppliedFilters: FC<FiltersProps> = (props) => {
  const { filters1, setFilters1, chartState, renderChart } = props;
  // console.log(filters1);
  const IndicatorSeparator = () => {
    return null;
  };
  const DropdownIndicator = () => {
    return null;
  };

  const checkType2 = (type: any) => {
    switch (type) {
      case "number":
        return <Image src="/charts/123Icon.svg" className="me-1" />;
      case "string":
        return <Image src="/charts/abcIcon.svg" className="me-1" />;
      case "date":
        return <Image src="/charts/date_icon.svg" className="me-1" />;
      default:
        return null;
    }
  };

  const Control = ({ children, ...props }: ControlProps<ColourOption, false>) => {
    const value: any = props.selectProps.value;
    const type = chartState.options.filter((item: any) => {
      if (item.value === value.value) {
        return item.type;
      }
    });
    return (
      <components.Control {...props} key={0}>
        <Container2 type={type[0]?.type} className="">
          {checkType2(type[0]?.type)}
          <h6 className="f-16 mb-0" style={{ width: `calc(100% - 28px)` }}>
            <p className="mb-0" style={{ fontSize: "12px", color: "#485255" }}>
              {children}
            </p>
          </h6>
        </Container2>
      </components.Control>
    );
  };
  const ControlAddNew = ({ children, ...props }: ControlProps<ColourOption, false>) => {
    return <components.Control {...props}>{children}</components.Control>;
  };
  const ValueContainer = ({ children, ...props }: ValueContainerProps<ColourOption, false>) => {
    return (
      <components.ValueContainer {...props}>
        {children}
        <Image src="/addNew.svg" className="img-fluid cursor-pointer" />
      </components.ValueContainer>
    );
  };
  const Option2 = ({ children, ...props }: OptionProps<ColourOption, false>) => {
    return (
      <>
        <components.Option {...props}>
          <div className="d-flex w-100 ms-2 f-12" style={{ color: "black" }}>
            {checkType(props.data.type)} {children}
          </div>
        </components.Option>
      </>
    );
  };

  const checkType = (type: any) => {
    switch (type) {
      case "number":
        return <Image src="/charts/123Icon.svg" className="me-2" />;
      case "string":
        return <Image src="/charts/abcIcon.svg" className="me-2" />;
      case "date":
        return <Image src="/charts/date_icon.svg" className="me-2" />;
      default:
        return null;
    }
  };

  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      position: "center",
      transform: "none",
      color: "#485255",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      position: "center",
      transform: "none",
      color: "#485255",
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: 12,
      width: `200%`,
      // minWidth: 160,
      // left: -30,
    }),
    control: (base: any) => ({
      ...base,
      color: "#485255",
      border: "0px solid black",
      boxShadow: "none",
      "&:hover": {
        border: "0px solid black",
      },
      cursor: "pointer",
      // minWidth: 85,
    }),
    option: (base: any) => ({
      ...base,
      color: "#485255",
      backgroundColor: "white",
      cursor: "pointer",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      // textOverflow: "ellipsis",
      // minWidth: 85,
      borderRadius: 4,
      padding: 0,
      // maxWidth: 160,
      // whiteSpace: "nowrap",
      // overflow: "hidden",
      display: "flex",
      // fontFamily: "Metropolis",
      // fontSize: 13,
      // fontWeight: 700,
      color: "#000",
      fontStyle: "normal",
      // fontWeight: "bold",
      fontSize: 12,
      fontFamily: "Inter",
      letterSpacing: 0.1,
    }),
  };

  return (
    <div>
      {/* Dropdown Filters with select components to add new filter and edit existing filters */}
      <div>
        {filters1?.dropdown?.length === 0 ? null : (
          <div>
            <Title className="ms-2 f-12">Dropdown</Title>
            <div className="p-1 m-1 border">
              {/* Dropdown Filters with select components to edit existing filters */}
              {filters1?.dropdown?.map((item: any, index: any) => {
                return (
                  <div key={index} className="d-flex align-items-center p-r">
                    <Select
                      isSearchable={false}
                      styles={customStyles}
                      menuPlacement="top"
                      value={{
                        value: item.field,
                        field: item.field,
                        label: item.field,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      className="w-100 p-0"
                      classNamePrefix="select"
                      options={chartState.options}
                      name="dropdown filter field"
                      components={{
                        IndicatorSeparator,
                        Control,
                        DropdownIndicator,
                        Option: Option2,
                      }}
                      id="select-dropdown"
                      onChange={(option: any) => {
                        const a: any = filters1?.dropdown.map((item: any, index1: any) => {
                          const temp: any = [..._.map(chartState.data, option.value)];
                          if (index === index1) {
                            return {
                              field: option.value,
                              fieldType: option.type,
                              type: item.type,
                              open: false,
                              values: [
                                ..._.map(
                                  _.map(chartState.data, option.value),
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
                                  _.map(chartState.data, option.value),
                                  (label: any, index: any) => {
                                    const obj = {} as any;
                                    obj.id = index;
                                    obj.value = label;
                                    obj.label = label;
                                    return obj;
                                  }
                                ),
                              ],
                              max: Math.max(...temp),
                              min: Math.min(...temp),

                              max1: Math.max(...temp),
                              min1: Math.min(...temp),
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
                        // setFilters(a);
                      }}
                    />
                    {/* <div
                      className="ms-auto border "
                      style={{ backgroundColor: checkColor2(item.fieldType) }}
                    > */}
                    <Image
                      onClick={() => {
                        const tempFilters: any = [];
                        filters1?.dropdown?.map((item: any, index1: any) => {
                          if (index !== index1) {
                            tempFilters.push(item);
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
                          {
                            ...filters1,
                            dropdown: tempFilters?.dropdown?.length !== 0 ? tempFilters : [],
                          },
                          chartState.optionsCount,
                          chartState.ascending,
                          chartState.descending,
                          chartState.sortingField
                        );
                      }}
                      src="/charts/cross.svg"
                      width={16}
                      height={16}
                      className="cursor-pointer p-a"
                      style={{ right: "6px" }}
                    />
                    {/* </div> */}
                  </div>
                );
              })}
              {/* Dropdown Filters with select component to add new filter */}
              <Select
                isSearchable={false}
                styles={customStyles}
                menuPlacement="top"
                placeholder=""
                menuPosition="absolute"
                className="width-max"
                classNamePrefix="select"
                options={chartState.options}
                controlShouldRenderValue={false}
                name="dropdown addnew"
                components={{
                  IndicatorSeparator,
                  ValueContainer: ValueContainer,
                  Control: ControlAddNew,
                  DropdownIndicator,
                  Option: Option2,
                }}
                id="select-dropdown-addnew"
                onChange={(option: any) => {
                  const temp: any = [..._.map(chartState.data, option.value)];
                  setFilters1({
                    ...filters1,
                    dropdown: [
                      ...filters1.dropdown,
                      {
                        field: option.value,
                        fieldType: option.type,
                        open: false,
                        type: "Dropdown",
                        filterInput: null,
                        max: Math.max(...temp),
                        min: Math.min(...temp),

                        max1: Math.max(...temp),
                        min1: Math.min(...temp),
                        values: [
                          ..._.map(
                            _.map(chartState.data, option.value),
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
                            _.map(chartState.data, option.value),
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
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Text box Filters with select components to add new filter and edit existing filters */}
      <div>
        {filters1?.textBox?.length === 0 ? null : (
          <div>
            <Title className="ms-2 f-12">Textbox</Title>
            <div className="p-1 m-1 border">
              {/* Text box Filters with select components to edit existing filters */}
              {filters1?.textBox?.map((item: any, index: any) => {
                return (
                  <div key={index} className="d-flex align-items-center p-r">
                    <Select
                      isSearchable={false}
                      styles={customStyles}
                      menuPlacement="top"
                      value={{
                        value: item.field,
                        field: item.field,
                        label: item.field,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      className="w-100 p-0"
                      classNamePrefix="select"
                      options={chartState.options}
                      name="textbox filter field"
                      components={{
                        IndicatorSeparator,
                        Control,
                        DropdownIndicator,
                        Option: Option2,
                      }}
                      id="select-textBox"
                      onChange={(option: any) => {
                        const a: any = filters1?.textBox.map((item: any, index1: any) => {
                          const temp: any = [..._.map(chartState.data, option.value)];
                          if (index === index1) {
                            return {
                              field: option.value,
                              fieldType: option.type,
                              type: item.type,
                              open: false,
                              values: [
                                ..._.map(
                                  _.map(chartState.data, option.value),
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
                                  _.map(chartState.data, option.value),
                                  (label: any, index: any) => {
                                    const obj = {} as any;
                                    obj.id = index;
                                    obj.value = label;
                                    obj.label = label;
                                    return obj;
                                  }
                                ),
                              ],
                              max: Math.max(...temp),
                              min: Math.min(...temp),

                              max1: Math.max(...temp),
                              min1: Math.min(...temp),
                              filterInput: option.type === "number" ? Math.min(...temp) : "",
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
                        // setFilters(a);
                      }}
                    />
                    {/* <div
                      className="ms-auto border "
                      style={{ backgroundColor: checkColor2(item.fieldType) }}
                    > */}
                    <Image
                      onClick={() => {
                        const tempFilters: any = [];
                        filters1?.textBox?.map((item: any, index1: any) => {
                          if (index !== index1) {
                            tempFilters.push(item);
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
                          {
                            ...filters1,
                            textBox: tempFilters?.textBox?.length !== 0 ? tempFilters : [],
                          },
                          chartState.optionsCount,
                          chartState.ascending,
                          chartState.descending,
                          chartState.sortingField
                        );
                      }}
                      src="/charts/cross.svg"
                      width={16}
                      height={16}
                      className="cursor-pointer p-a"
                      style={{ right: "6px" }}
                    />
                    {/* </div> */}
                  </div>
                );
              })}
              {/* Text box Filters with select component to add new filter */}
              <Select
                isSearchable={false}
                styles={customStyles}
                menuPlacement="top"
                placeholder=""
                menuPosition="absolute"
                className="width-max"
                classNamePrefix="select"
                options={chartState.options}
                controlShouldRenderValue={false}
                name="textbox addnew"
                components={{
                  IndicatorSeparator,
                  ValueContainer: ValueContainer,
                  Control: ControlAddNew,
                  DropdownIndicator,
                  Option: Option2,
                }}
                id="select-textbox-addnew"
                onChange={(option: any) => {
                  const temp: any = [..._.map(chartState.data, option.value)];
                  setFilters1({
                    ...filters1,
                    textBox: [
                      ...filters1.textBox,
                      {
                        field: option.value,
                        fieldType: option.type,
                        open: false,
                        type: "Textbox",
                        max: Math.max(...temp),
                        min: Math.min(...temp),

                        max1: Math.max(...temp),
                        min1: Math.min(...temp),
                        values: [
                          ..._.map(
                            _.map(chartState.data, option.value),
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
                        filterInput: option.type === "number" ? Math.min(...temp) : "",
                      },
                    ],
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Slider Filters with select components to add new filter and edit existing filters */}
      <div>
        {filters1?.slider?.length === 0 ? null : (
          <div>
            <Title className="ms-2 f-12">Slider</Title>
            <div className="p-1 m-1 border">
              {/* Slider Filters with select components to edit existing filters */}
              {filters1?.slider?.map((item: any, index: any) => {
                return (
                  <div key={index} className="d-flex align-items-center p-r">
                    <Select
                      isSearchable={false}
                      styles={customStyles}
                      menuPlacement="top"
                      value={{
                        value: item.field,
                        field: item.field,
                        label: item.field,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      className="w-100 p-0"
                      classNamePrefix="select"
                      options={chartState.options.filter((item: any) => {
                        if (item.type === "number") {
                          return item;
                        }
                      })}
                      name="slider filter field"
                      components={{
                        IndicatorSeparator,
                        Control,
                        DropdownIndicator,
                        Option: Option2,
                      }}
                      id="select-slider"
                      onChange={(option: any) => {
                        const a: any = filters1?.slider.map((item: any, index1: any) => {
                          const temp: any = [..._.map(chartState.data, option.value)];
                          if (index === index1) {
                            return {
                              field: option.value,
                              fieldType: option.type,
                              type: item.type,
                              open: false,
                              values: [
                                ..._.map(
                                  _.map(chartState.data, option.value),
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
                                  _.map(chartState.data, option.value),
                                  (label: any, index: any) => {
                                    const obj = {} as any;
                                    obj.id = index;
                                    obj.value = label;
                                    obj.label = label;
                                    return obj;
                                  }
                                ),
                              ],
                              max: Math.max(...temp),
                              min: Math.min(...temp),

                              max1: Math.max(...temp),
                              min1: Math.min(...temp),
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
                        // setFilters(a);
                      }}
                    />
                    {/* <div
                      className="ms-auto border "
                      style={{ backgroundColor: checkColor2(item.fieldType) }}
                    > */}
                    <Image
                      onClick={() => {
                        const tempFilters: any = [];
                        filters1?.slider?.map((item: any, index1: any) => {
                          if (index !== index1) {
                            tempFilters.push(item);
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
                          {
                            ...filters1,
                            slider: tempFilters?.slider?.length !== 0 ? tempFilters : [],
                          },
                          chartState.optionsCount,
                          chartState.ascending,
                          chartState.descending,
                          chartState.sortingField
                        );
                      }}
                      src="/charts/cross.svg"
                      width={16}
                      height={16}
                      className="cursor-pointer p-a"
                      style={{ right: "6px" }}
                    />
                    {/* </div> */}
                  </div>
                );
              })}
              {/* Slider Filters with select component to add new filter */}
              <Select
                isSearchable={false}
                styles={customStyles}
                menuPlacement="top"
                placeholder=""
                menuPosition="absolute"
                className="width-max"
                classNamePrefix="select"
                options={chartState.options.filter((item: any) => {
                  if (item.type === "number") {
                    return item;
                  }
                })}
                controlShouldRenderValue={false}
                name="slider addnew"
                components={{
                  IndicatorSeparator,
                  ValueContainer: ValueContainer,
                  Control: ControlAddNew,
                  DropdownIndicator,
                  Option: Option2,
                }}
                id="select-slider-addnew"
                onChange={(option: any) => {
                  const temp: any = [..._.map(chartState.data, option.value)];
                  setFilters1({
                    ...filters1,
                    slider: [
                      ...filters1.slider,
                      {
                        field: option.value,
                        fieldType: option.type,
                        open: false,
                        type: "Slider",
                        filterInput: null,
                        max: Math.max(...temp),
                        min: Math.min(...temp),

                        max1: Math.max(...temp),
                        min1: Math.min(...temp),
                        values: [
                          ..._.map(
                            _.map(chartState.data, option.value),
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
                      },
                    ],
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
