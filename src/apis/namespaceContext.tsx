// import {
//   K8sResourceCommon,
//   useK8sWatchResource,
// } from "@openshift-console/dynamic-plugin-sdk";
// import { K8sResourceKind } from "components/copiedFromConsole/k8s/types";
// import { LoadingBox } from "components/copiedFromConsole/status-box";
// import ErrorState from "components/shared/ErrorState";
// import { namespaceKind } from "data/model";
// import * as React from "react";

// export type NamespacesContextType = {
//   getAllNamespaces(): K8sResourceCommon[];
// };

// export const NamespacesContext =
//   React.createContext<NamespacesContextType | null>(null);

// export const NamespacesContextProvider: React.FC = ({ children }) => {
//   const [namespaces, loading, error] = useK8sWatchResource<K8sResourceKind[]>({
//     isList: true,
//     groupVersionKind: namespaceKind,
//     optional: true,
//   });
//   const namespaceContextData = React.useMemo<NamespacesContextType>(() => {
//     return {
//       getAllNamespaces: () => namespaces,
//     };
//   }, [namespaces]);
//   if (loading) {
//     return <LoadingBox />;
//   }
//   if (error) {
//     return <ErrorState />;
//   }
//   return (
//     <StatuxBox loading={}
//     <NamespacesContext.Provider value={namespaceContextData}>
//       {children}
//     </NamespacesContext.Provider>
//   );
// };

// export const useNamespacesContext = (): NamespacesContextType => {
//   const namespaceContext =
//     React.useContext<NamespacesContextType>(NamespacesContext);
//   if (!namespaceContext) {
//     throw "useNamespaces must be used within NamespacesContextProvider";
//   }
//   return namespaceContext;
// };
