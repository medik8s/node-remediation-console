import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Form,
  Page,
  PageSection,
  Split,
  SplitItem,
  Text,
} from "@patternfly/react-core";
import { Meta, StoryObj } from "@storybook/react";
import { Formik, useFormikContext } from "formik";
import * as React from "react";
import { RemediationTemplate } from "../../../../data/types";
import RemediationTemplateField from "./RemediationTemplateField";

const mockSnrRemdiatorResult: [RemediationTemplate, boolean] = [
  {
    apiVersion: "v1",
    kind: "SnrTemplate",
    name: "snr-template-resource-deletion",
    namespace: "openshift-operators",
  },
  true,
];

type FormWrapperProps = {
  children: React.ReactNode;
  initialValues?: unknown;
  validationSchema?: unknown;
};
function replacer(_: string, value: unknown) {
  // Filtering out properties
  if (value instanceof File) {
    return {
      size: value.size,
      name: value.name,
      type: value.type,
    };
  }
  return value;
}

const FormValues: React.FC = () => {
  const { values } = useFormikContext();
  return (
    <Card isFlat>
      <CardBody>
        <Text component="h5">Form State</Text>
        <CodeBlock>
          <CodeBlockCode>{JSON.stringify(values, replacer, 2)}</CodeBlockCode>
        </CodeBlock>
      </CardBody>
    </Card>
  );
};

export const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  initialValues,
  validationSchema,
}) => (
  <Page>
    <PageSection variant="light" isFilled isWidthLimited isCenterAligned>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
        }}
      >
        {({ handleSubmit, handleReset, isSubmitting }) => (
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <Split>
              <SplitItem>{children}</SplitItem>
              <SplitItem>
                <FormValues />
              </SplitItem>
            </Split>
            <ActionGroup>
              <Button variant="primary" type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
              <Button variant="link" type="reset">
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        )}
      </Formik>
    </PageSection>
  </Page>
);

const RemediatorsArrayFieldWrapper = () => {
  return (
    <FormWrapper initialValues={{ formData: { useEscalating: true } }}>
      <RemediationTemplateField snrTemplateResult={mockSnrRemdiatorResult} />
    </FormWrapper>
  );
};

const meta: Meta<typeof RemediatorsArrayFieldWrapper> = {
  title: "RemediatorsArrayField",
  component: RemediatorsArrayFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof RemediatorsArrayFieldWrapper>;

export const CustomRemediator: Story = {
  args: {},
};
