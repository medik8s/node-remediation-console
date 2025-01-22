import * as React from "react";
import {
  ActionList,
  ActionListItem,
  Alert,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { DownloadIcon } from "@patternfly/react-icons";
import * as cx from "classnames";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { FormFooterProps } from "./form-utils-types";

import { ButtonBar } from "../button-bar";
import { Shadows, useScrollShadows } from "../hooks/useScrollShadows";
import { useScrollContainer } from "../hooks/useScrollContainer";

const FormFooter: React.FC<FormFooterProps> = ({
  handleSubmit,
  handleReset,
  handleCancel,
  handleDownload,
  submitLabel,
  resetLabel,
  cancelLabel,
  infoTitle,
  infoMessage,
  isSubmitting,
  errorMessage,
  successMessage,
  disableSubmit,
  hideSubmit = false,
  showAlert,
  sticky,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [scrollContainer, footerElementRef] = useScrollContainer();
  const shadowPosition = useScrollShadows(sticky ? scrollContainer : null);
  return (
    <div
      className={cx("ocs-form-footer", {
        "ocs-form-footer__sticky": sticky,
        "ocs-form-footer__shadow":
          sticky &&
          (shadowPosition === Shadows.both ||
            shadowPosition === Shadows.bottom),
      })}
      data-test="form-footer"
      ref={footerElementRef}
    >
      <ButtonBar
        inProgress={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
      >
        {showAlert && (
          <Alert
            isInline
            className="co-alert"
            variant="info"
            title={infoTitle || t("You made changes to this page.")}
          >
            {infoMessage ||
              t(
                "Click {{submit}} to save changes or {{reset}} to cancel changes.",
                {
                  submit: submitLabel,
                  reset: resetLabel,
                }
              )}
          </Alert>
        )}
        <ActionList>
          {!hideSubmit && (
            <ActionListItem>
              <Button
                {...(handleSubmit && { onClick: handleSubmit })}
                variant={ButtonVariant.primary}
                isDisabled={disableSubmit}
                data-test-id="submit-button"
                data-test="save-changes"
              >
                {submitLabel || t("Save")}
              </Button>
            </ActionListItem>
          )}
          {handleReset && (
            <ActionListItem>
              <Button
                type="button"
                data-test-id="reset-button"
                variant={ButtonVariant.secondary}
                onClick={handleReset}
              >
                {resetLabel || t("Reload")}
              </Button>
            </ActionListItem>
          )}
          {handleCancel && (
            <ActionListItem>
              <Button
                type="button"
                data-test-id="cancel-button"
                variant={ButtonVariant.secondary}
                onClick={handleCancel}
              >
                {cancelLabel || t("Cancel")}
              </Button>
            </ActionListItem>
          )}
          {handleDownload && (
            <ActionListItem>
              <Button
                type="button"
                data-test-id="download-button"
                variant={ButtonVariant.secondary}
                className="pf-c-button--align-right hidden-sm hidden-xs"
                onClick={handleDownload}
                icon={<DownloadIcon />}
              >
                {t("Download")}
              </Button>
            </ActionListItem>
          )}
        </ActionList>
      </ButtonBar>
    </div>
  );
};
export default FormFooter;
