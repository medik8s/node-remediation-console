import { describe, it, expect } from "vitest";
import { ParseErrorCode, throwParseError, isParseError } from "../parseErrors";

describe("throwParseError", () => {
  it("throws an object with parseErrorCode and message", () => {
    try {
      throwParseError(ParseErrorCode.INVALID_NODE_SELECTOR, "bad selector");
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toEqual({
        parseErrorCode: ParseErrorCode.INVALID_NODE_SELECTOR,
        message: "bad selector",
      });
    }
  });
});

describe("isParseError", () => {
  it("returns true for valid parse errors", () => {
    expect(
      isParseError({
        parseErrorCode: ParseErrorCode.MATCH_EXPRESSION_UNSUPPORTED,
        message: "test",
      })
    ).toBe(true);
  });

  it("returns false for null", () => {
    expect(isParseError(null)).toBe(false);
  });

  it("returns false for plain Error", () => {
    expect(isParseError(new Error("test"))).toBe(false);
  });

  it("returns false for object with wrong code", () => {
    expect(isParseError({ parseErrorCode: 999, message: "test" })).toBe(false);
  });
});
