import * as React from "react";
import * as _ from "lodash";
import { FormikProps, useFormikContext } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";
import { EditorType } from "../copiedFromConsole/synced-editor/editor-toggle";
import { FormFooter } from "../copiedFromConsole/form-utils";
import { getFormData } from "data/formData";
import NodeHealthCheckFormFields from "./formView/NodeHealthCheckFormFields";
import SyncedEditorField from "components/copiedFromConsole/formik-fields/SyncedEditorField";
import "./editor.css";
import YamlEditorField from "./YamlEditorField";
import { toYamlText } from "data/toYamlText";
const LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY =
  "console.createNodeHealthCheck.editor.lastView";

type NodeHealthCheckFormEditorProps = {
  handleCancel: () => void;
  originalNodeHealthCheck: NodeHealthCheck;
};

export const NodeHealthCheckSyncedEditor: React.FC<
  FormikProps<NodeHealthCheckFormValues> & NodeHealthCheckFormEditorProps
> = ({
  originalNodeHealthCheck,
  values,
  status,
  handleSubmit,
  isSubmitting,
  dirty,
  handleCancel,
  setStatus,
  setErrors,
  errors,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const { setFieldValue } = useFormikContext<NodeHealthCheckFormValues>();

  const disableSubmit = !dirty || !_.isEmpty(errors) || isSubmitting;

  const yamlEditor = React.useMemo(
    () => <YamlEditorField fieldName="yamlData" />,
    []
  );

  const formEditor = React.useMemo(
    () => (values.formParsingError ? null : <NodeHealthCheckFormFields />),
    []
  );

  const onReload = React.useCallback(() => {
    setStatus({ submitSuccess: "", submitError: "" });
    setErrors({});
    if (values.editorType === EditorType.Form) {
      setFieldValue(
        "formData",
        getFormData(originalNodeHealthCheck, false),
        false
      );
    }
    setFieldValue("yamlData", originalNodeHealthCheck, false);
  }, [setErrors, setFieldValue, setStatus, values, originalNodeHealthCheck]);

  React.useEffect(() => {
    setStatus({ submitError: null });
  }, [setStatus, values.editorType]);
  return (
    <>
      <SyncedEditorField
        name="editorType"
        formContext={{
          name: "formData",
          editor: formEditor,
          sanitizeTo: (yamlNodeHealthCheck: NodeHealthCheck) => {
            return getFormData(yamlNodeHealthCheck, false);
          },
        }}
        yamlContext={{
          name: "yamlData",
          editor: yamlEditor,
          sanitizeTo: () =>
            toYamlText(
              values.formData,
              originalNodeHealthCheck,
              values.yamlData
            ),
        }}
        lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
        noMargin
        formErrorCallback={() => {
          return getFormData(originalNodeHealthCheck, true);
        }}
        formParsingError={values.formParsingError}
      />

      <FormFooter
        handleSubmit={handleSubmit}
        handleReset={values.isCreateFlow ? null : onReload}
        errorMessage={status?.submitError}
        successMessage={status?.submitSuccess}
        infoTitle={t("This object has been updated.")}
        infoMessage={t("Click reload to see the new version.")}
        isSubmitting={isSubmitting}
        submitLabel={values.isCreateFlow ? t("Create") : t("Save")}
        disableSubmit={disableSubmit}
        handleCancel={handleCancel}
        sticky
      />
    </>
  );
};
