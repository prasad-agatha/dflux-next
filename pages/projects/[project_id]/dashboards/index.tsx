// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react bootstrap
// import { Spinner } from "react-bootstrap";
// hooks
import { useRequest } from "@lib/hooks";
// toast
import { toast } from "react-toastify";
// next seo
import { NextSeo } from "next-seo";
// components
import { Dashboards } from "components/tabs";
import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const DashboardPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  // dashboards data
  const { data: dashboardData, mutate: dashboardMutate } = useRequest({
    url: `api/projects/${project_id}/limiteddashboards/?search=${debounceSearch}`,
  });

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Dashboards`} description="Dashboards" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Dashboards
            project_id={project_id}
            dashboardData={dashboardData}
            dashboardMutate={dashboardMutate}
            setSearch={setSearch}
            search={search}
          />
          {/* <DashboardCard dashboardData={dashboardData} dashboardMutate={dashboardMutate} /> */}
        </div>
      </div>

      {/* {!dashboardData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : (
        <div className=" d-flex flex-column">
          <div className="d-flex align-items-center flex-row pt-2">
            <Dashboards
              project_id={project_id}
              dashboardData={dashboardData}
              dashboardMutate={dashboardMutate}
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export default DashboardPage;
