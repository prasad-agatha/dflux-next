import React, { FC } from "react";
import { Image } from "react-bootstrap";
// react-select
import Select from "react-select";
// react button loader
import Button from "react-bootstrap-button-loader";
// react-toastify
import { toast } from "react-toastify";
//toast configuration
toast.configure();

export interface IModelSelectionProps {
  modelling: any;
  setModelling: any;
  setModelling1: any;
  skipProcess: any;
  setRegressionTypes: any;
  targetVariable: any;
  setTargetVariable: any;
  options: any;
  loading: any;
  setSkipProcess: any;
  setStep: any;
  setCrossValidation: any;
}

const ModelSelection: FC<IModelSelectionProps> = (props) => {
  const {
    modelling,
    setModelling,
    setModelling1,
    skipProcess,
    setRegressionTypes,
    targetVariable,
    setTargetVariable,
    options,
    loading,
    setSkipProcess,
    setStep,
    setCrossValidation,
  } = props;
  return (
    <>
      <h6 className="fw-600 f-18">Model Selection</h6>
      <h6 className="border-bottom f-14 mb-5 pb-2">
        Please select the model technique with which you want to proceed
      </h6>

      <div className="d-flex" style={{ gap: "1rem" }}>
        <h6
          className={"modelling-cards " + (modelling === "Classification" ? "active" : "")}
          onClick={() => {
            setModelling("Classification");
            setModelling1("classification");
            setRegressionTypes([]);
          }}
        >
          <Image src="/Classification.svg" className="mb-2" width={64} height={64} />
          Classification modelling
        </h6>
        <h6
          className={"modelling-cards " + (modelling === "Regression" ? "active" : "")}
          onClick={() => {
            setModelling("Regression");
            setModelling1("regression");

            setRegressionTypes([]);
          }}
        >
          <Image src="/Regression.svg" className="mb-2" width={64} height={64} />
          Regression modelling
        </h6>
        <h6
          className={"modelling-cards " + (modelling === "Timeseries" ? "active" : "")}
          onClick={() => {
            setModelling("Timeseries");
            setModelling1("timeseries");
          }}
        >
          <Image src="/Prediction.svg" className="mb-2" width={64} height={64} />
          Time Series Prediction
        </h6>
      </div>
      {skipProcess === true && (
        <>
          <h6 className="bold my-3 mt-4">Select the target variable</h6>
          <div style={{ maxWidth: 140 }}>
            <Select
              className="mt-1 w-100"
              style={{ border: "0px solid white" }}
              menuPlacement="bottom"
              value={
                targetVariable && {
                  value: targetVariable,
                  label: targetVariable,
                }
              }
              name="colors"
              options={options}
              placeholder="Select"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              onChange={(option: any) => {
                setTargetVariable(option.value);
              }}
            />
          </div>
        </>
      )}
      <div className="d-flex align-items-start">
        <Button
          onClick={() => {
            setStep("Pre Processing");
            document.getElementById("test_scroll")?.scrollIntoView();
            setSkipProcess(false);
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
            if (skipProcess === true && targetVariable.length === 0) {
              toast.error("Select target variable");
            } else {
              setCrossValidation("validation");
              document.getElementById("test_scroll")?.scrollIntoView();
            }
          }}
        >
          Proceed
        </Button>
      </div>
    </>
  );
};

export default ModelSelection;
