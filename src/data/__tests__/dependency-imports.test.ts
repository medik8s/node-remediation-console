import { describe, it, expect } from "vitest";

describe("PatternFly react-core imports", () => {
  it("resolves layout components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.PageSection).toBeDefined();
    expect(mod.Stack).toBeDefined();
    expect(mod.StackItem).toBeDefined();
    expect(mod.Grid).toBeDefined();
    expect(mod.GridItem).toBeDefined();
    expect(mod.Flex).toBeDefined();
    expect(mod.FlexItem).toBeDefined();
    expect(mod.Bullseye).toBeDefined();
  });

  it("resolves form components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.Form).toBeDefined();
    expect(mod.FormGroup).toBeDefined();
    expect(mod.FormSection).toBeDefined();
    expect(mod.TextInput).toBeDefined();
    expect(mod.TextInputTypes).toBeDefined();
    expect(mod.Radio).toBeDefined();
    expect(mod.NumberInput).toBeDefined();
    expect(mod.Checkbox).toBeDefined();
    expect(mod.FormHelperText).toBeDefined();
  });

  it("resolves modal components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.Modal).toBeDefined();
    expect(mod.ModalVariant).toBeDefined();
    expect(mod.ModalHeader).toBeDefined();
    expect(mod.ModalBody).toBeDefined();
    expect(mod.ModalFooter).toBeDefined();
  });

  it("resolves feedback components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.Alert).toBeDefined();
    expect(mod.AlertVariant).toBeDefined();
    expect(mod.Popover).toBeDefined();
    expect(mod.Tooltip).toBeDefined();
  });

  it("resolves select components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.Select).toBeDefined();
    expect(mod.SelectOption).toBeDefined();
    expect(mod.MenuToggle).toBeDefined();
    expect(mod.SelectList).toBeDefined();
    expect(mod.Divider).toBeDefined();
  });

  it("resolves misc components", async () => {
    const mod = await import("@patternfly/react-core");
    expect(mod.Button).toBeDefined();
    expect(mod.ButtonVariant).toBeDefined();
    expect(mod.Label).toBeDefined();
    expect(mod.Title).toBeDefined();
    expect(mod.Content).toBeDefined();
    expect(mod.DescriptionList).toBeDefined();
    expect(mod.EmptyState).toBeDefined();
    expect(mod.ExpandableSection).toBeDefined();
    expect(mod.Icon).toBeDefined();
    expect(mod.List).toBeDefined();
    expect(mod.ListItem).toBeDefined();
  });
});

describe("PatternFly react-icons imports", () => {
  it("resolves status icons", async () => {
    const mod = await import("@patternfly/react-icons");
    expect(mod.CheckCircleIcon).toBeDefined();
    expect(mod.ExclamationCircleIcon).toBeDefined();
    expect(mod.ExclamationTriangleIcon).toBeDefined();
    expect(mod.InfoCircleIcon).toBeDefined();
    expect(mod.HourglassHalfIcon).toBeDefined();
    expect(mod.InProgressIcon).toBeDefined();
  });

  it("resolves action icons", async () => {
    const mod = await import("@patternfly/react-icons");
    expect(mod.PlusCircleIcon).toBeDefined();
    expect(mod.MinusCircleIcon).toBeDefined();
    expect(mod.PencilAltIcon).toBeDefined();
    expect(mod.EllipsisVIcon).toBeDefined();
    expect(mod.DownloadIcon).toBeDefined();
    expect(mod.ExternalLinkAltIcon).toBeDefined();
    expect(mod.SearchIcon).toBeDefined();
    expect(mod.OutlinedQuestionCircleIcon).toBeDefined();
  });
});

describe("PatternFly react-table imports", () => {
  it("resolves table components and utilities", async () => {
    const mod = await import("@patternfly/react-table");
    expect(mod.Table).toBeDefined();
    expect(mod.Thead).toBeDefined();
    expect(mod.Tbody).toBeDefined();
    expect(mod.Tr).toBeDefined();
    expect(mod.Th).toBeDefined();
    expect(mod.Td).toBeDefined();
    expect(mod.sortable).toBeDefined();
    expect(mod.SortByDirection).toBeDefined();
  });
});

describe("PatternFly react-tokens imports", () => {
  it("resolves design tokens used in the project", async () => {
    const mod = await import("@patternfly/react-tokens");
    expect(mod.t_global_icon_color_status_info_default).toBeDefined();
    expect(mod.t_global_text_color_link_default).toBeDefined();
    expect(mod.t_global_color_status_danger_100).toBeDefined();
  });
});

describe("react-router imports", () => {
  it("resolves navigation hooks and components", async () => {
    const mod = await import("react-router");
    expect(mod.useNavigate).toBeDefined();
    expect(mod.useLocation).toBeDefined();
    expect(mod.Link).toBeDefined();
  });
});
