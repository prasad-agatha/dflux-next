// react
import React, { FC } from "react";
// next-link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// react bootstrap
import {
  Container,
  Form,
  Image,
  Card,
  Dropdown,
  Accordion,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
// react button loader
import Button from "react-bootstrap-button-loader";
// next seo
import { NextSeo } from "next-seo";
// react chart js
import { Line } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
// moment
import Moment from "moment";
// react-select
import Select from "react-select";
// react-toastify
import { toast } from "react-toastify";
// icons
import { ChevronDown } from "@styled-icons/bootstrap/ChevronDown";
// import { CaretBack } from "@styled-icons/ionicons-sharp/CaretBack";
import { TableView } from "@styled-icons/material/TableView";
// import { Edit } from "@styled-icons/boxicons-solid/Edit";
// components
import { PageLoading } from "components/loaders";
import { QueryResults, ModellingAnalysis } from "components/data-tables";
import {
  preProcessingTips,
  modellingTips,
  tableStyles,
  getTitle,
  crossValidationTechniques,
  getAlgorithm,
  algorithms,
  classificationAlgorithmTips,
  regressionAlgorithmTips,
  cvTechniqueTips,
} from "constants/common";
// services
import { QueryService, MLService, ModelService } from "services";
// import { FastField } from "formik";
import { NewModelPickle } from "components/modals";
import _ from "lodash";
import ClassificationModelling from "@components/modelling/ClassificationModelling";
import ModelSelection from "@components/modelling/ModelSelection";
//toast configuration
toast.configure();

const queryService = new QueryService();
const model = new ModelService();
const mlService = new MLService();

const Modelling: FC = () => {
  const router = useRouter();
  const { query_id, project_id, name } = router.query;
  if (!query_id) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }

  React.useEffect(() => {
    if (query_id) {
      getQuery();
    }
  }, [query_id]);

  const [queryDetails, setQueryDetails] = React.useState({
    name: "",
    data: [] as any,
    list: [] as any,
    mlData: [] as any,
  });

  const [loading, setLoading] = React.useState(false);

  const [options, setOptions] = React.useState([] as any);

  const [targetVariable, setTargetVariable] = React.useState<any>("");

  const [date, setDate] = React.useState<any>("");

  const [step, setStep] = React.useState("Pre Processing");

  const [crossValidation, setCrossValidation] = React.useState<any>("model");

  const [cVTechnique, setCVTechnique] = React.useState(crossValidationTechniques[0]);

  const [gcv, setGcv] = React.useState(false);

  const [cvParams, setCvParams] = React.useState<any>({});

  const [hyperParams, setHyperParams] = React.useState<any>({});

  const [render, setRender] = React.useState(false);

  const [preProcessingTypes, setPreProcessingTypes] = React.useState([
    "auto_imputer",
    "labelencoding",
    "onehotencoding",
    "remove_correlated_columns",
    "standard_scale",
  ] as any);

  const [minMaxTarget, setMinMaxTarget] = React.useState("") as any;

  const [preProcessingData, setPreProcessingData] = React.useState({
    list: [] as any,
    data: [] as any,
    output: [] as any,
    scalar_url: "" as any,
    data1: [] as any,
    label: [] as any,
  });

  const [regressionTypes, setRegressionTypes] = React.useState([] as any);

  const [modelsOutput, setModelsOutput] = React.useState([] as any);

  const [timeseriesoutput, setTimeSeriesOutput] = React.useState([] as any);
  const [metadataid, setMetaDataId] = React.useState() as any;
  // const [pickelurl, setPickelURL] = React.useState() as any;

  const [modelling, setModelling] = React.useState("Classification");
  const [modelling1, setModelling1] = React.useState("classification");

  const [idx, setIdx] = React.useState(false);
  const [skipProcess, setSkipProcess] = React.useState(false);

  const [threshold, setThreshold] = React.useState(0.9);

  const [classificationData, setClassificationData] = React.useState({
    list: [] as any,
    data: [] as any,
    output: [] as any,
  });

  const [visualize, setVisualize] = React.useState(false);
  const [visualId, setVisualId] = React.useState(0);
  const [regressionOutput, setRegressionOutput] = React.useState([] as any);
  const [classificationTable, setClassificationTable] = React.useState(false);

  const [analysis, setAnalysis] = React.useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    support: 0,
    f1score: 0,
    algorithm: "",
    list: [] as any,
    data: [] as any,
    pickleurl: "",
  });
  const [modelName, setModelName] = React.useState(name);
  const [editModelName, setEditModelName] = React.useState(false);

  const [confusionMatrix, setConfusionMatrix] = React.useState({
    matrix: [] as any,
    heads: [] as any,
    data: [] as any,
  });
  const [classes, setClasses] = React.useState([] as any);

  const [resultsTable, setResultsTable] = React.useState({
    list: [] as any,
    data: [] as any,
    results: [] as any,
    labels: [] as any,
    fp: {} as any,
    tp: {} as any,
  });
  const [selectedClass, setSelectedClass] = React.useState("") as any;
  const [fp, setFP] = React.useState([] as any);
  const [tp, setTP] = React.useState([] as any);
  const [auc, setAuc] = React.useState([] as any);
  // const [select1, setSelect1] = React.useState(true);
  // const [select2, setSelect2] = React.useState(true);
  // const [selectlabel, setSelectLabel] = React.useState(true);

  const [datatypecorrection, setDataTypeCorrection] = React.useState(false);
  const [autoremove, setAutoRemove] = React.useState(false);
  // const [onehot, setoneHot] = React.useState(false);
  // const [labelencoding, setLabelEncoding] = React.useState(false);

  // const [scale3, setScale3] = React.useState(false);

  const getQuery = () => {
    queryService
      .getQueryDetails(query_id)
      .then((response: any) => {
        const list: any = [];
        const arr = response.extra.data?.length > 0 ? Object.keys(response.extra.data[0]) : null;
        arr?.map((item) => {
          return list.push({
            field: item,
          });
        });
        const data1 = mlService.loadDBData({
          connection_id: response.connection,
          sql_query: response.raw_sql,
        });
        setQueryDetails({
          ...queryDetails,
          name: response.name,
          data: response.extra.data,
          list: list,
          mlData: data1,
        });

        setOptions(
          Object.keys(response?.extra.data[0]).map((item: any, index: any) => {
            return {
              field: item,
              label: item,
              value: item,
              key: index,
            };
          })
        );
      })
      .catch((error: any) => {
        toast.error(error.detail);
        toast.error(error);
      });
  };
  // pre-processing for classification
  const preProcessing = () => {
    // const tempArry = [
    //   { name: "data_type_correction", value: 1 },
    //   { name: "auto_remove_unwanted_columns", value: 2 },
    //   { name: "remove_correlated_columns", value: 3 },
    //   { name: "onehotencoding", value: 4 },
    //   { name: "labelencoding", value: 5 },
    //   { name: "standard_scale", value: 6 },
    //   { name: "min_max_scale", value: 7 },
    // ];

    // const tmpArry: any = [];

    // tempArry.map((ele: any) => {
    //   if (preProcessingTypes.includes(ele.name)) {
    //     tmpArry.push(ele);
    //   }
    // });

    // tmpArry.sort((a: any, b: any) => {
    //   return a.value - b.value;
    // });

    // setLoading(true);
    mlService
      .preProcessing({
        preprocessing: preProcessingTypes,
        data: queryDetails.data,
        target_variable: minMaxTarget,
        // standard_target_variable: minMaxTarget,
        // minimax_scale_target_variable: minMaxTarget,
        threshold: threshold,
      })
      .then((response) => {
        // setLoading(false);
        // setStep("Select Model");
        // document.getElementById("test_scroll")?.scrollIntoView();

        const tempObj = response.data;
        const tempString = response.scaler_url;
        const tempLable = response.label_encoder;

        setPreProcessingData({
          ...preProcessingData,
          data1: tempObj,
          scalar_url: tempString,
          label: tempLable,
        });

        classification(response.data, response.label_encoder);

        const list: any = [];
        const arr = Object.entries(response.data);
        arr?.map((item) => {
          return list.push({
            field: item,
          });
        });
        const arr1: any = [];
        const keys = Object.keys(response.data);
        response[keys[0]].map((item: any, index: any) => {
          const obj: any = {};
          keys.map((row) => {
            obj[row] = response[row][index];
          });
          arr1.push(obj);
        });
        setPreProcessingData({
          ...preProcessingData,
          data: arr1,
          list: list,
          output: response.data,
        });
      })
      .catch((error) => {
        // setLoading(false);
        toast.error(error.msg);
      });
  };
  // pre-processing for regression
  const regressionPreProcessing = () => {
    const b = preProcessingTypes.filter((a1: any) => a1 !== "labelencoding");
    setPreProcessingTypes(b);
    // setLoading(true);
    mlService
      .preProcessing({
        preprocessing: b,
        data: queryDetails.data,
        target_variable: minMaxTarget,
        // standard_target_variable: minMaxTarget,
        // minimax_scale_target_variable: minMaxTarget,
        threshold: threshold,
      })
      .then((response) => {
        // setLoading(false);
        // setStep("Select Model");
        // document.getElementById("test_scroll")?.scrollIntoView();

        const tempObj = response.data;
        const tempString = response.scaler_url;
        const tempLable = response.label_encoder;

        setPreProcessingData({
          ...preProcessingData,
          data1: tempObj,
          scalar_url: tempString,
          label: tempLable,
        });

        regression(response.data, response.label_encoder);

        // setLoading(false);

        const list: any = [];
        const arr = Object.entries(response.data);
        arr?.map((item) => {
          return list.push({
            field: item,
          });
        });
        const arr1: any = [];
        const keys = Object.keys(response.data);
        response[keys[0]].map((item: any, index: any) => {
          const obj: any = {};
          keys.map((row) => {
            obj[row] = response[row][index];
          });
          arr1.push(obj);
        });
        setPreProcessingData({
          ...preProcessingData,
          data: arr1,
          list: list,
          output: response.data,
        });
      })

      .catch((error) => {
        // setLoading(false);
        toast.error(error.msg);
      });
  };
  // executing time series model
  const timeSeries = () => {
    // if (typeof queryDetails.data[0][targetVariable] === "number") {
    setLoading(true);
    mlService
      .timeseries({
        // modelling: regressionTypes,
        data: queryDetails.data,
        target_column: targetVariable,
        date_column: date,
        seasonality: true,
        meta_data: {
          modeling_type: modelling1,
          query: query_id,
          name: modelName,
        },
      })
      .then((response) => {
        setLoading(false);
        setMetaDataId(response.meta_data.id);
        setTimeSeriesOutput(response);
        setStep("Execute Model");
      })
      .catch((error: any) => {
        toast.error(error.msg);
        setLoading(false);
      });
    // } else {
    //   toast.error(`Target variable should be of type integer`);
    // }
  };
  const getHyperParams = () => {
    const tempParams: any = {};
    Object.entries(hyperParams).map(([k, v]: any) => {
      const { cv, cross_validation, cv_params, gcv, gcv_params } = v;
      const tempObj: any = {};
      Object.entries(gcv_params).map(([ky, vl]: any) => {
        if (vl.length > 0) tempObj[ky] = vl;
      });
      tempParams[k] = {
        cv,
        cross_validation: cross_validation === "none" ? false : cross_validation,
        cv_params,
        gcv,
        gcv_params: tempObj,
      };
    });

    return tempParams;
  };

  // executing regression model
  const regression = (data: any, label: any) => {
    // if (typeof queryDetails.data[0][targetVariable] === "number") {
    setLoading(true);
    mlService
      .classification({
        modelling: regressionTypes,
        data: data,
        target_variable: minMaxTarget,
        modeling_type: modelling1,
        hyper_params: getHyperParams(),
        meta_data: {
          modeling_type: modelling1,
          algorithms: regressionTypes,
          target_variable: minMaxTarget,
          query: query_id,
          name: modelName,
          skipped: skipProcess,
          pre_processing: {
            data_type_correction: datatypecorrection,
            auto_remove_unwanted_columns: autoremove,
            remove_correlated_columns: true,
            threshold_value: threshold,
            onehotencoding: true,
            // labelencoding: true,
            standard_scale: preProcessingTypes.includes("standard_scale"),
            standard_scale_target_variable: minMaxTarget,
            min_max_scale: preProcessingTypes.includes("min_max_scale"),
            min_max_scale_target_variable: minMaxTarget,
            label_encoder: label,
          },
        },
      })
      .then((response) => {
        setMetaDataId(response.meta_data.id);
        setStep("Execute Model");
        setRegressionOutput(response.output);
        setLoading(false);

        // const arr = Object.keys(response);
        // const rmse: any = [];
        // arr.map((item: any) => {
        //   const a = response[item];
        //   rmse.push({ rmse: a[0].toFixed(2), model: item, output: a[1] });
        // });
        // setRegressionOutput(rmse);
        // console.log(rmse);
      })
      .catch((error: any) => {
        toast.error(error.msg);
        setLoading(false);
      });
    // } else {
    //   toast.error(`Target variable should be of type integer`);
    // }
  };
  // executing classification model
  const classification = (data: any, label: any) => {
    // if (typeof queryDetails.data[0][targetVariable] === "string") {
    setLoading(true);
    mlService
      .classification({
        modelling: regressionTypes,
        data: data,
        target_variable: minMaxTarget,
        modeling_type: modelling1,
        hyper_params: getHyperParams(),
        meta_data: {
          modeling_type: modelling1,
          algorithms: regressionTypes,
          target_variable: minMaxTarget,
          query: query_id,
          name: modelName,
          skipped: skipProcess,
          pre_processing: {
            data_type_correction: datatypecorrection,
            auto_remove_unwanted_columns: autoremove,
            remove_correlated_columns: true,
            threshold_value: threshold,
            onehotencoding: true,
            labelencoding: true,
            standard_scale: preProcessingTypes.includes("standard_scale"),
            standard_scale_target_variable: minMaxTarget,
            min_max_scale: preProcessingTypes.includes("min_max_scale"),
            min_max_scale_target_variable: minMaxTarget,
            label_encoder: label,
          },
        },
      })
      .then((response) => {
        setStep("Execute Model");
        setMetaDataId(response.meta_data.id);
        setModelsOutput(response.output);
        setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        toast.error(error.msg);
      });
    // } else {
    //   toast.error(`Target variable should be of type string`);
    // }
  };
  // skip pre-processing for regression models
  const skipProcessRegression = () => {
    // if (typeof queryDetails.data[0][targetVariable] === "number") {
    setLoading(true);
    mlService
      .classification({
        modelling: regressionTypes,
        data: queryDetails.data,
        target_variable: targetVariable,
        modeling_type: modelling1,
        hyper_params: getHyperParams(),
        meta_data: {
          modeling_type: modelling1,
          algorithms: regressionTypes,
          target_variable: targetVariable,
          query: query_id,
          name: modelName,
          skipped: skipProcess,
          pre_processing: {
            data_type_correction: datatypecorrection,
            auto_remove_unwanted_columns: autoremove,
            remove_correlated_columns: true,
            threshold_value: threshold,
            onehotencoding: false,
            // labelencoding: true,
            standard_scale: preProcessingTypes.includes("standard_scale"),
            standard_scale_target_variable: targetVariable,
            min_max_scale: preProcessingTypes.includes("min_max_scale"),
            min_max_scale_target_variable: targetVariable,
            label_encoder: null,
          },
        },
      })
      .then((response) => {
        setLoading(false);
        setMetaDataId(response.meta_data.id);
        setStep("Execute Model");
        setRegressionOutput(response.output);
        // const arr = Object.keys(response);
        // const rmse: any = [];
        // arr.map((item: any) => {
        //   const a = response[item];
        //   rmse.push({ rmse: a[0].toFixed(2), model: item, output: a[1] });
        // });
        // setRegressionOutput(rmse);
        // console.log(rmse);
      })
      .catch((error: any) => {
        toast.error(error.msg);
        setLoading(false);
      });
    // } else {
    //   toast.error(`Target variable should be of type integer`);
    // }
  };
  // skip pre-processing for classification models
  const skipProcessClassification = () => {
    // if (typeof queryDetails.data[0][targetVariable] === "string") {
    setLoading(true);
    mlService
      .classification({
        modelling: regressionTypes,
        data: queryDetails.data,
        target_variable: targetVariable,
        modeling_type: modelling1,
        hyper_params: getHyperParams(),
        meta_data: {
          modeling_type: modelling1,
          algorithms: regressionTypes,
          target_variable: targetVariable,
          query: query_id,
          name: modelName,
          skipped: skipProcess,
          pre_processing: {
            data_type_correction: datatypecorrection,
            auto_remove_unwanted_columns: autoremove,
            remove_correlated_columns: true,
            threshold_value: threshold,
            onehotencoding: false,
            labelencoding: false,
            standard_scale: preProcessingTypes.includes("standard_scale"),
            standard_scale_target_variable: targetVariable,
            min_max_scale: preProcessingTypes.includes("min_max_scale"),
            min_max_scale_target_variable: targetVariable,
            label_encoder: null,
          },
        },
      })
      .then((response) => {
        setLoading(false);
        setStep("Execute Model");
        setMetaDataId(response.meta_data.id);
        setModelsOutput(response.output);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.msg);
      });
    // } else {
    //   toast.error(`Target variable should be of type string`);
    // }
  };

  const regressionColumns = [
    {
      // query name
      name: "Model Name",
      width: "50%",
      sortable: true,
      center: false,
      selector: "name",
      style: { cursor: "auto" },
      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-engine">
                  {row.algorithm_name.substring(0, 1).toUpperCase() +
                    row.algorithm_name.substring(1)}
                </Tooltip>
              }
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.algorithm_name.substring(0, 1).toUpperCase() +
                  row.algorithm_name.substring(1).replace(/_/g, " ")}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      // query name
      name: "RMSE Score",
      width: "35%",
      sortable: true,
      center: false,
      selector: "rmse_score",
      style: { cursor: "auto" },
    },
    {
      // query name
      name: "Options",
      width: "15%",
      sortable: true,
      center: false,
      cell: (response: any) => {
        return (
          <Button
            variant="outline-primary"
            data-update={true}
            id="save-btn"
            onClick={() => {
              setAnalysis({
                ...analysis,
                precision: response.rmse_score,
                algorithm: response.algorithm_name,
                pickleurl: response.pickleURL,
              });

              const results: any = [];
              const results1 = Object.keys(response.result);
              results1?.map((item) => {
                return results.push({
                  field: item,
                });
              });
              const arrResults: any = [];
              const keysResults = Object.keys(response.result);
              response.result[keysResults[0]].map((item: any, index: any) => {
                const obj: any = {};
                keysResults.map((row) => {
                  obj[row] = response.result[row][index];
                });
                arrResults.push(obj);
              });
              setResultsTable({
                ...resultsTable,
                data: arrResults,
                list: results,
                results: response.result,
                labels: response.labels,
                fp: response.fp,
                tp: response.tp,
              });

              setStep("Model Analysis");
            }}
          >
            View details
          </Button>
        );
      },
    },
  ];

  const timeSeriesColumns = [
    {
      // query name
      name: "Model Name",
      width: "50%",
      sortable: true,
      center: false,
      selector: "name",
      style: { cursor: "auto" },
    },
    {
      // query name
      name: "RMSE Score",
      width: "35%",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "rmse_score",
    },
    {
      // query name
      name: "Options",
      width: "15%",
      sortable: true,
      center: false,
      cell: (response: any) => {
        return (
          <Button
            variant="outline-primary"
            data-update={true}
            id="save-btn"
            onClick={() => {
              setAnalysis({
                ...analysis,
                precision: response.rmse_score,
                // modelname: response.name,
                pickleurl: response.pickleURL,
              });

              const results: any = [];
              const results1 = Object.keys(response.result);
              results1?.map((item) => {
                return results.push({
                  field: item,
                });
              });
              const arrResults: any = [];
              const keysResults = Object.keys(response.result);
              response.result[keysResults[0]].map((item: any, index: any) => {
                const obj: any = {};
                keysResults.map((row) => {
                  obj[row] = response.result[row][index];
                });
                arrResults.push(obj);
              });
              setResultsTable({
                ...resultsTable,
                data: arrResults,
                list: results,
                results: response.result,
                labels: response.labels,
                fp: response.fp,
                tp: response.tp,
              });

              setStep("Model Analysis");
            }}
          >
            View details
          </Button>
        );
      },
    },
  ];

  // columns data
  const columns = [
    {
      // query name
      name: "Algorithm name",
      sortable: true,
      center: false,
      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-engine">{getAlgorithm(row.algorithm_name)}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {getAlgorithm(row.algorithm_name)}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
      selector: "name",
      style: { cursor: "auto" },
    },

    {
      // project name
      name: "Error messages",
      sortable: true,
      center: false,
      selector: "error",
      style: { cursor: "auto" },
      cell: (response: any) => {
        return (
          <OverlayTrigger
            placement="auto-start"
            overlay={<Tooltip id="tooltip-engine">{response.error}</Tooltip>}
          >
            <div
              className="mini-heading-1 overflow-hidden overflow-whitespace"
              // style={{ width: 230 }}
            >
              {response.error}
            </div>
          </OverlayTrigger>
        );
      },
    },
    {
      // project name
      name: "Accuracy",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "accuracy",
    },
    {
      // connection name
      name: "Precision",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "precision",
    },
    {
      // connection name
      name: "Recall",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "recall",
    },
    {
      // connection name
      name: "Support",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "support",
    },
    {
      // connection name
      name: "F1-Score",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "f1_score",
    },
    {
      name: "Report",
      sortable: true,
      center: false,
      style: { padding: 0, cursor: "auto" },
      selector: "classification_report_result_reset_index",
      cell: (response: any) => {
        return (
          <TableView
            onClick={() => {
              if (response.model_status === "Failed") {
                toast.error("Model Training Failed");
              } else {
                const list: any = [];
                const arr = Object.keys(response.classification_report_result_reset_index);
                arr?.map((item) => {
                  return list.push({
                    field: item,
                  });
                });
                const arr1: any = [];
                const keys = Object.keys(response.classification_report_result_reset_index);
                response.classification_report_result_reset_index[keys[0]].map(
                  (item: any, index: any) => {
                    const obj: any = {};
                    keys.map((row) => {
                      obj[row] = response.classification_report_result_reset_index[row][index];
                    });
                    arr1.push(obj);
                  }
                );
                setClassificationData({
                  ...preProcessingData,
                  data: arr1,
                  list: list,
                });
                setClassificationTable(!classificationTable);
              }
            }}
            width={24}
            height={24}
            className="cursor-pointer"
          />
        );
      },
    },
    {
      // option - menu
      name: "Options",
      center: true,
      width: "16%",
      selector: "f1_score",
      style: { cursor: "auto" },
      cell: (response: any) => {
        return (
          <Button
            disabled={response.status === "Failed"}
            variant="outline-primary"
            style={{ width: 150 }}
            data-update={true}
            id="save-btn"
            onClick={() => {
              const list: any = [];
              const arr = Object.keys(response.classification_report_result_reset_index);
              arr?.map((item) => {
                return list.push({
                  field: item,
                });
              });
              const arr1: any = [];
              const keys = Object.keys(response.classification_report_result_reset_index);
              response.classification_report_result_reset_index[keys[0]].map(
                (item: any, index: any) => {
                  const obj: any = {};
                  keys.map((row) => {
                    obj[row] = response.classification_report_result_reset_index[row][index];
                  });
                  arr1.push(obj);
                }
              );
              setClassificationData({
                ...preProcessingData,
                data: arr1,
                list: list,
              });
              setAnalysis({
                ...analysis,
                precision: response.precision,
                accuracy: response.accuracy,
                support: response.support,
                recall: response.recall,
                data: arr1,
                f1score: response.f1_score,
                algorithm: response.name,
                pickleurl: response.pickleURL,
              });
              const list1: any = [];
              list1.push({ field: "X" });
              response.labels?.map((item: any) => {
                return list1.push({
                  field: item,
                });
              });
              const a: any = [];
              response.confusion_matrix_result.map((item: any, index1: any) => {
                const x: any = { X: response.labels[index1] };

                x["X"] = response.labels[index1];
                item.map((item1: any, index: any) => {
                  x[response.labels[index]] = item1;
                });
                a.push(x);
              });
              setConfusionMatrix({
                ...confusionMatrix,
                matrix: response.confusion_matrix_result,
                heads: list1,
                data: a,
              });

              const list3: any = [];
              const arr3 = Object.keys(response.classification_report_result_reset_index);
              arr3?.map((item) => {
                return list3.push({
                  field: item,
                });
              });
              const arr4: any = [];
              const keys3 = Object.keys(response.classification_report_result_reset_index);
              response.classification_report_result_reset_index[keys[0]].map(
                (item: any, index: any) => {
                  const obj: any = {};
                  keys3.map((row) => {
                    obj[row] = response.classification_report_result_reset_index[row][index];
                  });
                  arr4.push(obj);
                }
              );
              setClassificationData({
                ...preProcessingData,
                data: arr1,
                list: list,
              });

              // classes

              const labels: any = response.labels?.map((item: any, index: any) => {
                return { field: item, label: item, value: item, key: index };
              });
              setClasses(labels);
              setSelectedClass(response.labels[0]);
              const x: any = response.labels[0];
              setTP(response.tp[x]);
              setFP(response.fp[x]);

              // results table
              const results: any = [];
              const results1 = Object.keys(response.result);
              results1?.map((item) => {
                return results.push({
                  field: item,
                });
              });
              const arrResults: any = [];
              const keysResults = Object.keys(response.result);
              response.result[keysResults[0]].map((item: any, index: any) => {
                const obj: any = {};
                keysResults.map((row) => {
                  obj[row] = response.result[row][index];
                });
                arrResults.push(obj);
              });
              setResultsTable({
                ...resultsTable,
                data: arrResults,
                list: results,
                results: response.result,
                labels: response.labels,
                fp: response.fp,
                tp: response.tp,
              });
              setAuc(response.auc);
              setStep("Model Analysis");
            }}
          >
            View details
          </Button>
        );
      },
    },
  ];
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });
  const [saved, setSaved] = React.useState(false);
  const chartValues = tp.map((item: any) => {
    return item.toFixed(2);
  });
  const data = {
    labels: fp,
    datasets: [
      {
        label: selectedClass,
        data: chartValues,
        fill: false,
        backgroundColor: "#FF5E04",
        borderColor: "#FF5E04",
      },
    ],
  };

  const modelAnalysisData: any = [];
  Object.entries(modelsOutput).map(([k, item]: any) => {
    modelAnalysisData.push({
      algorithm_name: k,
      name: item.input_modelling_method,
      pickleURL: item.pickle_url,
      accuracy: item.accuracy_score.toFixed(2),
      precision: item.classification_report_result_mean.precision.toFixed(2),
      recall: item.classification_report_result_mean.recall.toFixed(2),
      f1_score: item.classification_report_result_mean["f1-score"].toFixed(2),
      support: item.classification_report_result_mean.support.toFixed(2),
      datetime: Moment(item.datetime).format("MMM Do YYYY"),
      status: item.model_status,
      error: item.error_msg,
      classification_report_result_reset_index: item.classification_report_result_reset_index,
      labels: item.labels_order,
      confusion_matrix_result: item.confusion_matrix_result,
      fp: item.false_positive_rate,
      tp: item.true_positive_rate,
      result: {
        actual_output: item.X_test ? item.X_test["actual_output"] : [],
        predicted_output: item.X_test ? item.X_test["predicted_output"] : [],
      },
      auc: item.auc_score,
    });
  });

  const modelAnalysisData2: any = [];

  modelAnalysisData2.push({
    name: timeseriesoutput?.meta_data?.modeling_type,
    pickleURL: timeseriesoutput.pickle_url,
    rmse_score: timeseriesoutput?.rmse_score?.toFixed(2),

    result: {
      actual_output: timeseriesoutput?.forecast ? timeseriesoutput?.forecast["Actual_data"] : [],
      predicted_output: timeseriesoutput?.forecast ? timeseriesoutput?.forecast["Prediction"] : [],
    },
  });

  const modelAnalysisData1: any = [];
  Object.entries(regressionOutput).map(([k, item]: any) => {
    modelAnalysisData1.push({
      algorithm_name: k,
      name: item.input_modelling_method,
      pickleURL: item.pickle_url,
      rmse_score: item.rmse_score.toFixed(2),

      result: {
        actual_output: item.x_test ? item.x_test["actual_output"] : [],
        predicted_output: item.x_test ? item.x_test["predicted_output"] : [],
      },
    });
  });
  const checkErrors = () => {
    const tempParams = hyperParams;
    let txt = "";
    Object.entries(hyperParams).map(([k, v]: any) => {
      Object.entries(v.gcv_validations).map(([ky, vl]: any) => {
        const alg = _.filter(algorithms, (ele: any) => ele.input === k);
        const param: any = _.filter(alg[0].params, (ele: any) => ele.name === ky);
        if (gcv || param[0]?.cv) {
          if (!vl) tempParams[k]["gcv_validations"][ky] = false;

          if (["support_vector_classifier", "support_vector_machine_regressor"].includes(k)) {
            if (ky === "degree" && !tempParams[k]["gcv_params"]["kernel"].includes("poly"))
              tempParams[k]["gcv_validations"][ky] = null;
            else if (ky === "gamma" && !tempParams[k]["gcv_params"]["kernel"].includes("rbf"))
              tempParams[k]["gcv_validations"][ky] = null;
          }

          if (!txt && tempParams[k]["gcv_validations"][ky] === false)
            txt = `Please enter key values for ${getAlgorithm(k)}`;
        }
      });
    });

    setHyperParams(tempParams);
    setRender(!render);
    return txt;
  };
  const runModel = () => {
    if (regressionTypes.length === 0) {
      toast.error("Please select an algorithm to proceed");
    } else if (skipProcess === true && targetVariable.length === 0) {
      toast.error("Select target variable");
    } else if (modelName === "" || modelName === "Untitled Model") {
      toast.error("Please enter a model name");
    } else if (skipProcess === true && modelling === "Regression") {
      const txt = checkErrors();
      if (txt) toast.error(txt);
      else skipProcessRegression();
    } else if (skipProcess === true && modelling === "Classification") {
      const txt = checkErrors();
      if (txt) toast.error(txt);
      else skipProcessClassification();
    } else if (modelling === "Regression") {
      const txt = checkErrors();
      if (txt) toast.error(txt);
      else regressionPreProcessing();
    } else if (modelling === "Timeseries") {
      timeSeries();
    } else {
      const txt = checkErrors();
      if (txt) toast.error(txt);
      else preProcessing();
    }
  };
  // save model
  const saveModel = async () => {
    setLoading(true);
    if (modelName === "" || modelName === "Untitled Model") {
      alert("Please enter a model name");
    } else if (modelling === "Timeseries") {
      model
        .saveModel(project_id, {
          name: modelName,
          model_type: modelling1,
          data: resultsTable.data,
          meta_data: metadataid,
          pickle_url: analysis.pickleurl,
          // scaler_url: preProcessingData.scalar_url,
          other_params: {
            target_variable: targetVariable,
          },
          extra: {
            modelling: modelling,
            modelName: modelName,
            visualize: visualize,
            visualId: visualId,
            analysis: analysis,
            resultsTable: resultsTable,
            // confusionMatrix1: confusionMatrix.data,
            confusionMatrix: confusionMatrix,
            classificationData: classificationData,
            selectedClass: selectedClass,
            classes: classes,
            auc: auc,
            query_id: query_id,
          },
        })
        .then((response: any) => {
          if (response.msg === "This functions cant be performed") {
            toast.error("Don't have write permission to save the model");
          } else {
            setVisualId(response.id);
            setVisualize(true);
            toast.success("Model Saved");
            setSaved(true);
          }
          setLoading(false);
        });
    } else {
      model
        .saveModel(project_id, {
          name: modelName,
          model_type: analysis.algorithm,
          data: resultsTable.data,
          hyper_params: getHyperParams(),
          meta_data: metadataid,
          pickle_url: analysis.pickleurl,
          scaler_url: preProcessingData.scalar_url,
          other_params: {
            target_variable: minMaxTarget,
            model_type: analysis.algorithm,
          },
          extra: {
            modelling: modelling,
            modelName: modelName,
            visualize: visualize,
            visualId: visualId,
            analysis: analysis,
            resultsTable: resultsTable,
            // confusionMatrix1: confusionMatrix.data,
            confusionMatrix: confusionMatrix,
            classificationData: classificationData,
            selectedClass: selectedClass,
            classes: classes,
            auc: auc,
            query_id: query_id,
          },
        })
        .then((response: any) => {
          if (response.msg === "This functions cant be performed") {
            toast.error("Don't have write permission to save the model");
          } else {
            setVisualId(response.id);
            setVisualize(true);
            toast.success("Model Saved");
            setSaved(true);
          }
          setLoading(false);
        });
    }
  };
  // console.log(gCVParams, regressionTypes);
  // Stepper function with model pre-processing, model analysis and prediction
  // for Classification, Regression and Time series model types
  const currentStep = () => {
    switch (step) {
      case "Pre Processing":
        return (
          <div className="mx-4">
            {/* Accordion with QueryResults Table */}
            <div
              className="p-3 bg-white my-2 border"
              style={{ borderRadius: 12, boxSizing: "border-box", width: "94vw" }}
            >
              <Accordion>
                <Accordion.Toggle className="border-0 bg-white" eventKey="1">
                  <div className="d-flex">
                    <div style={{ fontWeight: 600, color: "#3B3E40" }} className="ls f-18">
                      {queryDetails.name}
                    </div>
                    <div>
                      <ChevronDown width={16} height={16} className="ms-2 mt-2 cursor-pointer" />
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse className="pt-3" eventKey="1">
                  <div className="model-div ">
                    <QueryResults
                      row={5}
                      list={queryDetails.list}
                      query={queryDetails.data}
                      chart={tableStyles}
                    />
                  </div>
                </Accordion.Collapse>
              </Accordion>
            </div>
            <div
              className="d-flex justify-content-between flex-lg-row flex-md-row flex-sm-column"
              style={{ width: "100%" }}
            >
              {/* Pre-Processing Card */}
              <Card className="processing-card">
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between border-bottom mb-4 pb-3">
                    <h6 style={{ fontSize: 18, fontWeight: 600, color: "#3B3E40" }}>
                      Select type of pre-processing
                    </h6>
                    <h6
                      onClick={() => {
                        const a = preProcessingTypes;
                        if (!a.includes("standard_scale")) {
                          a.push("standard_scale");
                          setPreProcessingTypes(a.filter((ele: any) => ele !== "min_max_scale"));
                        }
                        setStep("Select Model");
                        setSkipProcess(true);
                        setPreProcessingData({
                          ...preProcessingData,
                          list: queryDetails.list,
                          data: queryDetails.data,
                          output: queryDetails.data,
                        });
                        setCrossValidation("model");
                      }}
                      className="cursor-pointer"
                      style={{ fontSize: 15, color: "#0076FF", opacity: 0.9 }}
                    >
                      Auto pre-processing
                    </h6>
                  </div>

                  <div className="d-flex mb-0">
                    <Form.Group controlId="formBasicCheckbox" className="my-3">
                      <Form.Check
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            const a = preProcessingTypes;
                            if (!a.includes("data_type_correction")) {
                              a.push("data_type_correction");
                              setPreProcessingTypes(a);
                              setDataTypeCorrection(true);
                            }
                          } else {
                            const b = preProcessingTypes.filter(
                              (a1: any) => a1 !== "data_type_correction"
                            );
                            setPreProcessingTypes(b);
                            setDataTypeCorrection(false);
                          }
                        }}
                        defaultChecked={preProcessingTypes.includes("data_type_correction")}
                        className="me-2"
                        type="checkbox"
                        label="Data type correction"
                        style={{ color: "#3B3E40", textAlign: "start", opacity: 0.9 }}
                      />
                    </Form.Group>
                  </div>
                  <Dropdown.Divider className="mt-0 mb-0" />
                  <div className="d-flex mb-0">
                    <Form.Group controlId="formBasicCheckbox1" className="my-3">
                      <Form.Check
                        className="me-2"
                        type="checkbox"
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            const a = preProcessingTypes;
                            if (!a.includes("auto_remove_unwanted_columns")) {
                              a.push("auto_remove_unwanted_columns");
                              setPreProcessingTypes(a);
                            }
                            setAutoRemove(true);
                          } else {
                            const b = preProcessingTypes.filter(
                              (a1: any) => a1 !== "auto_remove_unwanted_columns"
                            );
                            setPreProcessingTypes(b);
                            setAutoRemove(false);
                          }
                        }}
                        defaultChecked={preProcessingTypes.includes("auto_remove_unwanted_columns")}
                        label="Auto remove unwanted columns"
                        style={{ color: "#3B3E40", textAlign: "start", opacity: 0.9 }}
                      />
                    </Form.Group>
                  </div>

                  <Dropdown.Divider className="mt-0 mb-0" />
                  <div className="d-flex flex-column mb-0">
                    <Form.Group controlId="formBasicCheckbox2" className="my-3 mb-0">
                      <Form.Check
                        className="me-2 "
                        type="checkbox"
                        readOnly
                        // onChange={(e: any) => {
                        // if (e.target.checked) {
                        //   const a = preProcessingTypes;
                        //   if (!a.includes("remove_correlated_columns")) {
                        //     a.push("remove_correlated_columns");
                        //     setPreProcessingTypes(a);
                        //     setRemoveColumns(true);
                        //   }
                        // } else {
                        //   const b = preProcessingTypes.filter(
                        //     (a1: any) => a1 !== "remove_correlated_columns"
                        //   );
                        //   setPreProcessingTypes(b);
                        //   setRemoveColumns(false);
                        // }
                        // }}
                        checked={preProcessingTypes.includes("remove_correlated_columns")}
                        label="Remove correlated columns"
                        style={{ color: "#3B3E40", textAlign: "start", opacity: 0.9 }}
                      />
                    </Form.Group>
                    <Form>
                      <Form.Label
                        className="mt-2"
                        style={{ fontSize: 11, marginLeft: 20, color: "#90A1B5" }}
                      >
                        ENTER THRESHOLD VALUE
                      </Form.Label>
                      <Form.Control
                        className="mt-2"
                        value={threshold}
                        step="0.1"
                        min="0.4"
                        max="0.9"
                        onChange={(e: any) => {
                          const value: any = parseFloat(e.target.value);
                          setThreshold(value);
                        }}
                        type="number"
                        style={{ width: 70, height: 35, marginLeft: 20, marginBottom: 20 }}
                      />
                    </Form>
                  </div>
                  <Dropdown.Divider className="mt-0 mb-0" />
                  <div className="d-flex flex-column mb-0">
                    <Form.Group controlId="formBasicCheckbox3" className="my-3 mb-0">
                      <Form.Check
                        className="me-2"
                        type="checkbox"
                        checked={preProcessingTypes.includes("standard_scale")}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            const a = preProcessingTypes;
                            if (!a.includes("standard_scale")) {
                              a.push("standard_scale");
                            }
                            setPreProcessingTypes(a.filter((ele: any) => ele !== "min_max_scale"));
                          } else {
                            const a = preProcessingTypes;
                            if (!a.includes("min_max_scale")) {
                              a.push("min_max_scale");
                            }
                            setPreProcessingTypes(a.filter((ele: any) => ele !== "standard_scale"));
                          }
                        }}
                        label="Standard scale"
                        style={{ color: "#3B3E40", textAlign: "start", opacity: 0.9 }}
                      />
                    </Form.Group>
                    <Form>
                      <Form.Label
                        className="mt-2 mb-0"
                        style={{ fontSize: 11, marginLeft: 20, color: "#90A1B5" }}
                      >
                        SELECT TARGET VARIABLE
                      </Form.Label>
                    </Form>
                    <div style={{ width: 220, marginLeft: 20, marginTop: 8 }}>
                      <Select
                        className="mt-2 mb-3 f-14"
                        style={{ border: "0px solid white" }}
                        isDisabled={!preProcessingTypes.includes("standard_scale")}
                        menuPlacement="bottom"
                        value={
                          minMaxTarget && preProcessingTypes.includes("standard_scale")
                            ? {
                                value: minMaxTarget,
                                label: minMaxTarget,
                              }
                            : null
                        }
                        name="colors"
                        options={options}
                        placeholder="Select Target Variable"
                        classNamePrefix="select"
                        closeMenuOnSelect={true}
                        onChange={(option: any) => {
                          setMinMaxTarget(option.value);
                        }}
                      />
                    </div>
                  </div>
                  <Dropdown.Divider className="mt-2 mb-0" />
                  <div className="d-flex flex-column mb-0">
                    <Form.Group controlId="formBasicCheckbox4" className="my-3 mb-0">
                      <Form.Check
                        className="me-2"
                        type="checkbox"
                        checked={preProcessingTypes.includes("min_max_scale")}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            const a = preProcessingTypes;
                            if (!a.includes("min_max_scale")) {
                              a.push("min_max_scale");
                            }
                            setPreProcessingTypes(a.filter((ele: any) => ele !== "standard_scale"));
                          } else {
                            const a = preProcessingTypes;
                            if (!a.includes("standard_scale")) {
                              a.push("standard_scale");
                            }
                            setPreProcessingTypes(a.filter((ele: any) => ele !== "min_max_scale"));
                          }
                        }}
                        label="Min max scale"
                        style={{ color: "#3B3E40", textAlign: "start", opacity: 0.9 }}
                      />
                    </Form.Group>
                    <Form>
                      <Form.Label
                        className="mt-2"
                        style={{ fontSize: 11, marginLeft: 20, color: "#90A1B5" }}
                      >
                        SELECT TARGET VARIABLE
                      </Form.Label>
                    </Form>
                    <div style={{ width: 220, marginLeft: 20, marginTop: 8 }}>
                      <Select
                        className="mt-2 mb-3 f-14"
                        style={{ border: "0px solid white" }}
                        isDisabled={!preProcessingTypes.includes("min_max_scale")}
                        menuPlacement="bottom"
                        value={
                          minMaxTarget && preProcessingTypes.includes("min_max_scale")
                            ? {
                                value: minMaxTarget,
                                label: minMaxTarget,
                              }
                            : null
                        }
                        name="colors"
                        options={options}
                        placeholder="Select Target Variable"
                        classNamePrefix="select"
                        closeMenuOnSelect={true}
                        onChange={(option: any) => {
                          setMinMaxTarget(option.value);
                        }}
                      />
                    </div>
                  </div>
                </Card.Body>
                <div>
                  <Link href={`/projects/${project_id}/models`}>
                    <button className="btn mt-4 f-16 ms-3 bg-white">Cancel</button>
                  </Link>
                  <Button
                    className="mt-4 f-16 ms-3 text-white"
                    loading={loading}
                    style={{ width: 160, backgroundColor: "#0076FF" }}
                    onClick={() => {
                      if (
                        (preProcessingTypes.includes("standard_scale") ||
                          preProcessingTypes.includes("min_max_scale")) &&
                        !minMaxTarget
                      ) {
                        toast.error("Select Target Variable");
                      } else {
                        setStep("Select Model");
                        setCrossValidation("model");
                        document.getElementById("test_scroll")?.scrollIntoView();
                      }
                    }}
                  >
                    Proceed
                  </Button>
                </div>
              </Card>
              {/* Tips */}
              <Accordion defaultActiveKey="sno-1" className="border-bottom accordian-style">
                <Card>
                  <Card.Header className="bg-white py-4 f-18">
                    <Image src="/ml-modelling/tips.svg" className="me-2" width={20} height={20} />
                    Tips
                  </Card.Header>
                  <Card.Header style={{ backgroundColor: "white" }}>
                    {preProcessingTips.map((item: any, index: any) => {
                      return (
                        <>
                          <Accordion.Toggle
                            onClick={() => {
                              setIdx(!idx);
                            }}
                            className="border-0 w-100 bg-white py-2"
                            eventKey={"sno-" + (index + 1)}
                          >
                            <div className="d-flex justify-content-between">
                              <h6 className="f-13 acc-header">{item.question}</h6>
                              <div>
                                <ChevronDown
                                  width={16}
                                  height={16}
                                  className="ms-2 mb-1 cursor-pointer"
                                />
                              </div>
                            </div>
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey={"sno-" + (index + 1)}>
                            <Card.Body
                              className="pt-2 pb-4"
                              style={{ backgroundColor: "white", fontSize: "14px" }}
                            >
                              {item.answer}
                            </Card.Body>
                          </Accordion.Collapse>
                        </>
                      );
                    })}
                  </Card.Header>
                </Card>
              </Accordion>
            </div>
          </div>
        );
      case "Select Model":
        return (
          <div className="mx-4">
            {/* Accordion with QueryResults Table */}
            <div
              className="p-3 bg-white my-2 border"
              style={{ borderRadius: 12, boxSizing: "border-box", width: "94vw" }}
            >
              <Accordion>
                <Accordion.Toggle className="border-0 bg-white" eventKey="1">
                  <div className="d-flex">
                    <div className="f-18 ls acc-div">{queryDetails.name}_PREP</div>
                    <div>
                      <ChevronDown width={16} height={16} className="ms-2 mt-2 cursor-pointer" />
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse className="pt-3" eventKey="1">
                  <div className="model-div ">
                    <QueryResults
                      row={5}
                      list={queryDetails.list}
                      query={queryDetails.data}
                      chart={tableStyles}
                    />
                  </div>
                </Accordion.Collapse>
              </Accordion>
            </div>
            <div className="d-flex justify-content-between flex-lg-row flex-md-row flex-sm-column">
              {/* Select Model Card */}
              <Card className="processing-card" style={{ height: "62%" }}>
                <Card.Body className="pt-0">
                  {crossValidation === "model" ? (
                    <ModelSelection
                      modelling={modelling}
                      setModelling={setModelling}
                      setModelling1={setModelling1}
                      skipProcess={skipProcess}
                      setRegressionTypes={setRegressionTypes}
                      targetVariable={targetVariable}
                      setTargetVariable={setTargetVariable}
                      options={options}
                      loading={loading}
                      setSkipProcess={setSkipProcess}
                      setStep={setStep}
                      setCrossValidation={setCrossValidation}
                    />
                  ) : crossValidation === "validation" ? (
                    <>
                      {modelling !== "Timeseries" && (
                        <>
                          <h6 className="fw-600 f-18">Cross Validation</h6>
                          <h6 className="border-bottom f-14 pb-2 mb-3">
                            Select the Cross validation technique
                          </h6>
                          <h6 className="f-14 mb-4">{`${modelling} > ${cVTechnique.name} ${
                            gcv ? "(Gridsearch)" : ""
                          }`}</h6>
                          <div>
                            {crossValidationTechniques.map((item: any, index: any) => (
                              <div key={index} className="border-bottom mb-0">
                                <Form.Group
                                  controlId={`formBasicCheckbox${index + 10}`}
                                  className="mt-3"
                                >
                                  <Form.Check
                                    key={index}
                                    onChange={() => {
                                      setCVTechnique(item);
                                      const tempObj: any = {};
                                      item.inputs.map((e: any) => (tempObj[e] = ""));
                                      setCvParams(tempObj);
                                    }}
                                    checked={cVTechnique.value === item.value}
                                    type="radio"
                                    label={item.name}
                                    style={{ color: "#4F4F4F", textAlign: "start" }}
                                  />
                                </Form.Group>
                                <div
                                  className="d-flex mb-3 ms-4"
                                  style={{ gap: "1rem", color: "#90A1B5" }}
                                >
                                  {cVTechnique.value === item.value &&
                                    item.inputs.map((ele: any, idx: any) => (
                                      <div key={idx} className="mt-2">
                                        <p className="f-11 m-0">{getTitle(ele)}</p>
                                        <input
                                          type="number"
                                          placeholder="enter value"
                                          className="p-2 cv-input"
                                          value={cvParams[ele]}
                                          onChange={(e: any) => {
                                            const value = Number(e.target.value);
                                            if (ele === "test_size" && (value > 1 || value < 0)) {
                                              toast.error("Enter number between 0 and 1");
                                              setCvParams({ ...cvParams, [ele]: 0 });
                                            } else setCvParams({ ...cvParams, [ele]: value });
                                          }}
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                            <div className="border-bottom mb-0">
                              <Form.Group controlId={`formBasicCheckbox01`} className="my-3">
                                <Form.Check
                                  onChange={(e: any) => setGcv(e.target.checked)}
                                  checked={gcv}
                                  type="checkbox"
                                  label="Gridsearch CV"
                                  style={{ color: "#4F4F4F", textAlign: "start" }}
                                />
                              </Form.Group>
                            </div>
                          </div>

                          <div className="d-flex align-items-start">
                            <Button
                              onClick={() => {
                                document.getElementById("test_scroll")?.scrollIntoView();
                                setCrossValidation("model");
                              }}
                              variant="text"
                              className="btn mt-4 bg-white"
                            >
                              Back
                            </Button>

                            <Button
                              className="mt-4 f-16 ms-3 text-white"
                              loading={loading}
                              style={{ width: 160, backgroundColor: "#0076FF" }}
                              onClick={() => {
                                let err = "";
                                Object.entries(cvParams).map(([k, v]: any, id: any) => {
                                  if (!v) err += (id === 0 ? "Enter values for " : ", ") + k;
                                });
                                if (err) toast.error(err);
                                else {
                                  setHyperParams({});
                                  setRegressionTypes([]);
                                  setCrossValidation("algorithm");
                                  document.getElementById("test_scroll")?.scrollIntoView();
                                }
                              }}
                            >
                              Proceed
                            </Button>
                          </div>
                        </>
                      )}
                      {modelling === "Timeseries" && (
                        <>
                          <h6 className="bold my-3 mt-4">Select date column</h6>
                          <div className="d-flex align-items-center">
                            <div style={{ width: 140, maxWidth: 140 }}>
                              <Select
                                className="mt-3"
                                style={{ border: "0px solid white" }}
                                menuPlacement="top"
                                name="colors"
                                placeholder="Select date"
                                value={
                                  date
                                    ? {
                                        field: date,
                                        value: date,
                                        label: date,
                                      }
                                    : null
                                }
                                menuPosition="absolute"
                                options={options}
                                classNamePrefix="select"
                                closeMenuOnSelect={true}
                                onChange={(option: any) => {
                                  setDate(option.value);
                                }}
                              />
                            </div>
                          </div>

                          <h6 className="bold my-3 mt-4">Select the target variable</h6>
                          <div className="d-flex align-items-center">
                            <div style={{ width: 140, maxWidth: 140 }}>
                              <Select
                                className="mt-3"
                                style={{ border: "0px solid white" }}
                                menuPlacement="top"
                                name="colors"
                                placeholder="Select"
                                value={
                                  targetVariable
                                    ? {
                                        field: targetVariable,
                                        value: targetVariable,
                                        label: targetVariable,
                                      }
                                    : null
                                }
                                menuPosition="absolute"
                                options={options}
                                classNamePrefix="select"
                                closeMenuOnSelect={true}
                                onChange={(option: any) => {
                                  setTargetVariable(option.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="d-flex align-items-start">
                            <Button
                              onClick={() => setCrossValidation("model")}
                              variant="text"
                              className="btn mt-4 bg-white"
                            >
                              Back
                            </Button>

                            <Button
                              className="mt-4 f-16 ms-3 text-white"
                              loading={loading}
                              style={{ width: 160, backgroundColor: "#0076FF" }}
                              onClick={() => {
                                if (skipProcess === true && targetVariable.length === 0) {
                                  toast.error("Select target variable");
                                } else if (skipProcess === true && date.length === 0) {
                                  toast.error("Select date column");
                                } else if (modelName === "" || modelName === "Untitled Model") {
                                  toast.error("Please enter a model name");
                                } else {
                                  timeSeries();
                                }
                              }}
                            >
                              Run Model
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <ClassificationModelling
                      modelling={modelling}
                      gcv={gcv}
                      cVTechnique={cVTechnique}
                      regressionTypes={regressionTypes}
                      setRegressionTypes={setRegressionTypes}
                      cvParams={cvParams}
                      hyperParams={hyperParams}
                      setHyperParams={setHyperParams}
                      loading={loading}
                      runModel={runModel}
                      setCrossValidation={setCrossValidation}
                      modelRender={render}
                    />
                  )}
                </Card.Body>
              </Card>
              {/* Tips */}
              <Accordion defaultActiveKey="sno-1" className="border-bottom accordian-style">
                <Card>
                  <Card.Header className="bg-white py-4 f-18">
                    <Image src="/ml-modelling/tips.svg" className="me-2" width={20} height={20} />
                    Tips
                  </Card.Header>
                  <Card.Header style={{ backgroundColor: "white" }}>
                    {(modelling !== "Timeseries"
                      ? modelling !== "Regression"
                        ? crossValidation === "model"
                          ? modellingTips
                          : crossValidation === "validation"
                          ? cvTechniqueTips
                          : classificationAlgorithmTips
                        : crossValidation === "model"
                        ? modellingTips
                        : crossValidation === "validation"
                        ? cvTechniqueTips
                        : regressionAlgorithmTips
                      : modellingTips
                    ).map((item: any, index: any) => {
                      return (
                        <>
                          <Accordion.Toggle
                            onClick={() => {
                              setIdx(!idx);
                            }}
                            className="border-0 w-100 bg-white py-2"
                            eventKey={"sno-" + (index + 1)}
                          >
                            <div className="d-flex justify-content-between">
                              <h6 className="f-14 acc-header">{item.question}</h6>
                              <div>
                                <ChevronDown
                                  width={16}
                                  height={16}
                                  className="ms-2 mb-1 cursor-pointer"
                                />
                              </div>
                            </div>
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey={"sno-" + (index + 1)}>
                            <Card.Body
                              className="pt-2 pb-4"
                              style={{ backgroundColor: "white", fontSize: "14px" }}
                            >
                              {item.answer}
                            </Card.Body>
                          </Accordion.Collapse>
                        </>
                      );
                    })}
                  </Card.Header>
                </Card>
              </Accordion>
            </div>
          </div>
        );
      case "Execute Model":
        return (
          <div>
            <Card className="d-flex model-card">
              <Card.Body className="p-1">
                <h5 className="mb-1">Modeling summary</h5>
                <div className="border border-right-0 mt-4">
                  {/* Model Summary Table */}
                  <ModellingAnalysis
                    row={5}
                    columns={
                      modelling === "Regression"
                        ? regressionColumns
                        : modelling === "Timeseries"
                        ? timeSeriesColumns
                        : columns
                    }
                    data={
                      modelling === "Regression"
                        ? modelAnalysisData1
                        : modelling === "Timeseries"
                        ? modelAnalysisData2
                        : modelAnalysisData
                    }
                  />
                </div>
                <Button
                  className="mt-3 me-2 text-white"
                  onClick={() => {
                    setStep("Select Model");
                    setCrossValidation("model");
                  }}
                >
                  Back
                </Button>
              </Card.Body>
            </Card>
          </div>
        );
      case "Model Analysis":
        if (modelling === "Regression") {
          return (
            <div>
              <Card className="model-card">
                <Card.Body className="p-3">
                  <div
                    style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                    className="d-flex justify-content-between align-items-center pb-2"
                  >
                    <div className="d-flex flex-row">
                      {/* <p className="f-16 my-1">{modelName}</p> */}
                      <p className="f-16 my-1">
                        {`The machine learning algorithm is built to predict "${
                          skipProcess ? targetVariable : minMaxTarget
                        }"`}
                      </p>
                    </div>

                    {/* Visualization Buttons */}
                    {visualize !== true ? null : (
                      <div className="d-flex">
                        <Link href={`/projects/${project_id}/visualization/model/${visualId}`}>
                          <Button
                            type="submit"
                            variant="outline-primary"
                            className="my-1 me-3 f-16"
                          >
                            Create Visualization
                          </Button>
                        </Link>
                        <Button
                          type="submit"
                          className="my-1 f-16 text-white"
                          onClick={() => {
                            document.body.click();
                            setNewState({ ...newState, model: true });
                          }}
                        >
                          Start making predictions
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Model Analysis */}
                  <div className="d-flex mt-4 mb-3">
                    <div>
                      <h6 className="fw-600">Analysis type</h6>
                      <p className="f-14">{modelling} model</p>
                    </div>
                    <div className="ms-4">
                      <h6 className="fw-600">Algorithm</h6>
                      <p className="f-14">{getAlgorithm(analysis.algorithm)}</p>
                    </div>
                    <div className="ms-3">
                      <h6 className="fw-600">RMSE</h6>
                      <p className="f-14">{analysis.precision}</p>
                    </div>
                  </div>
                  <h5>Model training</h5>
                  {/* Model Table */}
                  <div className="border">
                    <QueryResults
                      row={5}
                      list={resultsTable.list}
                      query={upto2decimal(resultsTable.data)}
                      chart={tableStyles}
                    />
                  </div>
                </Card.Body>
              </Card>
              {/* Back and Save Model Buttons */}
              <div className="d-flex justify-content-center my-3">
                <Button
                  className="me-3"
                  onClick={() => {
                    setStep("Execute Model");
                  }}
                  style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
                >
                  Back
                </Button>

                <Button
                  // variant="primary"
                  spinColor="#000000"
                  className="bg-white model-btn"
                  loading={loading}
                  data-update={saved ? false : true}
                  id="save-btn"
                  onClick={() => {
                    if (modelName === "" || modelName === "Untitled Model") {
                      toast.error("Please enter a model name");
                    } else {
                      saveModel();
                    }
                  }}
                >
                  <Image
                    src="/ml-modelling/save.svg"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                  Save model
                </Button>
              </div>
            </div>
          );
        } else if (modelling === "Timeseries") {
          return (
            <div>
              <Card className="model-card">
                <Card.Body className="p-3">
                  <div
                    style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                    className="d-flex justify-content-between align-items-center pb-2"
                  >
                    <div className="d-flex flex-row">
                      {/* <p className="f-16 my-1">{modelName}</p> */}
                      <p className="f-16 my-1">
                        {`The machine learning algorithm is built to predict "${
                          skipProcess ? targetVariable : minMaxTarget
                        }"`}
                      </p>
                    </div>
                    {/* Visualization Buttons */}
                    {visualize !== true ? null : (
                      <div className="d-flex">
                        <Link href={`/projects/${project_id}/visualization/model/${visualId}`}>
                          <Button
                            type="submit"
                            variant="outline-primary"
                            className="my-1 me-3 f-16"
                          >
                            Create Visualization
                          </Button>
                        </Link>
                        <Button
                          type="submit"
                          className="my-1 f-16 text-white"
                          onClick={() => {
                            document.body.click();
                            setNewState({ ...newState, model: true });
                          }}
                        >
                          Start making predictions
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Model Analysis */}
                  <div className="d-flex mt-4 mb-3">
                    <div>
                      <h6 className="fw-600">Analysis type</h6>
                      <p className="f-14">{modelling} model</p>
                    </div>
                    <div className="ms-3">
                      <h6 className="fw-600">RMSE</h6>
                      <p className="f-14">{analysis.precision}</p>
                    </div>
                  </div>
                  <h5>Model training</h5>
                  {/* Model Table */}
                  <div className="border">
                    <QueryResults
                      row={5}
                      list={resultsTable.list}
                      query={upto2decimal(resultsTable.data)}
                      chart={tableStyles}
                    />
                  </div>
                </Card.Body>
              </Card>
              {/* Back and Save Model Buttons */}
              <div className="d-flex justify-content-center my-3">
                <Button
                  className="me-3"
                  onClick={() => {
                    setStep("Execute Model");
                  }}
                  style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
                >
                  Back
                </Button>

                <Button
                  // variant="primary"
                  spinColor="#000000"
                  className="bg-white model-btn"
                  loading={loading}
                  data-update={saved ? false : true}
                  id="save-btn"
                  onClick={() => {
                    if (modelName === "" || modelName === "Untitled Model") {
                      toast.error("Please enter a model name");
                    } else {
                      saveModel();
                    }
                  }}
                >
                  <Image
                    src="/ml-modelling/save.svg"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                  Save model
                </Button>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <Card className="df1 model-card">
                <Card.Body className="p-2">
                  <div
                    style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                    className="d-flex justify-content-between align-items-center pb-2"
                  >
                    <div className="d-flex flex-row">
                      {/* <p className="f-16 my-1">{modelName}</p> */}
                      <p className="f-16 my-1">
                        {`The machine learning algorithm is built to predict "${
                          skipProcess ? targetVariable : minMaxTarget
                        }"`}
                      </p>
                    </div>
                    {/* Visualization Buttons */}
                    {visualize !== true ? null : (
                      <div className="d-flex">
                        <Link href={`/projects/${project_id}/visualization/model/${visualId}`}>
                          <Button
                            type="submit"
                            variant="outline-primary"
                            className="my-1 me-3 f-16"
                          >
                            Create Visualization
                          </Button>
                        </Link>
                        <Button
                          type="submit"
                          className="my-1 f-16 text-white"
                          onClick={() => {
                            document.body.click();
                            setNewState({ ...newState, model: true });
                          }}
                        >
                          Start making predictions
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Model Analysis */}
                  <div className="d-flex mt-4 mb-4 justify-content-around">
                    <div>
                      <h6 className="fw-600">Analysis type</h6>
                      <p className="f-14">{modelling} model</p>
                    </div>
                    <div>
                      <h6 className="fw-600">Algorithm</h6>
                      <p className="f-14">{getAlgorithm(analysis.algorithm)}</p>
                    </div>
                    <div>
                      <h6 className="fw-600">Accuracy</h6>
                      <p className="f-14">{analysis.accuracy}</p>
                    </div>
                    <div>
                      <h6 className="fw-600">Precision</h6>
                      <p className="f-14">{analysis.precision}</p>
                    </div>
                    <div>
                      <h6 className="fw-600">Recall</h6>
                      <p className="f-14">{analysis.recall}</p>
                    </div>
                    <div>
                      <h6 className="fw-600">Support</h6>
                      <p className="f-14">{analysis.support}</p>
                    </div>
                    <div>
                      <h6 className="fw-600">F1-score</h6>
                      <p className="f-14">{analysis.f1score}</p>
                    </div>
                  </div>
                  {/* Model Tables */}
                  <h5>Model training</h5>
                  <div className="model-div ">
                    <QueryResults
                      row={5}
                      list={resultsTable.list}
                      query={upto2decimal(resultsTable.data)}
                      chart={tableStyles}
                    />
                  </div>

                  <h5 className="my-3">Confusion matrix</h5>
                  <div className="model-div ">
                    <QueryResults
                      row={5}
                      list={confusionMatrix.heads}
                      query={confusionMatrix.data}
                      chart={tableStyles}
                    />
                  </div>
                  <h5 className="my-3">Classification report</h5>
                  <div className="model-div ">
                    <QueryResults
                      row={5}
                      list={classificationData.list}
                      query={classificationData.data}
                      chart={tableStyles}
                    />
                  </div>
                  {/* ROC Chart */}
                  <h5 className="my-3">ROC curve</h5>
                  <div className="d-flex">
                    <h6 className="mt-2 mb-0">Select class for it&apos;s respective ROC curve </h6>
                    <div style={{ width: 220, marginLeft: 20 }}>
                      <Select
                        style={{ border: "0px solid white" }}
                        menuPlacement="bottom"
                        value={{ value: selectedClass, label: selectedClass }}
                        name="colors"
                        options={classes}
                        placeholder="Select Target Variable"
                        classNamePrefix="select"
                        closeMenuOnSelect={true}
                        onChange={(option: any) => {
                          setSelectedClass(option.value);
                          setTP(resultsTable.tp[option.value]);
                          setFP(resultsTable.fp[option.value]);
                        }}
                      />
                    </div>
                  </div>

                  {/* <h6 className="mt-4">AUC score: {auc[selectedClass].toFixed(2)}</h6> */}
                  <div
                    className="d-flex justify-content-center"
                    style={{ padding: "20px 200px 10px 150px" }}
                  >
                    <Line
                      // width={200}
                      // height={150}
                      data={data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        elements: {
                          line: {
                            borderWidth: 1,
                            fill: false,
                            tension: 0.1,
                          },
                        },
                        scales: {
                          gridLines: { display: true },
                          xAxes: [
                            {
                              gridLines: {
                                drawOnChartArea: false,
                                display: true,
                                color: "#C1D2E1",
                                lineWidth: 2,
                              },
                              ticks: {
                                callback: function (value: any) {
                                  return value.toFixed(2);
                                },
                                beginAtZero: true,
                                fontSize: 12,
                              },
                              offset: true,
                              scaleLabel: {
                                labelString: "False Positive Rate",
                                display: true,
                                // fontFamily: "Poppins",
                                fontSize: 16,
                                fontColor: "#636464",
                              },
                            },
                          ],
                          yAxes: [
                            {
                              gridLines: {
                                drawOnChartArea: false,
                                display: true,
                                color: "#C1D2E1",
                                lineWidth: 2,
                              },
                              offset: true,
                              scaleLabel: {
                                labelString: "True Positive Rate",
                                display: true,
                                // fontFamily: "Poppins",
                                fontSize: 16,
                                fontColor: "#636464",
                              },
                              ticks: {
                                beginAtZero: true,
                                fontSize: 12,
                              },
                            },
                          ],
                        },
                        plugins: {
                          // labels: row,
                          datalabels: {
                            display: false,
                            align: "end",
                            anchor: "end",
                            font: {
                              family: "Inter",
                              weight: "bold",
                              size: 12,
                            },
                            padding: 6,
                          },
                        },
                        tooltips: {
                          callbacks: {
                            title: function (context: any) {
                              const label = (context && context[0].xLabel) || 0;

                              return label.toFixed(3);
                            },
                            label: function (context: any) {
                              const label = context?.yLabel || 0;

                              return selectedClass + " " + label.toFixed(3);
                            },
                          },
                        },
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            usePointStyle: true,
                            // fontFamily: "Poppins",
                            fontSize: 16,
                            fontColor: "#636464",
                            boxWidth: 12,
                            fontStyle: "bold",
                          },
                        },
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
              {/* Back and Save Model Buttons */}
              <div className="d-flex justify-content-center my-3">
                <Button
                  className="me-3"
                  onClick={() => {
                    setStep("Execute Model");
                  }}
                  style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
                >
                  Back
                </Button>

                <Button
                  // variant="primary"
                  className="bg-white model-btn"
                  spinColor="#000000"
                  loading={loading}
                  data-update={saved ? false : true}
                  id="save-btn"
                  onClick={() => {
                    if (modelName === "" || modelName === "Untitled Model") {
                      toast.error("Please enter a model name");
                    } else {
                      saveModel();
                    }
                  }}
                >
                  <Image
                    src="/ml-modelling/save.svg"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                  Save model
                </Button>
              </div>
            </div>
          );
        }
    }
  };

  const upto2decimal = (data: any) => {
    return _.map(data, (e: any) => {
      if (typeof e["predicted_output"] === "number")
        return { ...e, predicted_output: Number(e["predicted_output"].toFixed(2)) };
      return { ...e };
    });
  };
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Modeling`} description="Modeling" />
      <Container
        fluid
        id="test_scroll"
        className="mx-0 d-flex flex-column justify-content-center align-items-center px-3"
      >
        {/* Model Name and Stepper */}
        <div className="d-flex df1 px-4 mx-3 mt-3 w-100 justify-content-between align-items-center">
          {/* Model Name */}
          <div className="ms-2 d-flex flex-row">
            {editModelName ? (
              <Form>
                <Form.Control
                  autoComplete="off"
                  autoFocus
                  onChange={(event: any) => {
                    setModelName(event.target.value);
                  }}
                  onBlur={(event: any) => {
                    setEditModelName(false);
                    setModelName(event.target.value);
                  }}
                  value={modelName}
                  className="name-input-q cursor-pointer ms-1 f-14 query-1"
                  placeholder="Untitled model"
                />
              </Form>
            ) : (
              <p onClick={() => setEditModelName(true)}>{modelName}</p>
            )}
          </div>
          {/* Stepper */}
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <Image
                src={
                  step === "Pre Processing" ||
                  step === "Select Model" ||
                  step === "Execute Model" ||
                  step === "Model Analysis"
                    ? "/ml-modelling/preProcessingSelected.svg"
                    : "/ml-modelling/preProcessing.svg"
                }
                width={36}
                height={36}
                className="mx-1"
              />
              <h6
                className="mb-0 f-12 fw-bold"
                style={{
                  color:
                    step === "Pre Processing" ||
                    step === "Select Model" ||
                    step === "Execute Model" ||
                    step === "Model Analysis"
                      ? "#1F97FF"
                      : "#8B909B",
                  letterSpacing: "-2%",
                  // fontFamily: "Metropolis",
                }}
              >
                Pre processing
              </h6>
            </div>
            <div className="d-flex align-items-center">
              {step === "Select Model" || step === "Execute Model" || step === "Model Analysis" ? (
                <Image
                  src="/ml-modelling/lineSelected.svg"
                  width={46}
                  height={3}
                  className="mx-2"
                />
              ) : (
                <Image src="/ml-modelling/line.svg" width={46} height={3} className="mx-2" />
              )}
              <Image
                src={
                  step === "Select Model" || step === "Execute Model" || step === "Model Analysis"
                    ? "/ml-modelling/selectModelSelected.svg"
                    : "/ml-modelling/selectModel.svg"
                }
                width={36}
                height={36}
                className="mx-1"
              />
              <h6
                className="mb-0 f-12 fw-bold"
                style={{
                  color:
                    step === "Select Model" || step === "Execute Model" || step === "Model Analysis"
                      ? "#1F97FF"
                      : "#8B909B",
                  letterSpacing: "-2%",
                  // fontFamily: "Metropolis",
                }}
              >
                Select model
              </h6>
            </div>
            <div className="d-flex align-items-center">
              {step === "Execute Model" || step === "Model Analysis" ? (
                <Image
                  src="/ml-modelling/lineSelected.svg"
                  width={46}
                  height={3}
                  className="mx-2"
                />
              ) : (
                <Image src="/ml-modelling/line.svg" width={46} height={3} className="mx-2" />
              )}
              <Image
                src={
                  step === "Execute Model" || step === "Model Analysis"
                    ? "/ml-modelling/executeModelSelected.svg"
                    : "/ml-modelling/executeModel.svg"
                }
                width={36}
                height={36}
                className="mx-1"
              />
              <h6
                className="mb-0 f-12 fw-bold"
                style={{
                  color:
                    step === "Execute Model" || step === "Model Analysis" ? "#1F97FF" : "#8B909B",
                  letterSpacing: "-2%",
                  // fontFamily: "Metropolis",
                }}
              >
                Execute model
              </h6>
            </div>
            <div className="d-flex align-items-center">
              {step === "Model Analysis" ? (
                <Image
                  src="/ml-modelling/lineSelected.svg"
                  width={46}
                  height={3}
                  className="mx-2"
                />
              ) : (
                <Image src="/ml-modelling/line.svg" width={46} height={3} className="mx-2" />
              )}
              <Image
                src={
                  step === "Model Analysis"
                    ? "/ml-modelling/modelAnalysisSelected.svg"
                    : "/ml-modelling/modelAnalysis.svg"
                }
                width={36}
                height={36}
                className="mx-1"
              />
              <h6
                className="mb-0 f-12 fw-bold"
                style={{
                  color: step === "Model Analysis" ? "#1F97FF" : "#8B909B",
                  letterSpacing: "-2%",
                }}
              >
                Model analysis
              </h6>
            </div>
          </div>
        </div>
        {/* Main */}
        <div>{currentStep()}</div>
        <Modal
          size="xl"
          // style={{ width: 800 }}
          show={classificationTable}
          onHide={() => {
            setClassificationTable(!classificationTable);
          }}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="m-0 fw-600 ps-2" style={{ color: "#495968" }}>
              Classification report
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            <div className="d-flex flex-column mt-2">
              <div className="border">
                <QueryResults
                  row={5}
                  list={classificationData.list}
                  query={classificationData.data}
                  chart={tableStyles}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-top-0 p-0 justify-content-center">
            <Button
              onClick={() => {
                setClassificationTable(!classificationTable);
              }}
              variant="text"
              className="f-20 text-white"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <NewModelPickle newState={newState} setNewState={setNewState} row={visualId} />
      </Container>
    </>
  );
};
export default Modelling;
