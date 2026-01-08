import {
  ValidatedOptions,
  TextInputTypes,
  SelectOptionProps,
  SelectProps,
} from "@patternfly/react-core";
export interface FieldProps {
  name: string;
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  helpTextInvalid?: React.ReactNode;
  required?: boolean;
  style?: React.CSSProperties;
  isReadOnly?: boolean;
  className?: string;
  isDisabled?: boolean;
  validated?: ValidatedOptions;
  dataTest?: string;
  labelIcon?: React.ReactElement;
}
export interface BaseInputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  autoComplete?: string;
}
export interface RadioButtonFieldProps extends FieldProps {
  value: React.ReactText;
  description?: React.ReactNode;
  onChange?: (value: React.ReactText) => void;
}

export interface RadioGroupFieldProps extends FieldProps {
  isInline?: boolean;
  labelPosition?: "inline" | "stacked";
  options: RadioGroupOption[];
  onChange?: (value: React.ReactText) => void;
}

export interface RadioGroupOption {
  value: React.ReactText;
  label: React.ReactNode;
  isDisabled?: boolean;
  children?: React.ReactNode;
  activeChildren?: React.ReactElement;
}

export type MultiSelectOption = SelectOptionProps & {
  id: string;
  displayName: string;
  isDisabled?: boolean;
};

export interface MultiSelectFieldProps extends FieldProps {
  options: MultiSelectOption[];
  placeholderText?: string;
  onChange?: (val: string[]) => void;
  getHelperText?: (value: string) => React.ReactNode | undefined;
  chipGroupComponent?: React.ReactNode;
  onSelect: SelectProps["onSelect"];
  enableClear: boolean;
}
