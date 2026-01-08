import * as React from "react";

import { useField } from "formik";
import { useFormikValidationFix } from "../../../../copiedFromConsole/hooks/formik-validation-fix";
import { Remediator } from "../../../../data/types";
import { Flex, FlexItem } from "@patternfly/react-core";
import { Alert } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { RemediationTemplateKindField } from "./RemediationTemplateKindField";

import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import {
  getKindInfo,
  getOperatorDetailsItem,
} from "../../../../data/remediationTemplateKinds";
import { useRemediationTemplateInstances } from "../../../../apis/useRemediationTemplateInstances";
import { RemediationTemplateField } from "./RemediationTemplateInstanceField";

const getOperatorHubInstallUrl = (operatorDetailsItem: string): string => {
  return `${window.location.origin}/operatorhub/all-namespaces?details-item=${operatorDetailsItem}`;
};

const OperatorInstallAlert = ({ kind }: { kind: string }) => {
  const { t } = useNodeHealthCheckTranslation();

  const predefinedKindInfo = React.useMemo(() => getKindInfo(kind), [kind]);

  const installUrl = predefinedKindInfo
    ? getOperatorHubInstallUrl(getOperatorDetailsItem(predefinedKindInfo))
    : undefined;

  const actionLink =
    installUrl && predefinedKindInfo ? (
      <a href={installUrl} target="_blank" rel="noopener noreferrer">
        {t("Install {{operatorName}}", {
          operatorName: predefinedKindInfo.operatorName,
        })}{" "}
        <ExternalLinkAltIcon />
      </a>
    ) : undefined;

  return (
    <Alert
      variant="danger"
      title={t("CustomResourceDefinition not available")}
      isInline
      actionLinks={actionLink}
    >
      {t(
        "The required CustomResourceDefinition for {{kind}} is missing. Install the corresponding operator to add this CustomResourceDefinition.",
        {
          kind,
        }
      )}
    </Alert>
  );
};

export const RemediatorField: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const [remediatorValue] = useField<Remediator>(fieldName);
  const [kindValue] = useField<string>(`${fieldName}.template.kind`);
  const [apiVersionValue] = useField<string>(
    `${fieldName}.template.apiVersion`
  );
  useFormikValidationFix(remediatorValue);

  const kind = kindValue.value || "";
  const apiVersion = apiVersionValue.value || "";

  const [instances, loaded, error, autoSelectInstance] =
    useRemediationTemplateInstances(kind, apiVersion);

  return (
    <Flex
      direction={{ default: "column" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      <FlexItem>
        {kind && apiVersion && loaded && error && (
          <OperatorInstallAlert kind={kind} />
        )}
      </FlexItem>
      <FlexItem>
        <RemediationTemplateKindField fieldName={fieldName} />
      </FlexItem>
      <FlexItem>
        <RemediationTemplateField
          fieldName={fieldName}
          kind={kind}
          instances={instances}
          loaded={loaded}
          error={error}
          autoSelectInstance={autoSelectInstance}
        />
      </FlexItem>
    </Flex>
  );
};

export default RemediatorField;
