import * as React from "react";
import { useField } from "formik";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectProps,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
} from "@patternfly/react-core";

import { getFieldId } from "../../copiedFromConsole/formik-fields/field-utils";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";
import { useFormikValidationFix } from "../../copiedFromConsole/hooks/formik-validation-fix";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useNodeHealthCheckTranslation } from "../../localization/useNodeHealthCheckTranslation";

export interface MultiSelectFieldProps extends FieldProps {
  placeholderText?: string;
  isLoading: boolean;
  isRequired: boolean;
  label: string;
  filterValue: string;
  setFilterValue: (filterValue: string) => void;
  children: SelectProps["children"];
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  helpText,
  labelIcon,
  isRequired,
  filterValue,
  setFilterValue,
  isLoading,
  children,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [isOpen, setOpen] = React.useState(false);
  const [field, { touched, error }, { setValue }] = useField<string[]>(
    props.name
  );
  const textInputRef = React.useRef<HTMLInputElement>();
  const fieldId = getFieldId(props.name, "multiinput");
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";
  useFormikValidationFix(field.value);

  const onToggle = (isOpen: boolean) => setOpen(isOpen);
  const onClearSelection = () => {
    setValue([]);
    setOpen(false);
  };

  const onSelect: SelectProps["onSelect"] = (event, selection) => {
    let newValue: string[];
    if (field.value.includes(selection as string)) {
      newValue = field.value.filter((sel: string) => sel !== selection);
    } else {
      newValue = [...field.value, selection as string];
    }
    setValue(newValue);
  };

  const validated = isValid ? "default" : "error";

  const formContent = isLoading ? (
    <Spinner size="md" />
  ) : (
    <>
      <Select
        {...field}
        {...props}
        id={fieldId}
        validated={isValid ? "default" : "error"}
        aria-describedby={`${fieldId}-helper`}
        placeholderText={t("Filter by label")}
        isOpen={isOpen}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={field.value}
        onClear={onClearSelection}
        maxHeight={400}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            variant="typeahead"
            ref={toggleRef}
            onClick={() => setOpen(!isOpen)}
            isExpanded={isOpen}
            style={{
              width: "200px",
            }}
          >
            <TextInputGroup isPlain>
              <TextInputGroupMain
                value={filterValue}
                onClick={() => onToggle(!isOpen)}
                onChange={(_, val) => setFilterValue(val)}
                onKeyDown={() => onToggle(true)}
                id="multi-typeahead-select-checkbox-input"
                autoComplete="off"
                innerRef={textInputRef}
                placeholder={t("Filter by label")}
                role="combobox"
                isExpanded={isOpen}
                aria-controls="select-multi-typeahead-checkbox-listbox"
              />
            </TextInputGroup>
          </MenuToggle>
        )}
        maxMenuHeight="25rem"
        isScrollable
      >
        {children}
      </Select>
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            variant={validated}
            {...(validated === "error" && { icon: <ExclamationCircleIcon /> })}
          >
            {errorMessage || helpText}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </>
  );

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      isRequired={isRequired}
      labelIcon={labelIcon}
      data-test={`multi-select-${label}`}
    >
      {formContent}
    </FormGroup>
  );
};

export default MultiSelectField;
