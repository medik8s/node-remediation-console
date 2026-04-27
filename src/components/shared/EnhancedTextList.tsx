//a text list that keeps each text in a separate line, shows an ellipsis and a tooltip if the text is too long

import { List, ListItem } from "@patternfly/react-core";
import * as React from "react";
import EllipsisToolTip from "./EllipsisTooltip";
import "./enhanced-text-list.css";

const EnhancedTextList: React.FC<{ textList: string[] }> = ({ textList }) => (
  <List isPlain className="nhc-enhanced-text-list__list">
    {textList.map((text, idx) => (
      <EllipsisToolTip content={text} key={idx}>
        <ListItem className="nhc-enhanced-text-list__list-item">{text}</ListItem>
      </EllipsisToolTip>
    ))}
  </List>
);

export default EnhancedTextList;
