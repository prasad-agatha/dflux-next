import React, { FC } from "react";
// react bootstrap
import {
  Tabs,
  Tab,
  Image,
  Accordion,
  OverlayTrigger,
  Tooltip,
  Form,
  InputGroup,
  Col,
} from "react-bootstrap";
// react select
import Select, { components, ControlProps, OptionProps } from "react-select";
// lodash
import _ from "lodash";
// uuid
import { v4 as uuid } from "uuid";
// react dnd
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
// clsx
import clsx from "clsx";
// styled components
import styled from "styled-components";
import { ChevronDown } from "@styled-icons/bootstrap";
// components
import { ConnectionList } from "components/lists";
// constants
import {
  chartTypes,
  Container,
  Title,
  Container1,
  aggregateOptions,
  sortOptions,
  disableLabel,
  disableLAxis,
  disableGrids,
} from "constants/common";
import { AppliedFilters, FiltersDropdown } from "components/charts";
// import { chartTypes, Container, Title, Container1 } from "constants/common";
// import FiltersDropdown from "./filtersDropdown";
// import FieldChanger from "./filters/fieldChanger";
// import AppliedFilters from "./filtersList";
import { worldCountries } from "constants/common";

interface IChartTabs {
  chartState: any;
  setChartState: any;
  dnd: any;
  setDnd: any;
  type: any;
  reDraw: any;
  setRedraw: any;
  renderChart: any;
  filters1: any;
  setFilters1: any;
  verticalBarData: any;
  handleChartColor: any;
}

export const TaskList = styled.div`
  padding: 2px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  max-height: 69.5vh;
  // min-height: 69.5vh;
  overflow: auto;
`;
export const TaskList1 = styled.div`
  padding: 2px;
  padding-bottom: 8px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  height: 76.8vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;
// const TaskList = styled.div`
//   padding: 2px;
//   transition: background-color 0.2s ease;
//   flex-grow: 1;
//   min-height: ${(props: any) => (props.columnId === "Measure" ? 70 : 200)};
// `;
const Container2 = styled.div`
  margin: 4px;
  border-radius: 2px;
  border: 2px dashed #f0f0f0;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 80px;
`;

const ChartTabs: FC<IChartTabs> = (props) => {
  const {
    chartState,
    setChartState,
    dnd,
    setDnd,
    type,
    // reDraw,
    // setRedraw,
    renderChart,
    filters1,
    setFilters1,
    verticalBarData,
    handleChartColor,
  } = props;

  const [editFilter, setEditFilter] = React.useState(false);

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
  const checkType2 = (type: any) => {
    switch (type) {
      case "number":
        return <Image src="/charts/123Icon.svg" className="me-0" />;
      case "string":
        return <Image src="/charts/abcIcon.svg" className="me-0" />;
      case "date":
        return <Image src="/charts/date_icon.svg" className="me-0" />;
      default:
        return null;
    }
  };

  const IndicatorSeparator = () => {
    return null;
  };
  const DropdownIndicator = () => {
    return null;
  };

  interface ColourOption {
    readonly field: string;
    readonly value: string;
    readonly label: string;
  }

  const Control1 = ({ children, ...props }: ControlProps<ColourOption, false>) => {
    // console.log(props.selectProps.value.label);
    const value: any = props.selectProps.value;
    const type = chartState.options.filter((item: any) => {
      if (item.value === value.value) {
        return item.type;
      }
    });
    return (
      <components.Control {...props}>
        <div className="d-flex w-100 ms-2 f-12" style={{ color: "black" }}>
          {checkType2(type[0]?.type)} {children}
        </div>
      </components.Control>
    );
  };
  const Control = ({ children, ...props }: ControlProps<ColourOption, false>) => {
    return (
      <components.Control {...props}>
        {children}
        <Image src="/dropdownIcon.svg" />
      </components.Control>
    );
  };

  const Option = ({ children, ...props }: OptionProps<ColourOption, false>) => {
    return (
      <>
        <components.Option {...props}>
          {chartState.aggregate === props.data.value ? (
            <Image width={12} height={12} className="me-1" src="/radio.svg" />
          ) : (
            <Image width={12} height={12} className="me-1" src="/radioDisabled.svg" />
          )}

          {children}
        </components.Option>
      </>
    );
  };
  const Option1 = ({ children, ...props }: OptionProps<ColourOption, false>) => {
    return (
      <>
        <components.Option {...props}>
          {chartState.sort === props.data.value ? (
            <Image width={12} height={12} className="me-1" src="/radio.svg" />
          ) : (
            <Image width={12} height={12} className="me-1" src="/radioDisabled.svg" />
          )}

          {children}
        </components.Option>
      </>
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
      maxWidth: "100%",
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: 12,
      minWidth: 120,
      left: -30,
    }),
    control: (base: any) => ({
      ...base,
      color: "#485255",
      border: "0px solid white",
      boxShadow: "none",
      "&:hover": {
        border: "0px solid white",
      },
      cursor: "pointer",
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
      // minWidth: 95,
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

  const onDragEnd = (result: any) => {
    // setRedraw(!reDraw);
    // droppableId - "option0"
    // source - {index: 0, droppableId:"Available Fields"}
    // destination - {index:0, droppableId:"Measure"}

    const { source, destination, draggableId } = result;

    // if there is no destination do nothing
    if (!destination) {
      return;
    }

    // if destination is the same as source
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // if (destination.droppableId === "Dimensions" && source.droppableId === "Measure") {
    //   toast.error("Cannot move column from Measure to Dimension !!!");
    //   return;
    // }
    // if (source.droppableId === "Dimensions" && destination.droppableId === "Measure") {
    //   toast.error("Cannot move option from Dimensions to Measure !!!");
    //   return;
    // }

    // in order to reorder

    // source column
    // if destination contains the task which is being dragged
    const column = dnd.columns[source.droppableId];

    const start = dnd.columns[source.droppableId];
    const finish = dnd.columns[destination.droppableId];

    let flag = false;
    finish.taskIds.map((item: any) => {
      if (item === draggableId || dnd.tasks[draggableId].content === dnd.tasks[item].content) {
        flag = true;
      }
    });
    if (flag) {
      return;
    }

    // if task is dragged in between the same column
    if (start === finish) {
      // options list which will be updated when reordered
      const newTaskIds = Array.from(column.taskIds);

      // we need to move the task from old index to it's new index

      // removes option which was dragged from it's position
      newTaskIds.splice(source.index, 1);

      // now insert the dragged task in the column with destination index
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };

      const columns1: any = { ...dnd.columns };
      columns1[newColumn.id] = newColumn;

      const newState = {
        ...dnd,
        columns: columns1,
      };

      if (destination.droppableId === "Dimensions") {
        const a = dnd.tasks;
        const c: any = [];
        newTaskIds?.map((item: any) => {
          c.push(a[item].content);
        });

        if (chartState.sortingField === "") {
          setChartState({
            ...chartState,
            measures: _.map(c, (item: any) => {
              return item;
            }),
            sortingField: c[0],
          });
        } else {
          setChartState({
            ...chartState,
            measures: _.map(c, (item: any) => {
              return item;
            }),
            sortingField: chartState.sortingField,
          });
        }
      } else if (destination.droppableId === "Measure") {
        const a = dnd.tasks;
        const c: any = [];
        newTaskIds?.map((item: any) => {
          c.push(a[item].content);
        });
        setChartState({ ...chartState, dimension: c[0] });
      }
      setDnd(newState);

      return;
    }

    if (destination.droppableId !== "Options") {
      if (destination.droppableId === "Dimensions") {
        // moving from one column to another column
        // moving from one column to another column

        // source task ids
        const startTaskIds = Array.from(start.taskIds);

        let draggedTask: any = {};
        startTaskIds.map((item: any) => {
          if (item === draggableId) {
            draggedTask = dnd.tasks[item];
          }
        });

        const tempId: any = uuid();

        const tempTasks: any = dnd.tasks;

        // remove source task which was dragged
        startTaskIds.splice(source.index, 1, `${tempId}`);

        const newStart = { ...start, taskIds: startTaskIds };
        // source tasks will be updated here
        const finishTaskIds = Array.from(finish.taskIds);

        // push task to destination where it was dropped
        finishTaskIds.splice(destination.index, 0, draggableId);
        // const newFinishTaskIds = [draggableId];

        const newFinish = {
          ...finish,
          taskIds: finishTaskIds,
        };
        tempTasks[tempId] = { id: tempId, content: draggedTask.content, type: draggedTask.type };

        const c: any = [];
        finishTaskIds?.map((item: any) => {
          c.push(tempTasks[item].content);
        });
        if (chartState.sortingField === "") {
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
            c,
            chartState.aggregate,
            filters1,
            chartState.optionsCount,
            chartState.ascending,
            chartState.descending,
            c[0]
          );
        } else {
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
            c,
            chartState.aggregate,
            filters1,
            chartState.optionsCount,
            chartState.ascending,
            chartState.descending,
            chartState.sortingField
          );
        }
        const tempColumns = dnd.columns;

        tempColumns[newStart.id] = newStart;
        tempColumns[newFinish.id] = newFinish;

        // console.log(start.taskIds.filter((item: any) => item !== finishTaskIds[0]));

        const newState = {
          ...dnd,
          tasks: tempTasks,
          columns: tempColumns,
        };
        setDnd(newState);
      } else if (destination.droppableId === "Measure") {
        if (chartState.type !== "treeMap") {
          // moving from one column to another column

          // source task ids
          const startTaskIds = Array.from(start.taskIds);

          const tempId: any = uuid();

          const tempTasks: any = dnd.tasks;

          // remove source task which was dragged
          startTaskIds.splice(source.index, 1, `${tempId}`);

          const newStart = { ...start, taskIds: startTaskIds };

          // const finishTaskIds = Array.from(finish.taskIds);

          // push task to destination where it was dropped
          // finishTaskIds.splice(destination.index, 0, draggableId);
          const newFinishTaskIds = [draggableId];

          const newFinish = {
            ...finish,
            taskIds: newFinishTaskIds,
          };

          const optionData: any = [];
          [draggableId]?.map((item: any) => {
            optionData.push(tempTasks[item].content);
            optionData.push(tempTasks[item].type);
          });

          tempTasks[tempId] = { id: tempId, content: optionData[0], type: optionData[1] };

          renderChart(
            false,
            optionData[0],
            chartState.showLabel,
            chartState.showLegend,
            chartState.showGrids,
            chartState.showAxis,
            chartState.showAxisTitle,
            chartState.data,
            [optionData[0]],
            chartState.measures,
            chartState.aggregate,
            filters1,
            chartState.optionsCount,
            chartState.ascending,
            chartState.descending,
            chartState.sortingField
          );
          const tempColumns = dnd.columns;

          tempColumns[newStart.id] = newStart;
          tempColumns[newFinish.id] = newFinish;

          // console.log(start.taskIds.filter((item: any) => item !== finishTaskIds[0]));

          const newState = {
            ...dnd,
            tasks: tempTasks,
            columns: tempColumns,
          };
          setDnd(newState);
        } else {
          // moving from one column to another column

          // source task ids
          const startTaskIds = Array.from(start.taskIds);

          let draggedTask: any = {};
          startTaskIds.map((item: any) => {
            if (item === draggableId) {
              draggedTask = dnd.tasks[item];
            }
          });

          const tempId: any = uuid();

          const tempTasks: any = dnd.tasks;

          // remove source task which was dragged
          startTaskIds.splice(source.index, 1, `${tempId}`);

          const newStart = { ...start, taskIds: startTaskIds };

          // source tasks will be updated here
          const finishTaskIds = Array.from(finish.taskIds);

          // push task to destination where it was dropped
          finishTaskIds.splice(destination.index, 0, draggableId);
          // const newFinishTaskIds = [draggableId];

          // const finishTaskIds = Array.from(finish.taskIds);

          // push task to destination where it was dropped
          // finishTaskIds.splice(destination.index, 0, draggableId);
          // const newFinishTaskIds = [draggableId];

          const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
          };

          // const optionData: any = [];
          // [draggableId]?.map((item: any) => {
          //   optionData.push(tempTasks[item].content);
          //   optionData.push(tempTasks[item].type);
          // });

          // tempTasks[tempId] = { id: tempId, content: optionData[0], type: optionData[1] };
          tempTasks[tempId] = { id: tempId, content: draggedTask.content, type: draggedTask.type };
          const c: any = [];
          finishTaskIds?.map((item: any) => {
            c.push(tempTasks[item].content);
          });
          renderChart(
            false,
            c[0],
            chartState.showLabel,
            chartState.showLegend,
            chartState.showGrids,
            chartState.showAxis,
            chartState.showAxisTitle,
            chartState.data,
            c,
            chartState.measures,
            chartState.aggregate,
            filters1,
            chartState.optionsCount,
            chartState.ascending,
            chartState.descending,
            chartState.sortingField
          );
          const tempColumns = dnd.columns;

          tempColumns[newStart.id] = newStart;
          tempColumns[newFinish.id] = newFinish;

          // console.log(start.taskIds.filter((item: any) => item !== finishTaskIds[0]));
          const newState = {
            ...dnd,
            tasks: tempTasks,
            columns: tempColumns,
          };
          setDnd(newState);
        }
      }
    }
  };

  const checkType1: any = (a: any, type: string) => {
    let check = 0;
    a.map((item: any) => {
      if (typeof item === "string") {
        check = 0;
      } else {
        check = check + 1;
      }
    });
    switch (type) {
      case "scatter":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (check === 0) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case "bubble":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (check === 0) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case "histogram":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (check === 0) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case "waffle":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (check === 0) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case "bump":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (chartState.measures.length === 1 || chartState.dimension.length === 0) {
            return true;
          } else {
            return false;
          }
        }
        break;
      case "map":
        if (chartState.dimension.length != 0 || chartState.measures.length != 0) {
          if (worldCountries.includes(a[0])) {
            return false;
          } else {
            return true;
          }
        }
    }
  };
  //disable label checkbox in styles
  const disableFiled = (type: any, checkbox: any) => {
    if (checkbox === "label" && disableLabel.includes(type)) return true;
    if (checkbox === "axis" && disableLAxis.includes(type)) return true;
    if (checkbox === "grids" && disableGrids.includes(type)) return true;
  };
  return (
    <Tabs
      activeKey={chartState.key}
      onSelect={(k: any) => {
        setChartState({ ...chartState, key: k });
      }}
      id="charttabs"
      variant="pills"
      className="chart-data-tab f-14 d-flex mb-1 justify-content-center chart-8"
    >
      {/* OPTIONS TAB */}
      <Tab eventKey="data" title="OPTIONS" className="ps-0 pe-1">
        <div>
          {/* Select Charts Accordion*/}

          <Accordion>
            <Accordion.Toggle className="border-0 bg-white" eventKey="1">
              <div className="d-flex ms-1 bold">
                <div style={{ opacity: 0.8 }} className="f-12 black py-1">
                  Charts
                  <ChevronDown width={12} height={12} className="ms-2 cursor-pointer" />
                </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse className="p-0 pb-2" eventKey="1">
              <div className="d-flex flex-row flex-wrap px-2">
                {_.map(chartTypes, (item: any, index: any) => {
                  return (
                    <OverlayTrigger
                      key={index}
                      overlay={<Tooltip id="tooltip-engine">{item.Type}</Tooltip>}
                    >
                      <div
                        onClick={() => {
                          if (!checkType1(chartState.dimensionData, item.type)) {
                            setChartState({
                              ...chartState,
                              type: item.type,
                              category: item.category,
                              showLabel: false,
                              showLegend: item.type === "table" ? false : true,
                              showGrids: !disableFiled(item.type, "grids"),
                              showAxis: !disableFiled(item.type, "axis"),
                              showAxisTitle: !disableFiled(item.type, "axis"),
                            });
                          }
                        }}
                        className={clsx(
                          "d-flex justify-content-center align-items-center chartBox1",
                          {
                            ["active"]: chartState.type === item.type,
                          }
                        )}
                      >
                        <Image
                          className="p-1"
                          style={{ width: 32, height: 32 }}
                          src={
                            !checkType1(chartState.dimensionData, item.type)
                              ? item.img
                              : item.whiteImg
                          }
                        />
                      </div>
                    </OverlayTrigger>
                  );
                })}
              </div>
            </Accordion.Collapse>
          </Accordion>

          <hr className="mb-0 mt-1" />
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="df1 h-100 w-100 border border-top-0">
              <TaskList1>
                {type === "query" ? (
                  <>
                    <p className="w-100 mb-0 mt-2 ps-2 f-12 bold black ls" style={{ opacity: 0.8 }}>
                      Data source
                    </p>
                    <div>
                      <ConnectionList
                        dbId={chartState.connectionId}
                        tableName={chartState.tableName}
                      />
                    </div>
                    <hr className="my-2" />
                  </>
                ) : null}
                {/* Rows to Show */}
                <div className="mt-1 d-flex align-items-center">
                  <p className="w-100 mb-0 ps-2 f-12 bold  black ls" style={{ opacity: 0.8 }}>
                    Rows to show
                  </p>
                  <Form.Control
                    type="number"
                    value={chartState.optionsCount}
                    className="w-50 f-10 border-0"
                    max={chartState.data.length}
                    onChange={(e: any) => {
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
                        filters1,
                        e.target.value > chartState.data.length
                          ? chartState.optionsCount
                          : e.target.value,
                        chartState.ascending,
                        chartState.descending,
                        chartState.sortingField
                      );
                    }}
                  />
                </div>
                <hr className="my-2" />
                {/* Dimensions and measures */}
                <div>
                  {dnd?.columnOrder?.map((columnId: any, index: any) => {
                    const column = dnd.columns[columnId];
                    const tasks = column.taskIds.map((taskId: any) => {
                      return dnd.tasks[taskId];
                    });
                    if (column.id !== "Options") {
                      if (column.id === "Measure") {
                        return (
                          <Container2 className="w-90" key={index}>
                            <Title style={{ opacity: 0.8 }} className="f-12 fw-bold ls black">
                              {column.title}
                            </Title>

                            <Droppable droppableId={column.id}>
                              {(provided: any) => (
                                <TaskList
                                  // isDraggingOver={snapshot.isDraggingOver}
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  columnId={column.id}
                                >
                                  {tasks.length === 0 && (
                                    <div className="d-flex justify-content-center">
                                      <Image width={24} height={24} src="/emptyChartCard.svg" />
                                    </div>
                                  )}
                                  {(chartState.type !== "treeMap"
                                    ? tasks[0]
                                      ? [tasks[0]]
                                      : []
                                    : tasks
                                  ).map((task: any, index: any) => {
                                    return (
                                      <Draggable
                                        key={task.id}
                                        isDragDisabled={true}
                                        draggableId={task.id}
                                        index={index}
                                      >
                                        {(provided: any, snapshot: any) => (
                                          <Container1
                                            isDragging={snapshot.isDragging}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            column={column}
                                            task={task}
                                          >
                                            {checkType(task.type)}
                                            <h6 className="f-16 mb-0 overflow-hidden overflow-whitespace">
                                              <p
                                                className="mb-0 overflow-hidden overflow-whitespace"
                                                style={{ fontSize: "12px", color: "#485255" }}
                                              >
                                                {task.content}
                                              </p>
                                            </h6>
                                            {column.id === "Options" ? null : (
                                              <Image
                                                onClick={() => {
                                                  if (chartState.type === "treeMap") {
                                                    const y = column.taskIds;
                                                    const a: any = [];
                                                    y.map((item: any) => {
                                                      if (item !== task.id) {
                                                        a.push(item);
                                                      }
                                                    });
                                                    const finish = dnd.columns["Measure"];

                                                    const finishTaskIds = Array.from(
                                                      finish.taskIds
                                                    );

                                                    const test1: any = [];
                                                    finishTaskIds.map((item: any) => {
                                                      if (item !== task.id) {
                                                        test1.push(item);
                                                      }
                                                    });

                                                    const a1 = dnd.tasks;
                                                    const c: any = [];
                                                    test1?.map((item: any) => {
                                                      c.push(a1[item].content);
                                                    });
                                                    renderChart(
                                                      false,
                                                      c[0],
                                                      chartState.showLabel,
                                                      chartState.showLegend,
                                                      chartState.showGrids,
                                                      chartState.showAxis,
                                                      chartState.showAxisTitle,
                                                      chartState.data,
                                                      c,
                                                      chartState.measures,
                                                      chartState.aggregate,
                                                      filters1,
                                                      chartState.optionsCount,
                                                      chartState.ascending,
                                                      chartState.descending,
                                                      chartState.sortingField
                                                    );

                                                    setDnd({
                                                      tasks: dnd.tasks,
                                                      columns: {
                                                        Options: dnd.columns.Options,
                                                        Dimensions: dnd.columns.Dimensions,
                                                        Measure: {
                                                          id: dnd.columns.Measure.id,
                                                          title: dnd.columns.Measure.title,
                                                          taskIds: a,
                                                        },
                                                      },
                                                      columnOrder: [
                                                        "Measure",
                                                        "Options",
                                                        "Dimensions",
                                                      ],
                                                    });
                                                  } else {
                                                    renderChart(
                                                      false,
                                                      "",
                                                      chartState.showLabel,
                                                      chartState.showLegend,
                                                      chartState.showGrids,
                                                      chartState.showAxis,
                                                      chartState.showAxisTitle,
                                                      chartState.data,
                                                      [],
                                                      chartState.measures,
                                                      chartState.aggregate,
                                                      filters1,
                                                      chartState.optionsCount,
                                                      chartState.ascending,
                                                      chartState.descending,
                                                      chartState.sortingField
                                                    );
                                                    setDnd({
                                                      tasks: dnd.tasks,
                                                      columns: {
                                                        Options: dnd.columns.Options,
                                                        Measure: {
                                                          id: dnd.columns.Measure.id,
                                                          title: dnd.columns.Measure.title,
                                                          taskIds: [],
                                                        },
                                                        Dimensions: dnd.columns.Dimensions,
                                                      },
                                                      columnOrder: [
                                                        "Measure",
                                                        "Options",
                                                        "Dimensions",
                                                      ],
                                                    });
                                                  }
                                                }}
                                                src="/charts/cross.svg"
                                                width={16}
                                                height={16}
                                                className="ms-auto cursor-pointer"
                                              />
                                            )}
                                          </Container1>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {provided.placeholder}
                                </TaskList>
                              )}
                            </Droppable>
                          </Container2>
                        );
                      }
                      return (
                        <Container2 className="w-90" key={index}>
                          <Title style={{ opacity: 0.8 }} className="fw-bold f-12 ls black">
                            {column.title + "s"}
                          </Title>

                          <Droppable droppableId={column.id}>
                            {(provided: any) => (
                              <TaskList
                                // isDraggingOver={snapshot.isDraggingOver}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                columnId={column.id}
                              >
                                {tasks.length === 0 && (
                                  <div className="d-flex justify-content-center">
                                    <Image width={24} height={24} src="/emptyChartCard.svg" />
                                  </div>
                                )}
                                {tasks.map((task: any, index: any) => {
                                  return (
                                    <Draggable
                                      key={task.id}
                                      isDragDisabled={true}
                                      draggableId={task.id}
                                      index={index}
                                    >
                                      {(provided: any, snapshot: any) => (
                                        <Container1
                                          isDragging={snapshot.isDragging}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          column={column}
                                          task={task}
                                        >
                                          {checkType(task.type)}
                                          <h6 className="f-16 mb-0 overflow-hidden overflow-whitespace">
                                            <p
                                              className="mb-0 overflow-hidden overflow-whitespace"
                                              style={{ fontSize: "12px", color: "#485255" }}
                                            >
                                              {task.content}
                                            </p>
                                          </h6>
                                          <Image
                                            onClick={() => {
                                              const y = column.taskIds;
                                              const a: any = [];
                                              y.map((item: any) => {
                                                if (item !== task.id) {
                                                  a.push(item);
                                                }
                                              });

                                              const finish = dnd.columns["Dimensions"];

                                              const finishTaskIds = Array.from(finish.taskIds);

                                              const test1: any = [];
                                              finishTaskIds.map((item: any) => {
                                                if (item !== task.id) {
                                                  test1.push(item);
                                                }
                                              });

                                              const a1 = dnd.tasks;
                                              const c: any = [];
                                              test1?.map((item: any) => {
                                                c.push(a1[item].content);
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
                                                c,
                                                chartState.aggregate,
                                                filters1,
                                                chartState.optionsCount,
                                                chartState.ascending,
                                                chartState.descending,
                                                chartState.sortingField
                                              );

                                              setDnd({
                                                tasks: dnd.tasks,
                                                columns: {
                                                  Options: dnd.columns.Options,
                                                  Measure: dnd.columns.Measure,
                                                  Dimensions: {
                                                    id: dnd.columns.Dimensions.id,
                                                    title: dnd.columns.Dimensions.title,
                                                    taskIds: a,
                                                  },
                                                },
                                                columnOrder: ["Measure", "Options", "Dimensions"],
                                              });
                                            }}
                                            src="/charts/cross.svg"
                                            width={16}
                                            height={16}
                                            className="ms-auto cursor-pointer"
                                          />
                                        </Container1>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </TaskList>
                            )}
                          </Droppable>
                        </Container2>
                      );
                    }
                  })}
                </div>
                <hr className="my-2" />
                {/* Aggregate */}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mx-2">
                    <p style={{ opacity: 0.8 }} className="mb-0 fw-bold f-12 ls black text-nowrap">
                      Aggregate &gt;
                    </p>
                    <Select
                      isSearchable={false}
                      styles={customStyles}
                      menuPlacement="top"
                      defaultValue={{
                        value: chartState.aggregate,
                        field: chartState.aggregate,
                        label: chartState.aggregate,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      className="width-max"
                      classNamePrefix="select"
                      options={aggregateOptions}
                      name="x-filter"
                      components={{
                        IndicatorSeparator,
                        Control,
                        DropdownIndicator,
                        Option: Option,
                      }}
                      id="select-x-filter"
                      onChange={(option: any) => {
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
                          option.value,
                          filters1,
                          chartState.optionsCount,
                          chartState.ascending,
                          chartState.descending,
                          chartState.sortingField
                        );
                      }}
                    />
                  </div>
                </div>
                <hr className="my-2" />
                {/* Sort */}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mx-2">
                    <p style={{ opacity: 0.8 }} className="mb-0 fw-bold f-12 ls black">
                      Sort &gt;
                    </p>
                    <Select
                      isSearchable={false}
                      styles={customStyles}
                      menuPlacement="top"
                      defaultValue={{
                        value: chartState.sort,
                        field: chartState.sort,
                        label: chartState.sort,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      className="width-max"
                      classNamePrefix="select"
                      options={sortOptions}
                      name="x-filter"
                      components={{
                        IndicatorSeparator,
                        Control,
                        DropdownIndicator,
                        Option: Option1,
                      }}
                      id="select-x-filter"
                      onChange={(option: any) => {
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
                          filters1,
                          chartState.optionsCount,
                          option.value === "Ascending" ? true : false,
                          option.value === "Descending" ? true : false,
                          chartState.sortingField
                        );
                      }}
                    />
                  </div>
                  {chartState.sort === "Default" ? null : (
                    <Select
                      isSearchable={false}
                      styles={{
                        menu: (base: any) => ({
                          ...base,
                          fontSize: 12,
                          minWidth: 120,
                        }),
                      }}
                      menuPlacement="auto"
                      defaultValue={{
                        value: chartState.sortingField,
                        field: chartState.sortingField,
                        label: chartState.sortingField,
                      }}
                      // formatOptionLabel={formatOptionLabel}
                      menuPosition="absolute"
                      components={{ Control: Control1, Option: Option2 }}
                      className="single-select-box ms-2 w-100"
                      classNamePrefix="select"
                      options={chartState.options}
                      name="x-filter"
                      id="select-x-filter"
                      onChange={(option: any) => {
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
                          filters1,
                          chartState.optionsCount,
                          chartState.ascending,
                          chartState.descending,
                          option.value
                        );
                      }}
                    />
                  )}
                </div>

                <hr className="my-2" />
                {/* Filters */}
                <Container2>
                  <div className="d-flex flex-row align-items-center">
                    <p style={{ opacity: 0.8 }} className="w-70 mb-0 ms-1 fw-bold f-12 ls black">
                      Add filter
                    </p>
                    <FiltersDropdown
                      chartState={chartState}
                      filters1={filters1}
                      setFilters1={setFilters1}
                    />
                  </div>
                  <AppliedFilters
                    filters1={filters1}
                    setFilters1={setFilters1}
                    chartState={chartState}
                    editFilter={editFilter}
                    setEditFilter={setEditFilter}
                    renderChart={renderChart}
                  />
                </Container2>
              </TaskList1>
              {/* All Filters */}
              <div className="border-top-0 border-start border-end-0 d-flex h-100 w-50">
                <Container className="w-100">
                  <Title style={{ opacity: 0.8 }} className="fw-bold f-12 ls black">
                    Available fields
                  </Title>
                  <Droppable droppableId={"Options"}>
                    {(provided: any) => {
                      const column = dnd?.columns["Options"];
                      const tasks = column.taskIds.map((taskId: any) => {
                        return dnd.tasks[taskId];
                      });
                      return (
                        <TaskList
                          // isDraggingOver={snapshot.isDraggingOver}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          columnId={dnd.columns["Options"].id}
                        >
                          {tasks.map((task: any, index: any) => {
                            return (
                              <Draggable
                                key={task.id}
                                isDragDisabled={
                                  column.id === "Measure" || column.id === "Dimensions"
                                }
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided: any, snapshot: any) => (
                                  <Container1
                                    isDragging={snapshot.isDragging}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    column={column}
                                    task={task}
                                  >
                                    {checkType(task.type)}
                                    <h6 className="f-16 mb-0 overflow-hidden overflow-whitespace">
                                      <p
                                        className="mb-0 overflow-hidden overflow-whitespace"
                                        style={{ fontSize: "12px", color: "#485255" }}
                                      >
                                        {task.content}
                                      </p>
                                    </h6>
                                  </Container1>
                                )}
                              </Draggable>
                            );
                          })}

                          {provided.placeholder}
                        </TaskList>
                      );
                    }}
                  </Droppable>
                </Container>
              </div>
            </div>
          </DragDropContext>
        </div>
      </Tab>
      {/* STYLE TAB */}
      <Tab eventKey="styles" title="STYLE" className="ps-0 pe-1">
        <>
          <div className="d-flex flex-column px-3 mt-2">
            <div>
              <h6 style={{ opacity: 0.8 }} className="my-2 fw-bold f-12 ls black">
                Color settings
              </h6>
              {_.map(chartState.measures, (item: any, index: any) => {
                if (
                  chartState.category === "chartjs" ||
                  chartState.type === "pie" ||
                  chartState.type === "doughnut" ||
                  chartState.type === "polarArea"
                ) {
                  return (
                    <div key={index} className="pb-2">
                      {/* <hr /> */}
                      <div>
                        <div className="d-flex flex-row justify-content-between">
                          <h6
                            className="mt-3 ms-2 f-12"
                            style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
                          >
                            Series - {item}
                          </h6>
                          <div
                            className="me-2 mt-2 align-items-center"
                            style={{ border: "0.5px solid #919EAB", width: "51px", height: "11%" }}
                          >
                            <InputGroup>
                              <Form.Control
                                type="color"
                                className="p-1 border-0 cursor-pointer"
                                style={{ borderRadius: "4px" }}
                                value={
                                  verticalBarData &&
                                  verticalBarData.datasets &&
                                  verticalBarData?.datasets[index]?.backgroundColor
                                }
                                onChange={(event: any) => handleChartColor(event, index)}
                              />
                              <InputGroup.Prepend>
                                <InputGroup.Text
                                  className="p-1 border-0"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Image src="/charts/editColor.svg" />
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                            </InputGroup>
                          </div>
                        </div>
                        {chartState.type == "curve" ||
                        chartState.type == "line" ||
                        chartState.type == "mixed" ||
                        chartState.type == "area" ? (
                          <div className="d-flex flex-row justify-content-between">
                            <h6
                              className="mt-3 ms-2 f-12"
                              style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
                            >
                              Line weight
                            </h6>

                            <div
                              className="me-2 mt-2 ms-3 "
                              style={{ border: "0.5px solid #919EAB" }}
                            >
                              <Form.Row>
                                <Form.Group as={Col}>
                                  <InputGroup>
                                    <Form.Control
                                      max="8"
                                      min="1"
                                      className="p-1 f-11 border-0"
                                      style={{ width: 40 }}
                                      value={chartState.lineWeight}
                                      onChange={(e: any) => {
                                        setChartState({
                                          ...chartState,
                                          lineWeight: e.target.value,
                                        });
                                      }}
                                      type="number"
                                    />
                                    <InputGroup.Prepend>
                                      <InputGroup.Text
                                        className="border-0 mt-1"
                                        style={{ backgroundColor: "white" }}
                                      >
                                        <Image src="/charts/lineWeightIcon.svg" />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                  </InputGroup>
                                </Form.Group>
                              </Form.Row>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div style={{ width: "40%" }}></div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <hr className="my-3" />

          <h6 className="my-2 px-3 f-12 fw-bold ls black" style={{ opacity: 0.8 }}>
            Properties
          </h6>
          <Form className="px-4">
            {/* <Form.Group controlId="formBasicCheckboxT">
            <Form.Check
              defaultChecked={titleVisible}
              onChange={(e) => {
                setTitleVisible(e.target.checked);
              }}
              type="checkbox"
              label="Show title"
              className="f-14"
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                color: "#4F4F4F",
                textAlign: "start",
                opacity: 0.8,
              }}
            />
          </Form.Group> */}

            <p className="f-11 mb-0 mt-2 black">Chart title</p>
            <input
              type="text"
              name="company"
              autoComplete="off"
              className="form-control f-11 mt-1 image-placeholder tabs-input w-100"
              style={{ height: "28px" }}
              value={chartState.name}
              onChange={(e) => {
                setChartState({
                  ...chartState,
                  name: e.target.value,
                });
              }}
              onBlur={(e: any) => {
                if (e.target.value === "") {
                  setChartState({
                    ...chartState,
                    editTitle: false,
                    name: "Untitled chart",
                  });
                } else {
                  setChartState({ ...chartState, editTitle: false });
                }
              }}
            />

            <p className="f-11 mb-0 mt-3 black">Chart description</p>
            <textarea
              className="form-control  f-11 mt-1 image-placeholder tabs-input w-100"
              rows={2}
              value={chartState.description}
              autoComplete="off"
              name=""
              id=""
              placeholder="Enter the description"
              onChange={(e: any) => {
                setChartState({
                  ...chartState,
                  description: e.target.value,
                });
              }}
            />
          </Form>

          <hr className="my-3" />
          <h6 className="my-2 px-3 f-12 fw-bold ls black" style={{ opacity: 0.8 }}>
            General settings
          </h6>
          <Form className="ps-4">
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                checked={chartState.showLabel}
                onClick={() => setChartState({ ...chartState, showLabel: !chartState.showLabel })}
                type="checkbox"
                label="Show labels"
                className="f-14"
                disabled={disableFiled(chartState.type, "label")}
                style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox1">
              <Form.Check
                checked={chartState.showLegend}
                onClick={() => setChartState({ ...chartState, showLegend: !chartState.showLegend })}
                type="checkbox"
                label="Show legends"
                className="f-14"
                disabled={chartState.type === "table" ? true : false}
                style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox2">
              <Form.Check
                checked={chartState.showGrids}
                onClick={() => setChartState({ ...chartState, showGrids: !chartState.showGrids })}
                type="checkbox"
                label="Show grids"
                className="f-14"
                disabled={disableFiled(chartState.type, "grids")}
                style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox3">
              <Form.Check
                checked={chartState.showAxis}
                onClick={() => setChartState({ ...chartState, showAxis: !chartState.showAxis })}
                type="checkbox"
                label="Show axis"
                className="f-14"
                disabled={disableFiled(chartState.type, "axis")}
                style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox4">
              <Form.Check
                checked={chartState.showAxisTitle}
                onClick={() =>
                  setChartState({ ...chartState, showAxisTitle: !chartState.showAxisTitle })
                }
                type="checkbox"
                label="Show axis titles"
                className="f-14"
                disabled={disableFiled(chartState.type, "axis")}
                style={{ color: "#4F4F4F", textAlign: "start", opacity: 0.8 }}
              />
            </Form.Group>
          </Form>
          {chartState.showAxisTitle ? (
            <div className="d-flex flex-row justify-content-between px-4 mt-3 mb-4">
              <input
                className="form-control axies-title search"
                type="text"
                placeholder="X axis title"
                aria-label="X axis title"
                readOnly
                // value={search}
                // onChange={handleSearch}
              />
              <input
                className="form-control search axies-title-input ms-2"
                type="text"
                autoComplete="off"
                placeholder="Axies title"
                aria-label="Axies title"
                value={chartState.axisTitle}
                disabled={disableFiled(chartState.type, "axis")}
                onChange={(e) => {
                  setChartState({
                    ...chartState,
                    axisTitle: e.target.value,
                  });
                }}
                onBlur={(e: any) => {
                  if (e.target.value === "") {
                    setChartState({
                      ...chartState,
                      saving: false,
                      axisTitle: chartState.axisTitle,
                    });
                  } else {
                    setChartState({ ...chartState, saving: false });
                  }
                }}
              />
            </div>
          ) : null}
        </>
      </Tab>
    </Tabs>
  );
};

export default ChartTabs;
