import { DetailsItem } from "copiedFromConsole/utils/details-item";
import { LabelList } from "copiedFromConsole/utils/label-list";
import OwnerReferences from "copiedFromConsole/utils/OwnerReferences";
import { Selector } from "copiedFromConsole/utils/selector";
import { ModalId } from "components/modals/Modals";
import { useModals } from "components/modals/ModalsContext";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { Timestamp } from "@openshift-console/dynamic-plugin-sdk";
import { size, get } from "lodash-es";
import { DescriptionList } from "@patternfly/react-core";
import { nodeHealthCheckStringKind } from "../../../data/model";

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
  const modalsContext = useModals();
  return (
    <DescriptionList aria-label={t("NodeHealthCheck details")}>
      <DetailsItem label={t("Name")} obj={resource} path={"metadata.name"} />
      <DetailsItem
        label={t("Labels")}
        obj={resource}
        path="metadata.labels"
        valueClassName="details-item__value--labels"
        canEdit={canEdit}
        editAsGroup
        onEdit={() => modalsContext.openModal(ModalId.EDIT_LABELS, resource)}
      >
        <LabelList kind={nodeHealthCheckStringKind} labels={metadata.labels} />
      </DetailsItem>
      <DetailsItem
        label={t("Annotations")}
        obj={resource}
        path="metadata.annotations"
        onEdit={() =>
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
      >
        <Selector kind={t("Node")} selector={get(resource, "spec.selector")} />
      </DetailsItem>
      <DetailsItem
        label={t("Created at")}
        obj={resource}
        path="metadata.creationTimestamp"
      >
        <Timestamp timestamp={metadata.creationTimestamp} />
      </DetailsItem>
      <DetailsItem
        label={t("Owner")}
        obj={resource}
        path="metadata.ownerReferences"
      >
        <OwnerReferences obj={resource} />
      </DetailsItem>
    </DescriptionList>
  );
};
