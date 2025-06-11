import React, { FC } from "react";
// react-bootstrap
import { Modal, Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
// react-select
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Button from "react-bootstrap-button-loader";
import { minutes, hours, months, weekDaysList, days } from "constants/common";

interface ITriggerDetailsProps {
  detailsState: any;
  setDetailsState: any;
  viewTriggerState: any;
  setViewTriggerState: any;
  updateTrigger: any;
  userRole: any;
}

const TriggerDetails: FC<ITriggerDetailsProps> = (props) => {
  const {
    detailsState,
    setDetailsState,
    viewTriggerState,
    setViewTriggerState,
    updateTrigger,
    userRole,
  } = props;

  const weekDayChange = (e: any) => {
    if (e.target.checked) {
      const arr: any = [...viewTriggerState.weeks, e.target.value];
      setViewTriggerState({
        ...viewTriggerState,
        minute: "0",
        hour: "0",
        day_of_week: arr.toString(),
        day_of_month: "*",
        month_of_year: "*",
        weeks: arr,
        evrydayField: false,
        weekdayField: false,
        weekendField: false,
        minDisable: false,
        hrDisable: false,
        everyMonthDisable: false,
        specificMonthDisable: false,
        radioMinute: "",
        radioHour: "",
        radioMonth: "",
      });
    } else {
      const newArr = viewTriggerState.weeks;
      const dataArr: any = newArr.filter((row: any) => {
        return row !== e.target.value;
      });
      setViewTriggerState({
        ...viewTriggerState,
        minute: "0",
        hour: "0",
        day_of_week: dataArr.toString(),
        day_of_month: "*",
        month_of_year: "*",
        weeks: dataArr,
        evrydayField: false,
        weekdayField: false,
        weekendField: false,
        minDisable: false,
        hrDisable: false,
        everyMonthDisable: false,
        specificMonthDisable: false,
        radioMinute: "",
        radioHour: "",
        radioMonth: "",
      });
    }
  };

  const Freq_options = [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];
  const isValid = (email: any) => {
    const re = /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/;
    return re.test(email);
  };
  const handleFrequency = (e: any) => {
    setViewTriggerState({
      ...viewTriggerState,
      frequency: e.value,
    });
  };
  const handleChange = (newValue: any) => {
    const data = [];
    for (let i = 0; i < newValue.length; i++) {
      if (isValid(newValue[i].value)) {
        data.push(newValue[i]);
      }
    }
    setViewTriggerState({
      ...viewTriggerState,
      email: data,
    });
  };
  return (
    <Modal
      // size="lg"
      show={detailsState?.viewtrigger}
      centered
      onHide={() => {
        setViewTriggerState({
          ...viewTriggerState,
          disabled: true,
          name: "",
          description: "",
          radioHour: "",
          radioMinute: "",
          radioMonth: "",
          email: [],
          weeks: [],
          months: [],
          update: false,
        });
        setDetailsState({ ...detailsState, viewtrigger: false });
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className="flex-row align-items-center justify-content-center d-flex p-3"
        color="black"
      >
        <h2 className="dialog-title-create-connections f-24 mb-0">
          Trigger - {viewTriggerState.name}
        </h2>
      </Modal.Header>
      <Modal.Body className="pt-1">
        <Row className="d-flex my-1 mt-1 pb-2">
          <Form.Group as={Col}>
            <Form.Label>Chart name</Form.Label>
            <h5 style={{ textTransform: "capitalize" }}>{viewTriggerState.chartName} </h5>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Trigger name</Form.Label>
            <Form.Control
              disabled={viewTriggerState.disabled}
              value={viewTriggerState.name}
              onChange={(e) => {
                setViewTriggerState({
                  ...viewTriggerState,
                  name: e.target.value,
                });
              }}
              placeholder="Enter name"
            />
          </Form.Group>
        </Row>

        <Form.Group>
          <Form.Label>About trigger</Form.Label>
          <Form.Control
            disabled={viewTriggerState.disabled}
            value={viewTriggerState.description}
            onChange={(e) => {
              setViewTriggerState({
                ...viewTriggerState,
                description: e.target.value,
              });
            }}
            placeholder="Enter description"
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Email</Form.Label>
          <CreatableSelect
            isDisabled={viewTriggerState.disabled}
            value={viewTriggerState.email}
            isMulti
            onChange={handleChange}
            options={viewTriggerState.users}
          />
        </Form.Group>

        <Row className="d-flex my-1 pb-2 mt-4">
          <div style={{ width: 100 }}>
            <Form.Group as={Col}>
              <Form.Label className="mt-2 ms-1">Frequency</Form.Label>
            </Form.Group>
          </div>
          <div style={{ width: 200 }}>
            <Form.Group as={Col}>
              <Select
                classNamePrefix="select"
                value={{
                  label: viewTriggerState.frequency,
                  value: viewTriggerState.frequency,
                }}
                options={Freq_options}
                placeholder="Select"
                name="color"
                onChange={handleFrequency}
              />
            </Form.Group>
          </div>
          {viewTriggerState.frequency === "hourly" ? (
            <Form className="my-3 mt-4">
              <div className="d-flex align-items-center">
                <Form.Check
                  disabled={viewTriggerState.disabled}
                  checked={viewTriggerState.radioHour === "Every"}
                  type="radio"
                  name="daily"
                  onChange={() => {
                    setViewTriggerState({
                      ...viewTriggerState,
                      radioHour: "Every",
                      minDisable: true,
                      hrDisable: false,
                      radioMinute: "",
                      radioMonth: "",
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
                  onClick={(e: any) => {
                    setViewTriggerState({
                      ...viewTriggerState,
                      minute: "0",
                      hour: `*/${e.target.value}`,
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                    });
                  }}
                  defaultValue={viewTriggerState.hour.split("*/")[1]}
                  style={{ width: "8%" }}
                  as="select"
                  disabled={viewTriggerState.hrDisable || viewTriggerState.disabled}
                >
                  {hours.map((item: any, index: any) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                hours
              </div>

              <div className="d-flex align-items-center mt-2">
                <Form.Check
                  disabled={viewTriggerState.disabled}
                  checked={viewTriggerState.radioMinute === "Every"}
                  type="radio"
                  name="daily"
                  onChange={() => {
                    setViewTriggerState({
                      ...viewTriggerState,
                      radioMinute: "Every",
                      radioHour: "",
                      radioMonth: "",
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
                  className="ms-2 me-2"
                  onClick={(e: any) => {
                    setViewTriggerState({
                      ...viewTriggerState,
                      minute: `*/${e.target.value}`,
                      hour: "*",
                      day_of_week: "*",
                      day_of_month: "*",
                      month_of_year: "*",
                    });
                  }}
                  style={{ width: "8%" }}
                  as="select"
                  defaultValue={viewTriggerState.minute.split("*/")[1]}
                  disabled={viewTriggerState.minDisable || viewTriggerState.disabled}
                >
                  {minutes.map((item: any, index: any) => {
                    return (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                minutes
              </div>
            </Form>
          ) : viewTriggerState.frequency === "daily" ? (
            <div className="p-2 ms-2 my-3">
              <Form.Group>
                <div className="d-flex align-items-center mt-1">
                  <Form.Check
                    disabled={viewTriggerState.disabled}
                    checked={viewTriggerState.radioDaily === "Everyday"}
                    type="radio"
                    name="daily"
                    onChange={() => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        evrydayField: false,
                        weekdayField: true,
                        weekendField: true,
                        defaultEveryWeekDayTime: "0:0",
                        defaultEveryWeekEndTime: "0:0",
                        day_of_week: "sun,mon,tue,wed,thu,fri,sat",
                        day_of_month: "*",
                        month_of_year: "*",
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioDaily: "Everyday",
                      });
                    }}
                    label="Everyday"
                    id="daily1"
                  />
                  <input
                    className="ms-2"
                    style={{ height: "40px", width: "140px" }}
                    value={
                      viewTriggerState.evrydayField ? "0:0" : viewTriggerState.defaultEveryDayTime
                    }
                    type="time"
                    disabled={viewTriggerState.evrydayField || viewTriggerState.disabled}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryDayTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    disabled={viewTriggerState.disabled}
                    type="radio"
                    checked={viewTriggerState.radioDaily === "Everyweekday"}
                    name="daily"
                    onChange={() => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryDayTime: "0:0",
                        defaultEveryWeekEndTime: "0:0",
                        weekendField: true,
                        evrydayField: true,
                        weekdayField: false,
                        day_of_week: "mon,tue,wed,thu,fri",
                        day_of_month: "*",
                        month_of_year: "*",
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioDaily: "Everyweekday",
                      });
                    }}
                    label="Every weekday (Mon - Fri)"
                    id="daily2"
                  />
                  <input
                    className="ms-2"
                    style={{ height: "40px", width: "140px" }}
                    value={
                      viewTriggerState.weekdayField
                        ? "0:0"
                        : viewTriggerState.defaultEveryWeekDayTime
                    }
                    type="time"
                    disabled={viewTriggerState.weekdayField || viewTriggerState.disabled}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryWeekDayTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    disabled={viewTriggerState.disabled}
                    checked={viewTriggerState.radioDaily === "Everyweekend"}
                    type="radio"
                    name="daily"
                    onChange={() => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryDayTime: "0:0",
                        defaultEveryWeekDayTime: "0:0",
                        weekendField: false,
                        evrydayField: true,
                        weekdayField: true,
                        day_of_week: "sat,sun",
                        day_of_month: "*",
                        month_of_year: "*",
                        radioMinute: "",
                        radioHour: "",
                        radioMonth: "",
                        everyMonthDisable: false,
                        specificMonthDisable: false,
                        minDisable: false,
                        hrDisable: false,
                        radioDaily: "Everyweekend",
                      });
                    }}
                    label="Every weekend (Sat - Sun)"
                    id="daily3"
                  />
                  <input
                    className="ms-2"
                    style={{ height: "40px", width: "140px" }}
                    value={
                      viewTriggerState.weekendField
                        ? "0:0"
                        : viewTriggerState.defaultEveryWeekEndTime
                    }
                    type="time"
                    disabled={viewTriggerState.weekendField || viewTriggerState.disabled}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryWeekEndTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
              </Form.Group>
            </div>
          ) : viewTriggerState.frequency === "weekly" ? (
            <div className="p-2">
              <Form>
                <Form.Label className="ms-1 mt-2">Repeat on</Form.Label>
                <div className="p-2 ps-1">
                  {weekDaysList.map((item, index) => {
                    return (
                      <Form.Check
                        disabled={viewTriggerState.disabled}
                        onChange={(e: any) => {
                          weekDayChange(e);
                        }}
                        inline
                        checked={viewTriggerState?.weeks?.includes(item.value)}
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
                    className="m-2"
                    value={viewTriggerState.defaultWeeklyTime}
                    disabled={!(viewTriggerState.weeks.length > 1) || viewTriggerState.disabled}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultWeeklyTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
              </Form>
            </div>
          ) : viewTriggerState.frequency === "monthly" ? (
            <div className="p-2">
              <Form>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    disabled={viewTriggerState.disabled}
                    checked={viewTriggerState.radioMonth === "EveryMonth"}
                    onChange={() => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        minute: "0",
                        hour: "0",
                        day_of_week: "*",
                        day_of_month: "1",
                        month_of_year: "*/1",
                        radioMonth: "EveryMonth",
                        radioMinute: "",
                        radioHour: "",
                        everyMonthDisable: false,
                        specificMonthDisable: true,
                        defaultSpecificMonthTime: "0:0",
                      });
                    }}
                    type="radio"
                    name="monthly"
                    label="Run every month"
                    id="monthly1"
                  />
                  <Form.Control
                    name="day"
                    as="select"
                    defaultValue={viewTriggerState.day_of_month}
                    className="mx-2"
                    style={{ width: "8%" }}
                    disabled={!(viewTriggerState.radioMonth === "EveryMonth")}
                    onChange={(e: any) => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        day_of_month: `${e.target.value}`,
                      });
                    }}
                  >
                    {days.map((day) => {
                      return (
                        <option value={viewTriggerState.everyMonthDisable ? 1 : day} key={day}>
                          {viewTriggerState.everyMonthDisable ? 1 : day}
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
                      viewTriggerState.radioMonth === "EveryMonth"
                        ? viewTriggerState.defaultEveryMonthTime
                        : "0:0"
                    }
                    disabled={!(viewTriggerState.radioMonth === "EveryMonth")}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
                        defaultEveryMonthTime: e.target.value,
                        minute: segregattedValues[1],
                        hour: segregattedValues[0],
                      });
                    }}
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <Form.Check
                    disabled={viewTriggerState.disabled}
                    checked={viewTriggerState.radioMonth === "SpecificMonths"}
                    onChange={() => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        minute: "0",
                        hour: "0",
                        day_of_week: "*",
                        day_of_month: "1",
                        month_of_year: "*/1",
                        radioMonth: "SpecificMonths",
                        radioMinute: "",
                        radioHour: "",
                        everyMonthDisable: true,
                        specificMonthDisable: false,
                        defaultEveryMonthTime: "0:0",
                      });
                    }}
                    type="radio"
                    name="monthly"
                    label="Run on"
                    id="monthly2"
                  />
                  <Form.Control
                    name="day"
                    as="select"
                    defaultValue={viewTriggerState.day_of_month}
                    className="m-2"
                    style={{ width: "8%" }}
                    disabled={!(viewTriggerState.radioMonth === "SpecificMonths")}
                    onChange={(e: any) => {
                      setViewTriggerState({
                        ...viewTriggerState,
                        day_of_month: `${e.target.value}`,
                      });
                    }}
                  >
                    {days.map((day) => {
                      return (
                        <option value={viewTriggerState.specificMonthDisable ? 1 : day} key={day}>
                          {viewTriggerState.specificMonthDisable ? 1 : day}
                        </option>
                      );
                    })}
                  </Form.Control>
                  of every
                  <Select
                    isDisabled={!(viewTriggerState.radioMonth === "SpecificMonths")}
                    isMulti
                    name="months"
                    value={
                      viewTriggerState.radioMonth === "SpecificMonths"
                        ? viewTriggerState.months
                        : null
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
                      setViewTriggerState({
                        ...viewTriggerState,
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
                      viewTriggerState.radioMonth === "SpecificMonths"
                        ? viewTriggerState.defaultSpecificMonthTime
                        : "0:0"
                    }
                    disabled={!(viewTriggerState.radioMonth === "SpecificMonths")}
                    onChange={(e) => {
                      const segregattedValues = e.target.value.split(":");
                      setViewTriggerState({
                        ...viewTriggerState,
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

      {viewTriggerState.disabled ? (
        <Modal.Footer className="border-0 pt-0 mb-2 dflex justify-content-center align-items-center">
          <button
            className="btn ms-3 bg-white"
            onClick={() => {
              setViewTriggerState({
                ...viewTriggerState,
                disabled: true,
                name: "",
                description: "",
                radioHour: "",
                radioMinute: "",
                radioMonth: "",
                email: [],
                weeks: [],
                months: [],
                update: false,
                frequency: "",
              });
              setDetailsState({ ...detailsState, viewtrigger: false });
            }}
          >
            Cancel
          </button>
          {userRole?.user_role === "Owner" ? (
            <Button
              onClick={() => {
                setViewTriggerState({
                  ...viewTriggerState,
                  disabled: false,
                });
              }}
              className="mt-1 text-white"
            >
              Edit
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
                style={{ borderColor: "#d4d4d4", backgroundColor: "#fff", color: "#d4d4d4" }}
                className="f-14 ls"
              >
                Edit
              </Button>
            </OverlayTrigger>
          )}
        </Modal.Footer>
      ) : null}

      {viewTriggerState.disabled === false ? (
        <Modal.Footer className="border-0 pt-0 mb-2 dflex justify-content-center align-items-center">
          <button
            className="btn ms-3 bg-white"
            onClick={() => {
              setViewTriggerState({
                ...viewTriggerState,
                disabled: true,
                name: "",
                description: "",
                radioHour: "",
                radioMinute: "",
                radioMonth: "",
                email: [],
                weeks: [],
                months: [],
                update: false,
                frequency: "",
              });
              setDetailsState({ ...detailsState, viewtrigger: false });
            }}
          >
            Cancel
          </button>

          <Button loading={viewTriggerState.update} onClick={updateTrigger} className="text-white">
            Update
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};
export default TriggerDetails;
