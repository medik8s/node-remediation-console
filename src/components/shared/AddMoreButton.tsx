import { Button } from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import * as React from "react";

const AddMoreButton: React.FC<{
  onClick: () => void;
  dataTest: string;
}> = ({ onClick, dataTest }) => {
  return (
    <Button
      icon={<PlusCircleIcon />}
      isInline
      onClick={onClick}
      variant="link"
      data-test={dataTest}
    >
      Add more
    </Button>
  );
};

export default AddMoreButton;
