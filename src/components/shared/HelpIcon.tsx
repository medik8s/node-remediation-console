import * as React from "react";
import classNames from "classnames";
import { Button, Popover } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import "./HelpIcon.css";
type PopoverIconProps = {
  helpText: string;
};

const HelpIcon: React.FC<PopoverIconProps> = ({ helpText }) => (
  <Popover bodyContent={helpText}>
    <Button
      variant="plain"
      onClick={(e) => e.preventDefault()}
      className={classNames("pf-c-form__group-label-help")}
      id="help-icon"
    >
      <OutlinedQuestionCircleIcon noVerticalAlign={false} />
    </Button>
  </Popover>
);

export default HelpIcon;
