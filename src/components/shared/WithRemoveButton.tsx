import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { MinusCircleIcon } from "@patternfly/react-icons";
import * as React from "react";
import "./WithRemoveButton.css";

export const WithRemoveButton = ({
  children,
  isDisabled,
  onClick,
  direction = "row",
  grow = true,
}: {
  children: React.ReactNode;
  isDisabled: boolean;
  grow?: boolean;
  direction?: "column" | "columnReverse" | "row" | "rowReverse";
  onClick: () => void;
}) => {
  return (
    <Flex direction={{ default: direction }}>
      <FlexItem
        grow={grow ? { default: "grow" } : undefined}
        spacer={{ default: "spacerSm" }}
      >
        {children}
      </FlexItem>
      <FlexItem id="remove-button">
        <Button
          type="button"
          variant="plain"
          onClick={onClick}
          isDisabled={isDisabled}
        >
          <MinusCircleIcon />
        </Button>
      </FlexItem>
    </Flex>
  );
};
