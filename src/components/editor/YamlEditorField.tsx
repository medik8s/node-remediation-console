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
  const [{ value: reloadCount }] = useField<number>("reloadCount");
  const [initialObj, setInitialObj] = React.useState<NodeHealthCheck>();
  const [yamlError, setYamlError] = React.useState<string>();
  const [monacoModel, setMonacoModel] =
    React.useState<monaco.editor.ITextModel>();
  React.useEffect(() => {
    //workaround for ResourceYAMLEditor not exposing onChange
    let interval = setInterval(() => {
      if (
        window.monaco &&
        window.monaco.editor &&
        window.monaco.editor.getModels().length > 0
      ) {
        const model = window.monaco.editor.getModels()[0];
        setMonacoModel(model);
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

  const reset = () => {
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
  };
  React.useEffect(() => {
    //initialize
    if (value && !initialObj) {
      reset();
    }
  }, [value, initialObj]);

  React.useEffect(() => {
    //handle reload
    if (monacoModel) {
      monacoModel.setValue(value);
    }
  }, [reloadCount]);

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
