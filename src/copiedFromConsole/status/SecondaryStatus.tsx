import * as React from "react";
import { compact, concat } from "lodash-es";

type SecondaryStatusProps = {
  status?: string | string[];
  className?: string;
  dataStatusID?: string;
};

const SecondaryStatus: React.FC<SecondaryStatusProps> = ({
  status,
  className,
  dataStatusID,
}) => {
  const statusLabel = compact(concat([], status)).join(", ");
  const cssClassName = className || "";
  if (statusLabel) {
    return (
      <div data-status-id={dataStatusID}>
        <small className={`${cssClassName} text-muted`}>{statusLabel}</small>
      </div>
    );
  }
  return null;
};

export default SecondaryStatus;
