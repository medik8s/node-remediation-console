import { NodeHealthCheck, StatusPhase } from "data/types";
import { ModalId } from "components/modals/Modals";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { Action } from "@openshift-console/dynamic-plugin-sdk";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useModals } from "components/modals/ModalsContext";
import * as React from "react";

export enum NodeHealthCheckActionIds {
  EDIT = "edit",
}

export type NodeHealthCheckActionMenuId = NodeHealthCheckActionIds | ModalId;

const useNodeHealthCheckActions = (
  nodeHealthCheck: NodeHealthCheck
): Action[] => {
  const navigation = useNodeHealthCheckNavigation();
  const { t } = useNodeHealthCheckTranslation();
  const modalContext = useModals();

  const getModalIds = (): ModalId[] => {
    let res: ModalId[] = [];
    const disabled = nodeHealthCheck.status?.phase === StatusPhase.DISABLED;
    let pauseRequests = nodeHealthCheck.spec?.pauseRequests || [];
    if (disabled) {
      return [ModalId.DELETE];
    }
    if (pauseRequests && pauseRequests.length > 0) {
      res = [ModalId.EDIT_PAUSE, ModalId.UNPAUSE];
    } else {
      res = [ModalId.PAUSE];
    }
    res.push(ModalId.DELETE);
    return res;
  };

  const onEdit = () => {
    navigation.gotoEditor(nodeHealthCheck.metadata.name);
  };

  const modalLabels = {
    [ModalId.PAUSE]: t("Pause NodeHealthCheck"),
    [ModalId.UNPAUSE]: t("Unpause NodeHealthCheck"),
    [ModalId.EDIT_PAUSE]: t("Edit Pause NodeHealthCheck"),
    [ModalId.DELETE]: t("Delete NodeHealthCheck"),
  };

  const getActions = (): Action[] => {
    const actions: Action[] = [
      {
        id: NodeHealthCheckActionIds.EDIT,
        cta: onEdit,
        label: t("Edit NodeHealthCheck"),
      },
    ];

    for (const modalId of getModalIds()) {
      actions.push({
        id: modalId,
        cta: () => modalContext.openModal(modalId, nodeHealthCheck),
        label: modalLabels[modalId],
      });
    }
    return actions;
  };

  const actions = React.useMemo(getActions, [nodeHealthCheck]);
  return actions;
};

export default useNodeHealthCheckActions;
