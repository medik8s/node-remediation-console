import * as React from "react";
import * as _ from "lodash-es";
import { PencilAltIcon } from "@patternfly/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  FlexItem,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { K8sResourceKind } from "../k8s/types";
import * as classnames from "classnames";
import "./details-item.css";

import { toPath, isEmpty, get } from "lodash-es";

export const PropertyPath = ({ kind, path }) => {
  const pathArray: string[] = toPath(path);
  return (
    <Breadcrumb>
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
      {props.children} <PencilAltIcon />
    </Button>
  );
};

export const DetailsItem: React.FC<DetailsItemProps> = ({
  children,
  defaultValue = "-",
  editAsGroup,
  hideEmpty,
  label,
  obj,
  onEdit,
  canEdit = true,
  path,
  valueClassName,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const hide = hideEmpty && isEmpty(get(obj, path));
  const value: React.ReactNode = children ?? get(obj, path, defaultValue);
  const editable = onEdit && canEdit;
  return hide ? null : (
    <DescriptionListGroup>
      <DescriptionListTerm
        className="nhc-details-term"
        data-test-selector={`details-item-label__${label}`}
      >
        <Flex
          fullWidth={{ default: "fullWidth" }}
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          alignItems={{ default: "alignItemsCenter" }}
        >
          <FlexItem>{label}</FlexItem>
          {editable && editAsGroup && (
            <FlexItem>
              <EditButton testId={label} onClick={onEdit}>
                {t("Edit")}
              </EditButton>
            </FlexItem>
          )}
        </Flex>
      </DescriptionListTerm>
      <DescriptionListDescription
        className={classnames(valueClassName)}
        data-test-selector={`details-item-value__${label}`}
      >
        {editable && !editAsGroup ? (
          <EditButton testId={label} onClick={onEdit}>
            {value}
          </EditButton>
        ) : (
          value
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export type DetailsItemProps = {
  canEdit?: boolean;
  defaultValue?: React.ReactNode;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  label: string;
  labelClassName?: string;
  obj: K8sResourceKind;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path?: string | string[];
  valueClassName?: string;
};

type EditButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
};

DetailsItem.displayName = "DetailsItem";
PropertyPath.displayName = "PropertyPath";
EditButton.displayName = "EditButton";
