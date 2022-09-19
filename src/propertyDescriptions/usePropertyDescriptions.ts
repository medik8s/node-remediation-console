import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

export const usePropertyDescriptions = () => {
  const { t } = useNodeHealthCheckTranslation();
  return {
    name: t(
      "Name must be unique. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names"
    ),
    annotations: t(
      "Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations"
    ),
    labels: t(
      "Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: http://kubernetes.io/docs/user-guide/labels"
    ),
    created_at: t(
      "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.\n\nPopulated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata"
    ),
    owner: t(
      "List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller."
    ),
    minHealthy: t(
      "The minimum number or percentage of nodes that has to be healthy for the remediation to start."
    ),
    selector: t(
      "Label selector to match nodes whose health will be exercised. Note: An empty selector will match all nodes."
    ),
  };
};
