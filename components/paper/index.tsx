// react
import React, { FC } from "react";
// react-bootstrap
import { Card, Image } from "react-bootstrap";
// styled icons
import styled from "styled-components";
import { Mysql, Microsoftsqlserver, Oracle } from "@styled-icons/simple-icons";
// import { Postgresql } from "@styled-icons/simple-icons";
// components
import { ConnectionsMenu } from "components/menu";

// const PostgreSQL = styled(Postgresql)`
//   color: #336791;
// `;

const OracleRed = styled(Oracle)`
  color: #f80000;
`;

interface IConnectionPaperProps {
  item: any;
  index: any;
  project_Id: any;
  connMutate: any;
  userRole: any;
}

const ConnectionPaper: FC<IConnectionPaperProps> = (props) => {
  const { item, index, project_Id, connMutate, userRole } = props;
  const [dsState, setDsState] = React.useState({
    activeStep: 0,
    dbtype: "",
    tab: "configure",
    stepprogress: 100,
    testing: false,
    retesting: false,
    save: false,
    view: false,
  });
  const [values, setValues] = React.useState({
    dbname: "",
    engine: dsState.dbtype,
    host: "",
    name: "",
    password: "",
    port: "",
    project: project_Id,
    username: "",
  });

  const [valuesSnowflake, setValuesSnowflake] = React.useState({
    dbname: "",
    username: "",
    password: "",
    schema: "",
    warehouse: "",
    account: "",
    name: "",
    connection_type: "SNOWFLAKE",
  });

  return (
    <Card key={index} className="paper-container-c">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <div className="name-c overflow-hidden overflow-whitespace">
          {/* <p className="mb-0"> */}
          {item.engine == "postgres" ? (
            <Image src="/connections/icons/postgres.svg" width="56" height="56" className="me-2" />
          ) : // <PostgreSQL width="28" height="28" className="me-2" />
          null}
          {item.engine === "mysql" ? <Mysql width="56" height="56" className="me-2" /> : null}
          {item.engine === "mssql" ? (
            <Microsoftsqlserver width="56" height="56" className="me-2" />
          ) : null}
          {item.engine === "oracle" ? <OracleRed width="56" height="56" className="me-2" /> : null}
          {item.connection_type === "SNOWFLAKE" ? (
            <Image
              src="/assets/icons/summary/snowflakeLogo.svg"
              width="56"
              height="56"
              className="me-2"
            />
          ) : null}
          {item.name}
          {/* </p> */}
        </div>
        <ConnectionsMenu
          project_Id={project_Id}
          item={item}
          connMutate={connMutate}
          values={values}
          setValues={setValues}
          dsState={dsState}
          setDsState={setDsState}
          valuesSnowflake={valuesSnowflake}
          setValuesSnowflake={setValuesSnowflake}
          userRole={userRole}
        />
      </div>
      <div className="d-flex align-items-center pt-2">
        <p className="last-c f-14 mb-0">Created on:</p>
        <p className="date-c f-14 mb-0">{item.created}</p>
      </div>
      <div className="d-flex align-items-center">
        <p className="last-c f-14 mb-0">Database type: </p>
        <p className="date-c f-14 mb-0" style={{ textTransform: "capitalize" }}>
          {item.engine}
        </p>
      </div>
    </Card>
  );
};
export default ConnectionPaper;
