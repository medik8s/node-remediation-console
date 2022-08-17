import * as React from "react";
import * as _ from "lodash";

import { NodeHealthCheckSyncedEditor } from "./NodeHealthCheckSyncedEditor";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";

import { Formik, FormikHelpers } from "formik";

import {
  k8sCreate,
  k8sUpdate,
  useK8sWatchResource,
} from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheckModel, nodeKind } from "data/model";
import { validationSchema } from "data/validationSchema";
import { PageHeading } from "copiedFromConsole/utils/headings";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { withFallback } from "copiedFromConsole/error";
import { getFormValues, getNodeHealthCheck } from "data/formValues";
import { NodeKind } from "copiedFromConsole/types/node";
import { useSnrTemplatesExist } from "apis/useSNRTemplatesExist";
import { StatusBox } from "copiedFromConsole/utils/status-box";
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
    getFormValues(nodeHealthCheck, isCreateFlow)
  );
  const [allNodes, loaded, loadError] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeKind,
    isList: true,
    namespaced: false,
  });

  const [snrTemplatesLoading, snrTemplatesExist] = useSnrTemplatesExist();

  const navigation = useNodeHealthCheckNavigation();

  const handleSubmit = (
    values: NodeHealthCheckFormValues,
    actions: FormikHelpers<NodeHealthCheckFormValues>
  ) => {
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
      <StatusBox
        loaded={loaded && !snrTemplatesLoading}
        loadError={loadError}
        data={allNodes}
      >
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
                allNodes={allNodes}
                snrTemplatesExist={snrTemplatesExist}
              />
            </>
          )}
        </Formik>
      </StatusBox>
    </>
  );
};

const NodeHealthCheckForm = withFallback(NodeHealthCheckForm__);

export default NodeHealthCheckForm;
