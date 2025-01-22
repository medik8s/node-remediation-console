import * as React from "react";

import { Button, GridItem, TextInput } from "@patternfly/react-core";
import { MinusCircleIcon } from "@patternfly/react-icons";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

export const AnnotationsModalRow: React.FC<{
  annotation: { key: string; value: string };
  onChange: ({ key, value }: { key: string; value: string }) => void;
  onDelete: () => void;
}> = React.memo(({ annotation, onChange, onDelete }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <>
      <GridItem span={5}>
        <TextInput
          autoFocus
          maxLength={255}
          className="nhc-annotation-form__input"
          size={1}
          placeholder={t("annotation key")}
          isRequired
          type="text"
          value={annotation.key}
          onChange={(_, newKey) => onChange({ ...annotation, key: newKey })}
          aria-label={t("annotation key")}
        />
      </GridItem>
      <GridItem span={5}>
        <TextInput
          maxLength={255}
          className="nhc-annotation-form__input"
          placeholder={t("annotation value")}
          isRequired
          type="text"
          value={annotation.value}
          onChange={(_, newValue) =>
            onChange({ ...annotation, value: newValue })
          }
          aria-label={t("annotation value")}
        />
      </GridItem>
      <GridItem span={2}>
        <Button onClick={() => onDelete()} variant="plain">
          <MinusCircleIcon />
        </Button>
      </GridItem>
    </>
  );
});
AnnotationsModalRow.displayName = "AnnotationModalRow";
