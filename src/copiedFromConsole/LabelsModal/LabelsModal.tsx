import * as React from "react";
import TagsInput from "react-tagsinput";

import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { Label as PFLabel, Stack, StackItem } from "@patternfly/react-core";

import { isLabelValid, labelsArrayToObject, labelsToArray } from "./utils";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import TabModal from "../TabModal/TabModal";
import "./labels-modal.css";

type LabelsModalProps = {
  isOpen: boolean;
  obj: K8sResourceCommon;
  labelClassName?: string;
  onLabelsSubmit: (labels: {
    [key: string]: string;
  }) => Promise<void | K8sResourceCommon>;
  onClose: () => void;
};

export const LabelsModal: React.FC<LabelsModalProps> = React.memo(
  ({ isOpen, obj, labelClassName, onLabelsSubmit, onClose }) => {
    const { t } = useNodeHealthCheckTranslation();
    const [inputValue, setInputValue] = React.useState("");
    const [isInputValid, setIsInputValid] = React.useState(true);
    const [labels, setLabels] = React.useState<string[]>(
      labelsToArray(obj?.metadata?.labels || {})
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === "") {
        setInputValue(value);
        setIsInputValid(true);
        return;
      }
      setInputValue(value);
      setIsInputValid(isLabelValid(value));
    };

    const handleLabelsChange = (newLabels: string[], changed: string[]) => {
      const newLabel = changed[0];
      if (!isLabelValid(newLabel)) {
        setIsInputValid(false);
        return;
      }

      // duplicate labels
      if (newLabels.filter((l) => l === newLabel).length > 1) {
        setIsInputValid(false);
        return;
      }

      // if key exists, overwrite value
      if (
        newLabels.filter((l) => l.split("=")[0] === newLabel.split("=")[0])
          .length > 1
      ) {
        const filteredLabels = newLabels.filter(
          (l) => l.split("=")[0] !== newLabel.split("=")[0]
        );
        setLabels([...filteredLabels, newLabel]);
        setInputValue("");
        return;
      }

      setLabels(newLabels);
      setInputValue("");
    };

    const renderTag = ({ tag, key, onRemove, getTagDisplayValue }) => {
      return (
        <PFLabel
          className={"tag-item-content".concat(labelClassName || "")}
          key={key}
          onClose={() => onRemove(key)}
          textMaxWidth="16ch"
        >
          {getTagDisplayValue(tag)}
        </PFLabel>
      );
    };

    // reset labels when modal is closed
    React.useEffect(() => {
      if (obj?.metadata?.labels) {
        setLabels(labelsToArray(obj?.metadata?.labels || {}));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const inputProps = {
      autoFocus: true,
      className: "input".concat(isInputValid ? "" : " invalid-tag"),
      onChange: onInputChange,
      placeholder: labels.length === 0 ? "app=frontend" : "",
      spellCheck: "false",
      value: inputValue,
      id: "tags-input",
      ["data-test"]: "tags-input",
    };

    // Keys that add tags: Enter
    const addKeys = [13];
    // Backspace deletes tags, but not if there is text being edited in the input field
    const removeKeys = inputValue.length ? [] : [8];

    return (
      <TabModal
        obj={obj}
        headerText={t("Edit labels")}
        onSubmit={() => onLabelsSubmit(labelsArrayToObject(labels))}
        isOpen={isOpen}
        onClose={onClose}
      >
        <Stack hasGutter>
          <StackItem>
            {t(
              "Labels help you organize and select resources. Adding labels below will let you query for objects that have similar, overlapping or dissimilar labels."
            )}
          </StackItem>
          <StackItem>
            <div className="nhc-details--labels__input pf-c-form-control">
              <tags-input>
                <TagsInput
                  className="tags"
                  value={labels}
                  addKeys={addKeys}
                  removeKeys={removeKeys}
                  inputProps={inputProps}
                  renderTag={renderTag}
                  onChange={handleLabelsChange}
                  addOnBlur
                />
              </tags-input>
            </div>
          </StackItem>
        </Stack>
      </TabModal>
    );
  }
);

// console is declaring a new html element for some reason, we have to copy it for css reasons.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "tags-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
