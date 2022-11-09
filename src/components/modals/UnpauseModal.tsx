import {
  Button,
  Modal,
  ModalVariant,
  Text,
  Alert,
  TextVariants,
  Stack,
  StackItem,
  TextContent,
} from "@patternfly/react-core";
import { unpauseNodeHealthCheck } from "apis/nodeHealthCheckApis";
import * as React from "react";

import { NodeHealthCheckModalProps } from "./propTypes";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { global_palette_blue_100 as infoColor } from "@patternfly/react-tokens";

type PauseReasonFieldProps = {
  pauseReasons: string[];
};

const PauseReasons: React.FC<PauseReasonFieldProps> = ({ pauseReasons }) => {
  return (
    <TextContent>
      {pauseReasons.map((value, idx) => (
        <Text data-test="pause-reason" data-index={idx}>
          {value}
        </Text>
      ))}
    </TextContent>
  );
};

export const UnpauseModal: React.FC<NodeHealthCheckModalProps> = ({
  nodeHealthCheck,
  isOpen,
  onClose,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>();
  const [error, setError] = React.useState<boolean>();
  const pauseRequests = nodeHealthCheck.spec?.pauseRequests || [];
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await unpauseNodeHealthCheck(nodeHealthCheck);
    } catch (err) {
      setError(err);
    }
    setIsSubmitting(false);
    onClose();
  };
  const infoMessage = t("All the pause reasons will be removed");
  return (
    <Modal
      className="nhc-modal"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.small}
      title={t("Unpause NodeHealthCheck")}
      description={t("Are you sure you want to unpause Node health check?")}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={onSubmit}
          isLoading={isSubmitting}
          data-test="confirm"
        >
          {t("Unpause")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={onClose}
          data-test="cancel"
        >
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent id="#pause-reason">
            <Text component={TextVariants.h4}>{t(`Pause reasons`)}</Text>
            <PauseReasons pauseReasons={pauseRequests} />
          </TextContent>
        </StackItem>
        <StackItem>
          <Text>
            <InfoCircleIcon size="sm" color={infoColor.value} />
            &nbsp;{`${infoMessage}`}
          </Text>
        </StackItem>
      </Stack>
      {error && <Alert variant="danger" title={t("Failed to unpause")} />}
    </Modal>
  );
};
