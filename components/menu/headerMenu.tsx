// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// next dynamic
import dynamic from "next/dynamic";
// react-bootstrap
import { Dropdown, Image } from "react-bootstrap";
// cookie
import cookie from "js-cookie";
// styled icons
// import { AccountCircle } from "@styled-icons/material/AccountCircle";
// import { ManageAccounts } from "@styled-icons/material-outlined/ManageAccounts";
// import { ContactPage } from "@styled-icons/material/ContactPage";
// import { Admin } from "@styled-icons/remix-line/Admin";
import { LogIn, HelpCircle } from "@styled-icons/boxicons-regular";
// common
import { projectSummarySteps, chartSteps, querySteps, renderPage } from "constants/common";
// services
import { AuthorizationService } from "services";

import useLoginStatus from "lib/hooks/userLoginStatus";

// service instance declaration
const authService = new AuthorizationService();
const Tour: any = dynamic(() => import("reactour"), { ssr: false });

export interface IHeaderMenuProps {
  setNewState: any;
}

const HeaderMenu: FC<IHeaderMenuProps> = ({ setNewState }) => {
  const { user, mutate } = useLoginStatus();
  const router = useRouter();
  const [optionsTour, setOptionsTour] = React.useState(false);

  // const { data: user }: any = useRequest({
  //   url: `api/users/me/`,
  // });
  const firstSteps = [
    {
      selector: ".first-step",
      content: "Select measure",
    },
    {
      selector: ".second-step",
      content: "Select dimensions to be rendered. Multiple options can be selected",
    },
  ];
  const [queryTour, setQueryTour] = React.useState(false);
  const [chartTour, setChartTour] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  // check for unsaved changes
  const checkPage = (path: any) => {
    renderPage(router, path, "", setNewState, false);
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle className="bg-transparent border-0 float-right p-0" id="dropdown-basic">
          {/* {user?.profile_pic ? (
          <img className="rounded-circle" src={user.profile_pic} width="32" height="32" />
        ) : (
          <AccountCircle color="black" width="32" height="32" cursor="pointer" />
        )} */}

          <img
            className="rounded-circle me-3"
            src={user?.profile_pic || "/newAvatar.svg"}
            // src={user?.profile_pic === null || "string" || "" ? "/avatar1.png" : user.profile_pic}
            width="32"
            height="32"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu align="right" className="mt-2">
          {!cookie.get("accessToken") ? null : (
            <Dropdown.Item className="list-group-item menu-item">
              <div className="df1 flex-row" onClick={() => checkPage(["/profile"])}>
                <p className="d-flex align-items-center menu-item-text flex-row mb-0">
                  {/* <ManageAccounts width="20" height="20" className="me-3" /> */}
                  <Image
                    src="/newicons/profile/settings.svg"
                    width={20}
                    height={20}
                    className="me-2"
                  />
                  Settings
                </p>
              </div>
            </Dropdown.Item>
          )}
          <Dropdown.Item className="list-group-item menu-item">
            <div className="df1 flex-row" onClick={() => checkPage(["/contactsales"])}>
              <p className="d-flex align-items-center menu-item-text flex-row mb-0">
                {/* <ContactPage width="20" height="20" className="me-3" />
                 */}
                <Image
                  src="/newicons/profile/contact-us.svg"
                  width={20}
                  height={20}
                  className="me-2"
                />
                Contact us
              </p>
            </div>
          </Dropdown.Item>
          {user?.email.includes("soulpageit.com") || user?.email.includes("intellectdata.com") ? (
            <Dropdown.Item className="list-group-item menu-item">
              <div className="df1 flex-row" onClick={() => checkPage(["/admin"])}>
                <p className="d-flex align-items-center menu-item-text flex-row mb-0">
                  {/* <Admin width="20" height="20" className="me-3" /> */}
                  <Image
                    src="/newicons/profile/admin.svg"
                    width={20}
                    height={20}
                    className="me-2"
                  />
                  Admin
                </p>
              </div>
            </Dropdown.Item>
          ) : null}

          {router.pathname === "/projects/[project_id]/chart/create/[query_id]" ||
          router.pathname === "/projects/[project_id]/visualization/[type]/[id]" ||
          router.pathname === "/projects/[project_id]" ||
          router.pathname === "/projects/[project_id]/queries/[connection_id]" ? (
            // <div className="d-flex px-3 justify-content-center" style={{ alignItems: "end" }}>
            <Dropdown.Item
              className="cursor-pointer list-group-item menu-item"
              // color="rgb(31, 51, 102, 0.5)"
              // width={32}
              // height={32}
              onClick={() => {
                if (router.pathname === "/projects/[project_id]/visualization/[type]/[id]") {
                  setChartTour(true);
                } else if (router.pathname === "/projects/[project_id]/queries/[connection_id]") {
                  setQueryTour(true);
                } else if (router.pathname === "/projects/[project_id]") {
                  setIsTourOpen(true);
                }
              }}
            >
              <div className="df1 flex-row">
                <p className="d-flex align-items-center menu-item-text flex-row mb-0">
                  <HelpCircle width="20" height="20" className="me-3" />
                  Help
                </p>
              </div>
            </Dropdown.Item>
          ) : // </div>
          null}

          <Dropdown.Item
            className="list-group-item menu-item"
            onClick={() => {
              authService.logout();
              mutate();
            }}
          >
            <div className="df1 flex-row" onClick={() => checkPage(["/"])}>
              {cookie.get("accessToken") ? (
                <p
                  onClick={() => {
                    router.push("/");
                  }}
                  className="d-flex align-items-center menu-item-text flex-row mb-0"
                >
                  {/* <LogOut width="20" height="20" className="me-3" />
                   */}
                  <Image
                    src="/newicons/profile/sign-out.svg"
                    width={20}
                    height={20}
                    className="me-2"
                  />
                  Sign out
                </p>
              ) : (
                <p className="d-flex align-items-center menu-item-text flex-row mb-0">
                  <LogIn width="20" height="20" className="me-3" />
                  Sign in
                </p>
              )}
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
        <Tour
          rounded={8}
          startAt={0}
          steps={firstSteps}
          isOpen={optionsTour}
          onRequestClose={() => setOptionsTour(false)}
        />
        <Tour
          rounded={8}
          startAt={0}
          steps={chartSteps}
          isOpen={chartTour}
          onRequestClose={() => setChartTour(false)}
        />
        <Tour
          rounded={8}
          startAt={0}
          steps={projectSummarySteps}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
        />
        <Tour
          rounded={8}
          startAt={0}
          steps={querySteps}
          isOpen={queryTour}
          onRequestClose={() => setQueryTour(false)}
        />
      </Dropdown>
    </>
  );
};
export default HeaderMenu;
