import * as React from "react";

import { Action } from "@openshift-console/dynamic-plugin-sdk";
// import { LazyActionMenu } from '@openshift-console/dynamic-plugin-sdk-internal';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { EllipsisVIcon } from "@patternfly/react-icons";

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

  const onToggleClick = () => setIsOpen(!isOpen);

  return (
    <Dropdown
      data-test-id="actions"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      popperProps={{
        position: "right",
      }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) =>
        isKababToggle ? (
          <MenuToggle
            ref={toggleRef}
            aria-label="kebab dropdown toggle"
            variant="plain"
            onClick={onToggleClick}
            isExpanded={isOpen}
          >
            <EllipsisVIcon />
          </MenuToggle>
        ) : (
          <MenuToggle
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
          >
            {t("Actions")}
          </MenuToggle>
        )
      }
    >
      <DropdownList>
        {actions?.map((action) => (
          <DropdownItem
            data-test-id={`${action.id}`}
            key={action?.id}
            onClick={() => handleClick(action)}
            isDisabled={action?.disabled}
            description={action?.description}
            component="button"
          >
            {action?.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default ActionsMenu;
