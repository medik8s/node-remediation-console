import * as React from "react";
import { Text, TextVariants } from "@patternfly/react-core";
import { ErrorBoundaryFallbackProps } from "../types";
import ErrorDetailsBlock from "./ErrorDetailsBlock";
import { useNodeHealthCheckTranslation } from "../../../localization/useNodeHealthCheckTranslation";
import { ExpandCollapse } from "../../utils/expand-collapse";

/**
 * Standard fallback catch -- expected to take up the whole page.
 */
const ErrorBoundaryFallbackPage: React.FC<ErrorBoundaryFallbackProps> = (
  props
) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <div className="co-m-pane__body">
      <Text
        component={TextVariants.h1}
        className="co-m-pane__heading co-m-pane__heading--center"
      >
        {t(
          "plugin__node-remediation-console-plugin~Oh no! Something went wrong."
        )}
      </Text>
      <ExpandCollapse
        textCollapsed={t(
          "plugin__node-remediation-console-plugin~Show details"
        )}
        textExpanded={t("plugin__node-remediation-console-plugin~Hide details")}
      >
        <ErrorDetailsBlock {...props} />
      </ExpandCollapse>
    </div>
  );
};

export default ErrorBoundaryFallbackPage;
