import { Button } from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import * as React from "react";

const AddMoreButton: React.FC<{
  children?: React.ReactNode;
  onClick: () => void;
  dataTest: string;
}> = ({ children, onClick, dataTest }) => {
  return (
    <Button
      icon={<PlusCircleIcon />}
      isInline
      onClick={onClick}
      variant="link"
      data-test={dataTest}
    >
      {children ?? "Add more"}
    </Button>
  );
};

export default AddMoreButton;
