import * as React from "react";
import { Tooltip } from "@patternfly/react-core";

const EllipsisToolTip: React.FC<
  React.PropsWithChildren<{ content: React.ReactNode }>
> = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const mouseEnterHandler = (e) => {
    if (e.target.offsetWidth !== e.target.scrollWidth && !showTooltip) {
      setShowTooltip(true);
    } else if (e.target.offsetWidth === e.target.scrollWidth && showTooltip) {
      setShowTooltip(false);
    }
  };

  return (
    <Tooltip content={content} hidden={!showTooltip}>
      <div onMouseEnter={mouseEnterHandler}>{children}</div>
    </Tooltip>
  );
};

export default EllipsisToolTip;
