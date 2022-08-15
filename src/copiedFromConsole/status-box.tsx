import * as _ from "lodash-es";
import * as React from "react";
import * as classNames from "classnames";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

export const Box: React.FC<BoxProps> = ({ children, className }) => (
  <div className={classNames("cos-status-box", className)}>{children}</div>
);
export const EmptyBox: React.FC<EmptyBoxProps> = ({ label }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <Box>
      <div data-test="empty-message" className="pf-u-text-align-center">
        {label ? t("No {{label}} found", { label }) : t("Not found")}
      </div>
    </Box>
  );
};
export const Loading: React.FC<LoadingProps> = ({ className }) => (
  <div
    className={classNames("co-m-loader co-an-fade-in-out", className)}
    data-test="loading-indicator"
  >
    <div className="co-m-loader-dot__one" />
    <div className="co-m-loader-dot__two" />
    <div className="co-m-loader-dot__three" />
  </div>
);
Loading.displayName = "Loading";

export const LoadingInline: React.FC<{}> = () => (
  <Loading className="co-m-loader--inline" />
);
LoadingInline.displayName = "LoadingInline";

export const LoadingBox: React.FC<LoadingBoxProps> = ({
  className,
  message,
}) => (
  <Box className={classNames("cos-status-box--loading", className)}>
    <Loading />
    {message && (
      <div className="cos-status-box__loading-message">{message}</div>
    )}
  </Box>
);
LoadingBox.displayName = "LoadingBox";
type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

type LoadingProps = {
  className?: string;
};

type LoadingBoxProps = {
  className?: string;
  message?: string;
};

type EmptyBoxProps = {
  label?: string;
};
