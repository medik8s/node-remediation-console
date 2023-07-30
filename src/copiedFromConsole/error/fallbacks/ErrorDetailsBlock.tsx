import * as React from "react";
import { useNodeHealthCheckTranslation } from "../../../localization/useNodeHealthCheckTranslation";
import { CopyToClipboard } from "../../utils/copy-to-clipboard";
import { ErrorBoundaryFallbackProps } from "../types";

const ErrorDetailsBlock: React.FC<ErrorBoundaryFallbackProps> = (props) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <>
      <h3 className="co-section-heading-tertiary">{props.title}</h3>
      <div className="form-group">
        <label htmlFor="description">
          {t("plugin__node-remediation-console-plugin~Description:")}
        </label>
        <p>{props.errorMessage}</p>
      </div>
      {props.componentStack && (
        <div className="form-group">
          <label htmlFor="componentTrace">
            {t("plugin__node-remediation-console-plugin~Component trace:")}
          </label>
          <div className="co-copy-to-clipboard__stacktrace-width-height">
            <CopyToClipboard value={props.componentStack.trim()} />
          </div>
        </div>
      )}
      {props.stack && (
        <div className="form-group">
          <label htmlFor="stackTrace">
            {t("plugin__node-remediation-console-plugin~Stack trace:")}
          </label>
          <div className="co-copy-to-clipboard__stacktrace-width-height">
            <CopyToClipboard value={props.stack.trim()} />
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorDetailsBlock;
