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
import useSnrTemplate from "../../apis/useSNRTemplate";
import { range } from "lodash-es";
import { Flex, FlexItem, PageSection, Skeleton } from "@patternfly/react-core";
export interface NodeHealthCheckProps {
  title: string;
  name: string;
  nodeHealthCheck: NodeHealthCheck;
  isCreateFlow: boolean;
}

const FormLoading = () => (
  <>
    <br />
    {range(0, 20).map((idx) => (
      <>
        <Skeleton key={idx} width="50%" />
        <br />
      </>
    ))}
  </>
);

const LearnMoreLink: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  const [version, loaded, error] = useOpenShiftVersion();
  React.useEffect(() => {
    if (error) {
      console.error(
        `Failed to retrive OCP version for LearnMore link: ${error}`
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
  const [snrTemplate, loaded] = useSnrTemplate();
  const initialValues = React.useMemo(() => {
    if (!loaded) {
      return undefined;
    }
    return getFormValues(nodeHealthCheck, isCreateFlow, snrTemplate);
  }, [isCreateFlow, loaded, nodeHealthCheck, snrTemplate]);

  const navigation = useNodeHealthCheckNavigation();

  const handleSubmit = async (
    values: NodeHealthCheckFormValues,
    actions: FormikHelpers<NodeHealthCheckFormValues>
  ) => {
    try {
      const updatedNodeHealthCheck = getNodeHealthCheck(
        nodeHealthCheck,
        values
      );
      if (isCreateFlow) {
        await k8sCreate({
          model: NodeHealthCheckModel,
          data: updatedNodeHealthCheck,
        });
      } else {
        await k8sUpdate({
          model: NodeHealthCheckModel,
          data: updatedNodeHealthCheck,
          name,
        });
      }
      navigation.gotoDetails(updatedNodeHealthCheck?.metadata?.name);
      return true;
    } catch (e) {
      actions.setStatus({ submitError: e.message });
    }
  };

  return (
    <PageSection variant="light">
      <Flex
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsSm" }}
        style={{
          height: "100%",
        }}
      >
        <FlexItem>
          <PageHeading title={title} helpText={<HelpText />} />
        </FlexItem>
        <FlexItem grow={{ default: "grow" }}>
          {!loaded ? (
            <FormLoading />
          ) : (
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
                snrTemplate={snrTemplate}
              />
            </Formik>
          )}
        </FlexItem>
      </Flex>
    </PageSection>
  );
};

const NodeHealthCheckForm = withFallback(NodeHealthCheckForm__);

export default NodeHealthCheckForm;
