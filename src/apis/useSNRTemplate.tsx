import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { snrTemplateKind } from "data/model";
import {
  RemediationTemplate,
  SelfNodeRemediationTemplate,
  SnrTemplateResult,
} from "data/types";
import * as React from "react";

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
    const templateCR = templates.find(
      (template) =>
        template.spec?.template?.spec?.remediationStrategy ===
        "ResourceDeletion"
    );
    if (!templateCR) {
      return undefined;
    }
    return {
      apiVersion: templateCR.apiVersion,
      kind: templateCR.kind,
      namespace: templateCR.metadata?.namespace,
      name: templateCR.metadata?.name,
    };
  }, [templates, error]);

  return [template, loaded];
};

export default useSnrTemplate;
