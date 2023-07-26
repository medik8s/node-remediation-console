import { TFunction } from "react-i18next";

export const getDurationHelptext = (t: TFunction) =>
  t(
    `Expects a string of decimal numbers each with optional fraction and a unit suffix, eg "300ms", "1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".`
  );
