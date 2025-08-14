import * as React from "react";
import * as classNames from "classnames";
import * as _ from "lodash-es";
import { K8sResourceKindReference } from "@openshift-console/dynamic-plugin-sdk";

export const ResourceIcon: React.SFC<ResourceIconProps> = ({
  className,
  abbr,
  color,
  kindStr,
}) => {
  const backgroundColor = color;
  const iconLabel = abbr;

  const rendered = (
    <>
      <span className="sr-only">{kindStr}</span>
      <span
        title={kindStr}
        style={{ backgroundColor }}
        className={classNames(className)}
      >
        {iconLabel}
      </span>
    </>
  );

  return rendered;
};

export type ResourceIconProps = {
  className?: string;
  color?: string;
  abbr: string;
  kindStr: string;
};

export type ResourceNameProps = {
  kind: K8sResourceKindReference;
  name: string;
};
