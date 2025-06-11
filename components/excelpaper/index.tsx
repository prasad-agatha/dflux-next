// react
import React, { FC } from "react";
// react-bootstrap
import { Card, Image } from "react-bootstrap";
// components
import { ExcelDataSourceMenu } from "components/menu";

interface IConnectionPaperProps {
  item: any;
  index: any;
  project_Id: any;
  excelMutate: any;
  json?: any;
  jsonMutate?: any;
}

const ExcelPaper: FC<IConnectionPaperProps> = (props) => {
  const { item, index, project_Id, excelMutate, json, jsonMutate } = props;
  return (
    <Card key={index} className="paper-container-c">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <div className="name-c overflow-hidden overflow-whitespace">
          {item.file_type === "google_sheets" ? (
            <Image
              src="/connections/icons/sheets-icon.svg"
              width="56"
              height="56"
              className="mx-1"
            />
          ) : null}
          {item.file_type === "excel" ? (
            <Image
              src="/connections/icons/excel-icon.svg"
              width="56"
              height="56"
              className="mx-1"
            />
          ) : null}
          {item.file_type === "csv" ? (
            <Image src="/connections/icons/csv-icon.svg" width="56" height="56" className="mx-1" />
          ) : null}
          {json ? (
            <Image src="/connections/icons/json-icon.svg" width="56" height="56" className="mx-1" />
          ) : null}
          {item.tablename}
        </div>
        <ExcelDataSourceMenu
          project_Id={project_Id}
          item={item}
          excelMutate={excelMutate}
          json={json}
          jsonMutate={jsonMutate}
        />
      </div>
      <div className="d-flex align-items-center pt-2">
        <p className="last-c f-14 mb-0">Created on:</p>
        <p className="date-c f-14 mb-0">{item.created}</p>
      </div>
      <div className="d-flex align-items-center">
        <p className="last-c f-14 mb-0">Datasource: </p>
        <p className="date-c f-14 mb-0">{json ? "JSON" : "EXCEL / CSV"}</p>
      </div>
    </Card>
  );
};
export default ExcelPaper;
