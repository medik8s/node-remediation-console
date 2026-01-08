import * as React from "react";
import {
  Alert,
  Button,
  AlertActionCloseButton,
  Form,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import { useField, useFormikContext, FormikValues } from "formik";

import { EditorType } from "data/types";
import { useEditorType } from "../synced-editor/useEditorType";
import RadioGroupField from "./RadioGroupField";
import { load, dump } from "js-yaml";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { LoadingBox } from "copiedFromConsole/utils/status-box";
import { get, isEmpty } from "lodash-es";

type FormErrorCallback<ReturnValue = Record<string, unknown>> =
  () => ReturnValue;
type WithOrWithoutPromise<Type> = Promise<Type> | Type;
export type SanitizeToForm<
  YAMLStruct = Record<string, unknown>,
  FormOutput = Record<string, unknown>
> = (
  preFormData: YAMLStruct
) => WithOrWithoutPromise<FormOutput | FormErrorCallback<FormOutput>>;
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
  prune?: (data: unknown) => unknown;
  noMargin?: boolean;
};

const SyncedEditorField: React.FC<SyncedEditorFieldProps> = ({
  name,
  formContext,
  yamlContext,
  prune,
  noMargin = false,
  lastViewUserSettingKey,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [field] = useField(name);

  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const formData = get(values, formContext.name);
  const yamlData: string = get(values, yamlContext.name);

  const [yamlWarning, setYAMLWarning] = React.useState<boolean>(false);
  const [sanitizeToCallback, setSanitizeToCallback] =
    React.useState<FormErrorCallback>(undefined);
  const [disabledFormAlert, setDisabledFormAlert] = React.useState<boolean>(
    formContext.isDisabled
  );

  const isEditorTypeEnabled = (type: EditorType): boolean =>
    !(type === EditorType.Form
      ? formContext?.isDisabled
      : yamlContext?.isDisabled);

  const [editorType, setEditorType, resourceLoaded] = useEditorType(
    lastViewUserSettingKey,
    field.value as EditorType,
    isEditorTypeEnabled
  );

  const loaded = resourceLoaded && field.value === editorType;

  const changeEditorType = (newType: EditorType) => {
    setEditorType(newType);
    setFieldValue(name, newType);
  };

  const handleToggleToForm = async () => {
    // Convert from YAML
    let content = {};
    try {
      content = load(yamlData);
    } catch (err) {
      content = {};
    }

    // Sanitize the YAML structure if possible
    if (!isEmpty(content)) {
      if (formContext.sanitizeTo) {
        try {
          content = await formContext.sanitizeTo(content);
        } catch (e) {
          // Failed to sanitize, discard invalid data
          content = null;
          console.error(e);
        }
      }

      // Handle sanitized result
      if (typeof content === "object" && !isEmpty(content)) {
        setFieldValue(formContext.name, content);
        changeEditorType(EditorType.Form);
        return;
      }
      if (typeof content === "function") {
        setSanitizeToCallback(() => content);
      }
    }

    setYAMLWarning(true);
  };

  const handleToggleToYAML = () => {
    const newYAML = dump(prune?.(formData) ?? formData, {
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
    if (sanitizeToCallback) {
      setFieldValue(formContext.name, sanitizeToCallback());
    }
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

  React.useEffect(() => {
    setDisabledFormAlert(formContext.isDisabled);
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

  return loaded ? (
    <Flex
      direction={{ default: "column" }}
      spaceItems={{ default: "spaceItemsMd" }}
      style={{ height: "100%" }}
    >
      <FlexItem>
        <Form>
          <RadioGroupField
            label={t("Configure via:")}
            name={name}
            className="nhc-form-synced-editor-field"
            options={[
              {
                label: formContext.label || t("Form view"),
                value: EditorType.Form,
                isDisabled: formContext.isDisabled,
              },
              {
                label: yamlContext.label || t("YAML view"),
                value: EditorType.YAML,
                isDisabled: yamlContext.isDisabled,
              },
            ]}
            onChange={(val: string) => onChangeType(val as EditorType)}
            isInline
          />
        </Form>
      </FlexItem>

      {yamlWarning && (
        <FlexItem>
          <Alert
            variant="danger"
            isInline
            title={t("Invalid YAML cannot be persisted")}
          >
            <p>{t("Switching to form view will delete any invalid YAML.")}</p>
            <Button variant="danger" onClick={onClickYAMLWarningConfirm}>
              {t("Switch and delete")}
            </Button>
            &nbsp;
            <Button variant="secondary" onClick={onClickYAMLWarningCancel}>
              {t("Cancel")}
            </Button>
          </Alert>
        </FlexItem>
      )}

      {disabledFormAlert && (
        <FlexItem>
          <Alert
            variant="info"
            title={t(
              "Form view is disabled for this chart because the schema is not available"
            )}
            actionClose={
              <AlertActionCloseButton
                onClose={() => setDisabledFormAlert(false)}
              />
            }
            isInline
          />
        </FlexItem>
      )}

      <FlexItem grow={{ default: "grow" }}>
        {editorType === EditorType.Form && !disabledFormAlert
          ? formContext.editor
          : yamlContext.editor}
      </FlexItem>
    </Flex>
  ) : (
    <LoadingBox />
  );
};

export default SyncedEditorField;
