// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// toast
import { toast } from "react-toastify";
// next seo
import { NextSeo } from "next-seo";
// components
import { Charts } from "components/tabs";
// import { PageLoading } from "components/loaders";
import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const ChartsPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  // PROJECTS charts
  const { data: chartData, mutate: chartMutate } = useRequest({
    url: `api/projects/${project_id}/limitedcharts/?search=${debounceSearch}`,
  });

  // dashboards data
  const { data: dashboardData } = useRequest({
    url: `api/projects/${project_id}/limiteddashboards/`,
  });

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Charts`} description="Charts" />
      <div className="d-flex flex-column">
        <div className="d-flex flex-row pt-2">
          <Charts
            chartData={chartData}
            chartMutate={chartMutate}
            dashboardData={dashboardData}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>
      {/* {!chartData ? (
        <main className="w-75 h-50 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row pt-2">
            <Charts chartData={chartData} chartMutate={chartMutate} dashboardData={dashboardData} />
          </div>
        </div>
      )} */}
    </>
  );
};

export default ChartsPage;
