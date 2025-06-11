// react
import React, { FC } from "react";
// next-link
import Link from "next/link";
// next router
import { useRouter } from "next/router";
// react bootstrap
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
// react button loader
import Button from "react-bootstrap-button-loader";
// next seo
import { NextSeo } from "next-seo";
// react chart js
import { Line } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import { useRequest } from "lib/hooks";

// react-select
import Select from "react-select";
// react-toastify
import { toast } from "react-toastify";
// icons

import { QueryResults } from "components/data-tables";
import { getAlgorithm, tableStyles } from "constants/common";
// services
import { ModelService } from "services";
import { PageLoader } from "components/loaders";
import { NewModelPickle } from "components/modals";
//toast configuration
toast.configure();

const models = new ModelService();

const AnalysisModelling: FC = () => {
  const router = useRouter();
  const { project_id, model_id } = router.query;
  const [loading, setLoading] = React.useState(true);

  const [modelling, setModelling] = React.useState("Classification");

  const [classificationData, setClassificationData] = React.useState({
    list: [] as any,
    data: [] as any,
    output: [] as any,
  });

  const [visualize, setVisualize] = React.useState(true);
  const [fieldName, setFieldName] = React.useState("");
  const [analysis, setAnalysis] = React.useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    support: 0,
    f1score: 0,
    algorithm: "",
    list: [] as any,
    data: [] as any,
  });
  const [modelName, setModelName] = React.useState("Untitled Model");
  //   const [editQueryName, setEditQueryName] = React.useState(false);

  const [confusionMatrix, setConfusionMatrix] = React.useState({
    matrix: [] as any,
    heads: [] as any,
    data: [] as any,
  });
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
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
  // const [auc, setAuc] = React.useState([] as any);
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  React.useEffect(() => {
    //text
    getModelInfo(model_id);
    // setVisualId(model_id);
  }, [model_id]);

  const getModelInfo = (id: any) => {
    models
      .getModel(project_id, id)
      .then((res) => {
        if (res.extra.modelling === "Regression" || res.extra.modelling === "Timeseries") {
          setLoading(false);

          setModelling(res.extra.modelling);
          setModelName(res.extra.modelName);
          setVisualize(true);
          setFieldName(res?.other_params?.target_variable);
          setAnalysis(res.extra.analysis);
          setResultsTable(res.extra.resultsTable);

          // setVisualId(model_id);
          // setConfusionMatrix(res.extra.confusionMatrix);
          // setClassificationData(res.extra.classificationData);
        } else {
          setLoading(false);

          setModelling(res.extra.modelling);
          setModelName(res.extra.modelName);
          setVisualize(true);
          setFieldName(res?.other_params?.target_variable);
          setAnalysis(res.extra.analysis);
          setResultsTable(res.extra.resultsTable);
          // setVisualId(model_id);
          setConfusionMatrix(res.extra.confusionMatrix);
          setClassificationData(res.extra.classificationData);
          setSelectedClass(res.extra.selectedClass);
          setTP(res.extra.resultsTable.tp[res.extra.selectedClass]);
          setFP(res.extra.resultsTable.fp[res.extra.selectedClass]);
          // setAuc(res.extra.auc);
          setClasses(res.extra.classes);
        }
      })
      .catch();
  };
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
      // {
      //   label: "Threshold",
      //   data: [fp[0], fp.slice(-1)[0]],
      //   fill: false,
      //   backgroundColor: "red",
      //   borderColor: "red",
      //   enableInteractivity: false,
      // },
    ],
  };

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Model analysis`} description="Analysis" />

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="d-flex summary-1 mt-4 px-5">
            <h4 className="mb-2 title">Model analysis</h4>
          </div>
          <div>
            {modelling === "Regression" ? (
              <div className="d-flex align-items-center justify-content-center ms-4 me-4">
                <Card className="model-card">
                  <Card.Body className="p-3">
                    <div
                      style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                      className="d-flex justify-content-between align-items-center pb-2"
                    >
                      {/* <div className="d-flex flex-row">
                    <CaretBack
                      onClick={() => {
                        setStep("Execute Model");
                      }}
                      width={30}
                      height={24}
                      className="me-2 cursor-pointer"
                    />
 
                   
                  </div> */}
                      <h6 className="f-18 ls my-1">{modelName}</h6>

                      {/* <p className="f-16">{modelName}</p> */}

                      {/* <div>
              <p className="f-14">{modelling}</p>
            </div> */}

                      {/* {!visualize ? (
                    <div>
                      <Button
                        className="me-3 f-16 bg-white"
                        style={{
                          color: "#495968",
                          border: "1px solid #495968",
                          fontFamily: "Metropolis",
                          fontStyle: "normal",
                          fontWeight: 600,
                          borderRadius: 4,
                          boxSizing: "border-box",
                        }}
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
                  ) : null} */}
                      {/* Visualization Buttons */}
                      {visualize === true ? (
                        <div className="d-flex">
                          <Link href={`/projects/${project_id}/visualization/model/${model_id}`}>
                            <Button
                              type="submit"
                              variant="outline-primary"
                              className="my-1 me-3 f-16"
                            >
                              Create Visualization
                            </Button>
                          </Link>
                          {userRole?.user_role === "Owner" ||
                          userRole?.user_module_access[3]["Models"] === "WRITE" ? (
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
                          ) : (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip className="mt-3" id="tooltip-engine">
                                  You didn&apos;t have access to this feature
                                </Tooltip>
                              }
                            >
                              <Button variant="light" className="text-black-50">
                                Start making predictions
                              </Button>
                            </OverlayTrigger>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      {fieldName &&
                        `The machine learning algorithm is built to predict ${fieldName}`}
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
                        query={resultsTable.data}
                        chart={tableStyles}
                      />
                    </div>
                  </Card.Body>
                </Card>
                {/* <div className="d-flex justify-content-center">
              <Button
                className="mt-2 me-3 mb-2 f-16"
                onClick={() => {
                  setStep("Execute Model");
                }}
                style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
              >
                Back
              </Button>
            </div> */}
              </div>
            ) : modelling === "Timeseries" ? (
              <div className="d-flex align-items-center justify-content-center ms-4 me-4">
                <Card className="model-card">
                  <Card.Body className="p-3">
                    <div
                      style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                      className="d-flex justify-content-between align-items-center pb-2"
                    >
                      {/* <div className="d-flex flex-row">
                  <CaretBack
                    onClick={() => {
                      setStep("Execute Model");
                    }}
                    width={30}
                    height={24}
                    className="me-2 cursor-pointer"
                  />

                 
                </div> */}
                      <h6 className="f-18 ls my-1">{modelName}</h6>

                      {/* <p className="f-16">{modelName}</p> */}

                      {/* <div>
            <p className="f-14">{modelling}</p>
          </div> */}

                      {/* {!visualize ? (
                  <div>
                    <Button
                      className="me-3 f-16 bg-white"
                      style={{
                        color: "#495968",
                        border: "1px solid #495968",
                        fontFamily: "Metropolis",
                        fontStyle: "normal",
                        fontWeight: 600,
                        borderRadius: 4,
                        boxSizing: "border-box",
                      }}
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
                ) : null} */}
                      {/* Visualization Buttons */}
                      {visualize === true ? (
                        <div className="d-flex">
                          <Link href={`/projects/${project_id}/visualization/model/${model_id}`}>
                            <Button
                              type="submit"
                              variant="outline-primary"
                              className="my-1 me-3 f-16"
                            >
                              Create Visualization
                            </Button>
                          </Link>
                          {userRole?.user_role === "Owner" ||
                          userRole?.user_module_access[3]["Models"] === "WRITE" ? (
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
                          ) : (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip className="mt-3" id="tooltip-engine">
                                  You didn&apos;t have access to this feature
                                </Tooltip>
                              }
                            >
                              <Button variant="light" className="text-black-50">
                                Start making predictions
                              </Button>
                            </OverlayTrigger>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      {fieldName &&
                        `The machine learning algorithm is built to predict ${fieldName}`}
                    </div>
                    {/* Model Analysis */}
                    <div className="d-flex mt-4 mb-3">
                      <div>
                        <h6 className="fw-600">Analysis type</h6>
                        <p className="f-14">{modelling} model</p>
                      </div>
                      {/* <div className="ms-4">
                    <h6>Algorithm</h6>
                    <p className="f-14">{analysis.algorithm}</p>
                  </div> */}
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
                        query={resultsTable.data}
                        chart={tableStyles}
                      />
                    </div>
                  </Card.Body>
                </Card>
                {/* <div className="d-flex justify-content-center">
            <Button
              className="mt-2 me-3 mb-2 f-16"
              onClick={() => {
                setStep("Execute Model");
              }}
              style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
            >
              Back
            </Button>
          </div> */}
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center ms-5 me-5">
                <Card className="df1 model-card">
                  <Card.Body className="p-2">
                    <div
                      style={{ borderBottom: "0.695975px solid #C1D2E1" }}
                      className="d-flex justify-content-between align-items-center pb-2"
                    >
                      {/* <div className="d-flex flex-row">
                    <CaretBack
                      onClick={() => {
                        setStep("Execute Model");
                      }}
                      width={30}
                      height={24}
                      className="me-2 cursor-pointer"
                    />
 
                   
                  </div> */}
                      <h6 className="f-18 ls my-1">{modelName}</h6>
                      {/* <p className="f-16">{modelName}</p> */}
                      {/* {!visualize ? (
                    <div>
                      <Button
                        className="me-3 f-16 bg-white"
                        style={{
                          color: "#495968",
                          border: "1px solid #495968",
                          fontFamily: "Metropolis",
                          fontStyle: "normal",
                          fontWeight: 600,
                          borderRadius: 4,
                          boxSizing: "border-box",
                        }}
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
                  ) : null} */}
                      {/* Visualization Buttons */}
                      {visualize === true ? (
                        <div className="d-flex">
                          <Link href={`/projects/${project_id}/visualization/model/${model_id}`}>
                            <Button
                              type="submit"
                              variant="outline-primary"
                              className="my-1 me-3 f-16"
                            >
                              Create Visualization
                            </Button>
                          </Link>
                          {userRole?.user_role === "Owner" ||
                          userRole?.user_module_access[3]["Models"] === "WRITE" ? (
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
                          ) : (
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip className="mt-3" id="tooltip-engine">
                                  You didn&apos;t have access to this feature
                                </Tooltip>
                              }
                            >
                              <Button variant="light" className="text-black-50">
                                Start making predictions
                              </Button>
                            </OverlayTrigger>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      {fieldName &&
                        `The machine learning algorithm is built to predict ${fieldName}`}
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
                        query={resultsTable.data}
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
                      <h6 className="mt-2 mb-0">
                        Select class for it&apos;s respective ROC curve{" "}
                      </h6>
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

                    {/* <h6 className="mt-4">AUC score: {auc}</h6> */}
                    <div
                      className="d-flex justify-content-center"
                      style={{ padding: "20px 200px 10px 150px" }}
                    >
                      <Line
                        // width={400}
                        // height={300}
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
                {/* <div className="d-flex justify-content-center">
              <Button
                className="mt-2 me-3 mb-2 f-16"
                onClick={() => {
                  setStep("Execute Model");
                }}
                style={{ border: 0, backgroundColor: "white", color: "#0076FF" }}
              >
                Back
              </Button>
            </div> */}
              </div>
            )}
          </div>
          <NewModelPickle newState={newState} setNewState={setNewState} row={model_id} />
        </>
      )}
    </>
  );
};
export default AnalysisModelling;
