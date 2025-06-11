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
// toast
import { toast } from "react-toastify";
// components
import { Queries } from "components/tabs";
import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const QueryPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  // Queries
  const { data: queryData, mutate: queryMutate } = useRequest({
    url: `api/project/${project_id}/queries/?search=${debounceSearch}`,
  });

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Queries`} description="Queries" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Queries
            data={queryData}
            queryMutate={queryMutate}
            setSearch={setSearch}
            search={search}
          />
        </div>
      </div>
      {/* {!queryData ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : (
        <div className=" d-flex flex-column">
          <div className="d-flex align-items-center flex-row pt-2">
            <Queries data={queryData} queryMutate={queryMutate} />
          </div>
        </div>
      )} */}
    </>
  );
};

export default QueryPage;
