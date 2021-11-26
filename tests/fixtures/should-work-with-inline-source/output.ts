function _nonNull(expr, message = "NonNull assertion failed") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

const a = {
  b: 1,
};
_nonNull(a, "NonNull assertion failed: 'a'").b = 1;
a.b! = 2;

const c = _nonNull(a, "NonNull assertion failed: 'a'").b;

const d = _nonNull(a.b, "NonNull assertion failed: 'a.b'");
