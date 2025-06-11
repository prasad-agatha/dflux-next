// react
import React, { FC } from "react";
import Moment from "moment";
import { useRequest } from "@lib/hooks";
// react bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// toast
import { toast } from "react-toastify";
// componenets
// import { ChangePassword } from "components/forms";
// services
// import { AuthorizationService } from "services";
//toast configuration
toast.configure();
import "react-phone-input-2/lib/style.css";
// yup
import { ListTable } from "components/data-tables";
import useDebounce from "lib/hooks/useDebounce";

import "@blueprintjs/core/lib/css/blueprint.css";
// import { Spinner } from "react-bootstrap";

// const userService = new AuthorizationService();

const Admin: FC = () => {
  // const [userlist, setUserList] = React.useState([]);
  const [search, setSearch]: any = React.useState("");

  const debounceSearch = useDebounce(search, 500);

  const { data: userList }: any = useRequest({
    url: `api/userslist/?search=${debounceSearch}`,
  });

  // console.log(debounceSearch);
  // const getUserList = (debounceSearch: any) => {
  //   userService
  //     .getUsersList(debounceSearch)
  //     .then((user: any) => {
  //       setUserList(user);
  //     })
  //     .catch((error) => {
  //       toast.error(error);
  //     });
  // };

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const copyToClipBoard = async (copyMe: any) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      toast.success("Copied!");
    } catch (err: any) {
      toast.error(err);
    }
  };

  const columns = [
    {
      name: "FIRST NAME",
      sortable: true,
      center: false,
      selector: "first_name",

      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.first_name}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.first_name}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "LAST NAME",
      sortable: true,
      center: false,
      selector: "last_name",

      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.last_name}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.last_name}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "CONTACT",
      sortable: true,
      center: false,
      selector: "contact",
      cell: (row: any) => <>{row.contact_number}</>,
    },
    {
      name: "EMAIL",
      sortable: true,
      center: false,
      selector: "email",

      cell: (row: any) => {
        return (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.email}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.email}
              </p>
            </OverlayTrigger>

            <img
              src="/copy.svg"
              alt="copy-icon"
              className="ms-auto cursor-pointer"
              onClick={() => copyToClipBoard(row?.email)}
            />
          </>
        );
      },
    },
    {
      name: "ROLE",
      sortable: true,
      center: false,
      selector: "role",

      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.role}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.role}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "SIGNUP TIME",
      sortable: true,
      center: false,
      selector: "date_joined",
      cell: (row: any) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.date_joined}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "120px" }}>
                {row.date_joined}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "TRAIL END DATE",
      sortable: true,
      center: false,
      selector: "enddate",
      cell: (row: any) => {
        if (row.end_date === null) {
          const new_date = Moment(row.date_joined).add(14, "days").format("MM/DD/YYYY HH:mm");
          return (
            <div>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-engine">{new_date}</Tooltip>}
              >
                <p className="text-truncate mb-0" style={{ width: "120px" }}>
                  {new_date}
                </p>
              </OverlayTrigger>
            </div>
          );
        } else {
          return (
            <div>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-engine">{row.end_date}</Tooltip>}
              >
                <p className="text-truncate mb-0" style={{ width: "120px" }}>
                  {row.end_date}
                </p>
              </OverlayTrigger>
            </div>
          );
        }
      },
    },
    {
      name: "STATUS",
      sortable: true,
      center: false,
      selector: "is_active",
      cell: (row: any) => (
        <>
          <button
            className={
              "btn text-center w-100 text-nowrap px-0  " +
              (row?.is_active ? "btn-outline-success" : "btn-outline-danger")
            }
            style={{ fontSize: 13, borderRadius: "4px" }}
          >
            {row?.is_active ? "Active" : "Inactive"}
          </button>
        </>
      ),
    },
  ];

  // load user data
  React.useEffect(() => {
    // getUserList(search);
  }, [userList]);
  // console.log(window.document.getElementById("input1")?.offsetWidth);
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Admin`} description="Admin" />
      {/* {!userList ? (
        <main
          className="d-flex w-100 justify-content-center align-items-center"
          style={{ height: "82vh" }}
        >
          <Spinner animation="grow" className="dblue mb-5" />
        </main>
      ) : ( */}
      <div className="d-flex container flex-column w-100 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="summary-1 mt-4">
            <h4 className="mb-2 title">User details</h4>
            <p className="mt-1 mb-0 f-16 opacity-75">List of users signed up to the platform</p>
          </div>
          <div className="ms-auto">
            <input
              className="form-control search mt-4"
              type="text"
              placeholder="Search"
              aria-label="Search"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="border mb-4 mt-4" style={{ borderRadius: "8px" }}>
          <ListTable columns={columns} data={userList} />
        </div>
      </div>
      {/* )} */}
    </>
  );
};
export default Admin;
