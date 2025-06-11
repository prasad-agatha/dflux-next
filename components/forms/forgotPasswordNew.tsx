// react
import React, { FC } from "react";
// react-bootstrap
import { Form } from "react-bootstrap";
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
interface IForgetPassProps {
  state: any;
  setState: any;
}

const ForgetPasswordForm: FC<IForgetPassProps> = (props) => {
  const { state, setState } = props;

  // loading spinner
  const [sendingLink, setSendingLink] = React.useState(false);

  // formik
  const formik: IformikDefination = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validate: ForgetPassValidation,
    onSubmit: (values) => {
      setSendingLink(true);
      authService
        .resetPassword(values)
        .then(() => {
          setSendingLink(false);
          toast.success("Reset password link sent to your email address", { autoClose: 3000 });
        })
        .catch(() => {
          toast.error("No active account found...!", { autoClose: 3000 });
          setSendingLink(false);
        });
    },
  });

  return (
    <div className="bgdblue w-100 d-flex flex-column align-items-center justify-content-center">
      <h3 className="font-weight-bold text-light mb-4 f-24">Set password</h3>

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
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          ) : null}
        </Form.Group>
      </div>

      <div className="mt-3 d-flex justify-content-between" style={{ width: 301 }}>
        <Button
          className="f-16 dblue bg-white"
          onClick={() => {
            setState({ ...state, forgetPass: false });
          }}
        >
          <div className="d-flex f-14 bold align-items-center color2">Back to login</div>
        </Button>
        <Button
          loading={sendingLink}
          spinColor="#0076FF"
          className="f-14 bold login-b"
          spinAlignment="right"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
export default ForgetPasswordForm;
