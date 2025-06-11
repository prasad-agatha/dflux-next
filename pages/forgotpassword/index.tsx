// react
import React, { FC } from "react";
// react bootstrap
import { Image } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
// components
import { ForgetPasswordForm } from "components/forms";
// toast
import { toast } from "react-toastify";
//toast configuration
toast.configure();
const ForgotPassword: FC = () => {
  return (
    <>
      <NextSeo
        title={`Forgot password - ${process.env.CLIENT_NAME}`}
        description="User Authentication"
      />
      <div className="d-flex flex-column main-container-i me-0 ms-0 w-100">
        <div>
          <div
            className="d-flex align-items-center w-100 mt-1 ps-5"
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)", height: 60 }}
          >
            <Image src={`${process.env.CLIENT_LOGO}`} alt="logo" />
          </div>
        </div>
        {/* <div className="d-flex flex-column w-100">
            <div className="d-flex align-items-center mt-2 ps-2">
              <Image src={`${process.env.CLIENT_LOGO}`} alt="logo" width={237} height={43} />
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center flex-fill">
              <h3 className="text-i font-weight-bold f-32">Realize the potential of</h3>
              <h3 className="dblue font-weight-bold f-32 mb-5">advanced data analytics</h3>
              <Image
                src="/welcome.svg"
                alt="logo"
                className="img-fluid"
                width="445.71"
                height="330.73"
              />
            </div>
          </div> */}
        <div className="d-flex flex-fill w-100">
          <ForgetPasswordForm />
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
