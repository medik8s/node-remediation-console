import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const NotAvailable: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  return <span>{t("N/A")}</span>;
};

export default NotAvailable;
