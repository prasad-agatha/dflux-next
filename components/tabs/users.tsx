// react
import React, { FC } from "react";
// components
import { ListTable } from "components/data-tables";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { InviteUser } from "components/modals";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";
import { Spinner } from "react-bootstrap";
import { UsersMenu } from "components/menu";
import { ProjectsService } from "services";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
// import useLoginStatus from "lib/hooks/userLoginStatus";
import hotkeys from "hotkeys-js";

interface IUsersProps {
  usersData: any;
  setSearch: any;
  search: any;
  userRole: any;
  userMutate: any;
}

const Users: FC<IUsersProps> = (props) => {
  const router = useRouter();
  const { project_id } = router.query;
  const { usersData, setSearch, search, userRole, userMutate } = props;
  const projects = new ProjectsService();
  const [newState, setNewState] = React.useState({
    query: false,
    model: false,
    chart: false,
    chartTrigger: false,
    connection: false,
    invite: false,
  });
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  // const [users, setUsers] = React.useState({users: []})
  // const { user: profileData } = useLoginStatus();
  const deleteUser = async (id: any) => {
    projects
      .deleteUser(project_id, id)
      .then(() => {
        toast.success("User deleted");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const columns = [
    {
      // connection name
      name: "FIRST NAME",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "user.first_name",
    },
    {
      // connection name
      name: "LAST NAME",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "user.last_name",
    },
    {
      // connection name
      name: "ROLE",
      sortable: true,
      center: false,
      style: { cursor: "auto" },
      selector: "role",
    },
    // {
    // connection name
    //   name: "PERMISSIONS",
    //   sortable: true,
    //   center: false,
    //   selector: "access",
    //   style: { cursor: "auto" },
    //   cell: (row: any) => {
    //     const accessName = row.access;
    //     if (accessName === "READ") {
    //       return "Read";
    //     } else if (accessName === "WRITE") {
    //       return "Read and write";
    //     }
    //   },
    // },
    {
      // option - menu
      name: "OPTIONS",
      center: true,
      width: "10%",
      cell: (row: any) => {
        if (row.role !== "Owner") {
          return (
            <UsersMenu
              userMutate={userMutate}
              row={row}
              deleteUser={deleteUser}
              userRole={userRole}
            />
          );
        }
      },
    },
  ];

  hotkeys("enter", function () {
    document?.getElementById("create-button")?.click();
  });
  return (
    <div className="container-fluid d-flex flex-column px-1">
      <div className="d-flex justify-content-between">
        <div className="summary-1 mt-4">
          <h4 className="mb-2 title">Members</h4>
          <p className="mt-1 f-16 opacity-75">Authorized project members.</p>
        </div>

        <div className="ms-auto">
          <input
            className="form-control search mt-4"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={handleSearch}
          />
        </div>
        {userRole?.user_role === "Owner" ||
        userRole?.user_module_access[7]["Members"] === "WRITE" ? (
          <div className="ms-3 mt-4">
            <Button
              id="create-button"
              onClick={() => {
                setNewState({ ...newState, invite: true });
              }}
              variant="outline-primary"
              className="f-14 ls"
            >
              <div className="d-flex w-100 align-items-center">
                <PlusCircle className="me-2" width={24} height={24} />
                Add member
              </div>
            </Button>
          </div>
        ) : (
          <div className="ms-3 mt-4">
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip className="mt-3" id="tooltip-engine">
                  You didn&apos;t have access to this feature
                </Tooltip>
              }
            >
              <Button
                style={{ borderColor: "#d4d4d4", backgroundColor: "#fff", color: "#d4d4d4" }}
                className="f-14 ls"
              >
                <div className="d-flex w-100 align-items-center">
                  <PlusCircle className="me-2" width={19} height={19} />
                  Add member
                </div>
              </Button>
            </OverlayTrigger>
          </div>
        )}
      </div>

      {!usersData && !project_id ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : userRole?.user_role !== "Owner" &&
        userRole?.user_module_access[7]["Members"] === "NONE" ? (
        <>
          <div className="p-0 d-flex py-5 my-5 justify-content-center align-items-center flex-column">
            <Image
              src="/assets/icons/summary/emptyUser.svg"
              alt="create chart"
              width="70"
              height="80"
              className="me-1"
            />
            <h6 className="fw-bold f-14 mt-2 noneaccess">
              You didn&apos;t have access to this feature
            </h6>
          </div>
        </>
      ) : (
        <div
          className={`p-0 d-flex ${
            usersData?.length > 0
              ? ""
              : "py-5 my-5 justify-content-center align-items-center flex-column"
          }`}
        >
          {usersData?.length > 0 ? (
            <div className="projects-container-p">
              <ListTable columns={columns} data={usersData} />
            </div>
          ) : (
            <>
              <Image
                src="/assets/icons/summary/emptyUser.svg"
                alt="create user"
                width="70"
                height="80"
                className="me-1"
              />
              <h6 className="fw-bold mt-2 title">No members available</h6>
              <p className="mb-2 f-12 opacity-75 text-center">Invite a member</p>
              {userRole?.user_role === "Owner" ||
              userRole?.user_module_access[7]["Members"] === "WRITE" ? (
                <Button
                  className="cursor-pointer text-white text-center ls"
                  onClick={() => {
                    setNewState({ ...newState, invite: true });
                  }}
                  style={{ color: "#0076FF", width: 190 }}
                >
                  Invite members
                </Button>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip className="mt-3" id="tooltip-engine">
                      You didn&apos;t have access to this feature
                    </Tooltip>
                  }
                >
                  <Button
                    style={{ borderColor: "#d4d4d4", backgroundColor: "#fff", color: "#d4d4d4" }}
                    className="f-14 ls"
                  >
                    <div className="d-flex w-100 align-items-center">Invite members</div>
                  </Button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      )}
      <InviteUser newState={newState} setNewState={setNewState} />
    </div>
  );
};
export default Users;
