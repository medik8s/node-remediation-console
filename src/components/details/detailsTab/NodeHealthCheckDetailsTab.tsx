import {
  PageComponentProps,
  useAccessReview,
} from "@openshift-console/dynamic-plugin-sdk";
import { Grid, GridItem, PageSection } from "@patternfly/react-core";
import { SectionHeading } from "copiedFromConsole/utils/headings";
import { Loading } from "copiedFromConsole/utils/status-box";
import { NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { DetailsLeftPane } from "./DetailsLeftPane";
import { DetailsRightPane } from "./DetailsRightPane";
import { UnhealthyConditionsTable } from "./UnhealthyConditionsTable";

const NodeHealthCheckDetailsTab: React.FC<
  PageComponentProps<NodeHealthCheck>
> = ({ obj: nodeHealthCheck }) => {
  const [canUpdateAccess, loading] = useAccessReview({
    group: NodeHealthCheckModel.apiGroup,
    resource: NodeHealthCheckModel.plural,
    verb: "patch",
    name: nodeHealthCheck.metadata?.name,
  });

  const { t } = useNodeHealthCheckTranslation();
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <PageSection variant="light">
        <Grid hasGutter>
          <SectionHeading text={t("NodeHealthCheck details")} />
          <GridItem span={5}>
            <DetailsLeftPane
              resource={nodeHealthCheck}
              canEdit={!loading && canUpdateAccess}
            />
          </GridItem>
          <GridItem span={1} />
          <GridItem span={5}>
            <DetailsRightPane nodeHealthCheck={nodeHealthCheck} />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection variant="light">
        <SectionHeading text={t("Unhealthy Conditions")} />
        <UnhealthyConditionsTable nodeHealthCheck={nodeHealthCheck} />
      </PageSection>
    </>
  );
};

export default NodeHealthCheckDetailsTab;
