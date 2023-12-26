import { EditorType } from "copiedFromConsole/synced-editor/editor-toggle";
import { getFormViewValues } from "./formViewValues";
import {
  FormViewValues,
  NodeHealthCheck,
  NodeHealthCheckFormValues,
  RemediationTemplate,
} from "./types";
import { dump } from "js-yaml";
import { isParseError } from "./parseErrors";
import * as formViewValues from "./formViewValues";

import * as yamlText from "./yamlText";

export const getFormValues = (
  nodeHealthCheck: NodeHealthCheck,
  isCreateFlow: boolean,
  snrTemplate: RemediationTemplate | undefined
): NodeHealthCheckFormValues => {
  const yamlData = dump(nodeHealthCheck, {
    skipInvalid: true,
  });
  let formParsingError: string | null = null;
  let formData: FormViewValues | null = null;
  let editorType = EditorType.YAML;
  try {
    formData = getFormViewValues(nodeHealthCheck, snrTemplate);
    editorType = EditorType.Form;
  } catch (err) {
    if (isParseError(err)) {
      formParsingError = err.message;
    } else {
      formParsingError = "Unexpected parsing error";
    }
  }
  return {
    isCreateFlow,
    editorType,
    yamlData,
    formData,
    formParsingError,
    resourceVersion: nodeHealthCheck?.metadata?.resourceVersion,
    reloadCount: 0,
  };
};

export const getNodeHealthCheck = (
  originalNodeHealthCheck: NodeHealthCheck,
  values: NodeHealthCheckFormValues
): NodeHealthCheck => {
  const nodeHealthCheck = yamlText.getNodeHealthCheck(
    originalNodeHealthCheck,
    values.yamlData
  );
  if (values.editorType === EditorType.YAML) {
    return nodeHealthCheck;
  }
  return formViewValues.getNodeHealthCheck(values.formData, nodeHealthCheck);
};
