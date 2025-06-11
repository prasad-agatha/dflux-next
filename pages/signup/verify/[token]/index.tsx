import React, { FC } from "react";
import { Card, Spinner } from "react-bootstrap";
// next router
import { useRouter } from "next/router";
// toast
import { toast } from "react-toastify";
import Button from "react-bootstrap-button-loader";
import { AuthorizationService, ProjectsService } from "services";

//toast configuration
toast.configure();

// service instance
const authService = new AuthorizationService();
const projectService = new ProjectsService();

const Confirm: FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  const verifyUser = () => {
    setLoading(true);
    authService
      .getUsersData()
      .then(() => {
        projectService
          .verify_User({ token: token })
          .then(() => {
            setVerified(true);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            setVerified(false);
          });
      })
      .catch((error) => {
        setLoading(true);
        toast.error(error);
      });
  };
  React.useEffect(() => {
    if (token) {
      verifyUser();
    }
  }, [token]);
  return (
    <div style={{ marginTop: 90 }}>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" className="dblue" />
        </div>
      ) : verified ? (
        <div className="w-100 d-flex flex-row align-items-center justify-content-center">
          <Card className="password-container mt-4">
            <div className="d-flex h-100 flex-column align-items-center justify-content-center">
              <img src="/greenTick.svg"></img>
              <h3 className="font-weight-bold mb-3 mt-3 f-30">Thank you</h3>
              <p className="mb-0" style={{ color: "#282828" }}>
                Your email has been successfully verified
              </p>

              <div className="mt-3 d-flex justify-content-between" style={{ width: 201 }}>
                <Button
                  className="text-white f-13 mt-3 submit-btn"
                  spinAlignment="right"
                  spinColor="#0076FF"
                  onClick={() => router.push("/projects")}
                >
                  Go to my account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className=" w-100 d-flex flex-column align-items-center justify-content-center">
          <Card className="password-container mt-4">
            <div className="d-flex h-100 flex-column align-items-center justify-content-center">
              <h3 className="font-weight-bold mb-3 mt-3 f-30">Email not verified</h3>
              <p className="mb-0" style={{ color: "#282828" }}>
                There is an error verifying your email.
              </p>
              <p className="mb-0" style={{ color: "#282828" }}>
                Please try again.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Confirm;
