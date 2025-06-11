import React, { FC } from "react";

interface ITooltipProps {
  position: any;
  visible: any;
  style: any;
  text: any;
  element: any;
}
const ToolTip: FC<ITooltipProps> = ({ position, visible, style, text, element }) => {
  return (
    <div className={position === "top" ? "toltip" : "toltip-bottom"}>
      <span className={"toltip-text text-nowrap " + (visible ? "" : "d-none")} style={style}>
        {text}
      </span>
      {element()}
    </div>
  );
};

export default ToolTip;
