import {
  Action,
  ResourceIcon,
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
  Title,
  Flex,
  FlexItem,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import ActionsMenu from "./ActionsMenu";
import { isEmpty } from "lodash-es";
import { nodeHealthCheckKind } from "../../data/model";

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
  kind?: string;
  detail?: boolean;
};

export const BreadCrumbs: React.SFC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <Breadcrumb>
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
    kind,
  } = props;

  const hasMenuActions = !isEmpty(menuActions);
  const showBreadcrumbs = breadcrumbs;
  return (
    <>
      <Grid hasGutter>
        <GridItem>
          {showBreadcrumbs && (
            <Split style={{ alignItems: "baseline" }}>
              <SplitItem isFilled>
                <BreadCrumbs breadcrumbs={breadcrumbs} />
              </SplitItem>
            </Split>
          )}
        </GridItem>

        <GridItem>
          <Flex
            alignItems={{ default: "alignItemsCenter" }}
            justifyContent={{ default: "justifyContentSpaceBetween" }}
          >
            <FlexItem>
              <Flex
                alignItems={{ default: "alignItemsCenter" }}
                spaceItems={{ default: "spaceItemsSm" }}
              >
                {kind && (
                  <ResourceIcon groupVersionKind={nodeHealthCheckKind} />
                )}
                <Title
                  headingLevel="h1"
                  size="xl"
                  data-test-id="resource-title"
                >
                  {title}
                </Title>
                {!!statusIcon && (
                  <ResourceStatus>
                    <StatusIconAndText title={statusText} icon={statusIcon} />
                  </ResourceStatus>
                )}
              </Flex>
              {helpText && (
                <TextContent>
                  <Text component={TextVariants.p}>{helpText}</Text>
                </TextContent>
              )}
            </FlexItem>
            {hasMenuActions && (
              <FlexItem>
                <ActionsMenu actions={menuActions} isKababToggle={false} />
              </FlexItem>
            )}
          </Flex>
        </GridItem>
      </Grid>
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
  <Title headingLevel="h2" id={id} style={style}>
    {text}
    {required && <span aria-hidden="true"> *</span>}
    {children}
  </Title>
);

export type SectionHeadingProps = {
  children?: unknown;
  style?: unknown;
  text: string;
  required?: boolean;
  id?: string;
};
