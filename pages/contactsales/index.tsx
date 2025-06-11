// react
import React, { FC } from "react";
// next seo
import { NextSeo } from "next-seo";
// toast
import { AuthorizationService } from "services";
import Button from "react-bootstrap-button-loader";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import Form from 'react-bootstrap/Form'

const authService = new AuthorizationService();

//toast configuration
toast.configure();
const ContactSales: FC = () => {
  const [loading, setLoading] = React.useState(false);

  const [requestInput, setRequestInput] = React.useState({
    fullName: "",
    contactNumber: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
    success: false,
  });
  const contactSales = () => {
    if (
      // requestInput.fullName.length === 0 ||
      // requestInput.contactNumber.length === 0 ||
      // requestInput.email.length === 0 ||
      // requestInput.company.length === 0 ||
      // requestInput.role.length === 0 ||
      requestInput.subject.length === 0 ||
      requestInput.message.length === 0
      // requestInput.subject === "Select the type of model"
    ) {
      toast.error("Please fill all the data");
      setLoading(false);
    } else {
      setLoading(true);

      authService
        .contactSales({
          // full_name: requestInput.fullName,
          // contact_number: requestInput.contactNumber,
          message: requestInput.message,
          // email: requestInput.email,
          // role: requestInput.role,
          // company: requestInput.company,
          subject: requestInput.subject,
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success(
              "We have received your request. Someone from our team will contact you soon."
            );
          }
          setLoading(false);

          setRequestInput({
            ...requestInput,
            success: true,
            message: "",
            subject: "",
          });

          // authService
          //   .getUsersData()
          //   .then((res) => {
          //     setRequestInput({
          //       ...requestInput,
          //       fullName: res.username,
          //       contactNumber: res.contact_number,
          //       email: res.email,
          //       company: res.company,
          //       role: res.role,
          //       message: "",
          //       subject: "",
          //       // model: res.industry,
          //     });
          //   })
          //   .catch((err) => {
          //     toast.error(err);
          //   });
        });
    }
  };

  // React.useEffect(() => {
  //   authService
  //     .getUsersData()
  //     .then((res) => {
  //       setRequestInput({
  //         ...requestInput,
  //         fullName: res.username,
  //         contactNumber: res.contact_number,
  //         email: res.email,
  //         company: res.company,
  //         role: res.role,
  //         // model: res.industry,
  //       });
  //     })
  //     .catch((err) => {
  //       toast.error(err);
  //     });
  // }, []);

  // const onHandleTelephoneChange = (e: any) => {
  //   let telephone = e.target.value;
  //   const re = /^[0-9\b]+$/;
  //   // if (!Number(telephone)) {
  //   //   return;
  //   // }
  //   if (e.target.value === "" || re.test(e.target.value)) {
  //     setRequestInput({ ...requestInput, contactNumber: telephone.trim() });
  //   }
  // };

  return (
    <>
      <NextSeo
        title={`${process.env.CLIENT_NAME} - Contact sales`}
        description="User Authentication"
      />
      <div className="d-flex flex-column me-0 ms-0 w-100">
        {/* <div>
          <div
            className="d-flex align-items-center w-100 mt-1 ps-5"
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)", height: 60 }}
          >
            <Image src={`${process.env.CLIENT_LOGO}`} alt="logo" />
          </div>
        </div> */}

        <div className="container">
          <div className="pt-4">
            <div className="summary-1 mt-3">
              <h4 className="mb-2 title">Sales request</h4>
              <p className="mt-1 f-16 opacity-75">
                Let us know how we can help and we&apos;ll get in touch with you shortly.
              </p>
            </div>
            <div className="bg-white p-4 rounded card-container">
              {/* <div className="row">
                <div className="col-md-6">
                  <p className="font-16 my-2 p-0 ">Full name</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="form-control  image-placeholder"
                    style={{ backgroundColor: "#EDF2F7" }}
                    value={requestInput.fullName}
                    placeholder="John Deo"
                    onChange={(e) => {
                      setRequestInput({ ...requestInput, fullName: e.target.value });
                    }}
                  />
                  <p className="font-16 my-2 p-0 ">Email</p>
                  <input
                    type="email"
                    name=""
                    id=""
                    className="form-control  image-placeholder"
                    style={{ backgroundColor: "#EDF2F7" }}
                    value={requestInput.email}
                    placeholder="John@company.com"
                    onChange={(e) => {
                      setRequestInput({ ...requestInput, email: e.target.value });
                    }}
                  />
                  <p className="font-16 my-2 p-0 ">What is your role?</p>
                  <select
                    className="form-select "
                    id="inputGroupSelect02"
                    style={{ backgroundColor: "#EDF2F7" }}
                    value={requestInput.role}
                    onChange={(e) => {
                      setRequestInput({ ...requestInput, role: e.target.value });
                    }}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Select your role
                    </option>
                    <option value="Customer service manager">Customer service manager</option>
                    <option value="CXO/General manager">CXO/General manager</option>
                    <option value="Data scientist">Data scientist</option>
                    <option value="Developer/Software engineer/Analyst">
                      Developer/Software engineer/Analyst
                    </option>
                    <option value="IT manager">IT manager</option>
                    <option value="Marketing/PR manager">Marketing/PR manager</option>
                    <option value="Operations manager">Operations manager</option>
                    <option value="Sales manager">Sales manager</option>
                    <option value="Student/Personal interest">Student/Personal interest</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <p className="font-16 my-2 p-0 ">Contact number</p>
                  <PhoneInput
                    country={"us"}
                    inputClass="form-control  image-placeholder w-100"
                    inputStyle={{ backgroundColor: "#EDF2F7", width: "100%" }}
                    onChange={(tel) => {
                      setRequestInput({ ...requestInput, contactNumber: tel });
                    }}
                    value={requestInput.contactNumber}
                    placeholder="Enter your mobile number"
                  />
                  {/* <input
                    // type="number"
                    name=""
                    id=""
                    // maxLength={10}
                    className="form-control  image-placeholder"
                    style={{ backgroundColor: "#EDF2F7" }}
                    value={requestInput.contactNumber}
                    placeholder="+91 1234568790"
                    onChange={(e) => {
                      onHandleTelephoneChange(e);
                    }}
                  /> */}
              {/* <p className="font-16 my-2 p-0 ">Company</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="form-control  image-placeholder"
                    style={{ backgroundColor: "#EDF2F7" }}
                    value={requestInput.company}
                    placeholder="Globex Corporation"
                    onChange={(e) => {
                      setRequestInput({ ...requestInput, company: e.target.value });
                    }}
                  />
                </div>
              </div> */}
              <div>
                <p className="font-16 my-2 p-0 ">Subject</p>
                <Form.Control
                  style={{ backgroundColor: "#EDF2F7" }}
                  className="form-control  image-placeholder"
                  value={requestInput.subject}
                  name=""
                  id=""
                  placeholder="Enter the subject of your request"
                  onChange={(e) => {
                    setRequestInput({ ...requestInput, subject: e.target.value });
                  }}
                />
              </div>

              <div>
                <p className="font-16 my-2 p-0 ">Message</p>
                <textarea
                  style={{ backgroundColor: "#EDF2F7" }}
                  className="form-control  image-placeholder"
                  rows={5}
                  value={requestInput.message}
                  name=""
                  id=""
                  placeholder="Enter the details of your request"
                  onChange={(e) => {
                    setRequestInput({ ...requestInput, message: e.target.value });
                  }}
                />
              </div>
              <Button
                className="btn btn-primary text-white mt-3 "
                loading={loading}
                onClick={contactSales}
              >
                Submit
              </Button>
            </div>
            {/* {requestInput.success ? (
              <div className="w-50 mt-4">
                <h4 className="">Thank you!</h4>
                <p className="">
                  We have received your request. Someone from our team will contact you soon.
                </p>
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactSales;
