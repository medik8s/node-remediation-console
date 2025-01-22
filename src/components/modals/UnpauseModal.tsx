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
  Icon,
} from "@patternfly/react-core";
import { unpauseNodeHealthCheck } from "apis/nodeHealthCheckApis";
import * as React from "react";

import { NodeHealthCheckModalProps } from "./propTypes";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { global_palette_blue_300 as infoColor } from "@patternfly/react-tokens";
import EnhancedTextList from "components/shared/EnhancedTextList";

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
          onClick={() => void onSubmit()}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          data-test="confirm"
        >
          {t("Unpause")}
        </Button>,
        <Button
          key="cancel"
          variant="secondary"
          onClick={onClose}
          data-test="cancel"
          isDisabled={isSubmitting}
        >
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.h4}>{t(`Pause reasons`)}</Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <EnhancedTextList textList={pauseRequests} />
        </StackItem>
        <StackItem>
          <Text>
            <Icon size="sm" color={infoColor.value}>
              <InfoCircleIcon />
            </Icon>
            &nbsp;{`${infoMessage}`}
          </Text>
        </StackItem>
      </Stack>
      {error && (
        <Alert variant="danger" title={t("Failed to unpause")} isInline />
      )}
    </Modal>
  );
};
