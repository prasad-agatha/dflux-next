// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// layouts - sidebar, header, main project component
import { DashboardLayout, ProjectLayout } from "./index";

const SiteLayout: FC = ({ children }) => {
  const router = useRouter();

  if (
    router.pathname.startsWith("/profile") ||
    router.pathname.startsWith("/sampledatasets") ||
    router.pathname === "/contactsales" ||
    router.pathname === "/admin" ||
    router.pathname === "/supportrequest" ||
    router.pathname.startsWith("/project") ||
    router.pathname.startsWith("/queries") ||
    router.pathname.startsWith("/signup/verify/[token]") ||
    router.pathname.startsWith("/query")
  ) {
    return (
      <DashboardLayout>
        {router.pathname.startsWith("/projects/[project_id]") ? (
          router.pathname.includes("/projects/[project_id]/dashboards/[dashboard_id]") ||
          router.pathname.includes("/projects/[project_id]/queries/[connection_id]") ||
          router.pathname.includes("/projects/[project_id]/visualization/[type]/[id]") ||
          router.pathname.includes("/projects/[project_id]/ml-modelling") ||
          router.pathname.includes(
            "/projects/[project_id]/modelling/[query_id]/prediction/[model_id]"
          ) ||
          router.pathname.includes("/projects/[project_id]/modelling/[query_id]/view/[model_id]") ||
          router.pathname.includes("/projects/[project_id]/modelling/[query_id]") ||
          router.pathname.includes("/projects/[project_id]/dashboards/create") ? (
            <>{children}</>
          ) : (
            <ProjectLayout>{children}</ProjectLayout>
          )
        ) : (
          <>{children}</>
        )}
      </DashboardLayout>
    );
  }

  return <main className="main-wrapper">{children}</main>;
};
export default SiteLayout;
