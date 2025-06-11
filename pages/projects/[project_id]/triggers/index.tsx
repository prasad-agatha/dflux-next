// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// import { Spinner } from "react-bootstrap";
// hooks
import { useRequest } from "@lib/hooks";
// toast
import { toast } from "react-toastify";
// next seo
import { NextSeo } from "next-seo";
// components
import { Triggers } from "components/tabs";
import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const TriggerPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  // chart Triggers
  const { data: chartTriggerData, mutate: chartTriggerMutate } = useRequest({
    url: `api/projects/${project_id}/charts/triggers/?search=${debounceSearch}`,
  });
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Triggers `} description="Triggers - Charts" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Triggers
            chartTriggerData={chartTriggerData}
            chartTriggerMutate={chartTriggerMutate}
            setSearch={setSearch}
            search={search}
          />
        </div>
      </div>

      {/* {!chartTriggerData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : (
        <div className=" d-flex flex-column">
          <div className="d-flex align-items-center flex-row pt-2">
            <Triggers chartTriggerData={chartTriggerData} chartTriggerMutate={chartTriggerMutate} />
          </div>
        </div>
      )} */}
    </>
  );
};

export default TriggerPage;
