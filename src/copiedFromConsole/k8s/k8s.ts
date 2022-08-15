import { K8sModel } from "@openshift-console/dynamic-plugin-sdk";

export const nameForModel = (model: K8sModel) =>
  [model.plural, model.apiGroup].join(".");
