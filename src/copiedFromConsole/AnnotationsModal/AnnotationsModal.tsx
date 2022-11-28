import * as React from "react";

import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { Button, Grid } from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

import { AnnotationsModalRow } from "./AnnotationsModalRow";

import "./AnnotationsModal.css";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import TabModal from "../TabModal/TabModal";
import { uniqBy, find, clone } from "lodash";

type Annotations = { [key: string]: string };

type AnnotationRowData = {
  key: string;
  value: string;
  id: number;
};

type AnnotationsArray = AnnotationRowData[];

const getAnnotationRowData = (
  key: string,
  value: string
): AnnotationRowData => ({
  key,
  value,
  id: Math.random(),
});

const toAnnotationArray = (
  annotationsObject: Annotations | undefined
): AnnotationsArray => {
  if (!annotationsObject) {
    return [getAnnotationRowData("", "")];
  }
  return Object.entries(annotationsObject).map(([key, value]) =>
    getAnnotationRowData(key, value)
  );
};

const toAnnotations = (annotationsArray: AnnotationsArray): Annotations => {
  const ret: Annotations = {};
  for (const { key, value } of annotationsArray) {
    if (key === "") {
      continue;
    }
    ret[key] = value;
  }
  return ret;
};

export const AnnotationsModal: React.FC<{
  obj: K8sResourceCommon;
  onSubmit: (annotations: {
    [key: string]: string;
  }) => Promise<void | K8sResourceCommon>;
  isOpen: boolean;
  onClose: () => void;
}> = ({ obj, isOpen, onSubmit, onClose }) => {
  const { t } = useNodeHealthCheckTranslation();

  const [annotations, setAnnotations] = React.useState<AnnotationsArray>([]);

  const onAnnotationAdd = () => {
    setAnnotations([...annotations, getAnnotationRowData("", "")]);
  };

  const onAnnotationsSubmit = () => {
    if (uniqBy(annotations, ({ key }) => key).length !== annotations.length) {
      return Promise.reject({ message: t("Duplicate keys found") });
    }

    const updatedAnnotations = toAnnotations(annotations);

    return onSubmit(updatedAnnotations);
  };

  const onRowChange = (id, key, value) => {
    const rowData = find(annotations, { id });
    if (!rowData) {
      console.error(`Failed to find annotation id of  ${key}: ${value}`);
      return;
    }
    rowData.key = key;
    rowData.value = value;
    setAnnotations(clone(annotations));
  };

  const onDelete = (deleteId) => {
    setAnnotations(annotations.filter(({ id }) => deleteId !== id));
  };

  // reset annotations when modal is closed
  React.useEffect(() => {
    setAnnotations(toAnnotationArray(obj.metadata?.annotations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <TabModal<K8sResourceCommon>
      obj={obj}
      headerText={t("Edit annotations")}
      onSubmit={onAnnotationsSubmit}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Grid hasGutter>
        {annotations.map((curAnnotation) => (
          <AnnotationsModalRow
            key={curAnnotation.id}
            annotation={curAnnotation}
            onChange={({ key, value }) =>
              onRowChange(curAnnotation.id, key, value)
            }
            onDelete={() => onDelete(curAnnotation.id)}
          />
        ))}
        <div className="co-toolbar__group co-toolbar__group--left">
          <Button
            isSmall
            className="pf-m-link--align-left"
            variant="link"
            onClick={() => onAnnotationAdd()}
            icon={<PlusCircleIcon />}
          >
            {t("Add more")}
          </Button>
        </div>
      </Grid>
    </TabModal>
  );
};
