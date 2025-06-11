// react
import React, { FC } from "react";
// react-bootstrap
import { Image } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// components
import { LoginForm, SignUpForm } from "components/forms";

const IndexPage: FC = () => {
  // state for forget password page
  // state for login page
  const [state, setState] = React.useState({ forgetPass: false, logIn: true });

  return (
    <>
      <NextSeo
        title={`${process.env.CLIENT_NAME} - ${
          !state.forgetPass ? (state.logIn ? "Signin" : "Signup") : "Reset"
        }`}
        description="User Authentication"
      />
      <div className="d-flex flex-column main-container-i me-0 ms-0 w-100">
        <div
          className="d-flex align-items-center w-100 my-1 ps-5"
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)", height: 60 }}
        >
          <Image src={`${process.env.CLIENT_LOGO}`} alt="logo" />
        </div>
        {process.env.CLIENT_NAME === "Dflux" ? (
          <div className="d-flex h-100">
            <div className="d-flex flex-column w-100">
              <div className="d-flex flex-column align-items-center justify-content-center flex-fill">
                <h3 className="text-i font-weight-bold f-32">Realize the potential of</h3>
                <h3 className="dblue font-weight-bold f-32 mb-5">advanced data analytics</h3>

                <Image
                  src={process.env.CLIENT_NAME === "Dflux" ? "/welcome.svg" : "/newLogo.png"}
                  alt="logo"
                  className="img-fluid"
                  width="445.71"
                  height="330.73"
                />
              </div>
            </div>

            <div className="d-flex flex-fill w-100">
              {!state.forgetPass ? (
                <>
                  {state.logIn ? (
                    <LoginForm state={state} setState={setState} />
                  ) : (
                    <SignUpForm state={state} setState={setState} />
                  )}
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="bg-img px-3 px-md-5" style={{ backgroundImage: "url(newLogo.png)" }}>
            <div className="d-none d-md-flex flex-column justify-content-center align-items-center me-3">
              <Image src={`${process.env.INSIGHT}`} alt="logo" className="div-bg" height={120} />
              <div className="mt-5 div-bg text-white text-center" style={{ background: "#1d212b" }}>
                <h3>The advanced predictive analytics and visualization platform</h3>
                <h6 className="f-20">
                  powered by Intellect<sup>2</sup>
                </h6>
              </div>
            </div>
            <div className="align-self-center" style={{ maxWidth: "380px" }}>
              {!state.forgetPass ? (
                <>
                  {state.logIn ? (
                    <LoginForm state={state} setState={setState} />
                  ) : (
                    <SignUpForm state={state} setState={setState} />
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;
