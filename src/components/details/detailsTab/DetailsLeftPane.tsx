import { DetailsItem } from "copiedFromConsole/utils/details-item";
import { LabelList } from "copiedFromConsole/utils/label-list";
import OwnerReferences from "copiedFromConsole/utils/OwnerReferences";
import { Selector } from "copiedFromConsole/utils/selector";
import { ModalId } from "components/modals/Modals";
import { useModals } from "components/modals/ModalsContext";
import { nodeHealthCheckKind, nodeHealthCheckStringKind } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { usePropertyDescriptions } from "propertyDescriptions/usePropertyDescriptions";
import * as React from "react";
import { Timestamp } from "@openshift-console/dynamic-plugin-sdk";
import { size, get } from "lodash-es";

export type ResourceSummaryProps = {
  resource: NodeHealthCheck;
  canEdit: boolean;
};

export const DetailsLeftPane: React.FC<ResourceSummaryProps> = ({
  resource,
  canEdit,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const descriptions = usePropertyDescriptions();
  const { metadata } = resource;
  const modalsContext = useModals();
  return (
    <dl className="co-m-pane__details">
      <DetailsItem
        label={t("Name")}
        obj={resource}
        path={"metadata.name"}
        description={descriptions.name}
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
        onEdit={(e) => modalsContext.openModal(ModalId.EDIT_LABELS, resource)}
        description={descriptions.labels}
      >
        <LabelList kind={nodeHealthCheckStringKind} labels={metadata.labels} />
      </DetailsItem>
      <DetailsItem
        label={t("Annotations")}
        obj={resource}
        path="metadata.annotations"
        resourceKind={nodeHealthCheckKind.kind}
        description={descriptions.annotations}
        onEdit={(e) =>
          modalsContext.openModal(ModalId.EDIT_ANNOTATIONS, resource)
        }
      >
        {t("{{count}} annotation", {
          count: size(metadata.annotations),
        })}
      </DetailsItem>
      <DetailsItem
        label={t("Node selector")}
        obj={resource}
        path={"spec.selector"}
        description={descriptions.selector}
        resourceKind={nodeHealthCheckKind.kind}
      >
        <Selector kind={t("Node")} selector={get(resource, "spec.selector")} />
      </DetailsItem>
      <DetailsItem
        label={t("Created at")}
        obj={resource}
        path="metadata.creationTimestamp"
        resourceKind={nodeHealthCheckKind.kind}
        description={descriptions.created_at}
      >
        <Timestamp timestamp={metadata.creationTimestamp} />
      </DetailsItem>
      <DetailsItem
        label={t("Owner")}
        obj={resource}
        path="metadata.ownerReferences"
        resourceKind={nodeHealthCheckKind.kind}
        description={descriptions.owner}
      >
        <OwnerReferences obj={resource} />
      </DetailsItem>
    </dl>
  );
};
