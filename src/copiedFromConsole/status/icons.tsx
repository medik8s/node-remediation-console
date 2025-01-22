import * as React from "react";
import {
  CheckCircleIcon,
  InfoCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@patternfly/react-icons";
import * as classNames from "classnames";
import { Icon } from "@patternfly/react-core";

export type ColoredIconProps = {
  className?: string;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export const GreenCheckCircleIcon: React.FC<ColoredIconProps> = ({
  className,
  title,
  size,
}) => (
  <Icon size={size}>
    <CheckCircleIcon
      data-test="success-icon"
      className={classNames("dps-icons__green-check-icon", className)}
      title={title}
    />
  </Icon>
);

export const RedExclamationCircleIcon: React.FC<ColoredIconProps> = ({
  className,
  title,
  size,
}) => (
  <Icon size={size}>
    <ExclamationCircleIcon
      className={classNames("dps-icons__red-exclamation-icon", className)}
      title={title}
    />
  </Icon>
);

export const YellowExclamationTriangleIcon: React.FC<ColoredIconProps> = ({
  className,
  title,
  size,
}) => (
  <Icon size={size}>
    <ExclamationTriangleIcon
      className={classNames("dps-icons__yellow-exclamation-icon", className)}
      title={title}
    />
  </Icon>
);

export const BlueInfoCircleIcon: React.FC<ColoredIconProps> = ({
  className,
  title,
}) => (
  <InfoCircleIcon
    className={classNames("dps-icons__blue-info-icon", className)}
    title={title}
  />
);
