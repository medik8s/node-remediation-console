import * as React from "react";

import { Action } from "@openshift-console/dynamic-plugin-sdk";
// import { LazyActionMenu } from '@openshift-console/dynamic-plugin-sdk-internal';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
} from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

export type ActionsMenuProps = {
  actions: Action[];
  isKababToggle: boolean;
};

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  actions,
  isKababToggle,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (action: Action) => {
    if (typeof action?.cta === "function") {
      action?.cta();
      setIsOpen(false);
    }
  };

  return (
    <Dropdown
      data-test-id="actions"
      isOpen={isOpen}
      position={DropdownPosition.right}
      isPlain={isKababToggle}
      toggle={
        isKababToggle ? (
          <KebabToggle onToggle={setIsOpen} />
        ) : (
          <DropdownToggle onToggle={setIsOpen}>{t("Actions")}</DropdownToggle>
        )
      }
      dropdownItems={actions?.map((action) => (
        <DropdownItem
          data-test-id={`${action.id}`}
          key={action?.id}
          onClick={() => handleClick(action)}
          isDisabled={action?.disabled}
          description={action?.description}
        >
          {action?.label}
        </DropdownItem>
      ))}
    />
  );
};

export default ActionsMenu;
