import { NodeHealthCheck } from "data/types";

export type NodeHealthCheckModalProps = {
  nodeHealthCheck: NodeHealthCheck;
  isOpen: boolean;
  onClose: () => void;
};
