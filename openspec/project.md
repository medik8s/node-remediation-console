# Project Context

## Purpose
This project is an OpenShift Console dynamic plugin that provides a user-friendly UI for managing NodeHealthCheck Custom Resource Definitions (CRDs) in Kubernetes/OpenShift clusters. The plugin enables users to create, edit, view, and manage NodeHealthCheck resources through form-based and YAML-based editors. It integrates with the [NodeHealthCheck Operator](https://github.com/medik8s/node-healthcheck-operator) to provide node remediation capabilities.

## Tech Stack
- **TypeScript** (4.7.4) - Primary language
- **React** (17.0.2) - UI framework
- **OpenShift Console Dynamic Plugin SDK** (1.4.0) - Plugin infrastructure and Kubernetes resource management
- **PatternFly React** (5.2.2) - UI component library
- **Formik** (2.2.9) - Form management
- **Yup** (0.32.11) - Form validation
- **Webpack** (5.97.1) - Module bundling
- **i18next** (21.8.14) - Internationalization
- **js-yaml** (4.1.0) - YAML parsing/stringification
- **Node.js** (>=22.x) - Runtime environment
- **Yarn** (1.22.22) - Package manager

## Project Conventions

### Code Style
- **TypeScript**: Primary language with type safety (strict mode disabled, but type checking enabled)
- **Linting**: ESLint with TypeScript, React, and Prettier integration
- **Formatting**: Prettier for consistent code formatting
- **Naming Conventions**:
  - PascalCase for types, interfaces, and React components
  - camelCase for functions and variables
  - Use `Record<string, unknown>` instead of `{}` for object types
- **Import Restrictions**: Use `useNodeHealthCheckTranslation` hook instead of direct `useTranslation` from react-i18next
- **React Rules**: 
  - Self-closing components required
  - React hooks rules enforced
  - Prop-types disabled (using TypeScript for type checking)

### Architecture Patterns
- **Plugin Architecture**: Built as an OpenShift Console dynamic plugin that extends the console UI
- **Component-Based**: React functional components with hooks
- **Data Fetching**: Uses OpenShift Console SDK's `useK8sWatchResource` and `useK8sWatchResources` hooks for Kubernetes resource management
- **Form Management**: Formik for form state and validation with Yup schemas
- **Dual Editor Support**: Both form-based and YAML-based editors for resource creation/editing
- **Error Handling**: Custom error boundaries and fallback components (from `copiedFromConsole/error`)
- **Code Reuse**: Shared utilities and components copied from OpenShift Console (`copiedFromConsole/`)
- **Internationalization**: i18next with custom translation hook (`useNodeHealthCheckTranslation`)

### Git Workflow
- Repository: `git@github.com/medik8s/node-remediation-console.git`
- License: Apache-2.0
- Uses OpenSpec for spec-driven development (see `openspec/AGENTS.md`)

## Domain Context
- **NodeHealthCheck CRD**: Kubernetes Custom Resource Definition for managing node health checks and remediation
- **Node Remediation**: Process of automatically remediating unhealthy nodes in a Kubernetes cluster
- **Remediation Templates**: Templates that define how to remediate nodes. Common remediation operators include:
  - [Self Node Remediation](https://github.com/medik8s/self-node-remediation) - Software-based node rebooting
  - [Fence Agents Remediation](https://github.com/medik8s/fence-agents-remediation) - BMC/IPMI-based power cycling
  - [Machine Deletion Remediation](https://github.com/medik8s/machine-deletion-remediation) - Machine resource deletion/recreation for OpenShift/ClusterAPI
- **Unhealthy Conditions**: Node conditions that trigger remediation (Ready, MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable)
- **OpenShift Console Integration**: Plugin extends the OpenShift web console, accessible via Compute -> NodeHealthChecks
- **Operator Dependency**: Requires [NodeHealthCheck Operator](https://github.com/medik8s/node-healthcheck-operator) to be installed in the cluster for full functionality

## Important Constraints
- **OpenShift Console SDK Version**: Requires `@console/pluginAPI >=4.16.0-0`
- **Node.js Version**: Requires Node.js >=22.x
- **Cluster Access**: Development requires access to an OpenShift cluster via `oc` CLI
- **Container Platform**: Docker or Podman 3.2.0+ required for local console development
- **Image Registry**: Deployment requires pushing images to a container registry (e.g., quay.io)
- **Plugin Registration**: Plugin must be registered in the cluster console configuration
- **API Communication**: All frontend-backend communication MUST go through REST APIs (per user rules)

## External Dependencies
- **OpenShift Console**: Host application that loads and runs the plugin
- **NodeHealthCheck Operator**: Kubernetes operator that manages NodeHealthCheck CRDs and remediation logic
- **Kubernetes API**: For CRUD operations on NodeHealthCheck resources and related CRDs
- **Remediation Operators**: Various operators that provide remediation templates (MachineHealthRemediation, SelfNodeRemediation, etc.)
- **Container Registry**: For storing and distributing plugin container images (e.g., quay.io)

## Related Repositories
This project is part of the Medik8s ecosystem for Kubernetes node health management and remediation. Related repositories include:

- **[Node Healthcheck Operator](https://github.com/medik8s/node-healthcheck-operator)**: The core operator that monitors node health conditions and triggers remediation based on NodeHealthCheck CRD configurations. This console plugin provides the UI for managing these CRDs.

- **[Self Node Remediation](https://github.com/medik8s/self-node-remediation)**: A remediation operator that provides software-based node rebooting capabilities. Nodes can self-remediate by rebooting themselves when health checks fail.

- **[Fence Agents Remediation](https://github.com/medik8s/fence-agents-remediation)**: A remediation operator that uses fence agents (via BMC/IPMI) to power cycle unhealthy nodes. Useful for bare metal and virtualized environments with out-of-band management capabilities.

- **[Machine Deletion Remediation](https://github.com/medik8s/machine-deletion-remediation)**: A remediation operator for OpenShift/ClusterAPI environments that remediates unhealthy nodes by deleting and recreating Machine resources, triggering automatic node replacement.
