// react
import React, { FC } from "react";
// react bootstrap
import { Spinner, Accordion, Card, Image } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
import { ListTable } from "components/data-tables";
import { DatasetMenu } from "components/menu";
import { sampleDatasets, sampleDatasetTips } from "constants/common";
import { ChevronDown } from "@styled-icons/bootstrap/ChevronDown";

const SampleDatasets: FC = () => {
  const [state, setState] = React.useState([] as any);

  React.useEffect(() => {
    setTimeout(() => {
      setState(sampleDatasets);
    }, 1000);
  }, []);

  const columns = [
    {
      name: "DATASET NAME",
      sortable: true,
      center: false,
      selector: "name",
    },
    {
      name: "BEST SUITS FOR",
      sortable: true,
      center: false,
      selector: "bestsuits",
    },
    {
      name: "DATASET TYPE",
      sortable: true,
      center: false,
      selector: "type",
    },
    {
      name: "OWNER",
      sortable: true,
      center: false,
      selector: "owner",
      //   cell: (row: any) => <>{row.created}</>,
    },
    {
      // option - menu
      name: "OPTIONS",
      center: true,
      width: "10%",
      // style: { cursor: "auto" },
      cell: (row: any) => <DatasetMenu row={row} />,
    },
  ];
  const [idx, setIdx] = React.useState(false);
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Sample Datasets`} description="User settings" />
      <div className="px-5 ms-5 mt-2 ">
        {state.length === 0 ? (
          <main
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ height: "82vh" }}
          >
            <Spinner animation="grow" className="dblue mb-5" />
          </main>
        ) : (
          <>
            <div>
              <div>
                <div className="pt-1">
                  <div className="summary-1 mt-3 ms-1">
                    <h4 className="mb-2 title">Sample Datasets</h4>
                    <p className="mt-1 f-16 opacity-75">
                      Check our different kinds of sample datasets to understand the functionalties
                      better
                    </p>
                  </div>
                  <div className="row gx-5 ms-1">
                    <div className="bg-white p-4 mt-1 border rounded col-12 col-sm-6 col-md-6 col-lg-8 h-100">
                      <ListTable columns={columns} data={sampleDatasets} />
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 py-1">
                      <Accordion defaultActiveKey="sno-1" className="">
                        <Card>
                          <Card.Header className="bg-white py-4 f-18">
                            <Image
                              src="/ml-modelling/tips.svg"
                              className="me-2"
                              width={20}
                              height={20}
                            />
                            How to use sample datasets for testing?
                          </Card.Header>
                          <Card.Header style={{ backgroundColor: "white" }}>
                            {sampleDatasetTips.map((item: any, index: any) => {
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default SampleDatasets;
