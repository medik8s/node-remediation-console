import * as React from "react";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import EditPauseReasonsModal from "./EditPauseReasonsModal";
import { NodeHealthCheckModalProps } from "./propTypes";

const EditPauseModal: React.FC<NodeHealthCheckModalProps> = ({
  nodeHealthCheck,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <EditPauseReasonsModal
      title={t("Edit pause reasons")}
      failureErrorMessage={t("Failed to edit pause reasons")}
      confirmButtonText="Save"
      initialPauseReasons={nodeHealthCheck.spec?.pauseRequests || []}
      nodeHealthCheck={nodeHealthCheck}
      {...props}
    />
  );
};

export default EditPauseModal;
