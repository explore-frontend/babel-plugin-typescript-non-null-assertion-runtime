function _nonNull(expr, message = "bar") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

const a = {
  b: 1,
};
_nonNull(a).b = 1;
a.b! = 2;

const c = _nonNull(a).b;

const d = _nonNull(a.b);
