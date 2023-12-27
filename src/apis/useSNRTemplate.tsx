import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { snrTemplateKind } from "data/model";
import {
  RemediationTemplate,
  SelfNodeRemediationTemplate,
  SnrTemplateResult,
} from "data/types";
import * as React from "react";

const DEFAULT_TEMPLATE_LABEL = "remediation.medik8s.io/default-template";

const useSnrTemplate = (): SnrTemplateResult => {
  const [templates, loaded, error] = useK8sWatchResource<
    SelfNodeRemediationTemplate[]
  >({
    groupVersionKind: snrTemplateKind,
    isList: true,
  });
  const template = React.useMemo<RemediationTemplate | undefined>(() => {
    if (error) {
      return undefined;
    }

    let defaultTemplate = templates.find(
      (template) =>
        template.metadata?.labels?.[DEFAULT_TEMPLATE_LABEL] === "true"
    );

    if (!defaultTemplate) {
      // fallback to resource deletion for backward compatibility of versions without label
      defaultTemplate = templates.find(
        (template) =>
          template.spec?.template?.spec?.remediationStrategy ===
          "ResourceDeletion"
      );
    }

    if (!defaultTemplate) {
      return undefined;
    }
    return {
      apiVersion: defaultTemplate.apiVersion,
      kind: defaultTemplate.kind,
      namespace: defaultTemplate.metadata?.namespace,
      name: defaultTemplate.metadata?.name,
    };
  }, [templates, error]);

  return [template, loaded];
};

export default useSnrTemplate;
