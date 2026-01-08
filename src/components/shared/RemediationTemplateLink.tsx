import { ResourceLink } from "@openshift-console/dynamic-plugin-sdk";
import * as React from "react";
import { NodeHealthCheck } from "../../data/types";
import { getRemediatorLabel } from "../../data/remediator";
import { apiVersionToGroupVersionKind } from "../../data/model";
import { useNodeHealthCheckTranslation } from "../../localization/useNodeHealthCheckTranslation";

export const RemediationTemplateLink: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const { t } = useNodeHealthCheckTranslation();
  const label = getRemediatorLabel(nodeHealthCheck, t);
  if (!label) {
    return null;
  }

  // If escalating remediations are used, show text only
  if (nodeHealthCheck.spec?.escalatingRemediations?.length > 0) {
    return <span>{label}</span>;
  }

  const remediationTemplate = nodeHealthCheck.spec?.remediationTemplate;

  const groupVersionKind = apiVersionToGroupVersionKind(
    remediationTemplate.apiVersion,
    remediationTemplate.kind
  );
  if (groupVersionKind && remediationTemplate.name) {
    return (
      <ResourceLink
        groupVersionKind={groupVersionKind}
        name={remediationTemplate.name}
        namespace={remediationTemplate.namespace}
      />
    );
  }

  // Fallback to text only
  return <span>{label}</span>;
};
