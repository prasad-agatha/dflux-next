// react
import React, { FC } from "react";
// react-bootstrap
import { Image, Popover, ListGroup, OverlayTrigger } from "react-bootstrap";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";

interface IResetPasswordFormProps {
  row: any;
}
const DatasetMenu: FC<IResetPasswordFormProps> = (props) => {
  const { row } = props;
  const popover = (
    <Popover popper id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup style={{ border: "0px solid black" }}>
          <ListGroup.Item className="menu-item">
            <div>
              <a href={row.url} className="d-flex flex-row align-items-center">
                <Image src="/charts/download.svg" className="menu-item-icon" />
                <p className="menu-item-text mb-0">Download Dataset</p>
              </a>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Popover.Content>
    </Popover>
  );
  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="bottom-end" overlay={popover} transition>
        <MoreVerticalOutline className="icon-size" />
      </OverlayTrigger>
    </>
  );
};
export default DatasetMenu;
