import React, { FC } from "react";
// react-bootstrap
import { Image, Popover, ListGroup, OverlayTrigger } from "react-bootstrap";
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
import { months } from "constants/common";
import _ from "lodash";

interface ITriggerMenuProps {
  row: any;
  deleteTrigger: any;
  detailsState: any;
  setDetailsState: any;
  viewTriggerState: any;
  setViewTriggerState: any;
  userRole: any;
}

const TriggerMenu: FC<ITriggerMenuProps> = (props) => {
  const {
    row,
    deleteTrigger,
    detailsState,
    setDetailsState,
    viewTriggerState,
    setViewTriggerState,
    userRole,
  } = props;
  const [triggerDelete, setTriggerDelete] = React.useState(false);
  const edit = () => {
    const newArr: any = [];

    _.map(row.email, (item) => {
      const obj: any = {};
      obj["label"] = item;
      obj["value"] = item;

      newArr.push(obj);
    });
    let a: any = [];
    a = row?.cron_expression.month_of_year.split(",");
    const b: any = [];
    months?.map((item: any) => {
      if (a.includes(item.value)) {
        b.push(item);
      }
    });
    setViewTriggerState({
      ...viewTriggerState,
      email: newArr,
      id: row?.id,
      name: row?.name,
      chartName: row?.chart_name,
      frequency: row?.extra.frequency,
      description: row?.description,
      minute: row?.cron_expression.minute,
      hour: row?.cron_expression.hour,
      day_of_week: row?.cron_expression.day_of_week,
      day_of_month: row?.cron_expression.day_of_month,
      month_of_year: row?.cron_expression.month_of_year,
      periodicTask: row?.periodic_task,
      tab: row?.extra?.tab,
      radioHour: row?.extra?.radioHour,
      radioMinute: row?.extra?.radioMinute,
      radioMonth: row?.extra?.radioMonth,
      radioDaily: row?.extra?.radioDaily,
      users: row?.extra?.users,
      weeks: row?.cron_expression?.day_of_week.split(","),
      months: b,
      minDisable: row?.extra?.minDisable,
      hrDisable: row?.extra?.hrDisable,
      everyMonthDisable: row?.extra?.everyMonthDisable,
      specificMonthDisable: row?.extra?.specificMonthDisable,
      defaultEveryDayTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      defaultEveryWeekDayTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      defaultEveryWeekEndTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      defaultWeeklyTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      defaultEveryMonthTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      defaultSpecificMonthTime: `${row?.cron_expression?.hour}:${row?.cron_expression?.minute}`,
      evrydayField: row?.extra?.evrydayField,
      weekdayField: row?.extra?.weekdayField,
      weekendField: row?.extra?.weekendField,
    });
    setDetailsState({
      ...detailsState,
      id: row.chart,
      viewtrigger: true,
    });
  };
  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        {userRole?.user_role === "Owner" ||
        userRole?.user_module_access[5]["Triggers"] === "WRITE" ? (
          <>
            <ListGroup style={{ border: "0px solid black" }}>
              <ListGroup.Item
                className="menu-item list-group-item"
                onClick={() => {
                  document.body.click();
                  edit();
                }}
              >
                <div className="df1 flex-row">
                  <Image src="/newicons/chart-menu/edit.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Edit</p>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <ListGroup style={{ border: "0px solid black" }}>
              <ListGroup.Item
                className="menu-item list-group-item"
                onClick={() => {
                  document.body.click();
                  setTriggerDelete(!triggerDelete);
                }}
              >
                <div className="df1 flex-row">
                  <Image src="/newicons/delete.svg" className="menu-item-icon" />
                  <p className="menu-item-text mb-0">Delete</p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </>
        ) : (
          <>
            <ListGroup style={{ border: "0px solid black" }}>
              <ListGroup.Item
                className="menu-item list-group-item"
                onClick={() => {
                  document.body.click();
                  edit();
                }}
              >
                <div className="df1 flex-row">
                  <Image src="/newicons/chart-menu/edit.svg" className="menu-item-icon" />
                  <p className="menu-item-text_disable mb-0">Edit</p>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <ListGroup style={{ border: "0px solid black" }}>
              <ListGroup.Item className="menu-item list-group-item disabled-item-hover">
                <div className="df1 flex-row">
                  <Image src="/newicons/disabled-delete.svg" className="menu-item-icon" />
                  <p className="menu-item-text_disable mb-0">Delete</p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </>
        )}
      </Popover.Content>
    </Popover>
  );
  return (
    <div>
      <OverlayTrigger
        rootClose
        trigger="click"
        placement="bottom-start"
        overlay={popover}
        transition
      >
        <MoreVerticalOutline className="icon-size" />
      </OverlayTrigger>

      <Modal
        show={triggerDelete}
        onHide={() => {
          setTriggerDelete(!triggerDelete);
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <h4 className="p-2 pt-3 mb-0 mt-1 d-flex justify-content-center align-items-center">
            Confirm delete
          </h4>
          <div className="mb-0 mt-1 d-flex justify-content-center align-items-center pt-0">
            <p className="d-flex justify-content-center align-items-center">
              Are you sure you want to delete this chart?
            </p>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mb-4 mt-4">
            <button
              className="btn bg-white"
              onClick={() => {
                setTriggerDelete(!triggerDelete);
              }}
            >
              Cancel
            </button>
            <Button
              variant="danger"
              className="text-white"
              // loading={deleteLoader}
              onClick={() => {
                deleteTrigger(row.id);
                setTriggerDelete(!triggerDelete);
              }}
              style={{ width: 150, marginLeft: "25px" }}
            >
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TriggerMenu;
