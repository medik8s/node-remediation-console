import * as React from "react";
import { Alert, Button } from "@patternfly/react-core";
import { useField, useFormikContext, FormikValues } from "formik";
import * as _ from "lodash";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import { EditorToggle, EditorType } from "../synced-editor/editor-toggle";

import "./SyncedEditorField.scss";
import { load, dump } from "js-yaml";
import { useEditorType } from "../synced-editor/useEditorType";
import { LoadingBox } from "../status-box";
type FormErrorCallback = () => void;
type WithOrWithoutPromise<Type> = Promise<Type> | Type;
export type SanitizeToForm<YAMLStruct = {}, FormOutput = {}> = (
  preFormData: YAMLStruct
) => WithOrWithoutPromise<FormOutput>;
export type SanitizeToYAML = (preFormData: string) => string;

type EditorContext<SanitizeTo> = {
  name: string;
  editor: React.ReactNode;
  isDisabled?: boolean;
  sanitizeTo?: SanitizeTo;
  label?: string;
};

type SyncedEditorFieldProps = {
  name: string;
  formContext: EditorContext<SanitizeToForm>;
  yamlContext: EditorContext<SanitizeToYAML>;
  lastViewUserSettingKey: string;
  prune?: (data: any) => any;
  noMargin?: boolean;
  formErrorCallback: FormErrorCallback;
  formParsingError?: string;
};

const SyncedEditorField: React.FC<SyncedEditorFieldProps> = ({
  name,
  formContext,
  yamlContext,
  prune,
  formErrorCallback,
  formParsingError,
  lastViewUserSettingKey,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [field, , { setValue }] = useField(name);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const formData = _.get(values, formContext.name);
  const yamlData: string = _.get(values, yamlContext.name);

  const [yamlWarning, setYAMLWarning] = React.useState<boolean>(
    !!formParsingError
  );

  const [editorType, setEditorType, resourceLoaded] = useEditorType(
    lastViewUserSettingKey,
    field.value as EditorType,
    () => true
  );

  React.useEffect(() => {
    if (resourceLoaded && field.value !== editorType) {
      setFieldValue(name, editorType);
    }
  }, [
    editorType,
    field.value,
    formContext.isDisabled,
    name,
    resourceLoaded,
    setFieldValue,
  ]);
  const loaded = resourceLoaded && field.value === editorType;
  const changeEditorType = (newType: EditorType) => {
    setValue(newType);
    setEditorType(newType);
  };

  const handleToggleToForm = async () => {
    // Convert from YAML
    let content = load(yamlData);

    // Sanitize the YAML structure if possible
    if (!_.isEmpty(content)) {
      if (formContext.sanitizeTo) {
        try {
          content = await formContext.sanitizeTo(content);
        } catch (e) {
          // Failed to sanitize, discard invalid data
          content = null;
        }
      }
      // Handle sanitized result
      if (typeof content === "object" && !_.isEmpty(content)) {
        setFieldValue(formContext.name, content);
        changeEditorType(EditorType.Form);
        return;
      }
    }

    setYAMLWarning(true);
  };

  const handleToggleToYAML = () => {
    const newYAML = dump(prune?.(formData) ?? formData, yamlData, {
      skipInvalid: true,
    });
    setFieldValue(
      yamlContext.name,
      yamlContext.sanitizeTo ? yamlContext.sanitizeTo(newYAML) : newYAML
    );
    changeEditorType(EditorType.YAML);
  };

  const onClickYAMLWarningConfirm = async () => {
    setYAMLWarning(false);

    setFieldValue(formContext.name, formErrorCallback());

    changeEditorType(EditorType.Form);
  };

  const onClickYAMLWarningCancel = () => {
    setYAMLWarning(false);
  };

  const onChangeType = (newType: EditorType) => {
    switch (newType) {
      case EditorType.YAML:
        handleToggleToYAML();
        break;
      case EditorType.Form:
        handleToggleToForm();
        break;
      default:
        break;
    }
  };

  return loaded ? (
    <>
      <EditorToggle value={field.value} onChange={onChangeType} />
      {yamlWarning && (
        <Alert
          className="co-synced-editor__yaml-warning"
          variant="danger"
          isInline
          title={
            formParsingError
              ? t("Failed to load form view")
              : t("Invalid YAML cannot be persisted")
          }
        >
          {formParsingError && <p>{formParsingError}</p>}
          <p>{t("Switching to form view will delete any invalid YAML.")}</p>
          <Button variant="danger" onClick={onClickYAMLWarningConfirm}>
            {t("Switch and delete")}
          </Button>
          &nbsp;
          <Button variant="secondary" onClick={onClickYAMLWarningCancel}>
            {t("Cancel")}
          </Button>
        </Alert>
      )}
      {field.value === EditorType.Form
        ? formContext.editor
        : yamlContext.editor}
    </>
  ) : (
    <LoadingBox />
  );
};

export default SyncedEditorField;
