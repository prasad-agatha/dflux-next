import React, { FC } from "react";
// react-bootstrap
import { Spinner } from "react-bootstrap";

const PageLoading: FC = () => {
  return (
    <div className="d-flex flex-row align-items-center justify-content-center w-100 h-100">
      <Spinner animation="border" className="dblue" />
    </div>
  );
};
export default PageLoading;
