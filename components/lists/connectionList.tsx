// react
import React, { FC, useState, useEffect } from "react";
// react bootstrap
import { Card, Spinner } from "react-bootstrap";
// styled icons
import { Database } from "@styled-icons/fa-solid/Database";
// import { CaretDownCircle, CaretUpCircle } from "@styled-icons/ionicons-outline";
// import { ArrowheadDownOutline } from "@styled-icons/evaicons-outline/ArrowheadDownOutline";
// components
// import { Table } from "@styled-icons/bootstrap/Table";
// services
import { ConnectionsService } from "services";

const connections = new ConnectionsService();

export interface IConnectionListProps {
  dbId: any;
  tableName: any;
}

const ConnectionList: FC<IConnectionListProps> = (props) => {
  const { dbId, tableName } = props;
  const [connectionData, setConnectionData] = useState({ name: "", created: "" });

  const [loading, setLoading] = React.useState(true);

  const fetchConnectionData = async () => {
    await connections
      .getConnectionData(dbId)
      .then((response: any) => {
        setConnectionData(response);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dbId) {
      fetchConnectionData();
    }
  }, [dbId]);
  return (
    <div className="flex-column w-100 h-100 overflow-auto d-flex">
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" className="dblue" />
        </div>
      ) : (
        <Card className="border-0 mx-2 mt-2 mb-1">
          <div
            className="d-flex w-100 p-2 flex-row bold align-items-center justify-content-center"
            // variant="link"
            style={{ background: "#D1D2D2", opacity: 0.3, borderRadius: "2px" }}
          >
            <div className="d-flex w-100 ms-3 align-items-center">
              <Database width={13} height={15} />
              <h2 className="f-12 mb-0 ms-2 pb-0">
                {connectionData?.name !== "" ? connectionData?.name : tableName}
              </h2>
            </div>
          </div>
          <div className="text-center d-flex mt-1">
            <p className="mb-0 ls" style={{ fontSize: 8, color: "#A3A3A3" }}>
              Last updated: {connectionData?.created}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
export default ConnectionList;
