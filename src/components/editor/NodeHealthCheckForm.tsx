import * as React from "react";

import { NodeHealthCheckSyncedEditor } from "./NodeHealthCheckSyncedEditor";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";

import { Formik, FormikHelpers } from "formik";

import { k8sCreate, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheckModel } from "data/model";
import { getValidationSchema } from "data/validationSchema";
import { PageHeading } from "copiedFromConsole/utils/headings";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { withFallback } from "copiedFromConsole/error";
import { getFormValues, getNodeHealthCheck } from "data/formValues";
import { LoadingInline } from "copiedFromConsole/utils/status-box";
import "./nhc-form.css";
import { useOpenShiftVersion } from "copiedFromConsole/hooks/useOpenShiftVersion";
export interface NodeHealthCheckProps {
  title: string;
  name: string;
  nodeHealthCheck: NodeHealthCheck;
  isCreateFlow: boolean;
}

const LearnMoreLink: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  const [version, loaded, error] = useOpenShiftVersion();
  React.useEffect(() => {
    if (error) {
      console.error(
        `${t("Failed to retrive OCP version for LearnMore link: ")} ${error}`
      );
    }
  }, [error]);
  if (!loaded) {
    return <LoadingInline />;
  }
  if (error) {
    return null;
  }
  const learnMoreLink = `https://docs.openshift.com/container-platform/${version}/nodes/nodes/eco-node-health-check-operator.html`;
  return (
    <a href={learnMoreLink} target="_blank" rel="noopener noreferrer">
      {t("Learn more")} <ExternalLinkAltIcon />
    </a>
  );
};

const HelpText: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <p>
      {t(
        "NodeHealthChecks define a set of criteria and thresholds to determine the health of a node."
      )}{" "}
      &nbsp;
      <LearnMoreLink />
    </p>
  );
};

const NodeHealthCheckForm__: React.FC<NodeHealthCheckProps> = ({
  name,
  title,
  nodeHealthCheck,
  isCreateFlow,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const initialValues = React.useMemo(
    () => getFormValues(nodeHealthCheck, isCreateFlow),
    []
  );

  const navigation = useNodeHealthCheckNavigation();

  const handleSubmit = async (
    values: NodeHealthCheckFormValues,
    actions: FormikHelpers<NodeHealthCheckFormValues>
  ) => {
    try {
      let resourceCall;

      const updatedNodeHealthCheck: NodeHealthCheck = getNodeHealthCheck(
        nodeHealthCheck,
        values
      );
      if (isCreateFlow) {
        resourceCall = k8sCreate({
          model: NodeHealthCheckModel,
          data: updatedNodeHealthCheck,
        });
      } else {
        resourceCall = k8sUpdate({
          model: NodeHealthCheckModel,
          data: updatedNodeHealthCheck,
          name,
        });
      }
      await resourceCall;
      navigation.gotoDetails(updatedNodeHealthCheck?.metadata?.name);
      return true;
    } catch (e) {
      actions.setStatus({ submitError: e.message });
    }
  };

  return (
    <>
      <PageHeading title={title} helpText={<HelpText />} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={getValidationSchema(t)}
        validateOnMount={true}
      >
        <NodeHealthCheckSyncedEditor
          originalNodeHealthCheck={nodeHealthCheck}
          handleCancel={() => navigation.goBack()}
        />
      </Formik>
    </>
  );
};

const NodeHealthCheckForm = withFallback(NodeHealthCheckForm__);

export default NodeHealthCheckForm;
