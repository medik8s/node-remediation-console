import * as _ from "lodash-es";
import * as React from "react";
import { Helmet } from "react-helmet";
import { Trans } from "react-i18next";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Stack,
  StackItem,
  Title,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { global_danger_color_100 as globalDangerColor100 } from "@patternfly/react-tokens";
import { ErrorBoundaryFallbackProps } from "../error/error-boundary";
import { PageHeading } from "./headings";
import { ExpandCollapse } from "./expand-collapse";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const getMessage = (type: string, id: string): string => {
  // User messages for error_types returned in auth.go
  const { t } = useNodeHealthCheckTranslation();
  const messages = {
    auth: {
      /* eslint-disable camelcase */
      oauth_error: t(
        "There was an error generating OAuth client from OIDC client."
      ),
      login_state_error: t("There was an error generating login state."),

      cookie_error: t("There was an error setting login state cookie"),

      missing_code: t("Auth code is missing in query param."),
      missing_state: t("There was an error parsing your state cookie"),
      invalid_code: t(
        "There was an error logging you in. Please log out and try again."
      ),
      invalid_state: t(
        "There was an error verifying your session. Please log out and try again."
      ),
      logout_error: t("There was an error logging you out. Please try again."),
      /* eslint-enable camelcase */
      default: t(
        "There was an authentication error with the system. Please try again or contact support."
      ),
    },
  };

  return (
    _.get(messages, `${type}.${id}`) || _.get(messages, `${type}.default`) || ""
  );
};
export const getQueryArgument = (arg: string) =>
  new URLSearchParams(window.location.search).get(arg);

const urlMessage = () => {
  const type = getQueryArgument("error_type");
  const error = getQueryArgument("error");
  return type && error ? getMessage(type, error) : "";
};

const ErrorComponent: React.SFC<ErrorComponentProps> = ({ title, message }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <>
      <PageHeading title={t("Error")} />
      <div className="co-m-pane__body" data-test-id="error-page">
        <PageHeading title={title} />
        {message && <div className="pf-u-text-align-center">{message}</div>}
      </div>
    </>
  );
};

export const ErrorPage: React.SFC<ErrorPageProps> = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <div>
      <Helmet>
        <title>{t("Error")}</title>
      </Helmet>
      <ErrorComponent
        title={t("Oh no! Something went wrong.")}
        message={urlMessage()}
      />
    </div>
  );
};

export const ErrorPage404: React.FC<ErrorPage404Props> = (props) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <div>
      <Helmet>
        <title>{t("Page Not Found (404)")}</title>
      </Helmet>
      <ErrorComponent
        title={t("404: Page Not Found")}
        message={props.message}
      />
    </div>
  );
};

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = (
  props
) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <div className="co-m-pane__body">
      <PageHeading title={t("Oh no! Something went wrong.")} />
      <ExpandCollapse
        textCollapsed={t("Show details")}
        textExpanded={t("Hide details")}
      >
        <h3 className="co-section-heading-tertiary">{props.title}</h3>
        <div className="form-group">
          <label htmlFor="description">{t("Description:")}</label>
          <p>{props.errorMessage}</p>
        </div>
        <div className="form-group">
          <label htmlFor="componentTrace">{t("Component trace:")}</label>
        </div>
        <div className="form-group">
          <label htmlFor="stackTrace">{t("Stack trace:")}</label>
        </div>
      </ExpandCollapse>
    </div>
  );
};

export type ErrorComponentProps = {
  title: string;
  message?: string;
};

export type ErrorPageProps = {};
export type ErrorPage404Props = Omit<ErrorComponentProps, "title">;

export const ErrorState: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  const DangerIcon = () => (
    <ExclamationCircleIcon color={globalDangerColor100.value} size="sm" />
  );
  return (
    <EmptyState variant="xs">
      <EmptyStateIcon variant="container" component={DangerIcon} />
      <Title headingLevel="h6">{t("Something went wrong")}</Title>
      <EmptyStateBody>
        <Stack>
          <StackItem>
            {t("There was a problem processing the request. Please try again.")}
          </StackItem>
          <StackItem>
            <Trans t={t}>
              If the problem persists, contact{" "}
              <a href="https://access.redhat.com/support">Red Hat Support</a> or
              check our <a href="https://status.redhat.com">status page</a> for
              known outages.
            </Trans>
          </StackItem>
        </Stack>
      </EmptyStateBody>
    </EmptyState>
  );
};
