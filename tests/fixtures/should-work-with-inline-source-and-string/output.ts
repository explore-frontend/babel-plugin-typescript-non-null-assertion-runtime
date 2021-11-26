function _nonNull(expr, message = "NonNull assertion failed") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

const a = _nonNull("", "NonNull assertion failed: ''''");

const b = _nonNull("", "NonNull assertion failed: '\"\"'");

const c = _nonNull(``, "NonNull assertion failed: '``'");

const d = _nonNull(undefined, "NonNull assertion failed: 'undefined'");
