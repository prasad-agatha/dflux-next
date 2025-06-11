import React from "react";

export interface IChartState {
  chartData: any;
  charts: any[];
}
const initialState = {
  chartData: {},
  charts: [],
};
const ChartContext = React.createContext<IChartState>(initialState);
const ChartDispatch = React.createContext<any>(undefined);
const ChartReducer = (state: any, action: any) => {
  switch (action.type) {
    case "add_chart":
      // const newArr = state.charts;
      // newArr.push(action.payload);
      return {
        ...state,
        chartData: action.payload.chartdata,
        charts: [...state.charts, action.payload.chartType],
      };

    default:
      return state;
  }
};
export const ChartsProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(ChartReducer, initialState);
  // console.log(state);

  return (
    <ChartContext.Provider value={state}>
      <ChartDispatch.Provider value={dispatch}>
        {props.children}
      </ChartDispatch.Provider>
    </ChartContext.Provider>
  );
};
export const useChartState = () => {
  const data = React.useContext(ChartContext);
  return data;
};
export const useChartDispatch = () => {
  const dispatch = React.useContext(ChartDispatch);
  return dispatch;
};
