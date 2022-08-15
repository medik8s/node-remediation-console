import * as React from "react";
import { HourglassHalfIcon } from "@patternfly/react-icons";

import { YellowExclamationTriangleIcon } from "./icons";
import {
  GenericStatus,
  StatusComponentProps,
  ErrorStatus as SdkErrorStatus,
  InfoStatus as SdkInfoStatus,
  ProgressStatus as SdkProgressStatus,
  SuccessStatus as SdkSuccessStatus,
} from "@openshift-console/dynamic-plugin-sdk";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

export const ErrorStatus: React.FC<StatusComponentProps> = ({
  title,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return <SdkErrorStatus {...props} title={title || t("Error")} />;
};

export const InfoStatus: React.FC<StatusComponentProps> = ({
  title,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return <SdkInfoStatus {...props} title={title || t("Information")} />;
};

export const ProgressStatus: React.FC<StatusComponentProps> = ({
  title,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return <SdkProgressStatus {...props} title={title || t("In progress")} />;
};

export const SuccessStatus: React.FC<StatusComponentProps> = ({
  title,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return <SdkSuccessStatus {...props} title={title || t("Healthy")} />;
};

export const PendingStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={HourglassHalfIcon}
      title={props.title || t("Pending")}
    />
  );
};
PendingStatus.displayName = "PendingStatus";

export const WarningStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={YellowExclamationTriangleIcon}
      title={props.title || t("Warning")}
    />
  );
};
WarningStatus.displayName = "WarningStatus";
