import * as React from "react";
import * as _ from "lodash-es";
import { PencilAltIcon } from "@patternfly/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Popover,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { K8sResourceKind } from "../k8s/types";
import * as classnames from "classnames";
import { LinkifyExternal } from "./link";

export const PropertyPath = ({ kind, path }) => {
  const pathArray: string[] = _.toPath(path);
  return (
    <Breadcrumb className="co-breadcrumb">
      <BreadcrumbItem>{kind}</BreadcrumbItem>
      {pathArray.map((property, i) => {
        const isLast = i === pathArray.length - 1;
        return (
          <BreadcrumbItem key={i} isActive={isLast}>
            {property}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

const EditButton: React.FC<EditButtonProps> = (props) => {
  return (
    <Button
      type="button"
      variant="link"
      isInline
      onClick={props.onClick}
      data-test={
        props.testId
          ? `${props.testId}-details-item__edit-button`
          : "details-item__edit-button"
      }
    >
      {props.children}
      <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
    </Button>
  );
};

export const DetailsItem: React.FC<DetailsItemProps> = ({
  children,
  defaultValue = "-",
  description,
  editAsGroup,
  hideEmpty,
  label,
  obj,
  onEdit,
  canEdit = true,
  path,
  resourceKind,
  valueClassName,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const hide = hideEmpty && _.isEmpty(_.get(obj, path));
  const value: React.ReactNode = children || _.get(obj, path, defaultValue);
  const editable = onEdit && canEdit;
  return hide ? null : (
    <>
      <dt
        className="details-item__label"
        data-test-selector={`details-item-label__${label}`}
      >
        <Split>
          <SplitItem>
            {description || path ? (
              <Popover
                headerContent={<div>{label}</div>}
                {...(description && {
                  bodyContent: (
                    <LinkifyExternal>
                      <div className="co-pre-line">{description}</div>
                    </LinkifyExternal>
                  ),
                })}
                {...(path && {
                  footerContent: (
                    <PropertyPath kind={resourceKind} path={path} />
                  ),
                })}
                maxWidth="30rem"
              >
                <Button
                  data-test={label}
                  variant="plain"
                  className="details-item__popover-button"
                >
                  {label}
                </Button>
              </Popover>
            ) : (
              label
            )}
          </SplitItem>
          {editable && editAsGroup && (
            <>
              <SplitItem isFilled />
              <SplitItem>
                <EditButton testId={label} onClick={onEdit}>
                  {t("Edit")}
                </EditButton>
              </SplitItem>
            </>
          )}
        </Split>
      </dt>
      <dd
        className={classnames("details-item__value", valueClassName, {
          "details-item__value--group": editable && editAsGroup,
        })}
      >
        {editable && !editAsGroup ? (
          <EditButton testId={label} onClick={onEdit}>
            {value}
          </EditButton>
        ) : (
          value
        )}
      </dd>
    </>
  );
};

export type DetailsItemProps = {
  canEdit?: boolean;
  defaultValue?: React.ReactNode;
  description?: string;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  label: string;
  labelClassName?: string;
  obj: K8sResourceKind;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path?: string | string[];
  valueClassName?: string;
  resourceKind: string;
};

type EditButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
};

DetailsItem.displayName = "DetailsItem";
PropertyPath.displayName = "PropertyPath";
EditButton.displayName = "EditButton";
