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
import * as _ from "lodash";
import { getPauseRequests } from "data/nodeHealthCheck";
import { NodeHealthCheckModalProps } from "./propTypes";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { InfoCircleIcon } from "@patternfly/react-icons";
import * as pluralize from "pluralize";

type PauseReasonFieldProps = {
  pauseReasons: string[];
};

const PauseReasons: React.FC<PauseReasonFieldProps> = ({ pauseReasons }) => {
  return (
    <TextContent>
      {pauseReasons.map((value, idx) => (
        <Text>{value}</Text>
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
  const pauseRequests = getPauseRequests(nodeHealthCheck);
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
  const pauseReasonsTxt = pluralize("reason", pauseRequests.length);
  const infoMessage =
    pauseRequests.length > 1
      ? `All the pause ${pauseReasonsTxt} will be removed`
      : `The pause ${pauseReasonsTxt} will be removed`;
  return (
    <Modal
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
        >
          {t("Unpause")}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent id="#pause-reason">
            <Text component={TextVariants.h4}>
              {t(`Pause ${pauseReasonsTxt}`)}
            </Text>
            {pauseRequests && <PauseReasons pauseReasons={pauseRequests} />}
          </TextContent>
        </StackItem>
        <StackItem>
          <Text>
            <InfoCircleIcon
              size="sm"
              color="var(--pf-global--info-color--100)"
            />
            &nbsp;{`${infoMessage}`}
          </Text>
        </StackItem>
      </Stack>
      {error && <Alert variant="danger" title={t("Failed to unpause")} />}
    </Modal>
  );
};
