import React, { FC } from "react";
// import Router from "next/router";
import { Navbar, Image, Nav } from "react-bootstrap";
// components
import { HeaderMenu } from "components/menu";

export interface IDashboardHeaderProps {
  handleDrawerOpen?: () => void;
  open?: boolean;
  firstName?: any;
}

const InviteNavbar: FC<IDashboardHeaderProps> = () => {
  return (
    <Navbar
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)" }}
      className="align-items-center p-0 px-4"
    >
      <Navbar.Brand>
        <Image src={`${process.env.CLIENT_LOGO}`} alt="logo" />
      </Navbar.Brand>
      <Nav className="ms-auto align-items-center">
        <div className="d-flex nav-dropdown">
          <HeaderMenu
            setNewState={() => {
              //
            }}
          />
        </div>
      </Nav>
    </Navbar>
  );
};

export default InviteNavbar;
