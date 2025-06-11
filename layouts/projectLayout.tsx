// react
import React, { FC } from "react";

// next router
import { useRouter } from "next/router";
// next seo
import { NextSeo } from "next-seo";
// react bootstrap
// import { ListGroup } from "react-bootstrap";
// components
import { ConnectionsModal } from "components/modals";
import { PageLoading } from "components/loaders";

const ProjectLayout: FC = ({ children }) => {
  const router = useRouter();
  const { project_id } = router.query;
  if (!project_id) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }

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

  // // PROJECTS charts
  // const { data: projectData, mutate: projectMutate }: any = useRequest({
  //   url: `api/projects/${project_id}/`,
  // });

  //For setting class to active tab

  return (
    <>
      <div className="d-flex flex-column h-100" id="top-page">
        <div className="px-4 mx-3">{children}</div>
      </div>

      <ConnectionsModal
        newState={newState}
        setNewState={setNewState}
        connMutate={"refresh"}
        connname={connname}
        setConnName={setConnName}
        updateTab={updateTab}
        setUpdateTab={setUpdateTab}
      />
    </>
  );
};

export default ProjectLayout;
