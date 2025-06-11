// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react-bootstrap
// import { Form, Tabs, Tab, Image, InputGroup, Button } from "react-bootstrap";
// toast
import { toast } from "react-toastify";
// components
import { Models } from "components/tabs";
// import { PageLoading } from "components/loaders";
// next seo
import { NextSeo } from "next-seo";
import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const ModelsPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);

  // PROJECTS Dashboard
  const { data: modelsData, mutate: modelsMutate } = useRequest({
    url: `api/projects/${project_id}/limitedmodels/?search=${debounceSearch}`,
  });

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Models`} description="ML modeling" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Models
            modelsData={modelsData}
            modelsMutate={modelsMutate}
            project_id={project_id}
            setSearch={setSearch}
            search={search}
          />
        </div>
      </div>
      {/* {!modelsData ? (
        <main className="w-75 h-50 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <div className=" d-flex flex-column">
          <div className="d-flex align-items-center flex-row pt-2">
            <Models
              modelsData={modelsData}
              modelsMutate={modelsMutate}
              project_id={project_id}
              setSearch={setSearch}
              search={search}
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export default ModelsPage;
