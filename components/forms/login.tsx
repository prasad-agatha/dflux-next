// react
import React, { FC } from "react";
// react-bootstrap
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap-button-loader";
// next router
import { useRouter } from "next/router";
// formik
import { useFormik } from "formik";
// services
import { AuthorizationService } from "services";
// types
import { ILogininInputValues } from "lib/types";
import { LoginInValidation } from "lib/validation";
// cookie
import cookie from "js-cookie";
import Link from "next/link";

// jwt
import jwt_decode from "jwt-decode";
// toast
import { toast } from "react-toastify";

import { Eye } from "@styled-icons/bootstrap/Eye";
import { EyeSlash } from "@styled-icons/bootstrap/EyeSlash";

const authService = new AuthorizationService();
interface IformikDefination {
  validateOnChange: boolean;
  validate?: any;
  handleSubmit: () => any;
  handleChange: (data: string) => any;
  values: ILogininInputValues;
  errors: any;
  resetForm: () => void;
}
interface ILoginProps {
  setState: any;
  state: any;
}

const LoginForm: FC<ILoginProps> = (props) => {
  const { state, setState } = props;
  // router
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };

  // loading spinner
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState<any>();
  const [tokenData, setTokenData] = React.useState<any>();
  const [loginModel, setLoginModel] = React.useState(false);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // formik
  const formik: IformikDefination = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validate: LoginInValidation,
    onSubmit: (values: any) => {
      setLoading(true);
      authService
        .userSignIN(values)
        .then((res: any) => {
          authService.authenticateUser(res?.access, res?.refresh);
          authService
            .editUser({
              timezone: timezone,
            })
            .catch((error) => {
              toast.error(error);
            });

          setLoading(false);
          if (token) {
            router.push(`/project/invitation/${token}`);
          } else {
            router.push("/projects");
          }
        })
        .catch((err) => {
          if (err.error === "user is inactive please contact your admin") {
            setLoginModel(!loginModel);
            setLoading(false);
          } else {
            toast.error(err.error, { autoClose: 3000 });
            setLoading(false);
          }
        });
    },
  });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get("invite");
    if (inviteToken) {
      setToken(inviteToken);
      const decoded: any = jwt_decode(`${inviteToken}`);

      if (!decoded.user_status) {
        setState({ ...state, logIn: false });
      }
      setTokenData(decoded);
      formik.values.email = decoded.user;
    } else if (cookie.get("accessToken") && !inviteToken) {
      router.push("/projects");
    }
  }, []);

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
        <h3 className="font-weight-bold text-light mb-0 f-26 w-100 " style={{ maxWidth: 320 }}>
          Sign in
        </h3>
        <p className="font-weight-normal text-light mb-4 f-16 w-100" style={{ maxWidth: 320 }}>
          Welcome back
        </p>
        <div className="mb-2">
          <Form.Group>
            <Form.Control
              name="email"
              placeholder="Email"
              className="login-i f-16 mb-0"
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
        <div className="mb-0 mt-2">
          <Form.Group>
            <Form.Control
              autoComplete="off"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-i f-16 mb-0 mr-0"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              isInvalid={formik.errors.password}
            />
            <i
              onClick={togglePasswordVisiblity}
              className={!formik.errors.password ? "icon" : "error-icon"}
            >
              {showPassword ? (
                <Eye width="20" height="20" className="icon1" />
              ) : (
                <EyeSlash width="20" height="20" className="icon2" />
              )}
            </i>
            {formik.errors.password ? (
              <Form.Control.Feedback type="invalid">
                <div className="error-message w-100" style={{ maxWidth: 320 }}>
                  {formik.errors.password}
                </div>
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
        </div>

        <div className="login-options-container-i mt-0">
          <Link href={`/forgotpassword`}>
            <h4 className="forgot-text-i f-16 mb-0">Forgot password?</h4>
          </Link>

          <Button
            className={"f-16 " + (process.env.CLIENT_NAME === "Dflux" ? "login-b" : "login-ib")}
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

        <p className="text-white mt-4 mb-2 text-center">
          Don’t have an account? &nbsp;
          <span className="forgot-text-i" onClick={() => setState({ ...state, logIn: false })}>
            Sign up
          </span>
        </p>

        {process.env.CLIENT_NAME === "Dflux" ? null : (
          <div>
            <h6 className="text-white text-center f-18 mt-3">Free two-week trial</h6>
            <p className="text-white text-center f-14 mb-5">
              (no credit card information required)
            </p>
          </div>
        )}

        <Modal
          show={loginModel}
          onHide={() => {
            setLoginModel(!loginModel);
          }}
          // show={show}
          // onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          // dialogClassName="modal-40w"
        >
          <Modal.Header className="border-0 d-flex justify-content-center align-items-center mt-4 ps-4">
            <Modal.Title className="mb-0">Your free trail has ended</Modal.Title>
          </Modal.Header>
          <Modal.Body className="mb-0 mt-1 d-flex justify-content-center align-items-center pt-0">
            <div className="d-flex flex-column">
              <p className="d-flex justify-content-center mt-1 mb-0 align-items-center">
                Unfortunately, your 15 days free trail has
              </p>
              <p className="d-flex mb-0 justify-content-center align-items-center">
                now expired. To continue using the
              </p>
              <p className="d-flex justify-content-center align-items-center">
                platform, contact us.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 mb-3 d-flex justify-content-center align-items-center">
            <button
              className="btn ms-3 bg-white"
              onClick={() => {
                setLoginModel(!loginModel);
              }}
            >
              Cancel
            </button>
            <Button
              variant="primary"
              className="text-white"
              onClick={() => {
                window.open("https://intellectdata.com/contact-us/");
                setLoginModel(!loginModel);
              }}
              style={{ width: 150 }}
            >
              Contact us
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
export default LoginForm;
