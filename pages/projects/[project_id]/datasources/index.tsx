// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react bootstrap
// import { Spinner } from "react-bootstrap";
// hooks
import { useRequest } from "@lib/hooks";
// next seo
import { NextSeo } from "next-seo";
// components
import { DataSources } from "components/tabs";
import { ConnectionsModal } from "components/modals";
import useDebounce from "lib/hooks/useDebounce";

const DataSourcePage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  // create connection modal
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });

  const [connname, setConnName] = React.useState("");
  const [updateTab, setUpdateTab] = React.useState("databases");

  // connections data
  const { data: connData, mutate: connMutate } = useRequest<any[]>({
    url: `api/projects/${project_id}/connections/?search=${debounceSearch}`,
  });
  const { data: excelData, mutate: excelMutate } = useRequest<any[]>({
    url: `api/projects/${project_id}/excel/?search=${debounceSearch}`,
  });

  const { data: jsonData, mutate: jsonMutate } = useRequest<any[]>({
    url: `api/projects/${project_id}/json/?search=${debounceSearch}`,
  });

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Data sources`} description="Data sources" />
      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <DataSources
            connData={connData}
            excelData={excelData}
            excelMutate={excelMutate}
            connMutate={connMutate}
            newState={newState}
            setNewState={setNewState}
            jsonData={jsonData}
            jsonMutate={jsonMutate}
            connname={connname}
            setUpdateTab={setUpdateTab}
            setConnName={setConnName}
            setSearch={setSearch}
            search={search}
          />
        </div>

        <ConnectionsModal
          newState={newState}
          setNewState={setNewState}
          connMutate={connMutate}
          jsonMutate={jsonMutate}
          excelMutate={excelMutate}
          connname={connname}
          setConnName={setConnName}
          updateTab={updateTab}
          setUpdateTab={setUpdateTab}
        />
      </div>

      {/* {!connData && excelData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : (
        <div className=" d-flex flex-column">
          <div className="d-flex align-items-center flex-row pt-2">
            <DataSources
              connData={connData}
              excelData={excelData}
              excelMutate={excelMutate}
              connMutate={connMutate}
              newState={newState}
              setNewState={setNewState}
              jsonData={jsonData}
              jsonMutate={jsonMutate}
              connname={connname}
              setUpdateTab={setUpdateTab}
              setConnName={setConnName}
            />
          </div>

          <ConnectionsModal
            newState={newState}
            setNewState={setNewState}
            connMutate={connMutate}
            excelMutate={excelMutate}
            connname={connname}
            setConnName={setConnName}
            updateTab={updateTab}
            setUpdateTab={setUpdateTab}
          />
        </div>
      )} */}
    </>
  );
};

export default DataSourcePage;
