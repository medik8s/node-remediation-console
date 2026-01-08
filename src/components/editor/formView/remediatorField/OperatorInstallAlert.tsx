import { Alert } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import { useOperatorAvailability } from "../../../../apis/useOperatorAvailability";
import {
  getKindInfo,
  getOperatorDetailsItem,
  isPredefinedKind,
} from "../../../../data/remediationTemplateKinds";

interface OperatorInstallAlertProps {
  kind: string;
  apiVersion: string;
}

const getOperatorHubInstallUrl = (operatorDetailsItem: string): string => {
  return `${window.location.origin}/operatorhub/all-namespaces?details-item=${operatorDetailsItem}`;
};

export const OperatorInstallAlert: React.FC<OperatorInstallAlertProps> = ({
  kind,
  apiVersion,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [isAvailable, loaded] = useOperatorAvailability(kind, apiVersion);
  if (!kind || !apiVersion || !loaded || isAvailable) {
    return null;
  }

  const isPredefined = isPredefinedKind(kind);
  const kindInfo = isPredefined ? getKindInfo(kind) : undefined;
  const installUrl =
    isPredefined && kindInfo
      ? getOperatorHubInstallUrl(getOperatorDetailsItem(kindInfo))
      : undefined;

  const alertTitle = isPredefined
    ? t("Operator not installed")
    : t("Operator not available");

  const alertMessage = t(
    "The required CustomResourceDefinition for {{kind}} is missing. Install the corresponding operator to add this CustomResourceDefinition.",
    {
      kind,
    }
  );

  const actionLink =
    installUrl && kindInfo ? (
      <a href={installUrl} target="_blank" rel="noopener noreferrer">
        {t("Install {{operatorName}}", { operatorName: kindInfo.operatorName })}{" "}
        <ExternalLinkAltIcon />
      </a>
    ) : undefined;

  return (
    <Alert
      variant={"danger"}
      title={alertTitle}
      isInline
      actionLinks={actionLink}
    >
      {alertMessage}
    </Alert>
  );
};
