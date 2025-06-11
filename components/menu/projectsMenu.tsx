// router
import React, { FC } from "react";
// react-bootstrap
import { Dropdown } from "react-bootstrap";
// styled icons
import { MoreVerticalOutline } from "@styled-icons/evaicons-outline";
import { Delete } from "@styled-icons/material/Delete";

// components
// import { DeleteProject } from "components/modals";

interface IProjectsMenuProps {
  id: any;
}

const ProjectsMenu: FC<IProjectsMenuProps> = () => {
  // const {} = props;

  const [projectDelete, setProjectDelete] = React.useState(false);

  return (
    <Dropdown>
      <Dropdown.Toggle className="bg-transparent border-0 float-right p-0" id="dropdown-basic">
        <MoreVerticalOutline color="#919EAB" cursor="pointer" className="icon-size" />
        <Dropdown.Menu align="left">
          <Dropdown.Item
            className="ps-3 pe-1"
            onClick={() => {
              setProjectDelete(!projectDelete);
            }}
          >
            <div className="df1 flex-row align-items-center">
              <Delete width={20} height={20} className="me-2" />
              <h6 className="mb-0">Delete</h6>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Toggle>
      {/* <DeleteProject
        projectDelete={projectDelete}
        setProjectDelete={setProjectDelete}
        id={id}
        projectsMutate={projectsMutate}
      /> */}
    </Dropdown>
  );
};
export default ProjectsMenu;
