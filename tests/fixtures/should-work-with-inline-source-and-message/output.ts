function _nonNull(expr, message = "bar") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

const a = _nonNull("", "bar: ''''");

const b = _nonNull("", "bar: '\"\"'");

const c = _nonNull(``, "bar: '``'");

const d = _nonNull(undefined, "bar: 'undefined'");
