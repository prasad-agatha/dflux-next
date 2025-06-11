import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// react-bootstrap
import { Modal } from "react-bootstrap";
// button loader
import Button from "react-bootstrap-button-loader";
// services
import { AuthorizationService, ProjectsService } from "services";
// components
// import { InviteNavbar } from "components/navbars";
import { PageLoading } from "components/loaders";
// jwt
import jwt_decode from "jwt-decode";
// cookie
import cookie from "js-cookie";
//external
import { toast } from "react-toastify";
//toast configuration
toast.configure();

// service instance
const authService = new AuthorizationService();
const projectService = new ProjectsService();

const InvitationPage: FC = () => {
  const [projectInvitationState, setprojectInvitationState] = React.useState({
    open: false,
    // showLoader: false,
    declineLoader: false,
    // projectId: 0,
    pageLoading: false,
  });
  const router = useRouter();

  const [acceptLoader, setAcceptLoader] = React.useState(false);

  const [projectId, setProjectId] = React.useState(0);
  const [userId, setUserId] = React.useState(0);

  React.useEffect(() => {
    const token = window.location.pathname.split("/").pop();
    const decoded: any = jwt_decode(`${token}`);
    setprojectInvitationState({
      ...projectInvitationState,
      pageLoading: true,
    });
    setProjectId(decoded?.project);
    authService
      .getUsersData()
      .then((user: any) => {
        setUserId(user.user);
      })
      .catch((error) => {
        toast.error(error);
      });
    if (decoded?.user_status) {
      if (!cookie.get("accessToken")) {
        router.push(`/?invite=${token}`);
      } else {
        authService
          .getUsersData()
          .then((res) => {
            if (decoded.user == res.email) {
              projectService
                .projectMembers(decoded?.project)
                .then((response) => {
                  if (response.some((row: any) => row.email == decoded.user)) {
                    router.push(`/projects/${decoded?.project}`);
                  } else {
                    setprojectInvitationState({
                      ...projectInvitationState,
                      pageLoading: false,
                      open: true,
                    });
                  }
                })
                .catch();
            } else {
              authService.logout();
              router.push(`/?invite=${token}`);
            }
          })
          .catch();
      }
    } else {
      setprojectInvitationState({ ...projectInvitationState, pageLoading: false });
      alert(
        "You are not registered with us, please signup and use the link sent in mail to accecpt invitation!"
      );
    }
  }, []);

  const acceptInvitation = () => {
    setAcceptLoader(true);
    projectService
      .acceptInvite(projectId, { user: userId })
      .then(() => {
        setAcceptLoader(false);
        setprojectInvitationState({ ...projectInvitationState, open: false });
        toast.success("Invite accepted successfully", { autoClose: 3000 });
        router.push(`/projects/${projectId}`);
      })
      .catch((error) => {
        if (error.non_field_errors[0]) {
          toast.error(error?.non_field_errors[0]);
        }
        setAcceptLoader(false);
      });
  };
  const declineInvitation = () => {
    setprojectInvitationState({ ...projectInvitationState, declineLoader: true });
    setTimeout(() => {
      setprojectInvitationState({ ...projectInvitationState, declineLoader: false, open: false });
      toast.success("Invite Declined", { autoClose: 3000 });
      router.push(`/projects`);
    }, 3000);
  };
  const onHide = () => {
    setprojectInvitationState({ ...projectInvitationState, open: false });
    toast.success("Invite Declined", { autoClose: 3000 });
    router.push(`/projects`);
    // setOpen(false);
  };
  return (
    <>
      {projectInvitationState.pageLoading ? (
        <main className="w-75 h-75 position-fixed">
          <PageLoading />
        </main>
      ) : (
        <>
          <Modal
            show={projectInvitationState.open}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Invite Accept</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
              <div className="d-flex flex-column mt-2 ">
                Are you sure you want to accept the invite ?
              </div>
            </Modal.Body>
            <Modal.Footer className="px-3">
              <Button
                loading={acceptLoader}
                variant="primary"
                type="button"
                className="primary-button text-white"
                onClick={acceptInvitation}
              >
                Accept
              </Button>
              <Button
                loading={projectInvitationState.declineLoader}
                variant="primary"
                className="decline-btn text-white"
                type="button"
                onClick={declineInvitation}
              >
                Decline
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default InvitationPage;
