// react
import React, { FC } from "react";
// react-bootstrap
import { Form } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// next router
import { useRouter } from "next/router";
// formik
import { useFormik } from "formik";
// services
import { AuthorizationService } from "services";
// types
import { ISiginInputValues } from "lib/types";
import { SignUpValidation } from "lib/validation";
// cookie
import cookie from "js-cookie";
// jwt
import jwt_decode from "jwt-decode";
// toast
import { toast } from "react-toastify";

const authService = new AuthorizationService();

interface IformikDefinition {
  validateOnChange: boolean;
  validate?: any;
  handleSubmit: () => any;
  handleChange: (data: string) => any;
  values: ISiginInputValues;
  errors: any;
  resetForm: () => void;
}
interface ISignProps {
  state: any;
  setState: any;
}

const SignUpForm: FC<ISignProps> = (props: ISignProps) => {
  const { state, setState } = props;
  const router = useRouter();
  // loading spinner
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState<any>();
  const [tokenData, setTokenData] = React.useState<any>();

  // formik
  const formik: IformikDefinition = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validateOnChange: false,
    validate: SignUpValidation,
    onSubmit: (values: any) => {
      setLoading(true);
      authService
        .createUser(values)
        .then((res: any) => {
          toast.success("Account created successfully");
          authService.authenticateUser(res?.access, res?.refresh);
          setLoading(false);
          if (token) {
            router.push(`/project/invitation/${token}`);
          } else {
            router.push("/projects");
          }
        })
        .catch((err) => {
          toast.error(err.email[0], { autoClose: 3000 });
          setLoading(false);
        });
    },
  });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get("invite");
    if (inviteToken) {
      setToken(inviteToken);
      const decoded: any = jwt_decode(`${inviteToken}`);

      setTokenData(decoded);
      formik.values.email = decoded.user;
    } else if (cookie.get("accessToken") && !inviteToken) {
      router.push("/projects");
    }
  });

  return (
    <>
      {process.env.CLIENT_NAME === "Dflux" ? null : (
        <h2 className="text-center text-bg m-0">Start for free</h2>
      )}
      <div
        className={
          "w-100 d-flex flex-column justify-content-center px-4 " +
          (process.env.CLIENT_NAME === "Dflux"
            ? "mt-1 bgdblue align-items-center"
            : "bgdarkblue pt-5")
        }
      >
        <div className=" w-100 " style={{ maxWidth: 320 }}>
          <h3 className="font-weight-bold text-light mb-0 f-24">Sign up</h3>
          {process.env.CLIENT_NAME === "Dflux" ? (
            <p className="font-weight-normal text-light mb-4 f-16">Welcome to DFLUX!</p>
          ) : (
            <p className="font-weight-normal text-light mb-4 f-16">Welcome to Intellect INSIGHT!</p>
          )}
        </div>

        <div className="mb-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              type="text"
              name="first_name"
              placeholder="First name"
              className="signup-i f-16 mb-0"
              value={formik.values.first_name}
              onChange={formik.handleChange("first_name")}
              isInvalid={formik.errors.first_name}
            />
            {formik.errors.first_name ? (
              <Form.Control.Feedback type="invalid">
                <div className="error-message">{formik.errors.first_name}</div>
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
        </div>
        <div className="mb-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              type="text"
              name="last_name"
              placeholder="Last name"
              className="signup-i f-16 mb-0"
              value={formik.values.last_name}
              onChange={formik.handleChange("last_name")}
              isInvalid={formik.errors.last_name}
            />
            {formik.errors.last_name ? (
              <Form.Control.Feedback type="invalid">
                <div className="error-message">{formik.errors.last_name}</div>
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
        </div>
        <div className="mb-2">
          <Form.Group>
            <Form.Control
              name="email"
              placeholder="Email"
              className="signup-i f-16 mb-0"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              isInvalid={formik.errors.email}
              disabled={tokenData ? true : false}
            />
            {formik.errors.email ? (
              <Form.Control.Feedback type="invalid">
                <div className="error-message">{formik.errors.email}</div>
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
        </div>
        <div className="mb-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              name="password"
              type="password"
              placeholder="Password"
              className="signup-i f-16 mb-0"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              isInvalid={formik.errors.password}
            />
            {formik.errors.password ? (
              <Form.Control.Feedback type="invalid">
                <div className="error-message">{formik.errors.password}</div>
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
        </div>
        <div className="mb-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              name="confirm_password"
              type="password"
              placeholder="Confirm password"
              className="signup-i f-16 mb-0"
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

        <div className="login-options-container-i">
          <Button
            className={"f-16 " + (process.env.CLIENT_NAME === "Dflux" ? "login-c" : "login-ic")}
            loading={loading}
            spinAlignment="right"
            spinColor={process.env.CLIENT_NAME === "Dflux" ? "#0076FF" : "#FFFFFF"}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Submit
          </Button>
        </div>
        <div>
          <Form.Group>
            <p className="text-white mt-3">
              Have an account already? &nbsp;
              <span className="forgot-text-i " onClick={() => setState({ ...state, logIn: true })}>
                Sign in
              </span>
            </p>
          </Form.Group>
        </div>
        <div>
          {process.env.CLIENT_NAME === "Dflux" ? (
            <Form.Group>
              <p className="text-white mt-3 mb-0">*By submitting this form, you agree to the</p>
              <p className="text-white">Terms and conditions, and Privacy policy.</p>
            </Form.Group>
          ) : (
            <Form.Group>
              <p className="text-white mt-3 mb-0">*By submitting this form, you agree to the</p>
              <div className="d-flex flex-row">
                <p
                  className="forgot-text-i"
                  onClick={() => window.open("https://intellectdata.com/terms-and-conditions/")}
                >
                  Terms and conditions,
                </p>
                <p
                  className="forgot-text-i"
                  onClick={() => window.open("https://intellectdata.com/privacy-policy/")}
                >
                  and Privacy policy.
                </p>
              </div>
            </Form.Group>
          )}
        </div>
      </div>
    </>
  );
};
export default SignUpForm;
