import * as React from "react";
import { load } from "js-yaml";
import { ResourceYAMLEditor } from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheck } from "data/types";
import { useField } from "formik";
import { LoadingBox } from "copiedFromConsole/utils/status-box";

const YamlEditorField: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const [{ value }, , { setValue }] = useField<string>(fieldName);
  const [initialObj, setInitialObj] = React.useState<NodeHealthCheck>();

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
    if (value && !initialObj) {
      setInitialObj(load(value));
    }
  }, [value, initialObj]);
  if (!initialObj) {
    return null;
  }
  return (
    <React.Suspense fallback={<LoadingBox />}>
      <div className="node-health-check-editor-yaml-view">
        <ResourceYAMLEditor initialResource={initialObj} />
      </div>
    </React.Suspense>
  );
};

export default YamlEditorField;
