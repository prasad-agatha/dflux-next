import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";
// react button loader
import Button from "react-bootstrap-button-loader";
import { algorithms, getTitle, isInteger } from "constants/common";
import _ from "lodash";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

export interface IClassificationModellingProps {
  modelling: any;
  gcv: any;
  cVTechnique: any;
  regressionTypes: any;
  setRegressionTypes: any;
  cvParams: any;
  hyperParams: any;
  setHyperParams: any;
  loading: any;
  runModel: any;
  setCrossValidation: any;
  modelRender: any;
}

const ClassificationModelling: FC<IClassificationModellingProps> = (props) => {
  const {
    modelling,
    gcv,
    cVTechnique,
    regressionTypes,
    setRegressionTypes,
    cvParams,
    hyperParams,
    setHyperParams,
    loading,
    runModel,
    setCrossValidation,
    modelRender,
  } = props;
  const [render, setRender] = useState<any>("");

  const getValue = (id: any) => {
    const input = document.getElementById(id) as HTMLInputElement;
    return input?.value || "";
  };
  const display = (alg: any, label: any) => {
    const tempParams = hyperParams;
    if (["support_vector_classifier", "support_vector_machine_regressor"].includes(alg)) {
      if (label === "degree" && !tempParams[alg]["gcv_params"]["kernel"].includes("poly"))
        return "d-none";
      else if (label === "gamma" && !tempParams[alg]["gcv_params"]["kernel"].includes("rbf"))
        return "d-none";
    }
    return "";
  };
  const displayError = (alg: any, label: any) => {
    const tempParams = hyperParams;
    if (tempParams[alg]["gcv_validations"][label] === false) return "";
    return "d-none";
  };
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
    menuList: (base: any) => ({
      ...base,
      maxHeight: 200,
    }),
    container: (base: any) => ({
      ...base,
      paddingTop: 4,
      background: "#F5F5F5",
    }),
    option: (base: any) => ({
      ...base,
      minWidth: "max-content",
    }),
    dropdownButton: () => ({
      width: 140,
      height: 42,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      borderRadius: 4,
      border: "1px solid #dbdde0",
      padding: 8,
      textAlign: "start",
      textTransform: "capitalize",
      fontSize: 16,
      color: "#ced1d3",
    }),
  };

  return (
    <>
      <h6 className="border-bottom fw-600 f-18 mb-4 pb-4 pt-1">{`${modelling} Modelling`}</h6>
      <h6 className="f-14 mb-4">{`${modelling} > ${cVTechnique.name} ${
        gcv ? "(Gridsearch)" : ""
      }`}</h6>
      <h6 className="fw-600 mb-4">Select the algorithms and key values you want to run</h6>
      <h6 className="d-none">{render - modelRender}</h6>

      {algorithms.map((alg: any, idx: any) => {
        if (alg.modelType === modelling) {
          return (
            <div key={idx}>
              <Form.Group controlId={`formBasicCheckbox1${idx + 20}`} className="my-2 mt-2 me-4">
                <Form.Check
                  type="checkbox"
                  label={alg.name}
                  name={alg.name}
                  style={{ color: "#313A4F", textAlign: "start" }}
                  checked={regressionTypes.includes(alg.input)}
                  onChange={(e: any) => {
                    if (e.target.checked) {
                      setRegressionTypes([...regressionTypes, alg.input]);
                      const gcv_params: any = {};
                      const gcv_validations: any = {};
                      alg.params.map((e: any) => {
                        gcv_params[e.name] = [];
                        gcv_validations[e.name] = null;
                      });
                      const tempObj = {
                        cv: true,
                        cross_validation: cVTechnique.value,
                        cv_params: cvParams,
                        gcv,
                        gcv_params,
                        gcv_validations,
                      };
                      const tempHyperParams = hyperParams;
                      tempHyperParams[alg.input] = tempObj;
                      setHyperParams(tempHyperParams);
                    } else {
                      setRegressionTypes(
                        regressionTypes.filter((el: any) => !el.includes(alg.input))
                      );
                      const tempHyperParams = hyperParams;
                      delete tempHyperParams[alg.input];
                      setHyperParams(tempHyperParams);
                    }
                  }}
                />
              </Form.Group>
              <div className="d-flex flex-wrap mb-3 ms-4" style={{ gap: "1rem", color: "#90A1B5" }}>
                {hyperParams[alg.input] &&
                  alg.params.map((ele: any, idx: any) => {
                    // if (gcv || ele.cv)
                    return (
                      <div key={idx} className="mt-2">
                        <p className={`f-11 m-0 ${display(alg.input, ele.name)}`}>
                          {getTitle(ele.name)}
                        </p>
                        {ele.type === "select" ? (
                          <div className="d-flex flex-column">
                            <ReactMultiSelectCheckboxes
                              classNamePrefix="multi-select"
                              styles={customStyles}
                              options={_.map(ele.options, (e: any, id: any) => {
                                return { id, value: e, label: e };
                              })}
                              value={_.map(
                                hyperParams[alg.input]["gcv_params"][ele.name],
                                (e: any, id: any) => {
                                  return { id, value: e, label: e };
                                }
                              )}
                              placeholderButtonLabel="Select"
                              onChange={(value: any, event: any) => {
                                const tempParams = hyperParams;
                                let tempValue: any = [];
                                if (gcv) {
                                  tempValue = _.map(value, "label");
                                  tempParams[alg.input]["gcv_params"][ele.name] = tempValue;
                                } else {
                                  if (event.action === "select-option") {
                                    tempParams[alg.input]["gcv_params"][ele.name] = [
                                      event.option.label,
                                    ];
                                  } else if (event.action === "deselect-option") {
                                    tempParams[alg.input]["gcv_params"][ele.name] = [];
                                  }
                                }
                                if (tempParams[alg.input]["gcv_params"][ele.name].length > 0)
                                  tempParams[alg.input]["gcv_validations"][ele.name] = true;
                                else tempParams[alg.input]["gcv_validations"][ele.name] = false;
                                setRender(tempValue);
                                setHyperParams(tempParams);
                              }}
                            />
                            <small
                              className={`text-danger p-1 f-10 ${display(
                                alg.input,
                                ele.name
                              )} ${displayError(alg.input, ele.name)}`}
                            >
                              Select option
                            </small>
                          </div>
                        ) : (
                          <div className="d-flex flex-column">
                            <input
                              placeholder={
                                ele.name === "hidden_layer_sizes"
                                  ? "Ex: (50,50,50),(100,)"
                                  : "enter value"
                              }
                              type={!gcv && ele.name !== "hidden_layer_sizes" ? "number" : "text"}
                              className={`p-2 cv-input ${display(alg.input, ele.name)}`}
                              style={{ width: "140px" }}
                              value={getValue(`${alg.input}-${ele.name}`)}
                              name={`${alg.input}-${ele.name}`}
                              id={`${alg.input}-${ele.name}`}
                              onChange={(e: any) => {
                                setRender(e.target.value + Math.random());
                                const tempParams = hyperParams;
                                if (ele.name === "hidden_layer_sizes") {
                                  tempParams[alg.input]["gcv_params"][ele.name] = [e.target.value];
                                  tempParams[alg.input]["gcv_validations"][ele.name] = true;
                                } else {
                                  const tempValue: any = [];
                                  tempParams[alg.input]["gcv_validations"][ele.name] = true;
                                  const tempArr = e.target.value.split(",");
                                  _.map(tempArr, (el: any, indx: any) => {
                                    const num = Number(el);
                                    const num_valid =
                                      (ele.type === "integer" && isInteger(num)) ||
                                      ele.type === "float"
                                        ? true
                                        : false;
                                    if (ele.name === "L1_ratio" && num > 0 && num < 1)
                                      tempValue.push(num);
                                    else if (ele.name !== "L1_ratio" && num && num_valid)
                                      tempValue.push(num);
                                    else if (indx === tempArr.length - 1 && el.trim() === "") {
                                      const txt =
                                        tempParams[alg.input]["gcv_validations"][ele.name];
                                      tempParams[alg.input]["gcv_validations"][ele.name] = txt;
                                    } else
                                      tempParams[alg.input]["gcv_validations"][ele.name] = false;
                                  });
                                  tempParams[alg.input]["gcv_params"][ele.name] = tempValue;
                                }
                                setHyperParams(tempParams);
                              }}
                            />
                            <small
                              className={`text-danger p-1 f-10 ${display(
                                alg.input,
                                ele.name
                              )} ${displayError(alg.input, ele.name)}`}
                            >
                              {ele.name === "L1_ratio" && gcv
                                ? `Enter list of floats between 0 & 1`
                                : ele.name === "L1_ratio" && !gcv
                                ? `Enter float value between 0 & 1`
                                : ele.name !== "L1_ratio" && gcv
                                ? `Enter list of ${ele.type} values`
                                : `Enter ${ele.type} value`}
                            </small>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        }
      })}

      <div className="d-flex align-items-start">
        <Button
          onClick={() => {
            document.getElementById("test_scroll")?.scrollIntoView();
            setCrossValidation("validation");
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
          onClick={runModel}
        >
          Run model
        </Button>
      </div>
    </>
  );
};

export default ClassificationModelling;
