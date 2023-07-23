import { GreenCheckCircleIcon } from "@openshift-console/dynamic-plugin-sdk";
import {
  Popover,
  TextContent,
  TextVariants,
  Text,
  TextListItem,
  Button,
  Stack,
  StackItem,
  TextList,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  WrenchIcon,
  PauseCircleIcon,
  AngleUpIcon,
  AngleRightIcon,
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
import { global_link_Color as okColor } from "@patternfly/react-tokens";
import { global_danger_color_100 as dangerColor } from "@patternfly/react-tokens";
import EllipsisToolTip from "components/shared/EllipsisTooltip";
import "./nhc-status.css";

const SHOW_MORE_BUTTON_ID = "nhc-show-more-button";

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

const ToggleShowAllButton: React.FC<{
  showAll: boolean;
  onClick: () => void;
}> = ({ showAll, onClick }) => {
  const { t } = useNodeHealthCheckTranslation();
  const Icon = showAll ? AngleUpIcon : AngleRightIcon;
  return (
    <Button
      icon={<Icon id={SHOW_MORE_BUTTON_ID} />}
      onClick={onClick}
      variant="link"
      className="nhc-paused-status-popover__button"
    >
      {showAll ? t("Show less") : t("Show more")}
    </Button>
  );
};

const PausePopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  pauseReasons: string[];
  onEditPauseReasons: () => void;
}> = ({ nodeHealthCheck, pauseReasons, onEditPauseReasons }) => {
  const { t } = useNodeHealthCheckTranslation();
  const modalsApi = useModals();
  const [showAll, setShowAll] = React.useState(false);
  const pauseReasonsToShow = showAll ? pauseReasons : pauseReasons.slice(0, 3);
  return (
    <Stack>
      <StackItem>
        <Text component={TextVariants.h4} data-test="status-reason">
          {t("{{count}} pause reason", { count: pauseReasons.length })}
        </Text>
      </StackItem>
      <StackItem>
        <TextList className="nhc-enhanced-text-list__list">
          {pauseReasonsToShow.map((reason, idx) => (
            <EllipsisToolTip content={reason} key={idx}>
              <TextListItem className="nhc-enhanced-text-list__list-item">
                {reason}
              </TextListItem>
            </EllipsisToolTip>
          ))}
        </TextList>
      </StackItem>
      {pauseReasons.length > 3 && (
        <StackItem>
          <ToggleShowAllButton
            showAll={showAll}
            onClick={() => setShowAll(!showAll)}
          />
        </StackItem>
      )}
      <StackItem>
        <Button
          className="nhc-paused-status-popover__button"
          variant="link"
          onClick={() => {
            onEditPauseReasons();
            modalsApi.openModal(ModalId.EDIT_PAUSE, nodeHealthCheck);
          }}
        >
          {t("Edit pause reasons")}
        </Button>
      </StackItem>
    </Stack>
  );
};

const PopoverContent: React.FC<{
  showPausePopover: boolean;
  pauseReasons: string[];
  nodeHealthCheck: NodeHealthCheck;
  phase: StatusPhase;
  reason: string;
  onEditPauseReasons: () => void;
}> = ({
  showPausePopover,
  pauseReasons,
  nodeHealthCheck,
  phase,
  reason,
  onEditPauseReasons,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <>
      {showPausePopover ? (
        <PausePopoverContent
          nodeHealthCheck={nodeHealthCheck}
          pauseReasons={pauseReasons}
          onEditPauseReasons={onEditPauseReasons}
        />
      ) : (
        <TextContent>
          <Text component={TextVariants.h4}>{getPhaseLabel(t, phase)}</Text>
          <Text data-test="status-reason">{reason}</Text>
        </TextContent>
      )}
    </>
  );
};

const NodeHealthCheckStatus: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  withPopover: boolean;
}> = ({ nodeHealthCheck, withPopover }) => {
  const { t } = useNodeHealthCheckTranslation();
  //need to control popovervisible programatically so it won't show over the edit pausereasons dialog
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const pauseReasons = nodeHealthCheck.spec?.pauseRequests || [];
  const showPausePopover =
    pauseReasons.length > 0 &&
    nodeHealthCheck.status?.phase !== StatusPhase.DISABLED;
  if (!nodeHealthCheck.status?.phase) {
    return <NotAvailable />;
  }
  const phase = nodeHealthCheck.status?.phase;
  const icon = getIcon(phase);
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
  const onShouldClose = (tip, hideFunction, event) => {
    //the condition is a workaround for a bug in patternfly
    //Clickin on an svg icon in the popover triggers onShouldClose
    //this causes the pause popover to close when user click on the "show more" angle icon
    //the condition checks the event target and the parent, because the id doesn't propogate to the svg child path element
    if (
      event?.target?.id !== SHOW_MORE_BUTTON_ID &&
      event?.target?.parentNode?.id !== SHOW_MORE_BUTTON_ID
    ) {
      setPopoverVisible(false);
    }
  };

  return nodeHealthCheck.status?.reason && withPopover ? (
    <Popover
      maxWidth="30rem"
      position={showPausePopover ? "right" : "top"}
      isVisible={popoverVisible}
      shouldOpen={() => setPopoverVisible(true)}
      shouldClose={onShouldClose}
      bodyContent={
        <PopoverContent
          pauseReasons={pauseReasons}
          showPausePopover={showPausePopover}
          nodeHealthCheck={nodeHealthCheck}
          phase={phase}
          reason={nodeHealthCheck.status?.reason}
          onEditPauseReasons={() => setPopoverVisible(false)}
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
