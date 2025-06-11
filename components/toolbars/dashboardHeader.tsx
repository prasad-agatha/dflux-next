// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// next seo
// import { NextSeo } from "next-seo";
// toast
import { toast } from "react-toastify";
// react-bootstrap
import { Navbar, Nav, Image, Tooltip, OverlayTrigger } from "react-bootstrap";
// react select
import Select, { components, ControlProps } from "react-select";
// import makeAnimated from "react-select/animated";
// import components from "react-select";
// cookie
import cookie from "js-cookie";
// components
import { HeaderMenu } from "components/menu";
import { renderPage } from "constants/common";
// import { DropdownIndicator } from "react-select/src/components/indicators";
// import { PageLoading } from "components/loaders";
// import useLoginStatus from "lib/hooks/userLoginStatus";

//toast configuration
toast.configure();

export interface IHeaderProps {
  projects: any;
  project_id?: any;
  menu: any;
  setMenu: any;
  setNewState: any;
}

// const animatedComponents = makeAnimated();

const DashboardHeader: FC<IHeaderProps> = (props: any) => {
  const { projects, project_id, menu, setMenu, setNewState } = props;
  const router = useRouter();
  // const { user } = useLoginStatus();

  // const { data: user }: any = useRequest({
  //   url: `api/users/me/`,
  // });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (
      !cookie.get("accessToken") &&
      (!router.pathname.startsWith("/shared/dashboard/[dashboard_id]") || !urlParams.get("shr"))
    ) {
      router.push("/");
      toast.error("Please sign in to continue");
    }
  }, []);

  // const DropdownIndicator = () => {
  //   return null;
  // };

  interface ColourOption {
    readonly value: string;
    readonly label: string;
  }

  const Control = ({ children, ...props }: ControlProps<ColourOption, false>) => {
    return (
      <components.Control {...props}>
        <Image
          src="/projectHeader.svg"
          alt="project"
          width="20"
          height="24"
          className="ms-2 me-1"
        />
        {children}
      </components.Control>
    );
  };

  const IndicatorSeparator = () => {
    return null;
  };

  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      position: "center",
      transform: "none",
      color: "#A0A4A8",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      position: "center",
      transform: "none",
      color: "#445870",
    }),
    control: (base: any) => ({
      ...base,
      border: "1px solid #A0A4A8",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #A0A4A8",
      },
      cursor: "pointer",
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 2,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      textOverflow: "ellipsis",
      minWidth: 115,
      borderRadius: 4,
      maxWidth: 160,
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "flex",
      // fontFamily: "Metropolis",
      fontSize: 14,
      color: "#445870",
    }),
  };

  // const formatOptionLabel = ({ label }: any) => (
  //   <div style={{ display: "flex", justifyContent: "flex-start" }}>
  //     <div style={{ color: "black" }}>
  //       <Image
  //         src="/projectHeader.svg"
  //         alt="project"
  //         width="20"
  //         height="24"
  //         className="ms-2 me-3"
  //       />
  //     </div>
  //     <div className="f-16" style={{ color: "#A0A4A8", fontFamily: "Metropolis" }}>
  //       {label}
  //     </div>
  //   </div>
  // );

  // const b: any = [];
  // projects?.map((item: any) => {
  //   if (item.id == project_id) {
  //     const name = item.name.length > 12 ? item.name.substring(0,12)+".." : item.name ;
  //     b.push(name);
  //   }
  // });
  const b: any = [];
  projects?.map((item: any) => {
    if (item.id == project_id) {
      b.push(item.name);
    }
  });
  return (
    <Navbar
      style={
        router.pathname === "/projects" ||
        router.pathname === "/profile" ||
        router.pathname === "/sampledatasets" ||
        router.pathname === "/admin" ||
        router.pathname === "/contactsales" ||
        router.pathname === "/supportrequest" ||
        router.pathname === "/project/invitation/[token]" ||
        router.pathname.includes("/projects/[project_id]/chart/[chart_id]") ||
        router.pathname.includes("/projects/[project_id]/visualization/[type]/[id]") ||
        router.pathname.includes("/projects/[project_id]/dashboards/[dashboard_id]") ||
        // router.pathname.includes("/projects/[project_id]/queries/[connection_id]") ||
        // router.pathname.includes("/projects/[project_id]/chart/create/[query_id]") ||
        // router.pathname.includes("/projects/[project_id]/ml-modelling") ||
        router.pathname.includes("/projects/[project_id]/modelling/[query_id]") ||
        router.pathname.includes("/projects/[project_id]/dashboards/create")
          ? { boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)" }
          : { paddingTop: 2, paddingBottom: 2 }
      }
      className="w-100 p-0 px-4"
    >
      {router.pathname === "/projects" ||
      router.pathname === "/profile" ||
      router.pathname === "/sampledatasets" ||
      router.pathname === "/admin" ||
      router.pathname === "/contactsales" ||
      router.pathname === "/supportrequest" ||
      router.pathname === "/signup/verify/[token]" ||
      router.pathname === "/project/invitation/[token]" ? null : menu ? (
        <div className="ms-3 me-2 p-2 hamburger">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-1" id="tooltip-engine">
                Menu
              </Tooltip>
            }
          >
            <Image
              onClick={() => {
                setMenu(!menu);
              }}
              className="cursor-pointer"
              src="/hamburger.svg"
            />
          </OverlayTrigger>
        </div>
      ) : (
        <div className="ms-3 me-2 p-2 hamburger">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip className="mt-1" id="tooltip-engine">
                Menu
              </Tooltip>
            }
          >
            <Image
              onClick={() => {
                setMenu(!menu);
              }}
              className="cursor-pointer"
              src="/hamburger.svg"
            />
          </OverlayTrigger>
        </div>
      )}

      <Navbar.Brand onClick={() => renderPage(router, ["/projects"], "", setNewState, false)}>
        <Image
          className="img-fluid ms-2 cursor-pointer"
          src={`${process.env.CLIENT_LOGO}`}
          alt="logo"
        />
      </Navbar.Brand>

      <Nav className="ms-auto">
        <div className="pe-3">
          <Select
            styles={customStyles}
            menuPlacement="top"
            // isMulti
            name="xMenu"
            // formatOptionLabel={formatOptionLabel}
            value={
              router.pathname.startsWith("/projects/[project_id]")
                ? { value: project_id, label: b[0] }
                : { value: "Select project", label: "Select project" }
            }
            isSearchable={false}
            //   className="multi-select-box"
            classNamePrefix="select"
            components={{ IndicatorSeparator, Option: components.Option, Control: Control }}
            options={projects?.map((item: any, index: any) => {
              return {
                field: item.name, //name,id
                label: item.name,
                value: item.name,
                id: item.id,
                key: index,
              };
            })}
            closeMenuOnSelect={true}
            onChange={(option: any) => {
              document.getElementById("top-page")?.scrollIntoView();
              renderPage(router, [`/projects/${option.id}/`], "", setNewState, false);
            }}
          />
        </div>
        {/* <p className="mb-0 me-2 mt-2" style={{ color: "#212529" }}>
          {user?.first_name}
        </p> */}

        <div className="nav-dropdown mt-1">
          <HeaderMenu setNewState={setNewState} />
        </div>
      </Nav>
    </Navbar>
  );
};

export default DashboardHeader;
