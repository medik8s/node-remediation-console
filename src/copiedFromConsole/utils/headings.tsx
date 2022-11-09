import {
  Action,
  ResourceStatus,
  StatusIconAndText,
} from "@openshift-console/dynamic-plugin-sdk";
import { K8sResourceKind } from "../k8s/types";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import ActionsMenu from "./ActionsMenu";
import { ResourceIcon } from "./resource-icon";
import { isEmpty } from "lodash-es";

export type BreadCrumbsProps = {
  breadcrumbs: { name: string; path: string }[];
};

export type PageHeadingProps = {
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactChildren;
  menuActions?: Action[];
  resourceKeys?: string[];
  title?: string | JSX.Element;
  icon?: React.ComponentType<{ obj?: K8sResourceKind }>;
  helpText?: React.ReactNode;
  obj?: K8sResourceKind;
  statusIcon?: React.ReactElement;
  statusText?: string;
  abbr?: string;
  kind?: string;
  detail?: boolean;
};

export const BreadCrumbs: React.SFC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <Breadcrumb className="co-breadcrumb">
    {breadcrumbs.map((crumb, i, { length }) => {
      const isLast = i === length - 1;

      return (
        <BreadcrumbItem key={i} isActive={isLast}>
          {isLast ? (
            crumb.name
          ) : (
            <Link
              className="pf-c-breadcrumb__link"
              to={crumb.path}
              data-test-id={`breadcrumb-link-${i}`}
            >
              {crumb.name}
            </Link>
          )}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

export const PageHeading: React.FC<PageHeadingProps> = (
  props: PageHeadingProps
) => {
  const {
    title,
    menuActions,
    breadcrumbs,
    helpText,
    statusIcon,
    statusText,
    abbr,
    kind,
    detail = true,
  } = props;

  const hasMenuActions = !isEmpty(menuActions);
  const showBreadcrumbs = breadcrumbs;
  return (
    <>
      {showBreadcrumbs && (
        <div className="pf-c-page__main-breadcrumb">
          <Split style={{ alignItems: "baseline" }}>
            <SplitItem isFilled>
              <BreadCrumbs breadcrumbs={breadcrumbs} />
            </SplitItem>
          </Split>
        </div>
      )}
      <div
        className={classNames(
          "co-m-nav-title",
          { "co-m-nav-title--detail": detail },
          { "co-m-nav-title--logo": props.icon },
          { "co-m-nav-title--breadcrumbs": showBreadcrumbs }
        )}
      >
        <Text
          component={TextVariants.h1}
          className={classNames("co-m-pane__heading", {
            "co-m-pane__heading--logo": props.icon,
            "co-m-pane__heading--with-help-text": helpText,
          })}
        >
          <div className="co-m-pane__name co-resource-item">
            {kind && (
              <ResourceIcon
                abbr={abbr}
                kindStr={kind}
                className="co-m-resource-icon--lg"
              />
            )}
            <span
              data-test-id="resource-title"
              className="co-resource-item__resource-name"
            >
              {title}
            </span>
            {!!statusIcon && (
              <ResourceStatus additionalClassNames="hidden-xs">
                <StatusIconAndText title={statusText} icon={statusIcon} />
              </ResourceStatus>
            )}
          </div>
          {hasMenuActions && (
            <div className="co-actions" data-test-id="details-actions">
              <ActionsMenu actions={menuActions} isKababToggle={false} />
            </div>
          )}
        </Text>
        {helpText && (
          <TextContent>
            <Text
              component={TextVariants.p}
              className="help-block co-m-pane__heading-help-text"
            >
              {helpText}
            </Text>
          </TextContent>
        )}
        {props.children}
      </div>
    </>
  );
};

export const SectionHeading: React.SFC<SectionHeadingProps> = ({
  text,
  children,
  style,
  required,
  id,
}) => (
  <h2
    className="co-section-heading"
    style={style}
    data-test-section-heading={text}
    id={id}
  >
    <span
      className={classNames({
        "co-required": required,
      })}
    >
      {text}
    </span>
    {children}
  </h2>
);

export type SectionHeadingProps = {
  children?: any;
  style?: any;
  text: string;
  required?: boolean;
  id?: string;
};
