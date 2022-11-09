import * as React from "react";
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
import { NodeHealthCheck, UnhealthyCondition } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { map } from "lodash-es";

export const UnhealthyConditionsTable: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const { t } = useNodeHealthCheckTranslation();
  const columnNames = {
    type: t("Type"),
    status: t("Status"),
    duration: t("Duration"),
  };
  return (
    <TableComposable
      aria-label="Unhealthy Conditions Table"
      variant="compact"
      translate={undefined}
    >
      <Thead translate={undefined}>
        <Tr translate={undefined}>
          <Th translate={undefined}>{columnNames.type}</Th>
          <Th translate={undefined}>{columnNames.status}</Th>
          <Th translate={undefined}>{columnNames.duration}</Th>
        </Tr>
      </Thead>
      <Tbody translate={undefined}>
        {map(
          nodeHealthCheck.spec?.unhealthyConditions,
          (condition: UnhealthyCondition, idx) => (
            <Tr
              key={idx}
              translate={undefined}
              data-index={idx}
              data-test="unhealthy-condition-row"
            >
              <Td dataLabel={columnNames.type} translate={undefined}>
                {condition.type}
              </Td>
              <Td dataLabel={columnNames.status} translate={undefined}>
                {condition.status}
              </Td>
              <Td dataLabel={columnNames.duration} translate={undefined}>
                {condition.duration}
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </TableComposable>
  );
};
