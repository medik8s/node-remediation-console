import * as React from "react";
import { SelectOptionProps, TextInputTypes } from "@patternfly/react-core";
import { FieldValidator } from "formik";

export interface FieldProps {
  name: string;
  label?: React.ReactNode;
  labelIcon?: React.ReactElement;
  helperText?: React.ReactNode;
  isRequired?: boolean;
  style?: React.CSSProperties;
  isReadOnly?: boolean;
  disableDeleteRow?: boolean;
  disableAddRow?: boolean;
  className?: string;
  groupClassName?: string;
  isDisabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any>;
  validate?: FieldValidator;
  min?: number;
  max?: number;
  idPostfix?: string;
  callFormikOnChange?: boolean;
}

export type MultiSelectOption = SelectOptionProps & {
  id: string;
  displayName: string;
};

export interface MultiSelectFieldProps extends FieldProps {
  options: MultiSelectOption[];
  placeholderText?: string;
  onChange?: (val: string[]) => void;
  getHelperText?: (value: string) => React.ReactNode | undefined;
}

export interface BaseInputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  autoComplete?: string;
}
