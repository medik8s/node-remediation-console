import * as React from "react";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import EditPauseReasonsModal from "./EditPauseReasonsModal";
import { NodeHealthCheckModalProps } from "./propTypes";

const PauseModal: React.FC<NodeHealthCheckModalProps> = ({ ...props }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <EditPauseReasonsModal
      title={t("Pause NodeHealthCheck")}
      failureErrorMessage={t("Failed pause")}
      confirmButtonText="Pause"
      initialPauseReasons={[""]}
      {...props}
    />
  );
};

export default PauseModal;
