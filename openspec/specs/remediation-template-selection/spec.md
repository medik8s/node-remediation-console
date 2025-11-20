# remediation-template-selection Specification

## Purpose
The system SHALL provide functionality for selecting a remediation template by choosing both the template kind and a specific instance of that kind. The remediation template consists of an apiVersion, kind, name, and namespace, which together uniquely identify a remediation template resource in the Kubernetes cluster.
## Requirements
### Requirement: Remediation Template Kind Selection
The system SHALL provide a select dropdown for choosing a remediation template kind from predefined options or a custom kind. The select field SHALL be a plain dropdown (not a typeahead/search field) that displays all predefined remediation template kinds. The dropdown SHALL include a "Use custom kind" option separated by a divider that opens a dialog for entering a custom kind name. When a predefined kind is selected, the system SHALL automatically set the apiVersion for that kind. When a kind is selected, the system SHALL store it at `.template.kind` and the apiVersion at `.template.apiVersion` (for predefined kinds).

#### Scenario: User views kind dropdown
- **WHEN** user views the remediation template kind field
- **THEN** a plain select dropdown is displayed (not a typeahead/search field)
- **AND** all predefined remediation template kinds are shown as options
- **AND** a "Use custom kind" option is shown below a divider

#### Scenario: User selects predefined kind
- **WHEN** user selects a predefined remediation template kind from the dropdown
- **THEN** the selected kind is set as the field value
- **AND** the apiVersion for that kind is automatically set
- **AND** the kind is stored at `.template.kind`
- **AND** the dropdown closes

#### Scenario: Auto-select kind when single operator installed
- **WHEN** exactly one remediation template operator is installed in the cluster
- **AND** the kind field has not been set
- **THEN** the kind is automatically selected
- **AND** the apiVersion is automatically set

### Requirement: Custom Remediation Template Kind Selection
The system SHALL allow users to select a custom remediation template kind that is not in the predefined list. The custom kind selection dialog SHALL provide a select field populated with CustomResourceDefinitions (CRDs) that have `spec.template.spec` in their OpenAPI schema, excluding any CRDs that correspond to predefined remediation template kinds. The dialog SHALL display an explanation of which CRDs are available and why they are shown. When a CRD is selected from the dropdown and the user confirms, the system SHALL automatically populate both the `apiVersion` and `kind` fields. If no CRDs with the required structure are available (excluding predefined kinds), the dialog SHALL display a warning message at the top of the dialog and SHALL keep the select field visible but disabled, and SHALL disable the ability to proceed, as both kind and apiVersion are required and cannot be determined without available CRDs. The warning message SHALL guide users to either select from predefined remediation template kinds or install the required CRD. When CRDs are being fetched, the select field SHALL be visible, disabled, and display "Loading" as placeholder text.

#### Scenario: User selects custom kind
- **WHEN** user clicks on the "Use custom kind" option in the remediation template kind dropdown
- **THEN** a dialog appears with a select field populated with CRDs that have `spec.template.spec` in their schema
- **AND** the dialog excludes any CRDs that correspond to predefined remediation template kinds (SelfNodeRemediationTemplate, FenceAgentsRemediationTemplate, MachineDeletionRemediationTemplate)
- **AND** the dialog displays an explanation of which CRDs are available and why they are shown
- **AND** the dialog has "OK" and "Cancel" buttons
- **AND** while CRDs are being fetched, the select field is visible, disabled, and displays "Loading" as placeholder text

#### Scenario: User selects CRD from dropdown
- **WHEN** user selects a CRD from the dropdown in the custom kind dialog
- **THEN** the selected CRD's kind and apiVersion are prepared for population

#### Scenario: User confirms custom kind with CRD selection
- **WHEN** user selects a CRD from the dropdown in the custom kind dialog
- **AND** user clicks "OK"
- **THEN** the dialog closes
- **AND** the remediation template kind select field is populated with the selected CRD's kind
- **AND** the `apiVersion` field is automatically populated with the selected CRD's apiVersion
- **AND** the kind is stored at `.template.kind`
- **AND** the apiVersion is stored at `.template.apiVersion`

#### Scenario: User cancels custom kind entry
- **WHEN** user clicks "Cancel" in the custom kind dialog
- **THEN** the dialog closes
- **AND** no changes are made to the selected kind

#### Scenario: CRD fetching error
- **WHEN** an error occurs while fetching CRDs from the cluster
- **THEN** the dialog displays an appropriate error message
- **AND** a warning alert is displayed explaining that CRDs could not be loaded
- **AND** the "OK" button is disabled
- **AND** the user cannot proceed without valid CRD information

#### Scenario: No CRDs available
- **WHEN** no CRDs with `spec.template.spec` structure are found in the cluster (excluding predefined kinds)
- **THEN** a warning alert is displayed at the top of the dialog explaining that no remediation template CRDs are available
- **AND** the warning message indicates that users should select from predefined remediation template kinds or install remediation template operators to use custom kinds
- **AND** the select field remains visible but is disabled
- **AND** the select field displays a placeholder indicating no CRDs are available
- **AND** the "OK" button is disabled
- **AND** the user cannot proceed, as both kind and apiVersion are required but cannot be determined without available CRDs

#### Scenario: Predefined kinds filtered from custom dropdown
- **WHEN** predefined remediation template kinds (SelfNodeRemediationTemplate, FenceAgentsRemediationTemplate, MachineDeletionRemediationTemplate) are installed as CRDs in the cluster
- **AND** user opens the custom kind selection dialog
- **THEN** these predefined kinds are not shown in the custom kind dropdown
- **AND** only non-predefined kinds with the remediation template structure are displayed

### Requirement: Remediation Template Instance Selection
The system SHALL provide a select dropdown for choosing a specific instance (name and namespace) of the selected remediation template kind. The instance field SHALL be disabled until a kind is selected. The system SHALL fetch available instances from the cluster based on the selected kind. When an instance is selected, the system SHALL store the name at `.template.name` and namespace at `.template.namespace`, and update the apiVersion at `.template.apiVersion` with the instance's apiVersion. The instance field SHALL display only the instance name (not the namespace) when closed. Each dropdown item SHALL display the instance name as the primary text and the namespace in a description field. The selected item SHALL be visually marked as selected in the dropdown. The dropdown SHALL always include a "Create new instance" option, visually separated from existing instances (e.g., with a divider). When the "Create new instance" option is selected, the system SHALL navigate to the instance creation page in a new tab. The instance field SHALL remain enabled when instances are loaded, even if no instances are available. When an error occurs while loading instances (indicating operator not available), the system SHALL display the operator availability alert (as specified in the Operator Availability Warning requirement) and SHALL disable the instance field with "Error loading instances" as placeholder text. When instances are being fetched, the instance field SHALL be visible, disabled, and display "Loading" as placeholder text.

#### Scenario: User views instance field without kind selected
- **WHEN** no kind is selected
- **THEN** the instance field is disabled
- **AND** displays "No selected Kind" as placeholder

#### Scenario: User views instance field while loading
- **WHEN** a kind is selected
- **AND** instances are being fetched from the cluster
- **THEN** the instance field is visible and disabled
- **AND** the instance field displays "Loading" as placeholder text

#### Scenario: User views instance dropdown items
- **WHEN** user opens the instance dropdown
- **THEN** each item displays the instance name as the primary text
- **AND** each item displays the namespace in a description field
- **AND** the selected item (if any) is visually marked as selected
- **AND** a "Create new instance" option is displayed, visually separated from existing instances (e.g., with a divider)

#### Scenario: User views selected instance in closed state
- **WHEN** an instance is selected
- **AND** the dropdown is closed
- **THEN** the instance field displays only the instance name (not the namespace)

#### Scenario: User selects instance
- **WHEN** user selects an instance from the dropdown
- **THEN** the instance name is stored at `.template.name`
- **AND** the instance namespace is stored at `.template.namespace`
- **AND** the dropdown closes
- **AND** the selected instance name is displayed in the field (without namespace)

#### Scenario: Auto-select instance when single instance available
- **WHEN** exactly one instance exists for the selected kind
- **AND** no instance has been manually selected
- **THEN** the instance is automatically selected
- **AND** the name, namespace, and apiVersion are automatically stored
- **AND** only the instance name is displayed in the field

#### Scenario: Instance cleared when kind changes
- **WHEN** the kind selection changes
- **THEN** the previously selected instance name and namespace are cleared
- **AND** the instance field is reset

#### Scenario: No instances available
- **WHEN** a kind is selected
- **AND** instances are loaded
- **AND** no instances are available for that kind
- **THEN** the instance field is enabled
- **AND** the instance field displays "Select instance" or similar placeholder
- **AND** when the dropdown is opened, only the "Create new instance" option is displayed

#### Scenario: User selects create new instance
- **WHEN** user opens the instance dropdown
- **AND** user selects the "Create new instance" option
- **THEN** the system navigates to the instance creation page for the selected kind
- **AND** the navigation opens in a new tab

#### Scenario: Error loading instances (operator not available)
- **WHEN** an error occurs while fetching instances (indicating operator not available)
- **THEN** a single operator availability alert is displayed on top of the kind selection field
- **AND** the alert uses PatternFly Alert component with variant="danger" and isInline prop
- **AND** for predefined kinds, the alert includes an "Install operator" link
- **AND** for custom kinds, the alert instructs manual installation (no link)
- **AND** the instance field is disabled
- **AND** the instance field displays "Error loading instances" as placeholder text

### Requirement: Remediation Template Display in List and Details Views
The system SHALL display remediation template information in both the NodeHealthCheck list view and details page. When a remediation template is selected (has both name and namespace), the system SHALL display a clickable link to the remediation template resource using the ResourceLink component. When no remediation template is selected or when escalating remediations are used, the system SHALL display the remediation template kind name as text only (no link). The link SHALL navigate to the remediation template resource details page in the OpenShift Console.

#### Scenario: User views remediation template in list view with link
- **WHEN** a NodeHealthCheck has a remediation template selected (has name and namespace)
- **AND** user views the NodeHealthCheck list
- **THEN** the remediator column displays a clickable link to the remediation template resource
- **AND** the link displays the remediation template kind name
- **AND** clicking the link navigates to the remediation template resource details page

#### Scenario: User views remediation template in list view without link
- **WHEN** a NodeHealthCheck has no remediation template selected (missing name or namespace)
- **OR** a NodeHealthCheck uses escalating remediations
- **AND** user views the NodeHealthCheck list
- **THEN** the remediator column displays the remediation template kind name as text only (no link)
- **OR** displays "Escalating remediations" text when escalating remediations are used

#### Scenario: User views remediation template in details page with link
- **WHEN** a NodeHealthCheck has a remediation template selected (has name and namespace)
- **AND** user views the NodeHealthCheck details page
- **THEN** the remediator details item displays a clickable link to the remediation template resource
- **AND** the link displays the remediation template kind name
- **AND** clicking the link navigates to the remediation template resource details page

#### Scenario: User views remediation template in details page without link
- **WHEN** a NodeHealthCheck has no remediation template selected (missing name or namespace)
- **OR** a NodeHealthCheck uses escalating remediations
- **AND** user views the NodeHealthCheck details page
- **THEN** the remediator details item displays the remediation template kind name as text only (no link)
- **OR** displays "Escalating remediations" text when escalating remediations are used

#### Scenario: Link works for predefined remediation template kinds
- **WHEN** a NodeHealthCheck uses a predefined remediation template kind (e.g., SelfNodeRemediationTemplate)
- **AND** the remediation template has name and namespace
- **THEN** the link correctly navigates to the predefined remediation template resource details page

#### Scenario: Link works for custom remediation template kinds
- **WHEN** a NodeHealthCheck uses a custom remediation template kind
- **AND** the remediation template has name and namespace
- **THEN** the link correctly navigates to the custom remediation template resource details page

