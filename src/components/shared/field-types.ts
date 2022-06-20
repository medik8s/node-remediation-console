import { K8sModel } from "@openshift-console/dynamic-plugin-sdk";
import {
  ValidatedOptions,
  TextInputTypes,
  SelectVariant,
  SelectOptionProps,
  SelectProps,
} from "@patternfly/react-core";
import { JSONSchema7 } from "json-schema";
import * as React from "react";

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

// export interface FieldProps {
//   name: string;
//   label?: React.ReactNode;

//   helperText?: React.ReactNode;
//   isRequired?: boolean;
//   style?: React.CSSProperties;
//   isReadOnly?: boolean;
//   disableDeleteRow?: boolean;
//   disableAddRow?: boolean;
//   className?: string;
//   groupClassName?: string;
//   isDisabled?: boolean;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   ref?: React.Ref<any>;
//   validate?: FieldValidator;
//   min?: number;
//   max?: number;
//   idPostfix?: string;
//   callFormikOnChange?: boolean;
// }

export interface DroppableFileInputFieldProps extends FieldProps {
  onChange?: (fileData: string) => void;
}
export interface BaseInputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  autoComplete?: string;
}

export interface GroupInputProps extends BaseInputFieldProps {
  beforeInput?: React.ReactNode;
  afterInput?: React.ReactNode;
  groupTextType?: GroupTextType;
}

export interface TextAreaProps extends FieldProps {
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  rows?: number;
  resizeOrientation?: "vertical" | "horizontal" | "both";
}

export enum GroupTextType {
  TextInput = "text",
  TextArea = "textArea",
}

export interface CheckboxFieldProps extends FieldProps {
  formLabel?: string;
  value?: string;
  onChange?: (val: boolean) => void;
}

export interface SearchInputFieldProps extends BaseInputFieldProps {
  onSearch: (searchTerm: string) => void;
}

export interface DropdownFieldProps extends FieldProps {
  items?: object;
  selectedKey?: string;
  title?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  autocompleteFilter?: (text: string, item: object, key?: string) => boolean;
  onChange?: (value: string) => void;
}

export type FormSelectFieldOption<T = any> = {
  label: string;
  value: T;
  isPlaceholder?: boolean;
  isDisabled?: boolean;
};

export type FormSelectFieldProps = FieldProps & {
  isDisabled?: boolean;
  options: FormSelectFieldOption[];
  onChange?: (selectedValue: any) => void;
};

export interface ResourceLimitFieldProps extends FieldProps {
  unitName: string;
  unitOptions: object;
  fullWidth?: boolean;
}

export interface YAMLEditorFieldProps {
  model?: K8sModel;
  schema?: JSONSchema7;
  showSamples: boolean;
  onSave?: () => void;
  name: string;
  label?: string;
}

export interface NameValuePair {
  name: string;
  value: string;
}

export interface NameValueFromPair {
  name: string;
  valueFrom: ConfigMapKeyRef | SecretKeyRef;
}

export interface ConfigMapKeyRef {
  configMapKeyRef: {
    key: string;
    name: string;
  };
}

export interface SecretKeyRef {
  secretKeyRef: {
    key: string;
    name: string;
  };
}

export interface RadioButtonFieldProps extends FieldProps {
  value: React.ReactText;
  description?: React.ReactNode;
  onChange?: (value: React.ReactText) => void;
}

export interface RadioGroupFieldProps extends FieldProps {
  isInline?: boolean;
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

export interface SelectInputOption {
  value: string;
  disabled: boolean;
}

export interface SelectInputFieldProps extends FieldProps {
  ariaLabel?: string;
  options: SelectInputOption[];
  variant?: SelectVariant;
  placeholderText?: React.ReactNode;
  isCreatable?: boolean;
  hasOnCreateOption?: boolean;
  isInputValuePersisted?: boolean;
  noResultsFoundText?: string;
  toggleOnSelection?: boolean;
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
