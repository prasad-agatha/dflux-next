import React, { FC } from "react";
import {
  Form,
  Image,
  OverlayTrigger,
  Tooltip,
  Overlay,
  Popover,
  InputGroup,
  Col,
} from "react-bootstrap";
// toasts
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
// react button loader
import Button from "react-bootstrap-button-loader";
import ChartMenu from "./chartMenu";
// services
import { QueryService, ChartService } from "services";
import _ from "lodash";
import { checkRole } from "constants/common";
import { ToolTip } from "components/tooltips";

interface TitleProps {
  chartState: any;
  setChartState: any;
  saveChart: any;
  updateChart?: any;
  sideBar: any;
  reDraw: any;
  setRedraw: any;
  setSideBar: any;
  edit: any;
  type: any;
  downloadAsImage: any;
  filters1: any;
  renderChart: any;
  id: any;
  newState: any;
  setNewState: any;
  userRole?: any;
  queryDetails?: any;
  queryFilters?: any;
}

//toast configuration
toast.configure();
const sql_data = new QueryService();
const chartService = new ChartService();

const TitleBar: FC<TitleProps> = (props) => {
  const {
    chartState,
    setChartState,
    saveChart,
    updateChart,
    // sideBar,
    // setSideBar,
    edit,
    type,
    downloadAsImage,
    filters1,
    renderChart,
    id,
    newState,
    setNewState,
    userRole,
    queryDetails,
    queryFilters,
  } = props;
  // refresh chart by getting latest query details
  const refreshChart = async () => {
    let sqlData: any = "";
    if (type === "query") {
      try {
        sqlData = await sql_data.runQuery({
          connection_id: chartState.connectionId,
          sql_query: chartState.raw_sql,
        });
      } catch (error: any) {
        toast.error(error);
      }
    }

    sql_data
      .getQueryDetails(id)
      .then((response: any) => {
        const data = type === "query" ? sqlData?.data : response.extra.data;
        const firstRowData = data[0];
        // const firstRowData = response.extra.data[0];
        const firstRowKeys = Object.keys(firstRowData);
        const finalRowData: any = [];
        Object.values(firstRowData).map((item: any, index: any) => {
          if (typeof item === "string") {
            finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
          }
        });
        Object.values(firstRowData).map((item: any, index: any) => {
          if (typeof item === "number") {
            finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
          }
        });
        Object.values(firstRowData).map((item: any, index: any) => {
          if (typeof item === "object") {
            finalRowData.push({ type: typeof item, item: firstRowKeys[index] });
          }
        });
        const b: any = {};
        finalRowData.map((item: any, index: any) => {
          b[`option_${index}`] = {
            id: `option_${index}`,
            content: item.item,
            type: item.type,
          };
        });
        const c = Object.keys(data[0]).map((item: any, index: any) => {
          return `option_${index}`;
        });

        setChartState({
          ...chartState,
          data: data,
          tableName: response.excel_name,
          connectionId: response.connection,
          defaultDnd: {
            tasks: b,
            columns: {
              Options: {
                id: "Options",
                title: "Available Fields",
                taskIds: c,
              },
              Measure: {
                id: "Measure",
                title: "Dimensions",
                taskIds: [],
              },
              Dimensions: {
                id: "Dimensions",
                title: "Measure",
                taskIds: [],
              },
            },
            columnOrder: ["Measure", "Options", "Dimensions"],
          },
          options: Object.keys(data[0]).map((item: any, index: any) => {
            return {
              field: item, //name,id
              label: item,
              value: item,
              key: index,
              type: typeof data[0][item],
            };
          }),
        });
        renderChart(
          false,
          chartState.axisTitle,
          chartState.showLabel,
          chartState.showLegend,
          chartState.showGrids,
          chartState.showAxis,
          chartState.showAxisTitle,
          data,
          chartState.dimension,
          chartState.measures,
          chartState.aggregate,
          filters1,
          chartState.optionsCount,
          chartState.ascending,
          chartState.descending,
          chartState.sortingField
        );
      })
      .catch((error: any) => {
        toast.error(error);
      });
  };
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [triggerState, setTriggerState] = React.useState({
    email: [],
    users: [],
  });
  const [text, setText] = React.useState("");
  const components = {
    DropdownIndicator: null,
  };

  const isValid = (email: any) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  };

  const handleChange = (newValue: any) => {
    const data: any = [];
    for (let i = 0; i < newValue.length; i++) {
      if (isValid(newValue[i].value)) {
        data.push(newValue[i]);
      }
    }
    setTriggerState({ ...triggerState, email: data });
  };

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };
  // share chart
  const sendInvitation = () => {
    if (triggerState === null || triggerState.email?.length === 0) {
      setError(true);
      setErrorMessage("This field is required");
    } else {
      // setInviteLoader(true);
      chartService
        .newSharedCharts({
          emails: _.map(triggerState.email, "value"),
          name: chartState.name,
          url: text,
        })
        .then(() => {
          // setInviteLoader(false);
          setTriggerState({
            ...triggerState,
            email: [],
          });
          setShow(!show);

          toast.success("Chart shared successfully", { autoClose: 1000 });
        })
        .catch(() => {
          toast.error("Error sending sharing", { autoClose: 1000 });
          // setInviteLoader(false);
        });
    }
  };

  //function for copying to clipboard
  const copyLink = (token: string) => {
    const text = process.env.APP_URL + `shared/chart/${edit}?shr=${token}`;
    const elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);

    toast.success("Copied to clipboard", { autoClose: 3000 });

    // setLoading(false);
  };

  const copy = (token: string) => {
    const text = process.env.APP_URL + `shared/chart/${edit}?shr=${token}`;
    // const elem = document.createElement("textarea");
    setText(text);
    // document.body.appendChild(elem);
    // elem.value = text;
    // elem.select();
    // document.execCommand("copy");
    // document.body.removeChild(elem);
    //
  };

  React.useEffect(() => {
    if (edit) {
      chartService
        .shareChart(edit)
        .then((res) => {
          copy(res.shared_token);
        })
        .catch();
    }
  }, [edit, userRole]);

  const shareChart = () => {
    chartService
      .shareChart(edit)
      .then((res) => {
        copyLink(res.shared_token);
        copy(res.shared_token);
      })
      .catch();
  };

  const disableBtn = (chartState: any) => {
    return chartState.measures.length === 0 || chartState.dimension.length === 0;
  };
  /*
  function to check for updates in chart 
  returned value is stored in data-update and used in page routing.
  on true opens modal(saveChanges)
  */
  const checkUpdates = () => {
    const { dimension, measures, measuresData } = queryDetails;
    const { dropdown, slider, textBox } = queryFilters;

    if (checkRole(userRole, 'charts') && edit) {
      if (
        Number(queryDetails.optionsCount) !== Number(chartState.optionsCount) ||
        queryDetails.aggregate !== chartState.aggregate ||
        queryDetails.ascending !== chartState.ascending ||
        queryDetails.descending !== chartState.descending ||
        queryDetails.lineWeight !== Number(chartState.lineWeight) ||
        queryDetails.name !== chartState.name ||
        queryDetails.description !== chartState.description ||
        queryDetails.showAxis !== chartState.showAxis ||
        queryDetails.showAxisTitle !== chartState.showAxisTitle ||
        queryDetails.showGrids !== chartState.showGrids ||
        queryDetails.showLabel !== chartState.showLabel ||
        queryDetails.showLegend !== chartState.showLegend ||
        queryDetails.axisTitle !== chartState.axisTitle ||
        queryDetails.type !== chartState.type
      )
        return true;

      let updated = false;
      const tempObj = { dimension, measures, measuresData, dropdown, slider, textBox };
      Object.entries(tempObj).map(([k, v]: any, i: any) => {
        const cloneArr = _.clone(chartState[k]);
        const clonefilter = _.clone(filters1[k]);
        if ([0, 1].includes(i) && !_.isEqual(v, cloneArr)) updated = true;
        else if (
          i === 2 &&
          !_.isEqual(_.map(v, "backgroundColor"), _.map(cloneArr, "backgroundColor"))
        )
          updated = true;
        else if (
          [3, 4, 5].includes(i) &&
          !_.isEqual(_.map(v, "field"), _.map(clonefilter, "field"))
        )
          updated = true;
      });
      return updated;
    } else if (checkRole(userRole, 'charts') && !disableBtn(chartState)) return true;
    return false;
  };
  return (
    <div
      className="d-flex mt-0 align-items-center pb-2 mt-1 me-3"
      style={{ borderBottom: "1px solid #BABABA" }}
    >
      <div>
        {chartState.editTitle ? (
          <Form.Control
            type="text"
            name="chartName"
            className=""
            value={chartState.name}
            onChange={(e: any) => {
              const str = e.target.value;
              const cap = str.charAt(0).toUpperCase() + str.slice(1);
              setChartState({ ...chartState, name: cap });
            }}
            autoFocus={true}
            onBlur={() => setChartState({ ...chartState, editTitle: false })}
          />
        ) : (
          <div className="d-flex flex-row align-items-center">
            <h4
              className="chart-title mb-0 mt-2 chart-2 cursor-pointer"
              onClick={() => setChartState({ ...chartState, editTitle: true })}
            >
              {chartState.name.trim() || "Untitled chart"}
            </h4>
            {chartState.description === "" ? null : (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-engine">
                    {chartState.description ? chartState.description : "Please add a description"}
                  </Tooltip>
                }
              >
                <Image
                  className="mb-0 mt-2 ms-2 cursor-pointer"
                  width={20}
                  height={20}
                  src="/info.svg"
                />
              </OverlayTrigger>
            )}
          </div>
        )}
      </div>
      <div className="ms-auto me-4 mt-1">
        {/* {chartState.name === "Untitled chart" ? (
                  <Button
                    onClick={() => {
                      toast.error("Please provide a name to save the chart!!");
                      setChartState({ ...chartState, editTitle: true, name: "" });
                    }}
                    variant={
                      chartState.name === "Untitled chart" ? "outline-primary" : "primary"
                    }
                    className={
                      "f-14 fw-bold cursor-pointer " +
                      (chartState.name !== "Untitled chart" ? "text-white" : "d-blue")
                    }
                    loading={chartState.saving}
                  >
                    Save
                  </Button>
                ) : ( */}
        {/* {userRole?.user_role === "Owner" || userRole?.user_role === "Collaborator" ? (
          chartState.name === "Untitled chart" ||
          chartState.measures.length === 0 ||
          chartState.dimension.length === 0 ? (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">Please enter chart name</Tooltip>}
            >
              <Button
                style={{
                  letterSpacing: 0.1,
                  borderColor: "#d4d4d4",
                  backgroundColor: "#fff",
                  color: "#d4d4d4",
                }}
                id="save-btn"
              >
                <div className="d-flex w-100 align-items-center">Save</div>
              </Button>
            </OverlayTrigger>
          ) : (
            <Button
              onClick={() => {
                if (edit) {
                  updateChart();
                } else {
                  saveChart();
                }
              }}
              disabled={chartState.name === "Untitled chart"}
              variant={chartState.name === "Untitled chart" ? "outline-primary" : "primary"}
              className={
                "f-14 fw-bold cursor-pointer " +
                (chartState.name !== "Untitled chart" ? "text-white" : "d-blue")
              }
              loading={chartState.saving}
              id="save-btn"
            >
              Save
            </Button>
          )
        ) : (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-3" id="tooltip-engine">
                You didn&apos;t have access to this feature
              </Tooltip>
            }
          >
            <Button
              className="ls"
              style={{ borderColor: "#d4d4d4", backgroundColor: "#fff", color: "#d4d4d4" }}
              id="save-btn"
            >
              <div className="d-flex w-100 align-items-center">Save</div>
            </Button>
          </OverlayTrigger>
        )} */}
        <ToolTip
          position={"bottom"}
          visible={!checkRole(userRole, 'charts')}
          style={{ left: "-130%" }}
          text="You didn't have access to this feature"
          element={() => (
            <Button
              onClick={() => {
                if (edit) {
                  updateChart();
                } else {
                  saveChart();
                }
              }}
              disabled={
                checkRole(userRole, 'charts') && edit ? false : disableBtn(chartState) || !checkRole(userRole, 'charts')
              }
              variant={
                checkRole(userRole, 'charts') && edit
                  ? "primary"
                  : disableBtn(chartState) || !checkRole(userRole, 'charts')
                  ? "light"
                  : "primary"
              }
              className={
                "f-14 ls cursor-pointer btn-sm " +
                (checkRole(userRole, 'charts') && edit
                  ? "text-white"
                  : disableBtn(chartState) || !checkRole(userRole, 'charts')
                  ? "disable-btn"
                  : "text-white")
              }
              loading={chartState.saving}
              id="save-btn"
              data-update={checkUpdates()}
            >
              Save
            </Button>
          )}
        />
      </div>
      {/* <div className="me-3 mt-1">
        <Button
          variant={chartState.name === "Untitled chart" ? "outline-primary" : "primary"}
          onClick={() => {
            setSideBar(!sideBar);
            // setRedraw(!reDraw);
          }}
          className={
            "f-14 fw-bold cursor-pointer " +
            (chartState.name !== "Untitled chart" ? "text-white" : "d-blue")
          }
          // style={{ left: "89%" }}
        >
          {sideBar ? "Collapse" : "Edit"}
        </Button>
      </div> */}

      {type === "query" ? (
        <div className="me-3">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-2" id="tooltip-engine">
                Updated on {chartState.lastUpdated}
              </Tooltip>
            }
          >
            <Image
              src="/charts/refresh.svg"
              className="cursor-pointer chart-5"
              width={20}
              height={20}
              onClick={refreshChart}
            />
          </OverlayTrigger>
        </div>
      ) : null}
      {edit ? (
        <div className="me-3">
          <Overlay
            show={show}
            target={target}
            containerPadding={20}
            rootClose={true}
            onHide={() => {
              setShow(!show);
            }}
            placement="bottom"
          >
            <Popover className="mt-3" id="popover-contained">
              {/* <div>Test</div> */}
              <Popover.Title style={{ opacity: 0.8 }} className="fw-bold f-13 ls black">
                Share chart
              </Popover.Title>
              <Popover.Content>
                <div className="d-flex flex-column">
                  <div className="mb-0">
                    <Form.Label style={{ opacity: 0.8 }} className="f-12 ls black">
                      URL
                    </Form.Label>
                    {/* <Form.Group className="w-100">
                              <Form.Control
                                autoComplete="off"
                                name="password"
                                // type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-100 f-16 mb-0 mr-0"
                                value={text}
                                // onChange={formik.handleChange("password")}
                                // isInvalid={formik.errors.password}
                                readOnly
                                data-autoselect
                              />
                              <i
                                onClick={() => {
                                  shareDashboard();
                                  setViewDashboardStates({
                                    ...viewDashboardStates,
                                    shareLoader: true,
                                  });
                                }}
                              >
                                <Image src="/copy.svg"></Image>
                              </i>
                            </Form.Group> */}

                    <Form.Row>
                      <Form.Group as={Col}>
                        <InputGroup>
                          <Form.Control
                            autoComplete="off"
                            name="url"
                            // type={showPassword ? "text" : "password"}
                            placeholder="URL"
                            className="ls border-right-0 border f-16 mb-0 mr-0"
                            value={text}
                            // onChange={formik.handleChange("password")}
                            // isInvalid={formik.errors.password}
                            readOnly
                            data-autoselect
                            style={{ color: "#7F8F9E" }}
                          />
                          <InputGroup.Prepend>
                            <InputGroup.Text
                              onClick={() => {
                                shareChart();
                                // setLoading(true);
                              }}
                              className="cursor-pointer border-0"
                              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                              <Image className="py-1" src="/copy.svg" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>

                    <Form style={{ backgroundColor: "white" }}>
                      <p className="f-12 ls black my-2 mt-2 p-0" style={{ opacity: 0.8 }}>
                        Email address
                      </p>
                      <CreatableSelect
                        formatCreateLabel={(userInput) => `Send to ${userInput}`}
                        components={components}
                        isClearable
                        isMulti
                        onChange={handleChange}
                        options={triggerState.users}
                        noOptionsMessage={() => null}
                        value={triggerState.email}
                        placeholder="Enter email"
                        type="email"
                        className="f-12 ls"
                        style={{ height: 48, color: "#485255", opacity: 0.8 }}
                      />
                      {error ? (
                        <span
                          id="error"
                          style={{ color: "red", fontSize: "12px", marginLeft: "2px" }}
                        >
                          {errorMessage}
                        </span>
                      ) : null}
                    </Form>
                    {userRole?.user_role === "Owner" || userRole?.user_module_access[4]['Charts'] === 'WRITE'? (
                      <Button
                        // loading={inviteLoader}
                        variant="primary"
                        className="text-white mt-4 f-14"
                        type="button"
                        onClick={sendInvitation}
                        style={{ textAlign: "center", opacity: 0.9, width: 243 }}
                      >
                        Share
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
                        <Button
                          style={{ borderColor: "#d4d4d4", color: "#d4d4d4", width: 243 }}
                          className="mt-4 f-17 ls bg-white text-center"
                        >
                          Share
                        </Button>
                      </OverlayTrigger>
                    )}
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </Overlay>

          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-3" id="tooltip-engine">
                Share chart
              </Tooltip>
            }
          >
            <Image
              src="/shareIcon.svg"
              width={20}
              height={20}
              className="ms-3 cursor-pointer"
              onClick={handleClick}
              // onClick={() => {
              //   shareDashboard1();
              //   handleClick;
              // }}
            />
          </OverlayTrigger>
        </div>
      ) : null}

      <div className="d-flex">
        <ChartMenu
          newState={newState}
          setNewState={setNewState}
          edit={edit}
          saveChart={saveChart}
          updateChart={updateChart}
          chartState={chartState}
          setChartState={setChartState}
          downloadAsImage={downloadAsImage}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default TitleBar;
