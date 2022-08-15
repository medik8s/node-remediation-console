import * as React from "react";
import * as _ from "lodash";

import { NodeHealthCheckSyncedEditor } from "./NodeHealthCheckSyncedEditor";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";

import { Formik, FormikHelpers } from "formik";

import { k8sCreate, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { fromNodeHealthCheck } from "data/fromNodeHealthCheck";
import { toNodeHealthCheck } from "data/toNodeHealthCheck";
import { NodeHealthCheckModel } from "data/model";
import { validationSchema } from "data/validationSchema";
import { PageHeading } from "copiedFromConsole/utils/headings";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { withFallback } from "copiedFromConsole/error";
export interface NodeHealthCheckProps {
  title: string;
  name: string;
  nodeHealthCheck: NodeHealthCheck;
  isCreateFlow: boolean;
}

const LEARN_MORE_LINK =
  "https://docs.openshift.com/container-platform/4.10/nodes/nodes/eco-node-health-check-operator.html";

const HelpText: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <p>
      {t(
        "NodeHealthChecks identify unhealthy nodes and specify the remediation type and strategy to fix them."
      )}{" "}
      &nbsp;
      <a href={LEARN_MORE_LINK} target="_blank" rel="noopener noreferrer">
        {t("Learn more")} <ExternalLinkAltIcon />
      </a>
    </p>
  );
};

const NodeHealthCheckForm__: React.FC<NodeHealthCheckProps> = ({
  name,
  title,
  nodeHealthCheck,
  isCreateFlow,
}) => {
  const [initialValues] = React.useState(
    fromNodeHealthCheck(nodeHealthCheck, isCreateFlow)
  );

  const navigation = useNodeHealthCheckNavigation();

  const handleSubmit = (
    values: NodeHealthCheckFormValues,
    actions: FormikHelpers<NodeHealthCheckFormValues>
  ) => {
    let resourceCall;
    const updatedNodeHealthCheck: NodeHealthCheck = toNodeHealthCheck(
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
    return resourceCall
      .then(() => {
        navigation.gotoDetails(updatedNodeHealthCheck?.metadata?.name);
        return true;
      })
      .catch((e) => {
        actions.setStatus({ submitError: e.message });
      });
  };

  return (
    <>
      <PageHeading title={title} helpText={<HelpText />}></PageHeading>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount={true}
      >
        {(formikProps) => (
          <>
            <NodeHealthCheckSyncedEditor
              originalNodeHealthCheck={nodeHealthCheck}
              handleCancel={navigation.goBack}
              {...formikProps}
            />
          </>
        )}
      </Formik>
    </>
  );
};

const NodeHealthCheckForm = withFallback(NodeHealthCheckForm__);

export default NodeHealthCheckForm;
