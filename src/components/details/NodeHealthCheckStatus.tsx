import { GreenCheckCircleIcon } from "@openshift-console/dynamic-plugin-sdk";
import {
  Popover,
  TextContent,
  TextVariants,
  Text,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  WrenchIcon,
  PauseCircleIcon,
} from "@patternfly/react-icons";
import { ModalId } from "components/modals/Modals";
import { getPauseRequests, getPhase } from "data/nodeHealthCheck";
import {
  NodeHealthCheck,
  StatusPhase,
  NodeHealthCheckStatus,
} from "data/types";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import NotAvailable from "../list/NotAvailable";
import { useModals } from "components/modals/ModalsContext";

export const getIcon = (phase: StatusPhase) => {
  switch (phase) {
    case StatusPhase.ENABLED: {
      return <GreenCheckCircleIcon />;
    }
    case StatusPhase.DISABLED: {
      return (
        <ExclamationCircleIcon color="var(--pf-global--danger-color--100" />
      );
    }
    case StatusPhase.REMEDIATING: {
      return <WrenchIcon color="var(--pf-global--link--Color)" />;
    }
    case StatusPhase.PAUSED: {
      return <PauseCircleIcon />;
    }
    default: {
      return null;
    }
  }
};

const usePhaseLabels = (): { getLabel(phase: StatusPhase): string } => {
  const { t } = useNodeHealthCheckTranslation();
  return {
    getLabel: (phase: StatusPhase) => {
      switch (phase) {
        case StatusPhase.DISABLED:
          return t("Disabled");
        case StatusPhase.ENABLED:
          return t("Enabled");
        case StatusPhase.PAUSED:
          return t("Paused");
        case StatusPhase.REMEDIATING:
          return t("Remeditating");
        default:
          return phase;
      }
    },
  };
};

const PausePopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  pauseReasons: string[];
}> = ({ nodeHealthCheck, pauseReasons }) => {
  const { t } = useNodeHealthCheckTranslation();
  const modalsApi = useModals();
  return (
    <>
      <Text>{`${pauseReasons.length} ${t("pause reasons found")}`}</Text>
      <a
        onClick={() => modalsApi.openModal(ModalId.EDIT_PAUSE, nodeHealthCheck)}
      >
        {t("Edit pause reasons")}
      </a>
    </>
  );
};

const PopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  phase: StatusPhase;
  reason: string;
}> = ({ nodeHealthCheck, phase, reason }) => {
  const pauseReasons = getPauseRequests(nodeHealthCheck);
  const showPausePopover = pauseReasons.length > 0;
  const { getLabel } = usePhaseLabels();
  return (
    <TextContent>
      <Text component={TextVariants.h4}>{getLabel(phase)}</Text>
      {showPausePopover && (
        <PausePopoverContent
          nodeHealthCheck={nodeHealthCheck}
          pauseReasons={pauseReasons}
        />
      )}
      {!showPausePopover && <Text id="status-reason">{reason}</Text>}
    </TextContent>
  );
};

const NodeHealthCheckStatus: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  withPopover: boolean;
}> = ({ nodeHealthCheck, withPopover }) => {
  const { getLabel } = usePhaseLabels();

  if (!nodeHealthCheck.status || !nodeHealthCheck.status?.phase) {
    return <NotAvailable />;
  }
  const phase = getPhase(nodeHealthCheck);
  let icon = getIcon(getPhase(nodeHealthCheck));
  if (!icon) {
    return <span>{getLabel(phase)}</span>;
  }
  const content = (
    <span id="nhc-status">
      {icon} <a id="nhc-status-text">{getLabel(phase)}</a>
    </span>
  );
  return nodeHealthCheck.status?.reason && withPopover ? (
    <Popover
      id="status-reason"
      maxWidth="30rem"
      bodyContent={
        <PopoverContent
          nodeHealthCheck={nodeHealthCheck}
          phase={phase}
          reason={nodeHealthCheck.status?.reason}
        />
      }
    >
      {content}
    </Popover>
  ) : (
    content
  );
};

export default NodeHealthCheckStatus;
