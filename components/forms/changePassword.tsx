import React, { FC } from "react";
// react-bootstrap
import { Form } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// formik
import { useFormik } from "formik";
// hooks
// import { useRequest } from "@lib/hooks";
// services
import { AuthorizationService } from "services";
// validations
import { ChangePassValidation } from "lib/validation";
// toast
import { toast } from "react-toastify";

const authService = new AuthorizationService();
//toast configuration
toast.configure();
interface IChangePasswordProps {
  profileState: any;
  setprofileState: any;
}

const ChangePassword: FC<IChangePasswordProps> = (props) => {
  const { profileState, setprofileState } = props;
  // const {profileState, setprofileState} = props
  const [loading, setLoading] = React.useState(false);

  // formik
  const formik: any = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validateOnChange: false,
    validate: ChangePassValidation,
    onSubmit: (values: any) => {
      setLoading(true);
      authService
        .changePassword(values, profileState.userId)
        .then(() => {
          setLoading(false);
          toast.success("Password has been updated successfully", { autoClose: 3000 });
          setTimeout(() => {
            // setReset(false);
            setprofileState({ ...profileState, reset: true });
          }, 2000);
        })
        .catch(() => {
          toast.error("Incorrect details", { autoClose: 3000 });
          setLoading(false);
        });
    },
  });

  return (
    <div className="d-flex container flex-column align-items-start mt-2 ">
      <h6 className=" align-self-baseline mt-3">Password</h6>
      <div className="d-flex flex-row w-100 mb-2">
        <div className="">
          <Form>
            <Form.Group>
              <Form.Label className="f-14">Old password</Form.Label>
              <Form.Control
                type="password"
                //   value={passwordUpdate.old_password || ""}
                //   onChange={handleInputChange}
                name="old_password"
                autoComplete="off"
                style={{ marginBottom: 5, width: 330 }}
                value={formik.values.old_password}
                onChange={formik.handleChange("old_password")}
                isInvalid={formik.errors.old_password}
              />
              {formik.errors.old_password ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.old_password}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label className="f-14">New password</Form.Label>
              <Form.Control
                type="password"
                name="new_password"
                autoComplete="off"
                style={{ marginBottom: 5, width: 330 }}
                value={formik.values.new_password}
                onChange={formik.handleChange("new_password")}
                isInvalid={formik.errors.new_password}
              />

              {formik.errors.new_password ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.new_password}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label className="f-14">Confirm password</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                autoComplete="off"
                style={{ marginBottom: 15, width: 330 }}
                value={formik.values.confirm_password}
                onChange={formik.handleChange("confirm_password")}
                isInvalid={formik.errors.confirm_password}
              />
              {formik.errors.confirm_password ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.confirm_password}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Button
              className="f-14 text-white"
              variant="primary"
              onClick={() => {
                // setReset(false);
                setprofileState({ ...profileState, reset: false });
              }}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              className="me-4 ms-4 f-14 text-white"
              variant="primary"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              Update password
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
