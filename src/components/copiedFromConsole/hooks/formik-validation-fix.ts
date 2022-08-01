import * as React from "react";
import { useFormikContext, FormikValues } from "formik";
import { useDeepCompareMemoize } from "./deep-compare-memoize";

export const useFormikValidationFix = (value: any) => {
  const { validateForm } = useFormikContext<FormikValues>();
  const memoizedValue = useDeepCompareMemoize(value);

  React.useEffect(() => {
    console.log({ value });
    validateForm().then((errors) => {
      console.log(errors);
    });
  }, [memoizedValue, validateForm]);
};
