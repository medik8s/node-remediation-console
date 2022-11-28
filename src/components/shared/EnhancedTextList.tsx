//a text list that keeps each text in a separate line, shows an ellipsis and a tooltip if the text is too long

import { TextList, TextListItem } from "@patternfly/react-core";
import * as React from "react";
import EllipsisToolTip from "./EllipsisTooltip";
import "./enhanced-text-list.css";

const EnhancedTextList: React.FC<{ textList: string[] }> = ({ textList }) => (
  <TextList className="nhc--enhanced-text-list__list">
    {textList.map((text) => (
      <EllipsisToolTip content={text}>
        <TextListItem className="nhc-enhanced-text-list__list-item">
          {text}
        </TextListItem>
      </EllipsisToolTip>
    ))}
  </TextList>
);

export default EnhancedTextList;
