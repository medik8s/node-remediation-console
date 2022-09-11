import * as yup from "yup";
import { EditorType } from "copiedFromConsole/synced-editor/editor-toggle";
import { RemediatorLabel } from "./types";
import { TFunction } from "i18next";

const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?(ns|us|µs|ms|s|m|h))+$/;
export const MIN_HEALTHY_REGEX = /^((100|[0-9]{1,2})%|[0-9]+)$/;
const NAME_REGEX = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const requiredSchema = yup.string().required("Required");

const customRemediatorSchema = yup.object({
  apiVersion: requiredSchema,
  kind: requiredSchema,
  name: requiredSchema,
  namespace: requiredSchema,
});

const getFormDataSchema = (t: TFunction) =>
  yup.object({
    name: requiredSchema.matches(new RegExp(NAME_REGEX), {
      message: `${t(
        "Expected value matches regular expression:"
      )} ${NAME_REGEX}`,
    }),
    minHealthy: requiredSchema.concat(
      yup.string().matches(new RegExp(MIN_HEALTHY_REGEX), {
        message: t(
          `Expected value is a percentage or a number. For example: 25 or 70%`
        ),
      })
    ),
    unhealthyConditions: yup.array().of(
      yup.object().shape({
        duration: requiredSchema.concat(
          yup.string().matches(new RegExp(DURATION_REGEX), {
            message: `${t(
              "Expected value matches regular expression:"
            )} ${DURATION_REGEX}`,
          })
        ),
      })
    ),
    remediator: yup.object({
      template: yup.mixed().when("label", {
        is: RemediatorLabel.CUSTOM,
        then: customRemediatorSchema,
        otherwise: yup.string(),
      }),
    }),
  });

export const getValidationSchema = (t: TFunction) =>
  yup.object({
    formData: yup.mixed().when("editorType", {
      is: EditorType.Form,
      then: getFormDataSchema(t),
    }),
    yamlData: yup.mixed().when("editorType", {
      is: EditorType.YAML,
      then: requiredSchema,
    }),
  });
