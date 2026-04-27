import * as React from "react";

import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import {
  Alert,
  AlertVariant,
  Button,
  ButtonProps,
  ButtonVariant,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  ModalVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

type TabModalProps<T extends K8sResourceCommon = K8sResourceCommon> = {
  isOpen: boolean;
  obj?: T;
  onSubmit: (obj: T) => Promise<T | void>;
  onClose: () => Promise<void> | void;
  headerText: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  submitBtnText?: string;
  modalVariant?: ModalVariant;
  positionTop?: boolean;
  submitBtnVariant?: ButtonVariant;
  submitBtnType?: ButtonProps["type"];
  titleIconVariant?: ModalHeaderProps["titleIconVariant"];
};

export type TabModalFC = <T extends K8sResourceCommon = K8sResourceCommon>(
  props: TabModalProps<T>
) => JSX.Element;

const TabModal: TabModalFC = React.memo(
  ({
    obj,
    onSubmit,
    isOpen,
    onClose,
    headerText,
    children,
    isDisabled,
    submitBtnText,
    modalVariant,
    positionTop = true,
    submitBtnVariant,
    titleIconVariant,
    submitBtnType,
  }) => {
    const { t } = useNodeHealthCheckTranslation();

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState(undefined);

    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(undefined);

      onSubmit(obj)
        .then(onClose)
        .catch(setError)
        .finally(() => setIsSubmitting(false));
    };

    const closeModal = () => {
      setError(undefined);
      setIsSubmitting(false);

      const promise = onClose();

      if (promise) promise?.catch(setError);
    };

    return (
      <Modal
        variant={modalVariant ?? "small"}
        position={positionTop ? "top" : "default"}
        className="ocs-modal"
        onClose={closeModal}
        isOpen={isOpen}
        id="tab-modal"
      >
        <ModalHeader
          title={headerText}
          titleIconVariant={titleIconVariant}
        />
        <ModalBody>
          <Form>
            {children}
            {error && (
              <Alert
                isInline
                variant={AlertVariant.danger}
                title={t("An error occurred")}
              >
                <Stack hasGutter>
                  <StackItem>{error.message}</StackItem>
                  {error?.href && (
                    <StackItem>
                      <a href={error.href} target="_blank" rel="noreferrer">
                        {error.href}
                      </a>
                    </StackItem>
                  )}
                </Stack>
              </Alert>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            isDisabled={isDisabled || isSubmitting}
            isLoading={isSubmitting}
            variant={submitBtnVariant ?? "primary"}
            type={submitBtnType}
          >
            {submitBtnText || t("Save")}
          </Button>
          <Button onClick={closeModal} variant="link">
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

export default TabModal;
