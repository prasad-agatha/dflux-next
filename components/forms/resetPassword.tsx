// react
import React, { FC } from "react";
// react-bootstrap
import { Form, Card } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// router
import { useRouter } from "next/router";
// formik
import { useFormik } from "formik";
// services
import { AuthorizationService } from "services";
// validations
import { ResetPassValidation } from "lib/validation";
// toast
import { toast } from "react-toastify";
// import { borderRadius } from "react-select/src/theme";

const authService = new AuthorizationService();
//toast configuration
toast.configure();

interface IResetPasswordFormProps {
  resettoken: any;
}

const ResetPasswordForm: FC<IResetPasswordFormProps> = (props) => {
  const { resettoken } = props;
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [enable, setEnable] = React.useState(false);

  // formik
  const formik: any = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
      token: resettoken,
    },
    validateOnChange: false,
    validate: ResetPassValidation,
    onSubmit: (values: any) => {
      setLoading(true);
      authService
        .confirmPassword(values)
        .then(() => {
          setLoading(false);
          toast.success("Password has been updated successfully", { autoClose: 3000 });
          setEnable(true);
        })
        .catch(() => {
          toast.error("Reset Link expired", { autoClose: 3000 });
          setLoading(false);
          setEnable(false);
        });
    },
  });
  React.useEffect(() => {
    if (resettoken) {
      formik.values.token = resettoken;
    }
  });

  return (
    <div className=" w-100 d-flex flex-column align-items-center justify-content-center">
      <Card className="password-container mt-4">
        <div className="d-flex h-100 flex-column align-items-center justify-content-center">
          <h3 className="font-weight-bold mb-4 f-30">Set password</h3>
          <div>
            <Form.Group>
              <Form.Control
                autoComplete="off"
                type="password"
                name="new_password"
                placeholder="New password"
                className="input-i mb-3 f-14"
                value={formik.values.new_password}
                onChange={formik.handleChange("new_password")}
                isInvalid={formik.errors.new_password}
              />

              {formik.errors.new_password ? (
                <Form.Control.Feedback type="invalid">
                  <div className="error-message">{formik.errors.new_password}</div>
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </div>
          <div>
            <Form.Group>
              <Form.Control
                autoComplete="off"
                type="password"
                name="confirm_password"
                placeholder="Confirm new password"
                className="input-i f-14"
                value={formik.values.confirm_password}
                onChange={formik.handleChange("confirm_password")}
                isInvalid={formik.errors.confirm_password}
              />
              {formik.errors.confirm_password ? (
                <Form.Control.Feedback type="invalid">
                  <div className="error-message">{formik.errors.confirm_password}</div>
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </div>
          <Button
            loading={loading}
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
      </Card>

      {enable === true ? (
        <div className="d-flex flex-row">
          <img src="/successRight.svg"></img>
          <p className="mt-4 ms-2">
            <span>Your password reset is successful. Click</span>
            <span
              className="font-weight-bold forgot-text-i1 ms-1 mt-4 cursor-pointer"
              onClick={() => router.push("/")}
            >
              here
            </span>
            <span> to continue</span>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ResetPasswordForm;
