import { Form } from "@patternfly/react-core";
import { Meta, StoryObj } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";
import {
  RemediationTemplate,
  Remediator,
  RemediatorRadioOption,
} from "../../../../data/types";
import RemediatorsArrayField from "./RemediatorsArrayField";

const mockRemediators: Remediator[] = [
  {
    radioOption: RemediatorRadioOption.CUSTOM,
    template: {
      apiVersion: "v1",
      kind: "Pod",
      name: "pod-name",
      namespace: "pod-namespace",
    },
  },
];

const mockSnrRemdiatorResult: [RemediationTemplate, boolean] = [
  {
    apiVersion: "v1",
    kind: "SnrTemplate",
    name: "snr-template-resource-deletion",
    namespace: "openshift-operators",
  },
  true,
];

const RemediatorsArrayFieldWrapper = () => {
  return (
    <Formik
      initialValues={{ formData: { remediators: mockRemediators } }}
      onSubmit={() => {
        console.log("on submit");
      }}
    >
      <div style={{ height: "100vh" }}>
        <Form>
          <RemediatorsArrayField snrTemplateResult={mockSnrRemdiatorResult} />
        </Form>
      </div>
    </Formik>
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
