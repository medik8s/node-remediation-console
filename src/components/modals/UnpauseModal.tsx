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
import { LoadingInline } from "components/copiedFromConsole/status-box";
import * as React from "react";
import * as _ from "lodash";
import { getPauseRequests } from "data/selectors";
import { NodeHealthCheckModalProps } from "./propTypes";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { InfoCircleIcon } from "@patternfly/react-icons";

type PauseReasonFieldProps = {
  pauseReasons: string[];
};

const PauseReasons: React.FC<PauseReasonFieldProps> = ({ pauseReasons }) => {
  return (
    <p>
      {pauseReasons.map((value, idx) => (
        <>
          <span>{value}</span>
          <br />
        </>
      ))}
    </p>
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.small}
      title={t("Unpause NodeHealthCheck")}
      description={t("Are you sure you want to unpause Node health check?")}
      actions={[
        <Button key="confirm" variant="primary" onClick={onSubmit}>
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
            <Text component={TextVariants.h4}>{t("Pause reason(s)")}</Text>
            {pauseRequests && <PauseReasons pauseReasons={pauseRequests} />}
          </TextContent>
        </StackItem>
        <StackItem>
          <Text>
            <InfoCircleIcon
              size="sm"
              color="var(--pf-global--info-color--100)"
            />
            &nbsp;{t("All the pause reason(s) will be removed.")}
          </Text>
        </StackItem>
      </Stack>
      {isSubmitting && <LoadingInline />}
      {error && <Alert variant="danger" title={t("Failed to unpause")} />}
    </Modal>
  );
};
