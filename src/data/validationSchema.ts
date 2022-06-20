import * as yup from "yup";
import { EditorType } from "components/copiedFromConsole/synced-editor/editor-toggle";
import { RemediatorKind } from "./types";
//TODO: add minHealthy validation

const DURATION_REGEX = /^([0-9]+(.[0-9]+)?(ns|us|µs|ms|s|m|h))+$/;
const MIN_HEALTHY_REGEX = /^((100|[0-9]{1,2})%|[0-9]+)$/;
const requiredSchema = yup.string().required("Required");

const customRemediatorSchema = yup.object({
  apiVersion: requiredSchema,
  kind: requiredSchema,
  name: requiredSchema,
  template: requiredSchema,
});

const formDataSchema = yup.object({
  name: requiredSchema,
  minHealthy: requiredSchema.concat(
    yup.string().matches(MIN_HEALTHY_REGEX, {
      message: `Must match the following: ${MIN_HEALTHY_REGEX} `,
    })
  ),
  unhealthyConditions: yup.array().of(
    yup.object().shape({
      duration: requiredSchema.concat(
        yup.string().matches(DURATION_REGEX, {
          message: `Must match the following: ${DURATION_REGEX}`,
        })
      ),
    })
  ),
  remediator: yup.object({
    template: yup.mixed().when("kind", {
      is: RemediatorKind.CUSTOM,
      then: customRemediatorSchema,
      otherwise: yup.string(),
    }),
  }),
});

export const validationSchema = yup.object({
  formData: yup.mixed().when("editorType", {
    is: EditorType.Form,
    then: formDataSchema,
  }),
  yamlData: yup.mixed().when("editorType", {
    is: EditorType.YAML,
    then: requiredSchema,
  }),
});
