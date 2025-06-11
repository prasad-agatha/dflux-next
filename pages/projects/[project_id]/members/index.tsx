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
import { Users } from "components/tabs";

import useDebounce from "lib/hooks/useDebounce";

//toast configuration
toast.configure();

const UsersPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [search, setSearch]: any = React.useState("");
  const debounceSearch = useDebounce(search, 500);

  // project users data
  const { data: usersData, mutate: userMutate } = useRequest({
    url: `api/projects/${project_id}/members/?search=${debounceSearch}`,
  });
  const { data: userRole }: any = useRequest({
    url: `api/projects/${project_id}/role/`,
  });
  return (
    <>
      <NextSeo title={`Members - ${process.env.CLIENT_NAME}`} description="Members - Project" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Users
            userMutate={userMutate}
            usersData={usersData}
            setSearch={setSearch}
            search={search}
            userRole={userRole}
          />
        </div>
      </div>
    </>
  );
};

export default UsersPage;
