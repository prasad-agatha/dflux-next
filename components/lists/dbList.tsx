// react
import React, { FC } from "react";
// react-bootstrap
import { Card, Accordion, Button, Image } from "react-bootstrap";
// styled icons
import { Table } from "@styled-icons/bootstrap/Table";
import { Database } from "@styled-icons/fa-solid/Database";
// import { CaretForwardCircle, CaretBackCircle } from "@styled-icons/ionicons-outline";
// import { ArrowheadDownOutline } from "@styled-icons/evaicons-outline/ArrowheadDownOutline";
import { ArrowIosDownwardOutline } from "@styled-icons/evaicons-outline/ArrowIosDownwardOutline";

interface IDbListProps {
  connection?: any;
  tables?: any;
  dbCollapse: any;
  setDbCollapse: any;
  excel?: any;
  excelData?: any;
}

const DbList: FC<IDbListProps> = (props) => {
  const { connection, tables, dbCollapse, setDbCollapse, excel, excelData } = props;

  return (
    <div className="flex-column w-100 h-100 d-flex">
      <Accordion defaultActiveKey="0">
        <Card className="border-0 ">
          <div
            className="d-flex w-100 p-2 flex-row bold align-items-center border-bottom"
            style={{ color: "#727E94", backgroundColor: "white" }}
          >
            <div className="d-flex w-100 align-items-center">
              <Database width={13} height={15} style={{ color: "#BCC5CE" }} />
              <h2 className="f-14 mb-0 ms-3 pb-0 query-2 overflow-hidden overflow-whitespace">
                {excel && excelData ? excelData[0]?.table_name : connection?.name}
              </h2>
            </div>
          </div>
          <Accordion.Collapse eventKey="0" className=" query-3">
            <div className="flex-column">
              {tables?.map((table: any, index: any) => (
                <Card.Body className="p-0 ps-2" key={index}>
                  <Accordion>
                    <Card className="border-0 mt-2">
                      {dbCollapse ? (
                        <div className="d-flex w-100 justify-content-around align-items-center">
                          <Table
                            width={16}
                            height={16}
                            className="me-2"
                            onClick={() => setDbCollapse(!dbCollapse)}
                          />
                        </div>
                      ) : (
                        <>
                          <Accordion.Toggle
                            className="d-flex w-100 border-0 p-1 flex-row bold align-items-center"
                            as={Button}
                            // variant="link"
                            eventKey="1"
                            style={{ color: "#727E94", backgroundColor: "white" }}
                          >
                            <div className="p-1 ps-4 w-100" style={{ borderRadius: 5 }}>
                              <div className="d-flex align-items-center">
                                <Table
                                  width={16}
                                  height={16}
                                  className="me-2"
                                  style={{ color: "#BCC5CE" }}
                                />
                                <h2 className="f-14 mb-0 overflow-hidden overflow-whitespace">
                                  <p className="mb-0">{table.table_name}</p>
                                </h2>
                                <ArrowIosDownwardOutline
                                  width={16}
                                  height={16}
                                  className="ms-auto text-dark"
                                />
                              </div>
                            </div>
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="1" className="">
                            <Card.Body className="p-1 ps-2" key={index}>
                              <div className="p-1 ps-4" style={{ borderRadius: 5 }}>
                                <div className="d-flex  flex-column">
                                  {table.columns.map((col: any, index1: any) => {
                                    return (
                                      <div className="d-flex ps-2 p-1" key={index1}>
                                        {col.type === "character varying" ? (
                                          <Image src="/charts/abcIcon.svg" className="me-2" />
                                        ) : null}
                                        {col.type === "character" ? (
                                          <Image src="/charts/abcIcon.svg" className="me-2" />
                                        ) : null}
                                        {col.type === "varying" ? (
                                          <Image src="/charts/123Icon.svg" className="me-2" />
                                        ) : null}
                                        {col.type === "numeric" ||
                                        col.type === "number" ||
                                        col.type === "bigint" ||
                                        col.type === "integer" ||
                                        col.type === "double precision" ||
                                        col.type === "double" ||
                                        col.type === "precision" ? (
                                          <Image src="/charts/123Icon.svg" className="me-2" />
                                        ) : null}
                                        {col.type === "date" ? (
                                          <Image src="/charts/date_icon.svg" className="me-2" />
                                        ) : null}

                                        {/* <Table width={16} height={16} className="me-2" /> */}
                                        <h2 className="f-14 mb-0 overflow-hidden overflow-whitespace">
                                          {col.name}
                                        </h2>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </>
                      )}
                    </Card>
                  </Accordion>
                </Card.Body>
              ))}
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};
export default DbList;
