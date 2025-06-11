// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// next seo
import { NextSeo } from "next-seo";
// hooks
import { useRequest } from "@lib/hooks";
// components
import { ProjectSummary } from "components/tabs";
import { ConnectionsModal, InviteUser, NewQuery, NewModel, NewChart } from "components/modals";
import { ConnectionsService } from "services";

const connections = new ConnectionsService();

const ProjectHomePage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
  });
  // const [chartState, setChartState] = React.useState({
  //   name: "",
  //   id: 0,
  //   trigger: false,
  //   query: 0,
  // });

  const [connname, setConnName] = React.useState("");
  const [updateTab, setUpdateTab] = React.useState("databases");

  const [allConnections, setAllConnections] = React.useState<any>([]);

  const [loading, setLoading] = React.useState(false);

  // project summary
  const { data: projectData, mutate: projectMutate }: any = useRequest({
    url: `api/projects/${project_id}/`,
  });

  const getQueries = async () => {
    setLoading(true);
    let newArr: any = [];
    let newArr1: any = [];
    let newArr2: any = [];
    await connections.getConnectionsData(project_id).then((response: any) => {
      newArr = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.name;
          item["label"] = item.name;
          item["value"] = item.name;
          item["type"] = "normal";
          item["datasource"] = item.engine;
          return item;
        }
      });
    });
    await connections.getExcelsData(project_id).then((response: any) => {
      newArr1 = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.tablename;
          item["label"] = item.tablename;
          item["value"] = item.tablename;
          item["type"] = "excel";
          item["datasource"] = item.file_type;
          return item;
        }
      });
    });
    await connections.getJsonsData(project_id).then((response: any) => {
      newArr2 = response?.filter((item: any) => {
        if (item.name !== "") {
          item["field"] = item.tablename;
          item["label"] = item.tablename;
          item["value"] = item.tablename;
          item["type"] = "json";
          item["datasource"] = item.engine;
          return item;
        }
      });
    });
    const connections1 = [...newArr, ...newArr1, ...newArr2];
    setAllConnections(connections1);
    setLoading(false);
  };

  return (
    <>
      <NextSeo
        title={`${process.env.CLIENT_NAME} - Project summary`}
        description="Project summary"
      />
      <ProjectSummary
        newState={newState}
        setNewState={setNewState}
        projectData={projectData}
        projectMutate={projectMutate}
        getQueries={getQueries}
      />

      <ConnectionsModal
        newState={newState}
        setNewState={setNewState}
        connMutate={projectMutate}
        jsonMutate={projectMutate}
        excelMutate={projectMutate}
        connname={connname}
        setConnName={setConnName}
        updateTab={updateTab}
        setUpdateTab={setUpdateTab}
      />
      <InviteUser newState={newState} setNewState={setNewState} />
      <NewQuery
        newState={newState}
        setNewState={setNewState}
        allConnections={allConnections}
        loading={loading}
      />
      <NewModel newState={newState} setNewState={setNewState} />
      <NewChart newState={newState} setNewState={setNewState} />
    </>
  );
};

export default ProjectHomePage;
