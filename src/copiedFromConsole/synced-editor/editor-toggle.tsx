import * as React from "react";
import { Flex, Radio } from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import "./styles.scss";

export enum EditorType {
  Form = "form",
  YAML = "yaml",
}

export const EditorToggle: React.FC<EditorToggleProps> = ({
  value,
  onChange,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const handleChange = (
    event: React.FormEvent<HTMLInputElement>,
    _checked: boolean
  ) => {
    onChange(event?.currentTarget?.value as EditorType);
  };
  return (
    <div className="co-synced-editor__editor-toggle">
      <Flex
        spaceItems={{ default: "spaceItemsMd" }}
        alignItems={{ default: "alignItemsCenter" }}
        role="radiogroup"
        aria-labelledby="radio-group-title-editor-toggle"
      >
        <label
          className="co-synced-editor__editor-toggle-label"
          id="radio-group-title-editor-toggle"
        >
          {t("Configure via:")}
        </label>
        <Radio
          isChecked={value === EditorType.Form}
          name={EditorType.Form}
          onChange={handleChange}
          label={t("Form view")}
          id={EditorType.Form}
          value={EditorType.Form}
        />
        <Radio
          isChecked={value === EditorType.YAML}
          name={EditorType.YAML}
          onChange={handleChange}
          label={t("YAML view")}
          id={EditorType.YAML}
          value={EditorType.YAML}
          data-test={`${EditorType.YAML}-view-input`}
        />
      </Flex>
    </div>
  );
};

type EditorToggleProps = {
  value: EditorType;
  onChange?: (newValue: EditorType) => void;
};
