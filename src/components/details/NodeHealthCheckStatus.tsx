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
import {
  NodeHealthCheck,
  StatusPhase,
  NodeHealthCheckStatus,
} from "data/types";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import NotAvailable from "../list/NotAvailable";
import { useModals } from "components/modals/ModalsContext";
import { TFunction } from "i18next";
import { global_palette_green_500 as okColor } from "@patternfly/react-tokens";
import { chart_global_danger_Color_100 as dangerColor } from "@patternfly/react-tokens";

export const getIcon = (phase: StatusPhase) => {
  switch (phase) {
    case StatusPhase.ENABLED: {
      return <GreenCheckCircleIcon />;
    }
    case StatusPhase.DISABLED: {
      return <ExclamationCircleIcon color={dangerColor.value} />;
    }
    case StatusPhase.REMEDIATING: {
      return <WrenchIcon color={okColor.value} />;
    }
    case StatusPhase.PAUSED: {
      return <PauseCircleIcon />;
    }
    default: {
      return null;
    }
  }
};

const getPhaseLabel = (t: TFunction, phase: string): string => {
  switch (phase) {
    case StatusPhase.DISABLED:
      return t("Disabled");
    case StatusPhase.ENABLED:
      return t("Enabled");
    case StatusPhase.PAUSED:
      return t("Paused");
    case StatusPhase.REMEDIATING:
      return t("Remediating");
    default:
      return phase;
  }
};

const PausePopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  pauseReasons: string[];
}> = ({ nodeHealthCheck, pauseReasons }) => {
  const { t } = useNodeHealthCheckTranslation();
  const modalsApi = useModals();
  return (
    <>
      <Text data-test="status-reason">
        {t("{{count}} pause reason found", { count: pauseReasons.length })}
      </Text>
      <a
        onClick={() => modalsApi.openModal(ModalId.EDIT_PAUSE, nodeHealthCheck)}
        data-test="edit-pause-reasons"
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
  const { t } = useNodeHealthCheckTranslation();
  const pauseReasons = nodeHealthCheck.spec?.pauseRequests || [];
  const showPausePopover =
    pauseReasons.length > 0 &&
    nodeHealthCheck.status?.phase !== StatusPhase.DISABLED;
  return (
    <TextContent>
      <Text component={TextVariants.h4}>{getPhaseLabel(t, phase)}</Text>
      {showPausePopover ? (
        <PausePopoverContent
          nodeHealthCheck={nodeHealthCheck}
          pauseReasons={pauseReasons}
        />
      ) : (
        <Text id="status-reason" data-test="status-reason">
          {reason}
        </Text>
      )}
    </TextContent>
  );
};

const NodeHealthCheckStatus: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  withPopover: boolean;
}> = ({ nodeHealthCheck, withPopover }) => {
  const { t } = useNodeHealthCheckTranslation();
  if (!nodeHealthCheck.status?.phase) {
    return <NotAvailable />;
  }
  const phase = nodeHealthCheck.status?.phase;
  let icon = getIcon(phase);
  if (!icon) {
    return <span>{getPhaseLabel(t, phase)}</span>;
  }
  const content = (
    <span className="nhc-status" data-test="nhc-status">
      {icon}{" "}
      <a className="nhc-status__label" data-test="nhc-status-label">
        {getPhaseLabel(t, phase)}
      </a>
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
