// import { AnyCnameRecord } from "dns";
import _ from "lodash";
import styled from "styled-components";

export const TaskList = styled.div`
  padding: 2px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  max-height: 69.5vh;
  min-height: 69.5vh;
  overflow: auto;
`;
export const TaskList1 = styled.div`
  padding: 2px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  height: 76.8vh;
  overflow-y: auto;
  overflow-x: hidden;
`;
const checkColor = (props: any) => {
  if (props.column.id === "Options") {
    return "white";
  } else {
    switch (props.task.type) {
      case "number":
        return "rgb(155,201,255,0.4)";
      case "string":
        return "rgb(143,177,175,0.4)";

      default:
        return "white";
    }
  }
};
const checkColor2 = (props: any) => {
  // if (props.column.id === "Options") {
  //   return "white";
  // } else {
  switch (props.type) {
    case "number":
      return "rgb(155,201,255,0.4)";
    case "string":
      return "rgb(143,177,175,0.4)";
    case "date":
      return "rgb(143,177,175,0.4)";
    default:
      return "white";
  }
  // }
};
export const Container = styled.div`
  margin: 4px;
  border-radius: 2px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
export const Container1 = styled.div`
  display: flex;
  align-items: center;
  height: 100;
  margin-bottom: 6px;
  font-size: 16px;
  padding: 8px;
  background-color: ${(props: any) => checkColor(props)};
  color: "#485255";
  border: ${(props: any) => (props.column.id === "Options" ? "1.5px solid rgb(0,0,0,0.1)" : ``)};
  border-radius: 1.95312px;
`;
export const Container2: any = styled.div`
  display: flex;
  align-items: center;
  height: 100;
  margin-bottom: 0;
  font-size: 16px;
  background-color: ${(props: any) => checkColor2(props)};
  padding: 8px;
  color: "#485255";
  border-radius: 1.95312px;
  width: 100%;
`;
// border: ${(props: any) => (props.column.id === "Options" ? "1.5px solid rgb(0,0,0,0.1)" : ``)};
// background-color: ${(props: any) => (props.isDragging ? "#0076FF" : "white")};

export const Title = styled.h6`
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 2px;
`;

export const engines = [
  {
    Engine: "postgres",
    Active: "/connections/icons/postgres2white.svg",
    Inactive: "/connections/icons/postgres2.svg",
    width: 122.67,
    height: 33.97,
  },
  {
    Engine: "mysql",
    Active: "/connections/icons/mysqlwhite.svg",
    Inactive: "/connections/icons/mysql.svg",
    width: 82.27,
    height: 42.27,
  },
  {
    Engine: "oracle",
    Active: "/connections/icons/oraclewhite.svg",
    Inactive: "/connections/icons/oracle.svg",
    width: 104.44,
    height: 13.69,
  },
  {
    Engine: "mssql",
    Active: "/connections/icons/mssql2white.svg",
    Inactive: "/connections/icons/mssql2.svg",
    width: 76,
    height: 20.86,
  },
  {
    Engine: "SNOWFLAKE",
    Inactive: "/connections/icons/Snowflake_Logo.svg",
    Active: "/connections/icons/snowflake.svg",
    width: 96,
    height: 30.86,
  },
];

export const chartTypes: any = [
  {
    type: "bar",
    category: "chartjs",
    label: "Bar",
    img: "/charts/vertiStackedbars.svg",
    whiteImg: "/charts/vertiStackedbarswhite.svg ",
    Type: "Vertical Bar",
  },
  {
    type: "bar1",
    category: "chartjs",
    label: "Stacked bar",
    img: "/charts/verticalStack.svg",
    whiteImg: "/charts/verticalStack.svg ",
    Type: "Vertical stacked bar",
  },
  {
    type: "horizontalBar",
    category: "chartjs",
    label: "Bar",
    img: "/charts/horizStackedbars.svg",
    whiteImg: "/charts/horizStackedbarswhite.svg",
    Type: "Horizontal bar",
  },
  {
    type: "bar2",
    category: "chartjs",
    label: "Stacked bar",
    img: "/charts/horizontalStack.svg",
    whiteImg: "/charts/verticalStack.svg ",
    Type: "Horizontal stacked bar",
  },
  {
    type: "curve",
    category: "chartjs",
    label: "Graph",
    img: "/charts/chart.svg",
    whiteImg: "/charts/chartWhite.svg",
    Type: "Curve chart",
  },
  {
    type: "line",
    category: "chartjs",
    label: "Line",
    img: "/charts/graph.svg",
    whiteImg: "/charts/graphwhite.svg",
    Type: "Line chart",
  },
  {
    type: "mixed",
    category: "chartjs",
    label: "Mixed",
    img: "/charts/mixed.svg",
    whiteImg: "/charts/graphwhite.svg",
    Type: "Mixed chart",
  },
  {
    type: "area",
    category: "chartjs",
    label: "Area",
    img: "/charts/areaLine.svg",
    whiteImg: "/charts/graphwhite.svg",
    Type: "Area chart",
  },
  {
    type: "scatter",
    category: "chartjs",
    label: "Scatter",
    img: "/charts/scatter.svg",
    whiteImg: "/charts/scatterDisabled.svg",
    Type: "Scatter chart",
  },
  {
    type: "bubble",
    category: "chartjs",
    label: "Bubble",
    img: "/charts/bubble.svg",
    whiteImg: "/charts/bubbleDisabled.svg",
    Type: "Bubble chart",
  },
  {
    type: "pie",
    category: "chartjs",
    label: "Pie",
    img: "/charts/pie1.svg",
    whiteImg: "/charts/pie1white.svg",
    Type: "Pie chart",
  },
  {
    type: "doughnut",
    category: "chartjs",
    label: "Dough",
    img: "/charts/pie2.svg",
    whiteImg: "/charts/pie2white.svg",
    Type: "Doughnut chart",
  },
  {
    type: "polarArea",
    category: "chartjs",
    label: "Polar",
    img: "/charts/polar1.svg",
    whiteImg: "/charts/vertiStackedbarswhite.svg ",
    Type: "Polar chart",
  },
  {
    type: "radar",
    category: "chartjs",
    label: "Radar",
    img: "/charts/radar1.svg",
    whiteImg: "/charts/vertiStackedbarswhite.svg ",
    Type: "Radar chart",
  },
  {
    type: "table",
    category: "chartjs",
    label: "Table",
    img: "/charts/tableIcon.svg",
    Type: "Table",
  },
  {
    type: "treeMap",
    category: "d3",
    label: "TreeMap",
    img: "/charts/treemap_icon.svg",
    Type: "Treemap",
  },
  {
    type: "histogram",
    category: "d3",
    label: "Histogram",
    img: "/charts/histogram_chart.svg",
    whiteImg: "/charts/histogramDisabled.svg",
    Type: "Histogram chart",
  },
  {
    type: "waffle",
    category: "d3",
    label: "WaffleChart",
    img: "/charts/waffle.svg",
    whiteImg: "/charts/waffleDisabled.svg",
    Type: "Waffle chart",
  },

  {
    type: "map",
    category: "d3",
    label: "map",
    img: "/charts/map.svg",
    whiteImg: "/charts/mapDisabled.svg",
    Type: "Background map",
  },
  {
    type: "heatMap",
    category: "d3",
    label: "HeatMap",
    img: "/charts/heatmapIcon.svg",
    Type: "Heat map",
  },

  {
    type: "packedBubble",
    category: "d3",
    label: "PackedBubble",
    img: "/charts/bubbleChartIcon.svg",
    Type: "Packed bubble chart",
  },

  {
    type: "boxPlot",
    category: "d3",
    label: "BoxPlot",
    img: "/charts/boxplotIcon.svg",
    Type: "Boxplot",
  },
  {
    type: "paretoChart",
    category: "d3",
    label: "ParetoChart",
    img: "/charts/pareto.svg",
    Type: "Pareto chart",
  },
  {
    type: "waterfallChart",
    category: "d3",
    label: "WaterfallChart",
    img: "/charts/waterfallIcon.svg",
    Type: "Waterfall chart",
  },
  {
    type: "sankey",
    category: "d3",
    label: "SankeyChart",
    img: "/charts/radialIcon.svg",
    Type: "Radial chart",
  },
  {
    type: "bump",
    category: "d3",
    label: "BumpChart",
    img: "/charts/bumpchart.svg",
    Type: "Bump chart",
    whiteImg: "/charts/bumpChartDisabled.svg",
  },
];
export const aggregateOptions = [
  {
    field: "None",
    label: "None",
    value: "None",
  },
  {
    field: "Sum",
    label: "Sum",
    value: "Sum",
  },
  {
    field: "Average",
    label: "Average",
    value: "Average",
  },
  {
    field: "Count",
    label: "Count",
    value: "Count",
  },
  {
    field: "Minimum",
    label: "Minimum",
    value: "Minimum",
  },
  {
    field: "Maximum",
    label: "Maximum",
    value: "Maximum",
  },
];
export const sortOptions = [
  {
    field: "Default",
    label: "Default",
    value: "Default",
  },
  {
    field: "Ascending",
    label: "Ascending",
    value: "Ascending",
  },
  {
    field: "Descending",
    label: "Descending",
    value: "Descending",
  },
];

export const months: any = [
  {
    field: "January",
    label: "January",
    value: "1",
  },
  {
    field: "February",
    label: "February",
    value: "2",
  },
  {
    field: "March",
    label: "March",
    value: "3",
  },
  {
    field: "April",
    label: "April",
    value: "4",
  },
  {
    field: "May",
    label: "May",
    value: "5",
  },
  {
    field: "June",
    label: "June",
    value: "6",
  },
  {
    field: "July",
    label: "July",
    value: "7",
  },
  {
    field: "August",
    label: "August",
    value: "8",
  },
  {
    field: "September",
    label: "September",
    value: "9",
  },
  {
    field: "October",
    label: "October",
    value: "10",
  },
  {
    field: "November",
    label: "November",
    value: "11",
  },
  {
    field: "December",
    label: "December",
    value: "12",
  },
];
export const weekDaysList = [
  { value: "mon", name: "Monday" },
  { value: "tue", name: "Tuesday" },
  { value: "wed", name: "Wednesday" },
  { value: "thu", name: "Thursday" },
  { value: "fri", name: "Friday" },
  { value: "sat", name: "Saturday" },
  { value: "sun", name: "Sunday" },
];
// hours options in menu
export const hours = _.range(1, 13);
// minutes options in menu
export const minutes = _.range(1, 56, 2);

export const days = _.range(1, 29);

export const pieColors = [
  "#F44336",
  "#FFEBEE",
  "#FFCDD2",
  "#EF9A9A",
  "#E57373",
  "#EF5350",
  "#F44336",
  "#E53935",
  "#D32F2F",
  "#C62828",
  "#B71C1C",
  "#FF8A80",
  "#FF5252",
  "#FF1744",
  "#D50000",
  "#E91E63",
  "#FCE4EC",
  "#F8BBD0",
  "#F48FB1",
  "#F06292",
  "#EC407A",
  "#E91E63",
  "#D81B60",
  "#C2185B",
  "#AD1457",
  "#880E4F",
  "#FF80AB",
  "#FF4081",
  "#F50057",
  "#C51162",
  "#9C27B0",
  "#F3E5F5",
  "#E1BEE7",
  "#CE93D8",
  "#BA68C8",
  "#AB47BC",
  "#9C27B0",
  "#8E24AA",
  "#7B1FA2",
  "#6A1B9A",
  "#4A148C",
  "#EA80FC",
  "#E040FB",
  "#D500F9",
  "#AA00FF",
  "#673AB7",
  "#EDE7F6",
  "#D1C4E9",
  "#B39DDB",
  "#9575CD",
  "#7E57C2",
  "#673AB7",
  "#5E35B1",
  "#512DA8",
  "#4527A0",
  "#311B92",
  "#B388FF",
  "#7C4DFF",
  "#651FFF",
  "#6200EA",
  "#3F51B5",
  "#E8EAF6",
  "#C5CAE9",
  "#9FA8DA",
  "#7986CB",
  "#5C6BC0",
  "#3F51B5",
  "#3949AB",
  "#303F9F",
  "#283593",
  "#1A237E",
  "#8C9EFF",
  "#536DFE",
  "#3D5AFE",
  "#304FFE",
  "#2196F3",
  "#E3F2FD",
  "#BBDEFB",
  "#90CAF9",
  "#64B5F6",
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
  "#82B1FF",
  "#448AFF",
  "#2979FF",
  "#2962FF",
  "#03A9F4",
  "#E1F5FE",
  "#B3E5FC",
  "#81D4FA",
  "#4FC3F7",
  "#29B6F6",
  "#03A9F4",
  "#039BE5",
  "#0288D1",
  "#0277BD",
  "#01579B",
  "#80D8FF",
  "#40C4FF",
  "#00B0FF",
  "#0091EA",
  "#00BCD4",
  "#E0F7FA",
  "#B2EBF2",
  "#80DEEA",
  "#4DD0E1",
  "#26C6DA",
  "#00BCD4",
  "#00ACC1",
  "#0097A7",
  "#00838F",
  "#006064",
  "#84FFFF",
  "#18FFFF",
  "#00E5FF",
  "#00B8D4",
  "#009688",
  "#E0F2F1",
  "#B2DFDB",
  "#80CBC4",
  "#4DB6AC",
  "#26A69A",
  "#009688",
  "#00897B",
  "#00796B",
  "#00695C",
  "#004D40",
  "#A7FFEB",
  "#64FFDA",
  "#1DE9B6",
  "#00BFA5",
  "#4CAF50",
  "#E8F5E9",
  "#C8E6C9",
  "#A5D6A7",
  "#81C784",
  "#66BB6A",
  "#4CAF50",
  "#43A047",
  "#388E3C",
  "#2E7D32",
  "#1B5E20",
  "#B9F6CA",
  "#69F0AE",
  "#00E676",
  "#00C853",
  "#8BC34A",
  "#F1F8E9",
  "#DCEDC8",
  "#C5E1A5",
  "#AED581",
  "#9CCC65",
  "#8BC34A",
  "#7CB342",
  "#689F38",
  "#558B2F",
  "#33691E",
  "#CCFF90",
  "#B2FF59",
  "#76FF03",
  "#64DD17",
  "#CDDC39",
  "#F9FBE7",
  "#F0F4C3",
  "#E6EE9C",
  "#DCE775",
  "#D4E157",
  "#CDDC39",
  "#C0CA33",
  "#AFB42B",
  "#9E9D24",
  "#827717",
  "#F4FF81",
  "#EEFF41",
  "#C6FF00",
  "#AEEA00",
  "#FFEB3B",
  "#FFFDE7",
  "#FFF9C4",
  "#FFF59D",
  "#FFF176",
  "#FFEE58",
  "#FFEB3B",
  "#FDD835",
  "#FBC02D",
  "#F9A825",
  "#F57F17",
  "#FFFF8D",
  "#FFFF00",
  "#FFEA00",
  "#FFD600",
  "#FFC107",
  "#FFF8E1",
  "#FFECB3",
  "#FFE082",
  "#FFD54F",
  "#FFCA28",
  "#FFC107",
  "#FFB300",
  "#FFA000",
  "#FF8F00",
  "#FF6F00",
  "#FFE57F",
  "#FFD740",
  "#FFC400",
  "#FFAB00",
  "#FF9800",
  "#FFF3E0",
  "#FFE0B2",
  "#FFCC80",
  "#FFB74D",
  "#FFA726",
  "#FF9800",
  "#FB8C00",
  "#F57C00",
  "#EF6C00",
  "#E65100",
  "#FFD180",
  "#FFAB40",
  "#FF9100",
  "#FF6D00",
  "#FF5722",
  "#FBE9E7",
  "#FFCCBC",
  "#FFAB91",
  "#FF8A65",
  "#FF7043",
  "#FF5722",
  "#F4511E",
  "#E64A19",
  "#D84315",
  "#BF360C",
  "#FF9E80",
  "#FF6E40",
  "#FF3D00",
  "#DD2C00",
  "#795548",
  "#EFEBE9",
  "#D7CCC8",
  "#BCAAA4",
  "#A1887F",
  "#8D6E63",
  "#795548",
  "#6D4C41",
  "#5D4037",
  "#4E342E",
  "#3E2723",
  "#9E9E9E",
  "#FAFAFA",
  "#F5F5F5",
  "#EEEEEE",
  "#E0E0E0",
  "#BDBDBD",
  "#9E9E9E",
  "#757575",
  "#616161",
  "#424242",
  "#212121",
  "#607D8B",
  "#ECEFF1",
  "#CFD8DC",
  "#B0BEC5",
  "#90A4AE",
  "#78909C",
  "#607D8B",
  "#546E7A",
  "#455A64",
  "#37474F",
  "#263238",
  "#000000",
  "#FFFFFF",
  // "#63b598",
  // "#ce7d78",
  // "#ea9e70",
  // "#a48a9e",
  // "#c6e1e8",
  // "#648177",
  // "#0d5ac1",
  // "#f205e6",
  // "#1c0365",
  // "#14a9ad",
  // "#4ca2f9",
  // "#a4e43f",
  // "#d298e2",
  // "#6119d0",
  // "#d2737d",
  // "#c0a43c",
  // "#f2510e",
  // "#651be6",
  // "#79806e",
  // "#61da5e",
  // "#cd2f00",
  // "#9348af",
  // "#01ac53",
  // "#c5a4fb",
  // "#996635",
  // "#b11573",
  // "#4bb473",
  // "#75d89e",
  // "#2f3f94",
];

export const preProcessingTips = [
  {
    question: "What is data preprocessing?",
    answer:
      "Data preprocessing refers to the transformation of raw data into a well-formed machine-understandable format through dropping missing values and correcting errors in the available data sets.",
  },
  {
    question: "What is data type correction?",
    answer:
      "Data type correction is the process of identifying incomplete, incorrect, inaccurate, or irrelevant parts of the data and then replacing, modifying, or deleting the coarse data from the data set.",
  },
  {
    question: "Why auto-remove unwanted columns?",
    answer:
      "The aim of data preprocessing is to identify and remove or replace unwanted data columns, in order to create a reliable dataset. Auto-remove unwanted columns (i.e., columns missing value or has repeated value) improves accuracy and quality of training data set.",
  },
  {
    question: "What are correlated columns? ",
    answer:
      "Two columns are correlated if the value of one column is related to the value of the other column. For example, The state name and the country name are two columns that are correlated to the city name column. These correlated columns convey similar information to the learning algorithm and therefore, should be removed.",
  },
  {
    question: "What is the Standard Scale?",
    answer:
      "Standard scaling is also called center scaling where the values are centered around the mean with a unit standard deviation. Through standardization techniques, one can re-scale a feature value of highly varying magnitudes or values or units in the data in a fixed range to be within a distribution where 0 is the mean value and variance equal to 1.",
  },
  {
    question: "What is Min-Max Scale?",
    answer: `The MinMaxScaler is to rescale variables into the range [0,1], although a preferred scale can be specified via the “feature_range” argument and specify a tuple, including the min and the max for all variables. For example, for a dataset, we could guesstimate the min and max observable values as 30 and -10.
             We can then normalize any value, like 18.8, as follows:
                  y = (x – min) / (max – min)
                  y = (18.8 – (-10)) / (30 – (-10))
                  y = 28.8 / 40
                  y = 0.72
`,
  },
];

export const cvTechniqueTips = [
  {
    question: "What is Cross Validation Technique in Machine Learning?",
    answer:
      "Cross validation is performed to detect the overfitting and to evaluate the machine learning models by training and testing using the available input data. This technique is used to train the model with a subset of available data and test the model using the complimentary subset of the same data. Here are a few CV techniques to understand it better.",
  },
  {
    question: "What is the Leave p-out validation techinque?",
    answer:
      "Leave p-out cross validation (LpOCV) is a validation technique in which p-observations are used as validation data and the rest of the data for model training. To reach the utmost accuracy the process is repeated in all ways to cut the original sample validation set of p observations and training data.",
  },
  {
    question: "What is the Leave one-out validation technique?",
    answer:
      "Leave one-out cross validation (LOOCV) is a validation case where p=1, which means if the data has n rows, the 1st row is selected as validation data, and the rest of n-1 rows are used for training the model. The process is repeated where in the next iteration the 2nd row is selected as validation data and the remaining rows as training data until we end the validation of n rows.",
  },
  {
    question: "What is the Hold Out validation technique?",
    answer:
      "Hold Out cross-validation is an exhaustive technique where data is randomly slipped into the training and test data depending on data analysis.",
  },
  {
    question: "What is the Repeated Random Sampling technique?",
    answer:
      "Repeated random subsampling cross-validation is also known as Monte Carlo cross-validation. In repeated random validation dataset is randomly split into training and validation where a number of iterations are not fixed and results are decided by analysis.",
  },
  {
    question: "What is the K-fold technique?",
    answer:
      "During the K-fold cross-validation technique the original dataset is equally distributed into K sub folds or groups, for every iteration, one group is selected for validation, and the rest (k-1) sub folds for training. The process is repeated until each k group is treated as a validation data set and remaining as training data. And the model accuracy is computed by finding the mean accuracy of k models validation data.",
  },
  {
    question: "What is the Stratified K-Fold technique?",
    answer:
      "Unlike k-fold validation, in stratified k-fold validation the solution is to split the data randomly in a stratified manner where it maintains the same class ratio throughout the k folds for the entire dataset.",
  },
  {
    question: "What is the Nested K-Fold technique?",
    answer:
      "Nested K-fold is a resampling procedure to perform cross validation and hyperparameter optimization. Cross-validation to evaluate the performance of the machine learning algorithm and hyperparameter tuning to find the best parameters for that machine learning algorithm to eliminate the generalisation error.",
  },
  {
    question: "What is the Gridsearch CV technique?",
    answer:
      "Gridsearch CV is a cross-validation technique where we search through the best parameter values from the given set of parameters to make the predictions. To run this validation technique the model and the required parameters must be fed in.",
  },
];
export const modellingTips = [
  {
    question: "What is Classification modeling?",
    answer:
      "Classification is a data mining function that assigns items in a collection to target categories or classes. The goal of classification is to accurately predict the target class for each case in the data. For example, a classification model could be used to identify loan applicants as low, medium, or high credit risks.",
  },
  {
    question: "What is Regression Modelling?",
    answer:
      "A regression model is used to investigate the relationship between two or more variables and estimate one variable based on the others. Performing a regression allows you to confidently determine which factors matter most, which factors can be ignored, and how these factors influence each other.",
  },
  {
    question: "What is a Time series prediction?",
    answer:
      "Time series prediction is a scientific technique used to forecast the data with historical time stamps to make observations and drive strategic decision-making to stay future untended.",
  },
  {
    question: "What is the Auto Arima model?",
    answer:
      "ARIMA (aka autoregressive integrated moving average) is a scientific data analysis technique that uses time-series data to measure the possibility of events that might happen over a period of time. Auto ARIMA is an automated function, which is created to find the optimal order and optimal seasonal order within the designated parameter restrictions. It best fits a single-variable time series data.",
  },
];
export const classificationAlgorithmTips = [
  {
    question: "What is an SVM Classifier?",
    answer:
      "Support vector machine is a representation of the training data as points in space separated into categories by a clear gap that is as wide as possible. New examples are then mapped into that same space and predicted to belong to a category based on which side of the gap they fall. Effective in high dimensional spaces and uses a subset of training points in the decision function so it is also memory efficient.",
  },
  {
    question: "What is a Decision Tree classification algorithm?",
    answer:
      "Decision Trees are a supervised learning method used for classification. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features. It breaks down a dataset into smaller and smaller subsets while at the same time an associated decision tree is incrementally developed. Decision trees can handle both categorical and numerical data.",
  },
  {
    question: "What is a Random Forest classification algorithm?",
    answer:
      "Random forest classifier is a meta-estimator that fits a number of decision trees on various sub-samples of datasets and uses an average to improve the predictive accuracy of the model and controls over-fitting. The sub-sample size is always the same as the original input sample size but the samples are drawn with replacement.",
  },
  {
    question: "What is a KNN Classifier?",
    answer:
      "Kneighbors classifier is a non-parametric classification method popularly known as KNN (K-nearest neighbours algorithm). In KNN classification, the output is a class membership. An object is classified by a plurality vote of its neighbors. Since this algorithm relies on distance for classification, if the features represent different physical units or come in vastly different scales then normalizing the training data can improve its accuracy dramatically.",
  },
  {
    question: "What is an XGBoost classification algorithm?",
    answer:
      "XGBoost is also known as “Extreme Gradient Boosting”. XGboost is commonly used for supervised learning in machine learning. It is the execution of gradient boosted decision trees to ensemble techniques where the new models are created that compute the error in the previous model and then leftover is added to make the final prediction. ",
  },
  {
    question: "What is an ADABoost Classifier?",
    answer:
      "AdaBoost is short for Adaptive Boosting and is a very popular boosting technique which combines multiple “weak classifiers” into a single “strong classifier”. It is best used with weak learners. These are models that achieve accuracy just above random chance on a classification problem. The most suited and therefore most common algorithm used with AdaBoost are decision trees with one level.",
  },
  {
    question: "What is a Logistic Regression algorithm?",
    answer:
      "Logistic regression is a machine learning algorithm for classification. In this algorithm, the probabilities describing the possible outcomes of a single trial are modeled using a logistic function. It is most useful for understanding the influence of several independent variables on a single outcome variable.",
  },
  {
    question: "What is Naive Bayes Classifier?",
    answer:
      "Naive Bayes Classifiers are a collection of classification algorithms based on Bayes theorem. Where a family of algorithms that share a common principle (i.e., Every pair of features being classified is independent of each other) are applied on the test data. This technique is very effective on a large range of complex problems as it predicts membership probabilities for each class and then considers the class with the highest probability as a mostly likely class.",
  },
  // {
  //   question: "What is a Multinomial Classifier?",
  //   answer:
  //     "The multinomial classifier or multinomial naive bayes classifier work on the bayes theorem. And it is a suitable classification for data with discrete features. Multinomial classifier consider a feature vector where a given term represents the number of times it appear or very often i.e., frequency. ",
  // },
  {
    question: "What is a Multi Layer Perceptron?",
    answer:
      "A multilayer perceptron (MLP) is a feedforward artificial neural network that generates a set of outputs from a set of inputs. An MLP is characterized by several layers of input nodes connected as a directed graph between the input and output layers. Except for the input nodes, each node is a neuron that uses a nonlinear activation function which provides an advantage for adaptive learning and an ability to learn how to do tasks based on the training data.",
  },
];

export const regressionAlgorithmTips = [
  {
    question: "What is the SVM Regressor?",
    answer:
      "Support Vector Regression is a supervised learning algorithm that is used to predict discrete values. The basic idea behind SVR is to find the best fit line. In SVR, the best fit line is the hyperplane that has the maximum number of points.",
  },
  // {
  //   question: "What is a Linear Regression algorithm?",
  //   answer:
  //     "Linear Regression is a machine learning algorithm based on supervised learning. It performs a regression task. Regression models a target prediction value based on independent variables. It is mostly used for finding out the relationship between variables and forecasting.",
  // },
  {
    question: "What is a Decision Tree Regressor?",
    answer:
      "If there is a high nonlinearity & complex relationship between dependent & independent variables, a tree model will outperform a classical regression method. If you need to build a model which is easy to explain to people, a decision tree model will always do better than a linear model.",
  },
  {
    question: "What is a Random Forest Regressor?",
    answer:
      "Random Forest Regression is a supervised learning algorithm that uses the ensemble learning method for regression. The ensemble learning method is a technique that combines predictions from multiple machine learning algorithms to make a more accurate prediction than a single model. The algorithm operates by constructing a multitude of decision trees at training time and outputting the mean/mode of prediction of the individual trees.",
  },
  {
    question: "What is a KNN Regressor?",
    answer:
      "Kneighbor regressor popularly known as KNN algorithm is used to define the output by determining the property value of the object. This value is the average of the values of K nearest neighbors.",
  },
  {
    question: "What is a Gradient Boosting Regression?",
    answer:
      "Gradient Boosting for regression. GB builds an additive model in a forward stage-wise fashion; it allows for the optimization of arbitrary differentiable loss functions. It relies on the intuition that the best possible next model, when combined with previous models, minimizes the overall prediction error.",
  },
  // {
  //   question: "What is an XGBoost regression algorithm?",
  //   answer:
  //     "XGBoost is a decision-tree-based ensemble Machine Learning algorithm that uses a gradient boosting framework. In prediction problems involving unstructured data (images, text, etc.). XGBoost expects to have the base learners which are uniformly bad at the remainder so that when all the predictions are combined, bad predictions cancel out and a better one sums up to form final good predictions.",
  // },
  // {
  //   question: "What is a Polynomial Regression?",
  //   answer:
  //     "Polynomial regression is considered as a part of linear regression since it is linear in the regression coefficients. The goal of polynomial regression is to model a non-linear relationship between the independent and dependent variables. And mostly used when the points in the data are not captured by the Linear Regression Model as Polynomial Regression provides the best approximation of the relationship between the dependent and independent variable.",
  // },
  {
    question: "What is a Lasso Regression?",
    answer:
      "Lasso regression is a type of linear regression that is used for eliminating automated variables and the selection of features and it is also called as regularized linear regression. The Lasso is a shrinkage and selection method for linear regression. It minimizes the usual sum of squared errors, with a bound on the sum of the absolute values of the coefficients.",
  },
  {
    question: "What is a Ridge Regression?",
    answer:
      "Ridge regression is a model tuning method that is used to analyse any data that suffers from multicollinearity. This method performs L2 regularization. When the issue of multicollinearity occurs, least-squares are unbiased, and variances are large, this results in predicted values to be far away from the actual values. The performance of ridge regression is good when there is a subset of true coefficients which are small or even zero.",
  },
  {
    question: "What is an Elastic Net?",
    answer:
      "Elastic Net is an extension of linear regression that adds regularization penalties to the loss function during training. The elastic net method performs variable selection and regularization simultaneously. The elastic net technique is most appropriate where the dimensional data is greater than the number of samples used. Groupings and variable selection are the key roles of the elastic net technique.",
  },
  {
    question: "What is an Sgd Regression?",
    answer:
      "Stochastic Gradient Descent (SGD) is an efficient approach to fitting for regression tasks. It's basically a linear model that is updated along the way with a decaying learning rate. The class SGDClassifier implements a plain stochastic gradient descent learning routine which supports different loss functions and penalties for classification.",
  },
];
export const sampleDatasetTips = [
  {
    question: "What is sample datasets",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "What is sample datasets",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "What is sample datasets",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "What is sample datasets",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "What is sample datasets",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
];

export const getTitle = (txt: any) => {
  return txt.charAt(0).toUpperCase() + txt.slice(1).trim();
};
export const isInteger = (num: any) => {
  if (num - Math.floor(num)) return false;
  return true;
};
export const getAlgorithm = (input: any) => {
  let txt = "";
  algorithms.map((ele: any) => {
    if (ele.input === input) txt = ele.name;
  });
  return txt;
};
export const getLabel = (txt: any) => {
  return txt.split("_").join(" ");
};

export const crossValidationTechniques = [
  { name: "None", inputs: [], value: "none" },
  { name: "Leave p-out", inputs: ["p"], value: "leave_p_out" },
  { name: "Leave one-out", inputs: [], value: "leave_one_out" },
  { name: "Hold Out", inputs: ["test_size"], value: "hold_out" },
  {
    name: "Repeated Random Sampling",
    inputs: ["n_splits", "test_size"],
    value: "repeated_random_sampling",
  },
  { name: "K-Fold", inputs: ["n_splits"], value: "k_fold" },
  { name: "Stratified K-Fold", inputs: ["n_splits"], value: "k_fold_stratified" },
  { name: "Nested K-Fold", inputs: ["n_splits_inner", "n_splits_outer"], value: "nested_k_fold" },
];
export const algorithms = [
  {
    name: "SVM Classifier",
    input: "support_vector_classifier",
    modelType: "Classification",
    params: [
      // { name: "kernel", type: "select", options: ["linear", "rbf", "poly"], cv: true },
      { name: "kernel", type: "select", options: ["linear", "rbf", "poly"], cv: false },
      { name: "C", type: "float", options: [], cv: false },
      // { name: "gamma", type: "float", options: [], cv: true },
      { name: "gamma", type: "float", options: [], cv: false },
      // { name: "degree", type: "integer", options: [], cv: true },
      { name: "degree", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "Decision Tree",
    input: "decision_tree_classifier",
    modelType: "Classification",
    params: [
      { name: "max_depth", type: "integer", options: [], cv: false },
      { name: "min_samples_split", type: "integer", options: [], cv: false },
      { name: "min_samples_leaf", type: "integer", options: [], cv: false },
      // { name: "criterion", type: "select", options: ["entropy", "gini", "log loss"], cv: true },
      { name: "criterion", type: "select", options: ["entropy", "gini", "log loss"], cv: false },
    ],
  },
  {
    name: "Random Forest",
    input: "random_forest_classifier",
    modelType: "Classification",
    params: [
      { name: "max_depth", type: "integer", options: [], cv: false },
      { name: "min_samples_split", type: "integer", options: [], cv: false },
      { name: "min_samples_leaf", type: "integer", options: [], cv: false },
      // { name: "criterion", type: "select", options: ["entropy", "gini", "log loss"], cv: true },
      { name: "criterion", type: "select", options: ["entropy", "gini", "log loss"], cv: false },
      { name: "n_estimators", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "KNN",
    input: "knn_classifier",
    modelType: "Classification",
    params: [
      { name: "n_neighbors", type: "integer", options: [], cv: false },
      // { name: "weights", type: "select", options: ["uniform", "distance"], cv: true },
      { name: "weights", type: "select", options: ["uniform", "distance"], cv: false },
    ],
  },
  {
    name: "XGBoost",
    input: "xgboost_classifier",
    modelType: "Classification",
    params: [
      { name: "eta", type: "float", options: [], cv: false },
      { name: "gamma", type: "integer", options: [], cv: false },
      { name: "max_depth", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "ADABoost",
    input: "adaboost_classifier",
    modelType: "Classification",
    params: [
      { name: "n_estimators", type: "integer", options: [], cv: false },
      { name: "learning_rate", type: "float", options: [], cv: false },
    ],
  },
  {
    name: "Logistic Regression",
    input: "logistic_regression_model",
    modelType: "Classification",
    params: [
      { name: "C", type: "float", options: [], cv: false },
      // { name: "penalty", type: "select", options: ["l1", "l2", "elasticnet", "none"], cv: true },
      { name: "penalty", type: "select", options: ["l1", "l2", "elasticnet", "none"], cv: false },
      { name: "tol", type: "float", options: [], cv: false },
    ],
  },
  {
    name: "MultiNaive Bayes",
    input: "naive_bayes_classifier",
    modelType: "Classification",
    params: [{ name: "alpha", type: "float", options: [], cv: false }],
  },
  {
    name: "MLP",
    input: "multi_layer_perceptron_classifier",
    modelType: "Classification",
    params: [
      // { name: "hidden_layer_sizes", type: "float", options: [], cv: true },
      { name: "hidden_layer_sizes", type: "float", options: [], cv: false },
      // { name: "activation", type: "select", options: ["tanh", "relu", "logistic"], cv: true },
      { name: "activation", type: "select", options: ["tanh", "relu", "logistic"], cv: false },
      // { name: "solver", type: "select", options: ["sdm", "adam"], cv: true },
      { name: "solver", type: "select", options: ["sdm", "adam"], cv: false },
      // { name: "alpha", type: "float", options: [], cv: true },
      { name: "alpha", type: "float", options: [], cv: false },
      // {
      //   name: "learning_rate",
      //   type: "select",
      //   options: ["constant", "adaptive", "invscaling"],
      //   cv: true,
      // },
      {
        name: "learning_rate",
        type: "select",
        options: ["constant", "adaptive", "invscaling"],
        cv: false,
      },
    ],
  },

  {
    name: "SVM Regressor",
    input: "support_vector_machine_regressor",
    modelType: "Regression",
    params: [
      { name: "kernel", type: "select", options: ["linear", "rbf", "poly"], cv: true },
      { name: "C", type: "float", options: [], cv: false },
      // { name: "gamma", type: "float", options: [], cv: true },
      { name: "gamma", type: "float", options: [], cv: false },
      // { name: "degree", type: "integer", options: [], cv: true },
      { name: "degree", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "Decision Tree Regressor",
    input: "decision_tree_regressor",
    modelType: "Regression",
    params: [
      { name: "max_depth", type: "integer", options: [], cv: false },
      { name: "min_samples_split", type: "integer", options: [], cv: false },
      { name: "min_samples_leaf", type: "integer", options: [], cv: false },
      // {
      //   name: "criterion",
      //   type: "select",
      //   options: ["friedman_mse", "squared_error", "mse"],
      //   cv: true,
      // },
      {
        name: "criterion",
        type: "select",
        options: ["friedman_mse", "squared_error", "mse"],
        cv: false,
      },
    ],
  },
  {
    name: "Random Forest Regressor",
    input: "random_forest_regressor",
    modelType: "Regression",
    params: [
      { name: "max_depth", type: "integer", options: [], cv: false },
      { name: "min_samples_split", type: "integer", options: [], cv: false },
      { name: "min_samples_leaf", type: "integer", options: [], cv: false },
      {
        name: "criterion",
        type: "select",
        options: ["friedman_mse", "squared_error", "mse"],
        cv: false,
      },
      // {
      //   name: "criterion",
      //   type: "select",
      //   options: ["friedman_mse", "squared_error", "mse"],
      //   cv: true,
      // },
      { name: "n_estimators", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "KNN Regressor",
    input: "kneighbors_regressor",
    modelType: "Regression",
    params: [
      { name: "n_neighbors", type: "integer", options: [], cv: false },
      // { name: "weights", type: "select", options: ["uniform", "distance"], cv: true },
      { name: "weights", type: "select", options: ["uniform", "distance"], cv: false },
    ],
  },
  {
    name: "Gradient Boosting Regression",
    input: "gradientboosting_regression",
    modelType: "Regression",
    params: [
      { name: "max_depth", type: "integer", options: [], cv: false },
      { name: "min_samples_split", type: "integer", options: [], cv: false },
      { name: "min_samples_leaf", type: "integer", options: [], cv: false },
      {
        name: "criterion",
        type: "select",
        options: ["friedman_mse", "squared_error", "mse"],
        cv: false,
      },
      // {
      //   name: "criterion",
      //   type: "select",
      //   options: ["friedman_mse", "squared_error", "mse"],
      //   cv: true,
      // },
      { name: "n_estimators", type: "integer", options: [], cv: false },
    ],
  },
  {
    name: "Lasso Regression",
    input: "lasso_regressor",
    modelType: "Regression",
    params: [{ name: "alpha", type: "float", options: [], cv: false }],
  },
  {
    name: "Ridge Regression",
    input: "elasticnet_regression",
    modelType: "Regression",
    params: [{ name: "alpha", type: "float", options: [], cv: false }],
  },
  {
    name: "Elastic Regression",
    input: "ridge_regressor",
    modelType: "Regression",
    params: [
      { name: "alpha", type: "float", options: [], cv: false },
      // { name: "L1_ratio", type: "float", options: [], cv: true },
      { name: "L1_ratio", type: "float", options: [], cv: false },
    ],
  },
  {
    name: "Sgd Regression",
    input: "sgd_regression",
    modelType: "Regression",
    params: [
      { name: "alpha", type: "float", options: [], cv: false },
      { name: "penalty", type: "select", options: ["l2", "l1", "elasticnet"], cv: false },
      { name: "l1_ratio", type: "float", options: [], cv: false },
      // { name: "alpha", type: "float", options: [], cv: true },
      // { name: "penalty", type: "select", options: ["l2", "l1", "elasticnet"], cv: true },
      // { name: "l1_ratio", type: "float", options: [], cv: true },
      {
        name: "learning_rate",
        type: "select",
        options: ["constant", "optimal", "invscaling", "adaptive"],
        cv: false,
      },
      // {
      //   name: "learning_rate",
      //   type: "select",
      //   options: ["constant", "optimal", "invscaling", "adaptive"],
      //   cv: true,
      // },
    ],
  },
];
export const models = [
  { name: "Linear regression", input: "linear_regression", modelType: "Regression" },
  {
    name: "Support vector regression",
    input: "support_vector_machine_regressor",
    modelType: "Regression",
  },
  { name: "Random forest", input: "random_forest_regressor", modelType: "Regression" },
  { name: "Decision tree", input: "decision_tree_regressor", modelType: "Regression" },
  { name: "XGBoost", input: "xgb_regressor", modelType: "Regression" },
  { name: "Kneighbors regressor", input: "kneighbors_regressor", modelType: "Regression" },
  { name: "Polynomial regression", input: "polynomial_regression", modelType: "Regression" },
  { name: "Lasso regressor", input: "lasso_regressor", modelType: "Regression" },
  { name: "Ridge regressor", input: "ridge_regressor", modelType: "Regression" },
  { name: "Elastic net", input: "elasticnet_regression", modelType: "Regression" },
  { name: "SGD regression", input: "sgd_regression", modelType: "Regression" },
  { name: "Gradient boost", input: "gradientboosting_regression", modelType: "Regression" },
  {
    name: "Logistic regression model",
    input: "logistic regression model",
    modelType: "Classification",
  },
  {
    name: "Support vector classifier",
    input: "support vector classifier",
    modelType: "Classification",
  },
  {
    name: "Random forest classifier",
    input: "random forest classifier",
    modelType: "Classification",
  },
  {
    name: "Decision tree classifier",
    input: "decision tree classifier",
    modelType: "Classification",
  },
  { name: "XGB classifier", input: "xgboost classifier", modelType: "Classification" },
  { name: "Knn classifier", input: "knn classifier", modelType: "Classification" },
  { name: "Naive bayes classifier", input: "naive bayes classifier", modelType: "Classification" },
  {
    name: "Multinomial classifier",
    input: "multinomailNB classifier",
    modelType: "Classification",
  },
  { name: "Adaboost classifier", input: "adaboost classifier", modelType: "Classification" },
  {
    name: "Multi layer perceptron",
    input: "multi layer perceptron classifier",
    modelType: "Classification",
  },
];
export const tableStyles = {
  // tableWrapper: {
  //   style: {
  //     display: "flex",
  //     flex: 1,
  //     width: "100%",
  //     borderLeft: "0.5px solid #DBDDE0",
  //     // height: "100%",
  //     // width: "100%",
  //   },
  // },
  headRow: {
    style: {
      backgroundColor: "#E5E8EC",
      border: "0.5px solid #DBDDE0",
      borderSizing: "border-box",
      textTransform: "capitalize",
      minHeight: "10px",
      // height: "30px",
      fontSize: 14,
      // fontFamily: "Metropolis",
      color: "#3B3E40",
    },
  },
  rows: {
    style: {
      borderBottom: "0px",
      minHeight: "25px",
      height: "30px",
      // fontFamily: "Inter",
      fontSize: 13,
      color: "#3B3E40",
    },
    highlightOnHoverStyle: {
      color: "#3B3E40",
      // backgroundColor: "rgba(0, 118, 255, 0.05)",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      // borderBottomColor: theme.background.default,
      outlineStyle: "solid",
      outlineWidth: "1px",
      // outlineColor: theme.background.default,
    },
  },
  headCells: {
    style: {
      fontSize: 14,
      fontWeight: 600,
      textAlign: "center",
      color: "#3B3E40",
      backgroundColor: "#E5E8EC",
      paddingRight: "10px",
      textWrap: "wrap",
      wordBreak: "break-all",
    },
  },
  cells: {
    style: {
      textAlign: "center",
      borderRight: "0.5px solid #DBDDE0",
      // color: 'pink',
      // backgroundColor: 'yellow',
      // paddingLeft: '10px',
      paddingRight: "10px",
    },
  },
  // pagination: {
  //   style: {
  //     fontSize: "15px",
  //   },
  // },
  pagination: {
    style: {
      // color: theme.text.secondary,
      fontSize: "15px",
      minHeight: "56px",
      // backgroundColor: theme.background.default,
      // borderTopStyle: "solid",
      borderTopWidth: "1px",
      // borderTopColor: theme.divider.default,
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "px",
      // cursor: "auto",
      transition: "0.4s",
      // color: theme.button.default,
      // fill: theme.button.default,
      backgroundColor: "transparent",
      "&:disabled": {
        // cursor: "unset",
        // color: theme.button.disabled,
        // fill: theme.button.disabled,
      },
      "&:hover:not(:disabled)": {
        // cursor: "pointer",
        // backgroundColor: theme.button.hover,
      },
      "&:focus": {
        outline: "none",
        // backgroundColor: theme.button.focus,
      },
    },
  },
};

export const projectSummarySteps = [
  {
    selector: ".summary-1",
    content: "Project name and description can be updated by clicking on them",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-2",
    content: "Details of the project and can delete project from the given menu",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-3",
    content: "Top data sources",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-4",
    content: "Top queries",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-5",
    content: "Top notebooks",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-6",
    content: "Top models",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-7",
    content: "Top charts",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-8",
    content: "Top triggers",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".summary-9",
    content: "Top dashboards",
    style: {
      fontSize: 14,
    },
  },

  // ...
];

export const chartSteps = [
  {
    selector: ".chart-1",
    content: "Chart",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-2",
    content: "Chart name",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-3",
    content: "Save chart",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-4",
    content: "Full screen",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-5",
    content: "Refresh data and reset filters",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-6",
    content: "Filters - Dropdown, Input, Range filters",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-7",
    content: "Export CSV, Add to dashboard, Reset measure and dimension",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".chart-8",
    content: "Data controls, Chart types, Styles.",
    style: {
      fontSize: 14,
    },
  },

  // ...
];
export const querySteps = [
  {
    selector: ".query-1",
    content: "Query name",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".query-2",
    content: "Data source",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".query-3",
    content: "Columns of data source",
  },
  {
    selector: ".query-4",
    content: "SQL query",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".query-5",
    content: "Editor theme",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".query-6",
    content: "Execute query",
    style: {
      fontSize: 14,
    },
  },
  {
    selector: ".query-7",
    content: "Return to datasources",
    style: {
      fontSize: 14,
    },
  },
];

export const outliers = [
  {
    value: "detecting_outliers_by_zscore",
    name: "detecting_outliers_by_zscore",
    label: "By Z-Score",
  },
  { value: "detecting_outliers_by_ior", name: "detecting_outliers_by_ior", label: "By IOR" },
  {
    value: "detecting_outliers_by_local_outlier_factor",
    name: "detecting_outliers_by_local_outlier_factor",
    label: "By Local Factor",
  },
  {
    value: "detecting_outliers_by_isolation_forest",
    name: "detecting_outliers_by_isolation_forest",
    label: "By Isolation Forest",
  },
  {
    value: "detecting_outliers_by_elliptic_envelope",
    name: "detecting_outliers_by_elliptic_envelope",
    label: "By Elliptic Envelope",
  },
];

export const worldCountries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua &amp; Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia &amp; Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cruise Ship",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyz Republic",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre &amp; Miquelon",
  "Samoa",
  "San Marino",
  "Satellite",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "St Kitts &amp; Nevis",
  "St Lucia",
  "St Vincent",
  "St. Lucia",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad &amp; Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks &amp; Caicos",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
export const sampleDatasets = [
  {
    name: "Diabetics data",
    bestsuits: "Classification Model",
    type: "CSV",
    owner: "Dflux Team",
    url: "https://d-flux.s3.amazonaws.com/assets/diabetics_class.csv",
  },
  {
    name: "House valuation data",
    bestsuits: "Regression Model",
    type: "CSV",
    owner: "Dflux Team",
    url: "https://d-flux.s3.amazonaws.com/assets/housing_reg.csv",
  },
  {
    name: "Electricity consumption",
    bestsuits: "Time Series Model",
    type: "CSV",
    owner: "Dflux Team",
    url: "https://d-flux.s3.amazonaws.com/assets/time_electric.csv",
  },
];
export const pageName = (pathname: any) => {
  return pathname === "/admin"
    ? "Admin"
    : pathname === "/contactsales"
    ? "Contact Sales"
    : pathname === "/forgotpassword"
    ? "Forgot Password"
    : pathname.startsWith("/password_reset")
    ? "Reset Password"
    : pathname.startsWith("/profile")
    ? "Profile"
    : pathname.startsWith("/sampledatasets")
    ? "Sample Datasets"
    : pathname.startsWith("/project/invitation/[token]")
    ? "Project Invitation"
    : pathname.includes("/projects/[project_id]/chart")
    ? "Project Charts"
    : pathname.includes("/projects/[project_id]/members")
    ? "Project Members"
    : pathname.includes("/projects/[project_id]/dashboards/[dashboard_id]")
    ? "Project Dashboard"
    : pathname.includes("/projects/[project_id]/dashboards/create")
    ? "Project Create Dashboard"
    : pathname.includes("/projects/[project_id]/dashboards")
    ? "Project Dashboards"
    : pathname.includes("/projects/[project_id]/datasources")
    ? "Project DataSources"
    : pathname.includes("/projects/[project_id]/modelling/[query_id]/prediction/[model_id]")
    ? "Project Prediction Modelling"
    : pathname.includes("/projects/[project_id]/modelling/[query_id]/view/[model_id]")
    ? "Project View Modelling"
    : pathname.includes("/projects/[project_id]/modelling/[query_id]")
    ? "Project Modelling"
    : pathname.includes("/projects/[project_id]/models")
    ? "Project Models"
    : pathname.includes("/projects/[project_id]/notebook")
    ? "Project NoteBook"
    : pathname.includes("/projects/[project_id]/queries")
    ? "Project Queries"
    : pathname.includes("/projects/[project_id]/triggers")
    ? "Project Triggers"
    : pathname.includes("/projects/[project_id]/visualization")
    ? "Project Visualization"
    : pathname.includes("/projects")
    ? "Projects"
    : pathname.startsWith("/shared/chart/[chart_id]")
    ? "Shared Chart"
    : pathname.startsWith("/shared/charts/[token]")
    ? "Shared Charts"
    : pathname.startsWith("/shared/dashboard/[dashboard_id]")
    ? "Shared Dashboards"
    : pathname.startsWith("/signup/verify/[token]")
    ? "Verify Signup"
    : pathname === "/supportrequest"
    ? "Support Request"
    : "Default";
};
export const disableLabel = [
  "table",
  "treeMap",
  "histogram",
  "waffle",
  "map",
  "heatMap",
  "packedBubble",
  "boxPlot",
  "paretoChart",
  "waterfallChart",
  "sankey",
  "bump",
];
export const disableLAxis = [
  "table",
  "pie",
  "doughnut",
  "polarArea",
  "radar",
  "treeMap",
  "waffle",
  "packedBubble",
  "map",
  "sankey",
];
export const disableGrids = [
  "table",
  "pie",
  "doughnut",
  "polarArea",
  "radar",
  "treeMap",
  "waffle",
  "packedBubble",
  "boxPlot",
  "histogram",
  "map",
  "heatMap",
  "packedBubble",
  "boxplot",
  "paretoChart",
  "waterfallChart",
  "sankey",
  "bump",
];
// check for unsaved changes
export const renderPage = (
  router: any,
  path: any,
  project_id: any,
  setNewState: any,
  project: any
) => {
  let openModal = false;
  const newPath = project
    ? path[0] === "/projects"
      ? "/projects"
      : `/projects/${project_id}${path[0]}`
    : path[0];
  const openModalFor = [
    "/projects/[project_id]/queries/[connection_id]",
    "/projects/[project_id]/visualization/[type]/[id]",
    "/projects/[project_id]/dashboards/[dashboard_id]",
    "/projects/[project_id]/dashboards/create",
    "/projects/[project_id]/modelling/[query_id]",
  ];
  openModalFor.map((ele: any) => {
    if (router.pathname.startsWith(ele)) openModal = true;
  });
  const save = document.getElementById("save-btn") as HTMLButtonElement;
  if (openModal && save && save.dataset.update === "true") setNewState(newPath);
  else router.push(newPath);
  // router.push(newPath);
};
export const checkRole = (userRole: any, route: any) => {
  if (userRole?.user_role === "Owner") return true;
  switch (route) {
    case "data_sources":
      return userRole?.user_module_access[0]["Data sources"] === "WRITE";
    case "queries":
      return userRole?.user_module_access[1]["Queries"] === "WRITE";
    case "notebook":
      return userRole?.user_module_access[2]["Notebook"] === "WRITE";
    case "models":
      return userRole?.user_module_access[3]["Models"] === "WRITE";
    case "charts":
      return userRole?.user_module_access[4]["Charts"] === "WRITE";
    case "triggers":
      return userRole?.user_module_access[5]["Triggers"] === "WRITE";
    case "dashboards":
      return userRole?.user_module_access[6]["Dashboards"] === "WRITE";
    case "members":
      return userRole?.user_module_access[7]["Members"] === "WRITE";
    default:
      return userRole?.user_role === "Owner";
  }
};
