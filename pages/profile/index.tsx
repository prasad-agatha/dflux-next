// react
import React, { FC } from "react";
// react bootstrap
import { Button, Spinner, Modal, Accordion } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// toast
import { toast } from "react-toastify";
import { ConnectionsService } from "services";
import { isArray } from "lodash";
// componenets
// import { ChangePassword } from "components/forms";
// services
import { AuthorizationService } from "services";
//toast configuration
toast.configure();
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useFormik } from "formik";
// import { SettingsPageValidation } from "lib/validation";
import { ChevronDown } from "@styled-icons/bootstrap/ChevronDown";
// hooks
import { useRequest } from "@lib/hooks";
// yup
import useLoginStatus from "lib/hooks/userLoginStatus";
import { ListTable } from "components/data-tables";
import { DeleteProject } from "components/modals";
import { TimezonePicker, TimezoneDisplayFormat } from "@blueprintjs/timezone";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Position } from "@blueprintjs/core";

const userService = new AuthorizationService();
const connections = new ConnectionsService();
// const phoneRegExp =
//   // /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
//   /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
const Profile: FC = () => {
  const { user: profileData, mutate } = useLoginStatus();

  const [showIcon, setShowIcon] = React.useState(false);
  const [projectDelete, setProjectDelete] = React.useState(false);
  const [tempId, setTempId] = React.useState(0);
  // const [tz, setTz] = React.useState("");

  // React.useMemo(() => {
  //   const tzValue = tz.value ?? tz;
  //   setDatetime(datetime.goto(tzValue));
  // }, [tz]);
  const {
    data: projects,
    mutate: projectsMutate,
  }: // isValidating,
  any = useRequest({
    url: `api/projects/`,
  });

  const { handleChange, handleSubmit, setFieldValue, values, resetForm, errors } = useFormik({
    initialValues: {
      firstname: profileData?.first_name ? profileData.first_name : "",
      lastname: profileData?.last_name ? profileData.last_name : "",

      contact_number:
        profileData?.contact_number && profileData?.contact_number !== "null"
          ? profileData.contact_number
          : "",
      email: profileData?.email ? profileData.email : "",
      company: profileData?.company && profileData?.company !== "null" ? profileData.company : "",
      role: profileData?.role ? profileData.role : "",
      industry: profileData?.industry ? profileData.industry : "",
      timezone: profileData?.timezone ? profileData.timezone : "",
      avatar: profileData?.profile_pic ? profileData.profile_pic : "",
      isEditable: false,
      show: false,
    },
    // validationSchema: Yup.object({
    //   contact_number: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    // }),
    enableReinitialize: true,
    // validateOnChange: false,

    // validate: SettingsPageValidation,

    onSubmit: async (values) => {
      setFieldValue("show", false);

      let uploadedFile;
      if (typeof values.avatar !== "string" && values.avatar) {
        const imgData = new FormData();
        imgData.append("name[]", `profile`);
        imgData.append("asset[]", values.avatar);
        uploadedFile = await connections.dumpJSONFile(imgData);
      } else {
        uploadedFile = true;
      }

      const formData = new FormData();
      formData.append("company", values.company);
      formData.append("role", values.role);
      formData.append("contact_number", values.contact_number);
      formData.append("industry", values.industry);
      formData.append("timezone", values.timezone);
      formData.append("profile_pic", isArray(uploadedFile) ? uploadedFile[0].asset : values.avatar);

      // typeof values.avatar !== "string"
      //   ? formData.append(
      //       "profile_pic",
      //       isArray(uploadedFile) ? uploadedFile[0].asset : values.avatar
      //     )
      //   : null;
      userService
        .editUser(formData)
        .then(() => {
          mutate();
          toast.success("Changes done successfully");
          setShowIcon(false);
        })
        .catch((error) => {
          toast.error(error);
          setShowIcon(false);
        });
    },
  });

  const columns = [
    {
      name: "PROJECT ID",
      sortable: true,
      center: false,
      selector: "id",
    },
    {
      name: "PROJECT NAME",
      sortable: true,
      center: false,
      selector: "name",
    },
    {
      name: "CREATED ON",
      sortable: true,
      center: false,
      selector: "updated",
      cell: (row: any) => <>{row.created}</>,
    },
    {
      name: "ACTION",
      sortable: true,
      center: false,
      selector: "notebook_url",

      cell: (row: any, index: any) => (
        <div key={index}>
          <button
            onClick={() => {
              setProjectDelete(!projectDelete);
              setTempId(row?.id);
            }}
            className="btn btn-outline-danger text-center delete-project"
          >
            Delete project
          </button>
        </div>
      ),
    },
  ];

  const hiddenFileInput = React.useRef(null) as any;

  const handleEdit = () => {
    setFieldValue("isEditable", true);
    setShowIcon(true);
  };
  const roles = [
    "Customer service manager",
    "CXO/General manager",
    "Data scientist",
    "Developer/Software engineer/Analyst",
    "IT manager",
    "Marketing/PR manager",
    "Operations manager",
    "Sales manager",
    "Student/Personal interest",
    "Others",
  ];

  const industry = [
    "Information Technology",
    "Pharma",
    "Education",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Gaming",
    "Others",
  ];
  // const handleImageClick = () => {
  //   if (values.isEditable) hiddenFileInput.current.click();
  // };

  const handleImageChange = (event: any) => {
    setFieldValue("avatar", event.target.files[0]);
  };

  const handleSave = () => {
    setFieldValue("show", true);
  };

  const handleClose = () => {
    setFieldValue("show", false);
  };

  const handleCancel = () => {
    setFieldValue("show", false);
    resetForm();
    setShowIcon(false);
    setFieldValue("isEditable", false);
  };

  const handleMobile = (tel: any) => {
    setFieldValue("contact_number", tel);
  };

  const handleSubmission = () => {
    handleSubmit();
  };
  const handleTimezoneChange = (timezone: string) => {
    setFieldValue("timezone", timezone);
  };
  // load user data
  React.useEffect(() => {
    // fetchUserData();
  }, []);
  // console.log(window.document.getElementById("input1")?.offsetWidth);
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Settings`} description="User settings" />
      <div className="d-flex container flex-column align-items-start mt-2 ">
        {!values.email ? (
          <main
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ height: "82vh" }}
          >
            <Spinner animation="grow" className="dblue mb-5" />
          </main>
        ) : (
          <>
            <form className="container" onSubmit={handleSubmit}>
              <div className="container">
                <div className="pt-1">
                  <div className="summary-1 mt-3">
                    <h4 className="mb-2 title">Settings</h4>
                    <p className="mt-1 f-16 opacity-75">
                      Change your profile and account settings.
                    </p>
                  </div>
                  <div className="bg-white p-4 mt-1 rounded card-container">
                    <div>
                      <div className="d-flex align-items-center">
                        <div>
                          <h4>Avatar</h4>
                        </div>
                        <div className="ms-auto">
                          {!values.isEditable ? (
                            <button
                              className="btn btn-primary px-4 text-white "
                              type="button"
                              onClick={handleEdit}
                            >
                              Edit
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary px-4 text-white "
                              type="button"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                      <img
                        // src={
                        //   values.avatar
                        //     ? typeof values.avatar == "string"
                        //       ? values.avatar
                        //       : URL.createObjectURL(values.avatar)
                        //     : "/avatarUser.svg"
                        // }
                        src={
                          values.avatar
                            ? typeof values.avatar == "string"
                              ? values.avatar
                              : URL.createObjectURL(values.avatar)
                            : "/newAvatar.svg"
                        }
                        alt="User-picture"
                        style={{ width: 70, height: 70 }}
                        className="rounded-circle"
                      />
                      {showIcon === true && values.isEditable ? (
                        <div className="overlay">
                          <img
                            onClick={() => {
                              // handleImageClick;
                              // values.isEditable ?
                              hiddenFileInput.current.click();
                              // : null;
                            }}
                            src="/editIcon.svg"
                            alt="delete-icon"
                            style={{ marginTop: "-60px", color: "#6152D9", marginLeft: "54px" }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={hiddenFileInput}
                            onChange={handleImageChange}
                            className="d-none"
                          />
                        </div>
                      ) : null}
                    </div>
                    <hr className="my-1 mt-3" />
                    <h4 className="pt-2">Profile</h4>
                    <div className="row">
                      <div className="col-md-4">
                        <p className="font-16 my-2 p-0 ">First name</p>
                        <input
                          type="text"
                          name=""
                          id=""
                          className="form-control  image-placeholder profile-font"
                          value={values.firstname}
                          placeholder="First name"
                          onChange={handleChange}
                          readOnly
                        />

                        <p className="font-16 my-2 p-0 ">Email</p>
                        <input
                          type="text"
                          name=""
                          id=""
                          className="form-control  image-placeholder profile-font"
                          value={values.email}
                          onChange={handleChange}
                          readOnly
                        />
                        <p className="font-16 my-2 p-0 ">Industry</p>
                        <select
                          className="form-select  image-placeholder profile-font"
                          id="inputGroupSelect02"
                          name="industry"
                          onChange={handleChange}
                          required
                          placeholder="Select your Industry"
                          disabled={!values.isEditable}
                          value={values.industry}
                        >
                          <option value="" className="text-muted" disabled hidden selected>
                            Select your industry
                          </option>
                          {industry.map((item, index) => (
                            <option key={index} value={item} selected={item === values.industry}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <p className="font-16 my-2 p-0 ">Last name</p>
                        <input
                          type="text"
                          name=""
                          id=""
                          className="form-control  image-placeholder profile-font"
                          value={values.lastname}
                          placeholder="Last name"
                          onChange={handleChange}
                          readOnly
                        />

                        <p className="font-16 my-2 p-0 ">Company</p>
                        <input
                          type="text"
                          name="company"
                          id="input1"
                          className="form-control  image-placeholder"
                          style={{ backgroundColor: "#EDF2F7" }}
                          value={values.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                          disabled={!values.isEditable}
                        />

                        <p className="font-16 my-2 p-0 ">Timezone</p>
                        <TimezonePicker
                          value={values.timezone}
                          popoverProps={{
                            position: Position.BOTTOM,
                          }}
                          valueDisplayFormat={TimezoneDisplayFormat.NAME}
                          placeholder="Select timezone"
                          onChange={handleTimezoneChange}
                          disabled={!values.isEditable}
                        ></TimezonePicker>
                      </div>
                      <div className="col-md-4">
                        <p className="font-16 my-2 p-0 ">Contact number</p>
                        <PhoneInput
                          country={"us"}
                          // name="contact_number"
                          inputClass="form-control  image-placeholder w-100"
                          inputStyle={{ backgroundColor: "#EDF2F7", width: "100%" }}
                          value={values.contact_number}
                          onChange={handleMobile}
                          disabled={!values.isEditable}
                          placeholder="Enter your mobile number"
                        />

                        <p className="text-danger">
                          {errors.contact_number ? errors.contact_number : ""}
                        </p>

                        <p className="font-16 my-2 p-0 ">What is your role?</p>
                        <select
                          className="form-select  profile-font"
                          id="inputGroupSelect02"
                          onChange={handleChange}
                          disabled={!values.isEditable}
                          required
                          name="role"
                        >
                          <option value="" className="text-muted" disabled hidden selected>
                            Select your role
                          </option>
                          {roles.map((item, index) => (
                            <option key={index} value={item} selected={item === values.role}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <hr className="my-4" />

                    <Accordion>
                      <Accordion.Toggle className="border-0 bg-white" eventKey="1">
                        <h4 className="fw-bold f-20" style={{ color: "#3B3E40" }}>
                          My projects
                          <ChevronDown width={16} height={16} className="ms-2 cursor-pointer" />
                        </h4>
                      </Accordion.Toggle>
                      <Accordion.Collapse className="pt-3" eventKey="1">
                        <div className="border">
                          <ListTable columns={columns} data={projects} />
                        </div>
                      </Accordion.Collapse>
                    </Accordion>

                    <hr className="my-4" />
                  </div>
                </div>
              </div>

              <Modal
                onHide={handleClose}
                show={values.show}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header className="border-0 mt-4 ps-4 d-flex justify-content-center align-items-center">
                  <Modal.Title className="mb-0">Confirm action</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mb-0 mt-0 ps-4 pt-0 d-flex justify-content-center align-items-center">
                  Do you want to save the changes?
                </Modal.Body>
                <Modal.Footer className="border-0 ms-2 mt-2 mb-2 d-flex justify-content-center align-items-center">
                  <button className="btn ms-3 bg-white" onClick={handleCancel}>
                    Cancel
                  </button>
                  <Button
                    variant="primary"
                    className="text-white"
                    onClick={handleSubmission}
                    style={{ width: 117 }}
                  >
                    Yes, save
                  </Button>
                </Modal.Footer>
              </Modal>
            </form>
          </>
        )}
      </div>

      <DeleteProject
        projectDelete={projectDelete}
        setProjectDelete={setProjectDelete}
        id={tempId}
        projectsMutate={projectsMutate}
      />
    </>
  );
};
export default Profile;
