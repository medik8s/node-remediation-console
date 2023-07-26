import * as yup from "yup";
import { EditorType } from "copiedFromConsole/synced-editor/editor-toggle";
import { TFunction } from "i18next";

const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?(ns|us|µs|ms|s|m|h))+$/;
export const MIN_HEALTHY_REGEX = /^((100|[0-9]{1,2})%|[0-9]+)$/;
const NAME_START_END_REGEX = /^[a-z0-9]$/;
const NAME_MAX_LENGTH = 253;

export const nameValidationMessages = (t: TFunction) => ({
  INVALID_LENGTH: t("1-{{max}} characters", {
    max: NAME_MAX_LENGTH,
  }),
  NOT_UNIQUE: t("Must be unique"),
  INVALID_VALUE: t(
    "Use lowercase alphanumeric characters, dot (.) or hyphen (-)"
  ),
  INVALID_START_END: t(
    "Must start and end with an lowercase alphanumeric character"
  ),
});

const requiredSchema = yup.string().required("Required");

const remediatorSchema = yup.object({
  apiVersion: requiredSchema,
  kind: requiredSchema,
  name: requiredSchema,
  namespace: requiredSchema,
});

export const nameSchema = (t: TFunction) => {
  const nameValidationMessagesList = nameValidationMessages(t);
  return yup
    .string()
    .min(1, nameValidationMessagesList.INVALID_LENGTH)
    .max(253, nameValidationMessagesList.INVALID_LENGTH)
    .test(
      nameValidationMessagesList.INVALID_START_END,
      nameValidationMessagesList.INVALID_START_END,
      (value?: string) => {
        const trimmed = value?.trim();
        if (!trimmed) {
          return true;
        }
        return (
          !!trimmed[0].match(NAME_START_END_REGEX) &&
          (trimmed[trimmed.length - 1]
            ? !!trimmed[trimmed.length - 1].match(NAME_START_END_REGEX)
            : true)
        );
      }
    )
    .matches(/^[a-z0-9-.]*$/, {
      message: nameValidationMessagesList.INVALID_VALUE,
      excludeEmptyString: true,
    });
};

const getFormDataSchema = (t: TFunction) =>
  yup.object({
    name: requiredSchema.concat(nameSchema(t)),
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
    remediator: yup.object().when("useEscalating", {
      is: false,
      then: yup.object().shape({ template: remediatorSchema }),
    }),
    escalatingRemediations: yup.array().when("useEscalating", {
      is: true,
      then: yup.array().of(
        yup.object().shape({
          template: remediatorSchema,
          timeout: requiredSchema.concat(
            yup.string().matches(new RegExp(DURATION_REGEX), {
              message: `${t(
                "Expected value matches regular expression:"
              )} ${DURATION_REGEX}`,
            })
          ),
        })
      ),
    }),
    nodeSelector: yup.array().of(yup.string()).required().min(1),
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
