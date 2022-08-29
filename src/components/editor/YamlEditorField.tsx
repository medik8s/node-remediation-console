import * as React from "react";
import { load, YAMLException } from "js-yaml";
import { ResourceYAMLEditor } from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheck } from "data/types";
import { useField } from "formik";
import { LoadingBox } from "copiedFromConsole/utils/status-box";
import { Alert } from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const YamlEditorField: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [{ value }, , { setValue }] = useField<string>(fieldName);
  const [initialObj, setInitialObj] = React.useState<NodeHealthCheck>();
  const [yamlError, setYamlError] = React.useState<string>();
  React.useEffect(() => {
    //workaround for ResourceYAMLEditor not exposing onChange
    let interval = setInterval(() => {
      if (
        window.monaco &&
        window.monaco.editor &&
        window.monaco.editor.getModels().length > 0
      ) {
        const model = window.monaco.editor.getModels()[0];
        model.onDidChangeContent(() => {
          setValue(model.getValue());
        });
        clearInterval(interval);
        interval = null;
      }
    }, 100);
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);
  React.useEffect(() => {
    if (value && !initialObj && !yamlError) {
      try {
        setInitialObj(load(value) as NodeHealthCheck);
      } catch (err) {
        if (err instanceof YAMLException) {
          setYamlError(err.message);
        } else {
          //will be handled by error boundary
          throw err;
        }
      }
    }
  }, [value, initialObj, yamlError, setInitialObj]);
  if (!initialObj && !yamlError) {
    return null;
  }
  if (yamlError) {
    return (
      <Alert
        variant="danger"
        title={t("Failed to parse NodeHealthCheck YAML")}
        isInline={true}
      >
        {yamlError}
      </Alert>
    );
  }
  return (
    <React.Suspense fallback={<LoadingBox />}>
      <div className="nhc-form-yaml-view">
        <ResourceYAMLEditor initialResource={initialObj} />
      </div>
    </React.Suspense>
  );
};

export default YamlEditorField;
