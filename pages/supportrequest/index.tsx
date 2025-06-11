import React, { FC, useState } from "react";
//Loader
import { Form } from "react-bootstrap";
// toasts
import { toast } from "react-toastify";
import { ConnectionsService } from "services";
import { AuthorizationService } from "services";
import { isArray } from "lodash";
import Button from "react-bootstrap-button-loader";

//toast configuration
toast.configure();
const connections = new ConnectionsService();
const authService = new AuthorizationService();

const support: FC = () => {
  const [subjectValid, setSubjectValid] = useState(false);
  const [descValid, setDescValid] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const [requestInput, setRequestInput] = useState({
    subject: "",
    description: "",
    attachedFile: null,
    success: false,
  }) as any;
  const raiseSupportRequest = async () => {
    setSubjectValid(false);
    setDescValid(false);
    setLoading(false);

    if (requestInput.subject.length === 0 || requestInput.description.length === 0) {
      if (requestInput.subject.length === 0) {
        setSubjectValid(true);
      }
      if (requestInput.description.length === 0) {
        setDescValid(true);
      }
    } else {
      setLoading(true);

      let uploadedFile;

      if (typeof requestInput.attachedFile !== "string" && requestInput.attachedFile) {
        const imgData = new FormData();
        imgData.append("name[]", `profile`);
        imgData.append("asset[]", requestInput.attachedFile);
        uploadedFile = await connections.dumpJSONFile(imgData);
      } else {
        uploadedFile = true;
      }
      // const formData = new FormData();
      // formData.append("subject", requestInput.subject);
      // formData.append("description", requestInput.description);
      if (isArray(uploadedFile)) {
        // formData.append("attachment", uploadedFile[0].asset);

        authService
          .supportRequest({
            subject: requestInput.subject,
            description: requestInput.description,
            attachment: uploadedFile[0].asset,
          })
          .then(() => {
            toast.success(
              "We have received your request. Someone from our team will contact you soon."
            );

            setLoading(false);
            setRequestInput({
              ...requestInput,
              success: true,
              subject: "",
              description: "",
              attachedFile: null,
            });
          });
      } else {
        authService
          .supportRequest({
            subject: requestInput.subject,
            description: requestInput.description,
          })
          .then(() => {
            toast.success(
              "We have received your request. Someone from our team will contact you soon."
            );

            setLoading(false);
            setRequestInput({
              ...requestInput,
              success: true,
              subject: "",
              description: "",
              attachedFile: null,
            });
          });
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="pt-4">
          <div className="summary-1 mt-3">
            <h4 className="mb-2 title">Support request</h4>
            <p className="mt-1 f-16 opacity-75">
              Fill in the form with your request details below and we&apos;ll get in touch with you
              shortly.
            </p>
          </div>
          <div className="bg-white p-4 rounded card-container">
            <div className="my-2 ">
              <p>Subject</p>
              <Form.Control
                type="text"
                name=""
                id=""
                value={requestInput.subject}
                className="form-control w-50 "
                style={{ backgroundColor: "#EDF2F7" }}
                placeholder="Enter the subject of your request"
                onChange={(e: any) => {
                  setRequestInput({ ...requestInput, subject: e.target.value });
                }}
              />
              {subjectValid ? (
                <small className="d-inline px-2 required">This field is required</small>
              ) : null}
            </div>
            <div className="mt-4">
              <p className="">Description</p>
              <textarea
                style={{ backgroundColor: "#EDF2F7" }}
                className="form-control w-50 "
                rows={5}
                name=""
                id=""
                value={requestInput.description}
                placeholder="Enter the details of your request"
                onChange={(e) => {
                  setRequestInput({ ...requestInput, description: e.target.value });
                }}
              />
              {descValid ? (
                <small className="d-inline px-2 required">This field is required</small>
              ) : null}
            </div>
            <div
              className="d-flex mt-3 cursor-pointer"
              onClick={() => {
                document.getElementById("selectImage")?.click();
              }}
            >
              <img src="/attach-icon.svg" alt="attach-icon" className="me-2" />
              Attach files
              <input
                type="file"
                id="selectImage"
                hidden
                onChange={(e: any) => {
                  setRequestInput({ ...requestInput, attachedFile: e.target.files[0] });
                }}
              />
              {requestInput.attachedFile !== null ? (
                <p className="p-0 m-0 mt-2  fw-bold ms-3">{requestInput.attachedFile?.name}</p>
              ) : null}
            </div>
            <Button
              className="btn btn-primary text-white mt-3 "
              onClick={raiseSupportRequest}
              loading={loading}
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
    </>
  );
};
export default support;
