export enum ParseErrorCode {
  MATCH_EXPRESSION_UNSUPPORTED = 0,
  INVALID_UNHEALTHY_CONDITIONS = 1,
  INVALID_NODE_SELECTOR = 2,
}

export type ParseError = {
  parseErrorCode: ParseErrorCode;
  message: string;
};

export const throwParseError = (
  parseErrorCode: ParseErrorCode,
  message: string
) => {
  const parseError: ParseError = {
    parseErrorCode,
    message,
  };

  throw parseError;
};

export const isParseError = (error: unknown): error is ParseError =>
  typeof error === "object" &&
  Object.values(ParseErrorCode).includes(error["parseErrorCode"]);
