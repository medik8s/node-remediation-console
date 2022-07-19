import { DescriptionList } from "@patternfly/react-core";
import { DetailsItem } from "components/copiedFromConsole/utils/details-item";
import { LabelList } from "components/copiedFromConsole/utils/label-list";
import OwnerReferences from "components/copiedFromConsole/utils/OwnerReferences";
import { Selector } from "components/copiedFromConsole/utils/selector";
import { Timestamp } from "components/copiedFromConsole/utils/timestamp";
import { nodeHealthCheckKind, nodeHealthCheckStringKind } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as _ from "lodash";
import * as React from "react";

export type ResourceSummaryProps = {
  resource: NodeHealthCheck;
  canEdit: boolean;
};

export const DetailsLeftPane: React.FC<ResourceSummaryProps> = ({
  resource,
  canEdit,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const { metadata } = resource;

  return (
    <DescriptionList>
      <DetailsItem
        label={t("Name")}
        obj={resource}
        path={"metadata.name"}
        resourceKind={nodeHealthCheckKind.kind}
      />
      <DetailsItem
        label={t("Labels")}
        obj={resource}
        path="metadata.labels"
        valueClassName="details-item__value--labels"
        canEdit={canEdit}
        editAsGroup
        resourceKind={nodeHealthCheckKind.kind}
      >
        <LabelList kind={nodeHealthCheckStringKind} labels={metadata.labels} />
      </DetailsItem>
      <DetailsItem
        label={t("Annotations")}
        obj={resource}
        path="metadata.annotations"
        resourceKind={nodeHealthCheckKind.kind}
      >
        {t("{{count}} annotation", {
          count: _.size(metadata.annotations),
        })}
      </DetailsItem>
      <DetailsItem
        label={t("Node selector")}
        obj={resource}
        path={"spec.selector"}
        resourceKind={nodeHealthCheckKind.kind}
      >
        <Selector
          kind={t("Node")}
          selector={_.get(resource, "spec.selector")}
        />
      </DetailsItem>
      <DetailsItem
        label={t("Created at")}
        obj={resource}
        path="metadata.creationTimestamp"
        resourceKind={nodeHealthCheckKind.kind}
      >
        <Timestamp timestamp={metadata.creationTimestamp} />
      </DetailsItem>
      <DetailsItem
        label={t("Owner")}
        obj={resource}
        path="metadata.ownerReferences"
        resourceKind={nodeHealthCheckKind.kind}
      >
        <OwnerReferences obj={resource} />
      </DetailsItem>
    </DescriptionList>
  );
};
