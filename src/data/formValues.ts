import { EditorType } from "copiedFromConsole/synced-editor/editor-toggle";
import { getFormViewValues } from "./formViewValues";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "./types";
import { dump } from "js-yaml";
import { isParseError } from "./parseErrors";
import * as formViewValues from "./formViewValues";
import * as _ from "lodash";
import * as yamlText from "./yamlText";

export const getFormValues = (
  nodeHealthCheck: NodeHealthCheck,
  isCreateFlow: boolean
): NodeHealthCheckFormValues => {
  const yamlData = dump(nodeHealthCheck, "", {
    skipInvalid: true,
  });
  let formParsingError = null;
  let formData = null;
  let editorType = EditorType.YAML;
  try {
    formData = getFormViewValues(nodeHealthCheck);
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
  };
};

export const getNodeHealthCheck = (
  originalNodeHealthCheck: NodeHealthCheck,
  values: NodeHealthCheckFormValues
): NodeHealthCheck => {
  let nodeHealthCheck = yamlText.getNodeHealthCheck(
    originalNodeHealthCheck,
    values.yamlData
  );
  if (values.editorType === EditorType.YAML) {
    return nodeHealthCheck;
  }
  return formViewValues.getNodeHealthCheck(values.formData, nodeHealthCheck);
};
