import * as React from "react";
import classNames from "classnames";
import CamelCaseWrap from "../utils/camel-case-wrap";
import { StatusComponentProps } from "@openshift-console/dynamic-plugin-sdk";
export const DASH = "-";

type StatusIconAndTextProps = StatusComponentProps & {
  icon?: React.ReactElement;
  spin?: boolean;
};

const StatusIconAndText: React.FC<StatusIconAndTextProps> = ({
  icon,
  title,
  spin,
  iconOnly,
  noTooltip,
  className,
}) => {
  if (!title) {
    return <>{DASH}</>;
  }

  return (
    <span
      className={classNames("co-icon-and-text", className)}
      title={iconOnly && !noTooltip ? title : undefined}
    >
      {icon &&
        React.cloneElement(icon, {
          className: classNames(
            spin && "fa-spin",
            icon.props.className,
            !iconOnly && "co-icon-and-text__icon co-icon-flex-child"
          ),
        })}
      {!iconOnly && <CamelCaseWrap value={title} dataTest="status-text" />}
    </span>
  );
};

export default StatusIconAndText;
