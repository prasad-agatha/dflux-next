import React, { FC } from "react";
import { Card, Image, Popover, ListGroup, OverlayTrigger } from "react-bootstrap";
// react select
import Select from "react-select";

interface FieldChangeProps {
  chartState: any;
  initialCondition: any;
  changeField: any;
  setChangeField: any;
  renderChart: any;
  filters: any;
  setChartState: any;
}

const FieldChanger: FC<FieldChangeProps> = (props) => {
  const {
    chartState,
    initialCondition,
    changeField,
    setChangeField,
    setChartState,
    renderChart,
    filters,
  } = props;
  // checktype
  const checkType = (type: any) => {
    switch (type) {
      case "number":
        return <Image src="/charts/123Icon.svg" className="me-2" />;
      case "string":
        return <Image src="/charts/abcIcon.svg" className="me-2" />;
      case "date":
        return <Image src="/charts/date_icon.svg" className="me-2" />;
    }
  };
  const formatOptionLabel = ({ label, type }: any) => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>{label}</div>
      <div style={{ color: "black", marginLeft: 10 }}>{checkType(type)}</div>
    </div>
  );

  return (
    <>
      {initialCondition ? (
        <div className="">
          <Card className="mb-2 p-1 field-card">
            <Card.Body className="p-1">
              <p
                className="mb-0 border ps-2 p-1 f-12"
                style={{ backgroundColor: "#C9DCF2", borderRadius: 2, color: "#485255" }}
              >
                <Image src="/charts/abcIcon.svg" className="me-2" />
                {chartState.sortingField}
              </p>
            </Card.Body>
            <div className="d-flex justify-content-center">
              <OverlayTrigger
                //   rootClose
                trigger="click"
                placement="left-start"
                overlay={
                  <Popover popper id="popover-basic1" className="border-0" style={{ width: 400 }}>
                    <Popover.Content className="p-0">
                      <ListGroup className="border-0 p-0">
                        <ListGroup.Item
                          onClick={() => {
                            document.body.click();
                          }}
                          className="p-0 border-0"
                        >
                          <Select
                            menuPlacement="top"
                            defaultValue={{
                              value: chartState.sortingField,
                              label: chartState.sortingField,
                            }}
                            formatOptionLabel={formatOptionLabel}
                            menuPosition="absolute"
                            className="single-select-box w-100"
                            classNamePrefix="select"
                            options={chartState.options}
                            name="x-filter"
                            id="select-x-filter"
                            onChange={(option: any) => {
                              setChartState({ ...chartState, sortingField: option.value });
                            }}
                          />
                        </ListGroup.Item>
                      </ListGroup>
                    </Popover.Content>
                  </Popover>
                }
                // transition
              >
                {!changeField ? (
                  <Image
                    onClick={() => {
                      document.body.click();
                      setChangeField(true);
                    }}
                    className="cursor-pointer "
                    src="/edit.svg"
                  />
                ) : (
                  <Image
                    onClick={() => {
                      document.body.click();
                      setChangeField(false);
                      renderChart(
                        chartState.data,
                        chartState.dimension,
                        chartState.measures,
                        chartState.aggregate,
                        filters,
                        chartState.optionsCount,
                        chartState.ascending,
                        chartState.descending,
                        chartState.sortingField
                      );
                    }}
                    src="/charts/updateIcon.svg"
                    className="cursor-pointer "
                  />
                )}
              </OverlayTrigger>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
};
export default FieldChanger;
