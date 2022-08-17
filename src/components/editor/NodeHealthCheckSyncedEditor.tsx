import * as React from "react";
import * as _ from "lodash";
import { FormikProps, useFormikContext } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";
import { EditorType } from "../../copiedFromConsole/synced-editor/editor-toggle";
import { FlexForm, FormFooter } from "../../copiedFromConsole/form-utils";
import NodeHealthCheckFormFields from "./formView/NodeHealthCheckFormFields";
import SyncedEditorField from "copiedFromConsole/formik-fields/SyncedEditorField";
import "./editor.css";
import YamlEditorField from "./YamlEditorField";
import { getFormValues } from "data/formValues";
import * as formViewValues from "data/formViewValues";
import * as yamlText from "data/yamlText";
import { dump } from "js-yaml";
import { Alert } from "@patternfly/react-core";

const sanitizeToYaml = (
  values: NodeHealthCheckFormValues,
  originalNodeHealthCheck: NodeHealthCheck
): string => {
  let yaml: NodeHealthCheck = originalNodeHealthCheck;
  if (values.formData) {
    yaml = formViewValues.getNodeHealthCheck(
      values.formData,
      yamlText.getNodeHealthCheck(originalNodeHealthCheck, values.yamlData)
    );
  }
  return dump(yaml, "", {
    skipInvalid: true,
  });
};

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
  const isStale =
    !!originalNodeHealthCheck &&
    originalNodeHealthCheck?.metadata?.resourceVersion !==
      values.resourceVersion;

  const disableSubmit =
    !dirty ||
    !_.isEmpty(errors) ||
    (isSubmitting &&
      (values.editorType === EditorType.YAML || !!values.formData));

  const yamlEditor = React.useMemo(
    () => <YamlEditorField fieldName="yamlData" />,
    []
  );

  const formEditor = React.useMemo(
    () =>
      values.formParsingError ? (
        <Alert variant="danger" title="Error parsing NodeHealthCheck">
          {values.formParsingError}
        </Alert>
      ) : (
        <NodeHealthCheckFormFields />
      ),
    []
  );

  const onReload = React.useCallback(() => {
    setStatus({ submitSuccess: "", submitError: "" });
    setErrors({});
    if (values.editorType === EditorType.Form) {
      setFieldValue(
        "formData",
        getFormValues(originalNodeHealthCheck, false),
        false
      );
    }
    setFieldValue("yamlData", originalNodeHealthCheck, false);
    setFieldValue(
      "resourceVersion",
      originalNodeHealthCheck?.metadata?.resourceVersion,
      true
    );
  }, [setErrors, setFieldValue, setStatus, values, originalNodeHealthCheck]);

  React.useEffect(() => {
    setStatus({ submitError: null });
  }, [setStatus, values.editorType]);
  return (
    <>
      <FlexForm>
        <SyncedEditorField
          name="editorType"
          formContext={{
            name: "formData",
            editor: formEditor,
            sanitizeTo: (yamlNodeHealthCheck: NodeHealthCheck) => {
              try {
                return formViewValues.getFormViewValues(yamlNodeHealthCheck);
              } catch (err) {
                //return a function so SyncedEditorField will handle the error properly
                return () =>
                  formViewValues.getFormViewValues(originalNodeHealthCheck);
              }
            },
          }}
          yamlContext={{
            name: "yamlData",
            editor: yamlEditor,
            sanitizeTo: () => sanitizeToYaml(values, originalNodeHealthCheck),
          }}
          lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
          noMargin
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
          showAlert={isStale}
          sticky
        />
      </FlexForm>
    </>
  );
};
