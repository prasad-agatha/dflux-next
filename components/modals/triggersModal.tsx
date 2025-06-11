// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react-bootstrap
import { Modal, Form, Col, Row } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// toast
import { toast } from "react-toastify";
// react-select
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
// lodash
import _ from "lodash";
// constants
import { minutes, hours, months, weekDaysList, days } from "constants/common";
// services
import { TriggerService } from "services";

//toast configuration
toast.configure();

const triggers = new TriggerService();

interface IWorkflowProps {
  queriesStates: any;
  setQueriesStates: any;
  triggersMutate: any;
}
const TriggersModal: FC<IWorkflowProps> = (props) => {
  const { queriesStates, setQueriesStates, triggersMutate } = props;

  const router = useRouter();
  const { project_id } = router.query;
  const [activeTab, setActiveTab] = React.useState("hourly");

  const [selectedChart, setSelectedChart]: any = React.useState(queriesStates?.item || []);
  const [allCharts, setAllCharts] = React.useState<any>([]);

  const [chartState, setChartState] = React.useState({
    name: queriesStates.name,
    id: queriesStates.id,
    trigger: queriesStates.trigger,
    query: queriesStates?.query || 0,
  });
  const defaultTriggerState = {
    name: "",
    description: "",
    minute: "*",
    hour: "*",
    day_of_week: "*",
    day_of_month: "*",
    month_of_year: "*",
    save: false,
    tab: activeTab,
    radioHour: "",
    radioMinute: "",
    radioMonth: "",
    radioDaily: "",
    users: [],
    email: [],
    months: [],
    weeks: [] as any,
    defaultEveryDayTime: "0:0",
    defaultEveryWeekDayTime: "0:0",
    defaultEveryWeekEndTime: "0:0",
    defaultWeeklyTime: "0:0",
    defaultEveryMonthTime: "0:0",
    defaultSpecificMonthTime: "0:0",
    evrydayField: true,
    weekdayField: true,
    weekendField: true,
    minDisable: true,
    hrDisable: true,
    everyMonthDisable: true,
    specificMonthDisable: true,
    frequency: "Select",
  };
  const [triggerState, setTriggerState] = React.useState(defaultTriggerState);
  const saveTrigger = () => {
    if (triggerState.name === "") {
      alert("Workflow name cannot be empty");
    } else {
      if (triggerState.email?.length === 0) {
        alert("Select target email");
      } else {
        setTriggerState({ ...triggerState, save: true });

        triggers
          .createChartTrigger(project_id, {
            query: chartState.query,
            chart: chartState.id,
            name: triggerState.name,
            email: _.map(triggerState.email, "value"),
            description: triggerState.description,
            cron_expression: {
              minute: triggerState.minute,
              hour: triggerState.hour,
              day_of_week: triggerState.day_of_week,
              day_of_month: triggerState.day_of_month,
              month_of_year: triggerState.month_of_year,
            },
            extra: triggerState,
            timezone: "UTC",
            project: project_id,
          })
          .then(() => {
            setQueriesStates({ ...queriesStates, trigger: false });
            triggersMutate();
            setActiveTab("hourly");
            setTriggerState({
              ...triggerState,
              save: false,
              radioHour: "",
              radioMinute: "",
              radioMonth: "",
              email: [],
              weeks: [],
              months: [],
            });
            toast.success("New trigger created");
          })
          .catch((res: any) => {
            setTriggerState({ ...triggerState, save: false });
            toast.error("Error creating trigger");
            if (res?.name[0]) {
              toast.error(res.name[0], { autoClose: 3000 });
            }
          });
      }
    }
  };

  // users data
  const { data: userData }: any = useRequest({
    url: `api/projects/${project_id}/members/`,
  });

  React.useEffect(() => {
    if (userData) {
      const data: any = _.map(userData, "user");
      // console.log(data);
      _.map(data, (item) => {
        item.value = item.email;
        item.label = item.email;
        return item;
      });
      setTriggerState({ ...triggerState, users: data });
    }
  }, [userData]);

  const Freq_options = [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const weekDayChange = (e: any) => {
    // setDay_of_week("");
    if (e.target.checked) {
      const arr: any = [...triggerState.weeks, e.target.value];
      setTriggerState({
        ...triggerState,
        minute: "0",
        hour: "0",
        day_of_week: arr.toString(),
        day_of_month: "*",
        month_of_year: "*",
        weeks: arr,
        radioMinute: "",
        radioHour: "",
        radioMonth: "",
        radioDaily: "",
        evrydayField: false,
        weekdayField: false,
        weekendField: false,
        minDisable: false,
        hrDisable: false,
        everyMonthDisable: false,
        specificMonthDisable: false,
      });
    } else {
      const newArr = triggerState.weeks;
      const dataArr = newArr.filter((row: any) => {
        return row !== e.target.value;
      });
      setTriggerState({
        ...triggerState,
        minute: "0",
        hour: "0",
        day_of_week: dataArr.toString(),
        day_of_month: "*",
        month_of_year: "*",
        weeks: dataArr,
        radioMinute: "",
        radioHour: "",
        radioMonth: "",
        radioDaily: "",
        evrydayField: false,
        weekdayField: false,
        weekendField: false,
        minDisable: false,
        hrDisable: false,
        everyMonthDisable: false,
        specificMonthDisable: false,
      });
    }
  };
  // email validation
  const isValid = (email: any) => {
    const re = /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/;
    return re.test(email);
  };

  const handleChange = (newValue: any) => {
    const data: any = [];
    for (let i = 0; i < newValue.length; i++) {
      if (isValid(newValue[i].value)) {
        // this.addToken(newValue[i]);
        data.push(newValue[i]);
      }
    }
    setTriggerState({ ...triggerState, email: data });
  };

  const { data: chartsData }: any = useRequest({
    url: `api/projects/${project_id}/limitedcharts/`,
  });

  React.useEffect(() => {
    if (chartsData) {
      const newArr1 = _.without(
        _.map(chartsData, (item) => {
          if (item.save_from === "query") {
            item["field"] = item.name;
            item["label"] = item.name;
            item["value"] = item.name;
            return item;
          } else return null;
        }),
        null
      );
      setAllCharts(newArr1);
    }
  }, [chartsData]);

  const addQuery = (e: any) => {
    setSelectedChart(e);
    setChartState({ ...chartState, name: e.name, id: e.id, query: e.query.id });
  };

  const handleFrequency = (e: any) => {
    setTriggerState({ ...triggerState, frequency: e.value });
  };
  return (
    <Modal
      // size="lg"
      show={queriesStates.trigger}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className="flex-row align-items-center justify-content-center p-3"
        color="black"
      >
        <h2 className="dialog-title-create-connections f-24 mb-0">
          {/* Create new trigger for {queriesStates.name} */}
          Create trigger
        </h2>
      </Modal.Header>
      <Modal.Body className="p-5 pt-1">
        <div className="d-flex flex-column my-1 pb-2 mt-3">
          <Form.Group className="mb-3">
            <div style={{ width: 390 }}>
              <Select
                className="w-100 f-14"
                classNamePrefix="select a chart:"
                placeholder="Select chart"
                value={selectedChart}
                options={allCharts}
                name="color"
                onChange={addQuery}
              />
            </div>
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>Name</Form.Label> */}
            <div style={{ width: 390 }}>
              <Form.Control
                className="me-1 f-14"
                onChange={(e) => {
                  setTriggerState({ ...triggerState, name: e.target.value });
                }}
                placeholder="Enter trigger name"
              />
            </div>
          </Form.Group>
        </div>
        <Form.Group>
          {/* <Form.Label>Description</Form.Label> */}
          <Form.Control
            onChange={(e) => {
              setTriggerState({ ...triggerState, description: e.target.value });
            }}
            style={{ height: 70, width: 390 }}
            className="mt-2 pb-4 f-14"
            placeholder="About trigger"
          />
        </Form.Group>
        <Form.Group style={{ width: 390 }}>
          <CreatableSelect
            value={triggerState.email}
            isMulti
            onChange={handleChange}
            options={triggerState.users}
            placeholder="Enter email address's"
            style={{ height: 60 }}
            className="mt-3 f-14"
          />
        </Form.Group>
        <Row className="d-flex my-1 pb-2 mt-4">
          <div style={{ width: 100 }}>
            <Form.Group as={Col}>
              <Form.Label className="mt-2 ms-1 f-14">Frequency</Form.Label>
            </Form.Group>
          </div>
          <div style={{ width: 200 }}>
            <Form.Group as={Col}>
              <Select
                classNamePrefix="select"
                options={Freq_options}
                value={{ value: triggerState.frequency, label: triggerState.frequency }}
                placeholder="Select"
                name="color"
                onChange={handleFrequency}
                className="f-14"
              />
            </Form.Group>
          </div>
          {triggerState.frequency === "hourly" ? (
            <Form className="my-3 mt-4">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  name="daily"
                  checked={triggerState.radioHour === "Every"}
                  onChange={() => {
                    setTriggerState({
                      ...triggerState,
                      minute: "0",
                      hour: "*/1",
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                      radioHour: "Every",
                      radioMinute: "",
                      radioDaily: "",
                      radioMonth: "",
                      minDisable: true,
                      hrDisable: false,
                      evrydayField: false,
                      weekdayField: false,
                      weekendField: false,
                      everyMonthDisable: false,
                      specificMonthDisable: false,
                    });
                  }}
                  label="Every"
                  id="hourly2"
                />
                <Form.Control
                  className="ms-2 me-2"
                  onChange={(e: any) => {
                    setTriggerState({
                      ...triggerState,
                      minute: "0",
                      hour: `*/${e.target.value}`,
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                    });
                  }}
                  style={{ width: "8%" }}
                  as="select"
                  disabled={triggerState.hrDisable}
                >
                  {hours.map((item: any, index: any) => {
                    return (
                      <option value={triggerState.hrDisable ? 1 : item} key={index}>
                        {triggerState.hrDisable ? 1 : item}
                      </option>
                    );
                  })}
                </Form.Control>
                hours
              </div>

              <div className="d-flex align-items-center mt-2">
                <Form.Check
                  type="radio"
                  name="daily"
                  checked={triggerState.radioMinute === "Every"}
                  onChange={() => {
                    setTriggerState({
                      ...triggerState,
                      minute: "*/1",
                      hour: "*",
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                      radioMinute: "Every",
                      radioHour: "",
                      radioMonth: "",
                      radioDaily: "",
                      minDisable: false,
                      hrDisable: true,
                      evrydayField: false,
                      weekdayField: false,
                      weekendField: false,
                      everyMonthDisable: false,
                      specificMonthDisable: false,
                    });
                  }}
                  label="Every"
                  id="minute2"
                />
                <Form.Control
                  className="ms-2 me-2 mt-2"
                  onChange={(e: any) => {
                    setTriggerState({
                      ...triggerState,
                      minute: `*/${e.target.value}`,
                      hour: "*",
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                      radioHour: "disabled",
                    });
                  }}
                  style={{ width: "8%" }}
                  as="select"
                  disabled={triggerState.minDisable}
                >
                  {minutes.map((item: any, index: any) => {
                    return (
                      <option value={triggerState.minDisable ? 1 : item} key={index}>
                        {triggerState.minDisable ? 1 : item}
                      </option>
                    );
                  })}
                </Form.Control>
                minutes
              </div>
            </Form>
          ) : triggerState.frequency === "daily" ? (
            <div className="p-2 ms-2 my-3">
              <Form.Group>
                <div className="d-flex align-items-center mt-1">
                  <Form.Check
                    type="radio"
                    name="daily"
                    checked={triggerState.radioDaily === "Everyday"}
                    onChange={() => {
                      setTriggerState({
                        ...triggerState,
                        defaultEveryWeekEndTime: "0:0",
                        defaultEveryWeekDayTime: "0:0",
                        evrydayField: false,
                        weekdayField: true,
                        weekendField: true,
                        minute: "0",
                        hour: "0",
                        day_of_week: "sun,mon,tue,wed,thu,fri,sat",
                        day_of_month: "*",
                        month_of_year: "*",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        radioDaily: "Everyday",
                      });
                    }}
                    label="Everyday"
                    id="daily1"
                  />
                  <input
                    className="ms-4"
                    value={triggerState.evrydayField ? "0:0" : triggerState.defaultEveryDayTime}
                    type="time"
                    style={{ height: "40px", width: "140px" }}
                    disabled={triggerState.evrydayField}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultEveryDayTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                        day_of_week: "*",
                        day_of_month: "*",
                        month_of_year: "*",
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    type="radio"
                    name="daily"
                    checked={triggerState.radioDaily === "Everyweekday"}
                    onChange={() => {
                      setTriggerState({
                        ...triggerState,
                        evrydayField: true,
                        weekdayField: false,
                        weekendField: true,
                        defaultEveryWeekEndTime: "0:0",
                        defaultEveryDayTime: "0:0",
                        minute: "0",
                        hour: "0",
                        day_of_week: "mon,tue,wed,thu,fri",
                        day_of_month: "*",
                        month_of_year: "*",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        radioDaily: "Everyweekday",
                      });
                    }}
                    label="Every weekday (Mon - Fri)"
                    id="daily2"
                  />
                  <input
                    className="ms-4"
                    value={triggerState.weekdayField ? "0:0" : triggerState.defaultEveryWeekDayTime}
                    type="time"
                    style={{ height: "40px", width: "140px" }}
                    disabled={triggerState.weekdayField}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultEveryWeekDayTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                        day_of_week: "*",
                        day_of_month: "*",
                        month_of_year: "*",
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    type="radio"
                    name="daily"
                    checked={triggerState.radioDaily === "Everyweekend"}
                    onChange={() => {
                      setTriggerState({
                        ...triggerState,
                        evrydayField: true,
                        weekdayField: true,
                        weekendField: false,
                        defaultEveryWeekDayTime: "0:0",
                        defaultEveryDayTime: "0:0",
                        minute: "0",
                        hour: "0",
                        day_of_week: "sat,sun",
                        day_of_month: "*",
                        month_of_year: "*",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        radioDaily: "Everyweekend",
                      });
                    }}
                    label="Every weekend (Sat - Sun)"
                    id="daily3"
                  />
                  <input
                    className="ms-4"
                    value={triggerState.weekendField ? "0:0" : triggerState.defaultEveryWeekEndTime}
                    type="time"
                    style={{ height: "40px", width: "140px" }}
                    disabled={triggerState.weekendField}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultEveryWeekEndTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                        day_of_week: "*",
                        day_of_month: "*",
                        month_of_year: "*",
                      });
                    }}
                  />
                </div>
              </Form.Group>
            </div>
          ) : triggerState.frequency === "weekly" ? (
            <div className="p-2">
              <Form>
                <Form.Label className="ms-1 mt-2">Repeat on</Form.Label>
                <div className="p-2 ps-1">
                  {weekDaysList.map((item, index) => {
                    return (
                      <Form.Check
                        onChange={(e: any) => {
                          weekDayChange(e);
                        }}
                        checked={triggerState?.weeks?.includes(item.value)}
                        inline
                        type="checkbox"
                        value={item.value}
                        label={item.name}
                        key={index}
                        id={`weekly${index + 1}`}
                      />
                    );
                  })}
                </div>
                <div className="ps-1 mt-3">
                  <Form.Label className="me-2">Time </Form.Label>
                  <input
                    type="time"
                    style={{ height: "40px", width: "140px" }}
                    value={triggerState.defaultWeeklyTime}
                    disabled={!(triggerState.weeks.length > 0)}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultWeeklyTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
              </Form>
            </div>
          ) : triggerState.frequency === "monthly" ? (
            <div className="p-2">
              <Form>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    onChange={() => {
                      setTriggerState({
                        ...triggerState,
                        minute: "0",
                        hour: "0",
                        day_of_week: "*",
                        day_of_month: "1",
                        month_of_year: "*/1",
                        everyMonthDisable: false,
                        specificMonthDisable: true,
                        defaultSpecificMonthTime: "0:0",
                        evrydayField: false,
                        weekdayField: false,
                        weekendField: false,
                        minDisable: false,
                        hrDisable: false,
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "EveryMonth",
                        radioDaily: "",
                      });
                    }}
                    checked={triggerState.radioMonth === "EveryMonth"}
                    type="radio"
                    name="monthly"
                    label="Run every month "
                    id="monthly1"
                  />
                  <Form.Control
                    name="day"
                    as="select"
                    className="mx-2"
                    style={{ width: "8%" }}
                    disabled={!(triggerState.radioMonth === "EveryMonth")}
                    onChange={(e: any) => {
                      setTriggerState({
                        ...triggerState,
                        day_of_month: `${e.target.value}`,
                      });
                    }}
                  >
                    {days.map((day) => {
                      return (
                        <option value={triggerState.everyMonthDisable ? 1 : day} key={day}>
                          {triggerState.everyMonthDisable ? 1 : day}
                        </option>
                      );
                    })}
                  </Form.Control>
                  Day, at
                  <input
                    type="time"
                    className="mx-2"
                    style={{ height: "40px", width: "140px" }}
                    value={
                      triggerState.radioMonth === "EveryMonth"
                        ? triggerState.defaultEveryMonthTime
                        : "0:0"
                    }
                    disabled={!(triggerState.radioMonth === "EveryMonth")}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultEveryMonthTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    onChange={() => {
                      setTriggerState({
                        ...triggerState,
                        minute: "0",
                        hour: "0",
                        day_of_week: "*",
                        day_of_month: "1",
                        month_of_year: "*/1",
                        radioMonth: "SpecificMonths",
                        radioMinute: "",
                        radioHour: "",
                        radioDaily: "",
                        everyMonthDisable: true,
                        specificMonthDisable: false,
                        evrydayField: false,
                        weekdayField: false,
                        weekendField: false,
                        minDisable: false,
                        hrDisable: false,
                        defaultEveryMonthTime: "0:0",
                      });
                    }}
                    checked={triggerState.radioMonth === "SpecificMonths"}
                    type="radio"
                    name="monthly"
                    label="Run on"
                    id="monthly2"
                  />
                  <Form.Control
                    name="day"
                    as="select"
                    className="m-2"
                    style={{ width: "8%" }}
                    disabled={!(triggerState.radioMonth === "SpecificMonths")}
                    onChange={(e: any) => {
                      setTriggerState({
                        ...triggerState,
                        day_of_month: `${e.target.value}`,
                      });
                    }}
                  >
                    {days.map((day) => {
                      return (
                        <option value={triggerState.specificMonthDisable ? 1 : day} key={day}>
                          {triggerState.specificMonthDisable ? 1 : day}
                        </option>
                      );
                    })}
                  </Form.Control>
                  of every
                  <Select
                    isDisabled={!(triggerState.radioMonth === "SpecificMonths")}
                    isMulti
                    name="months"
                    value={
                      triggerState.radioMonth === "SpecificMonths" ? triggerState.months : null
                    }
                    options={months}
                    className="multi-select-box w-25 m-2"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    onChange={(value: any) => {
                      const data: any = [];
                      value.map((item: any) => {
                        data.push(item.value);
                      });
                      setTriggerState({
                        ...triggerState,
                        minute: "0",
                        hour: "0",
                        day_of_week: "*",
                        day_of_month: "1",
                        month_of_year: data.toString(),
                        months: value,
                      });
                    }}
                  />
                  months, at
                  <input
                    type="time"
                    className="m-2"
                    style={{ height: "40px", width: "140px" }}
                    value={
                      triggerState.radioMonth === "SpecificMonths"
                        ? triggerState.defaultSpecificMonthTime
                        : "0:0"
                    }
                    disabled={!(triggerState.radioMonth === "SpecificMonths")}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setTriggerState({
                        ...triggerState,
                        defaultSpecificMonthTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
              </Form>
            </div>
          ) : (
            <></>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 mb-2 d-flex justify-content-center align-items-center">
        <button
          className="btn bg-white"
          onClick={() => {
            setQueriesStates({ ...queriesStates, trigger: false });
            setActiveTab("hourly");
            setTriggerState(defaultTriggerState);
            setSelectedChart([]);
          }}
        >
          Cancel
        </button>
        <Button loading={triggerState.save} onClick={saveTrigger} className="text-white">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TriggersModal;
