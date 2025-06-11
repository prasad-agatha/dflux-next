import React, { FC } from "react";
import { Spinner } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";

const PageLoader: FC = () => {
  return (
    <main
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "82vh" }}
    >
      <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
      <Spinner animation="grow" className="dblue mb-5" />
    </main>
  );
};

export default PageLoader;
