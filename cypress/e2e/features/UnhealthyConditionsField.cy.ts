import { gotoNewNodeHealthCheck } from "../../Routing";
import {
  addUnhealthyCondition,
  clickAddUnhealthyCondition,
  setUnhealthyCondition,
  UnhealthyCondition,
  validateNumUnhealthyConditions,
  validateStatusDisabled,
  validateUnhealthyConditions,
} from "../../views/FormView/UnhealthyConditionsView";
import * as _ from "lodash";

const defaultCondition: UnhealthyCondition = {
  duration: "300s",
  type: "Ready",
  status: "False",
};

const diskPressureCondition: UnhealthyCondition = {
  type: "Disk pressure",
  duration: "200m1s",
  status: "True",
};

const customTypeCondition: UnhealthyCondition = {
  type: "Custom type",
  isCustomType: true,
  status: "True",
  duration: "1.1s",
};

describe("Unhealthy conditions", () => {
  before(() => {
    gotoNewNodeHealthCheck();
  });

  it("should show default unhealthy condition", () => {
    validateUnhealthyConditions([defaultCondition]);
  });

  it("click add more", () => {
    clickAddUnhealthyCondition();
    validateNumUnhealthyConditions(2);
  });

  it("add unhealthy condition and set values", () => {
    addUnhealthyCondition();
    setUnhealthyCondition(2, _.omit(diskPressureCondition, "status"));
    validateStatusDisabled(2);
    validateUnhealthyConditions([
      defaultCondition,
      { duration: "", type: "Ready", status: "False" },
      diskPressureCondition,
    ]);
  });

  it("should set second unhealthy condition with custom type", () => {
    setUnhealthyCondition(1, customTypeCondition);
    validateUnhealthyConditions([
      defaultCondition,
      customTypeCondition,
      diskPressureCondition,
    ]);
  });
});
