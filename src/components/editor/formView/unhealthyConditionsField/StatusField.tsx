import { UnhealthyConditionStatus, UnhealtyConditionType } from "data/types";
import { useField } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import * as React from "react";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { find } from "lodash-es";
import SelectField, { SelectItem } from "../../../shared/SelectField";

const getStatuses = (
  type: UnhealtyConditionType
): UnhealthyConditionStatus[] => {
  if (type === UnhealtyConditionType.Ready) {
    return [UnhealthyConditionStatus.False, UnhealthyConditionStatus.Unknown];
  }
  if (Object.values(UnhealtyConditionType).includes(type)) {
    return [UnhealthyConditionStatus.True];
  }
  return [
    UnhealthyConditionStatus.True,
    UnhealthyConditionStatus.False,
    UnhealthyConditionStatus.Unknown,
  ];
};

const getStatusOptions = (type: UnhealtyConditionType): SelectItem[] => {
  const statuses = getStatuses(type);
  return statuses.map((status) => {
    return {
      label: status,
      value: status,
    };
  });
};

const StatusField: React.FC<
  UnhealthyConditionFieldProps & {
    type: UnhealtyConditionType;
  }
> = ({ name, type }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [{ value: status }, , { setValue: setStatus }] =
    useField<UnhealthyConditionStatus>(name);
  const statusOptions = React.useMemo<SelectItem[]>(() => {
    return getStatusOptions(type);
  }, [type, status]);

  React.useEffect(() => {
    //handle switching to a type that doesn't support the current status
    if (!find<SelectItem[]>(statusOptions, { value: status })) {
      setStatus(statusOptions[0].value as UnhealthyConditionStatus);
    }
  }, [type, status]);

  return (
    <SelectField
      name={name}
      label={t("Status")}
      isRequired
      items={statusOptions}
      isDisabled={statusOptions.length === 1}
    />
  );
};

export default StatusField;
