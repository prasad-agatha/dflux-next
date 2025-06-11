// react
import React, { FC } from "react";
// react-bootstrap
import { Form, Card } from "react-bootstrap";
// formik
import { useFormik } from "formik";
// toast
import { toast } from "react-toastify";
// services
import { AuthorizationService } from "services";
import Button from "react-bootstrap-button-loader";
// types
import { IForgetInputValues } from "lib/types";
// validation
import { ForgetPassValidation } from "lib/validation";
import Link from "next/link";

const authService = new AuthorizationService();

interface IformikDefination {
  validateOnChange: boolean;
  validate?: any;
  handleSubmit: () => any;
  handleChange: (data: string) => any;
  values: IForgetInputValues;
  errors: any;
  resetForm: () => void;
}

const ForgetPasswordForm: FC = () => {
  // loading spinner
  const [sendingLink, setSendingLink] = React.useState(false);
  const [enable, setEnable] = React.useState(false);

  // formik
  const formik: IformikDefination = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validate: ForgetPassValidation,
    onSubmit: (values, { resetForm }) => {
      setSendingLink(true);
      authService
        .resetPassword(values)
        .then(() => {
          setSendingLink(false);
          setEnable(true);
          resetForm({});
        })
        .catch(() => {
          toast.error("No active account found...!", { autoClose: 3000 });
          setSendingLink(false);
          setEnable(false);
        });
    },
  });

  return (
    <div className=" w-100 d-flex flex-column align-items-center justify-content-center">
      <Card className="password-container mt-4">
        <div className="d-flex h-100 flex-column align-items-center justify-content-center">
          <h3 className="font-weight-bold mb-3 mt-3 f-30">Forgot password</h3>
          <p className="mb-0" style={{ color: "#282828" }}>
            Enter your registered email. We will send you
          </p>
          <p style={{ color: "#282828" }}>a link to reset your password.</p>
          <div>
            <Form.Group>
              <Form.Control
                autoComplete="off"
                name="reset_email"
                placeholder="Email"
                className="input-i f-16 mb-0"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                isInvalid={formik.errors.email}
              />
              {formik.errors.email ? (
                <Form.Control.Feedback type="invalid">
                  <div className="error-message">{formik.errors.email}</div>
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </div>

          <div className="mt-3 d-flex justify-content-between" style={{ width: 301 }}>
            <Button
              loading={sendingLink}
              className="text-white f-13 mt-3 submit-btn"
              spinAlignment="right"
              spinColor="#0076FF"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              Submit
            </Button>
          </div>

          <div className="d-flex mt-3 flex-row">
            <p style={{ color: "#282828" }}>Return to</p>
            <Link href={`/`}>
              <p className="font-weight-bold forgot-text-i1  ms-1 cursor-pointer">Sign in</p>
            </Link>
          </div>
        </div>
      </Card>

      {enable === true ? (
        <div className="d-flex flex-row">
          <img src="/successRight.svg"></img>
          <p className="mt-4 ms-2">We have just emailed you a link to reset password.</p>
        </div>
      ) : null}
    </div>
  );
};
export default ForgetPasswordForm;
