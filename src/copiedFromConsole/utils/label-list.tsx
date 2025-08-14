import * as React from "react";
import { Link } from "react-router-dom";
import * as _ from "lodash-es";
import {
  Label as PfLabel,
  LabelGroup as PfLabelGroup,
} from "@patternfly/react-core";
import { isEqual, map, isEmpty } from "lodash-es";
/* eslint-disable import/named */
import { withTranslation, WithTranslation } from "react-i18next";
/* eslint-enable import/named */
import "./label-list.css";

export const Label: React.FC<LabelProps> = ({ kind, name, value, expand }) => {
  const href = `/search?kind=${kind}&q=${
    value ? encodeURIComponent(`${name}=${value}`) : name
  }`;

  return (
    <>
      <PfLabel isCompact={expand} textMaxWidth="16ch">
        <Link className="pf-c-label__content" to={href}>
          <span data-test="label-key">{name}</span>
          {value && <span>=</span>}
          {value && <span>{value}</span>}
        </Link>
      </PfLabel>
    </>
  );
};

class TranslatedLabelList extends React.Component<LabelListProps> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { labels, kind, t, expand = true } = this.props;
    const list = map(labels, (label, key) => (
      <Label key={key} kind={kind} name={key} value={label} expand={expand} />
    ));

    return (
      <div className="nhc-label-list" data-test="label-list-container">
        {isEmpty(list) ? (
          <div className="text-muted" key="0">
            {t("No labels")}
          </div>
        ) : (
          <PfLabelGroup
            defaultIsOpen={true}
            numLabels={20}
            data-test="label-list"
          >
            {list}
          </PfLabelGroup>
        )}
      </div>
    );
  }
}

export const LabelList = withTranslation()(TranslatedLabelList);

export type LabelProps = {
  kind: string;
  name: string;
  value: string;
  expand: boolean;
};

export type LabelListProps = WithTranslation & {
  labels: { [key: string]: string };
  kind: string;
  expand?: boolean;
};
