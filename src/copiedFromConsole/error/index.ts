// Default ErrorBoundary usage
export { default as ErrorBoundary } from "./error-boundary";
export * from "./types";

// Packaged, easy to use, fallback options
export { default as ErrorBoundaryPage } from "./fallbacks/ErrorBoundaryPage";

// Custom fallback options
export { default as withFallback } from "./fallbacks/withFallback";
