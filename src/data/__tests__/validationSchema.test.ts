import { describe, it, expect } from "vitest";
import { HEALTH_THRESHOLD_REGEX } from "../validationSchema";
import { DURATION_REGEX } from "../formViewValues";

describe("HEALTH_THRESHOLD_REGEX", () => {
  const valid = ["0", "1", "50", "99", "100", "0%", "50%", "100%", "999"];
  const invalid = ["", "-1", "abc", "50.5%", "101%", "%50", "50%%"];

  it.each(valid)("matches valid threshold: %s", (value) => {
    expect(HEALTH_THRESHOLD_REGEX.test(value)).toBe(true);
  });

  it.each(invalid)("rejects invalid threshold: %s", (value) => {
    expect(HEALTH_THRESHOLD_REGEX.test(value)).toBe(false);
  });
});

describe("DURATION_REGEX (single unit)", () => {
  const valid = ["1s", "30m", "1h", "500ms", "100ns", "1.5s", "0.001ms"];
  const invalid = ["", "1", "s", "1d", "1w", "abc", "-1s"];

  it.each(valid)("matches valid duration: %s", (value) => {
    expect(DURATION_REGEX.test(value)).toBe(true);
  });

  it.each(invalid)("rejects invalid duration: %s", (value) => {
    expect(DURATION_REGEX.test(value)).toBe(false);
  });

  it("rejects compound durations (validated by schema regex)", () => {
    expect(DURATION_REGEX.test("1h30m")).toBe(false);
  });
});

describe("validationSchema compound DURATION_REGEX", () => {
  // validationSchema.ts uses /^([0-9]+(\.[0-9]+)?(ns|us|µs|ms|s|m|h))+$/
  // which accepts compound durations like "1h30m". Not exported, so tested inline.
  const COMPOUND_DURATION_REGEX = /^([0-9]+(\.[0-9]+)?(ns|us|µs|ms|s|m|h))+$/;

  const valid = ["1s", "30m", "1h30m", "1h30m10s", "500ms", "1.5s"];
  const invalid = ["", "1", "s", "1d", "abc", "-1s"];

  it.each(valid)("matches valid compound duration: %s", (value) => {
    expect(COMPOUND_DURATION_REGEX.test(value)).toBe(true);
  });

  it.each(invalid)("rejects invalid duration: %s", (value) => {
    expect(COMPOUND_DURATION_REGEX.test(value)).toBe(false);
  });
});
