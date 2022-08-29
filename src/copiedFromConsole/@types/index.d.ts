export declare global {
  interface Window {
    monaco: any;
    SERVER_FLAGS: {
      alertManagerBaseURL: string;
      authDisabled: boolean;
      basePath: string;
      branding: string;
      consoleVersion: string;
      customLogoURL: string;
      customProductName: string;
      documentationBaseURL: string;
      kubeAPIServerURL: string;
      kubeAdminLogoutURL: string;
      kubectlClientID: string;
      loadTestFactor: number;
      loginErrorURL: string;
      loginSuccessURL: string;
      loginURL: string;
      logoutRedirect: string;
      logoutURL: string;
      meteringBaseURL: string;
      prometheusBaseURL: string;
      prometheusTenancyBaseURL: string;
      quickStarts: string;
      requestTokenURL: string;
      inactivityTimeout: number;
      statuspageID: string;
      GOARCH: string;
      GOOS: string;
      graphqlBaseURL: string;
      developerCatalogCategories: string;
      userSettingsLocation: string;
      addPage: string; // JSON encoded configuration
      consolePlugins: string[]; // Console dynamic plugins enabled on the cluster
      i18nNamespaces: string[]; // Available i18n namespaces
      projectAccessClusterRoles: string;
      clusters: string[];
      controlPlaneTopology: string;
      telemetry: Record<string, string>;
      releaseVersion: string;
    };
  }
}

module.exports = global;
