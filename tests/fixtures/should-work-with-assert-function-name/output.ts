function _foo(expr, message = "NonNull assertion failed") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

const a = {
  b: 1,
};
_foo(a).b = 1;
a.b! = 2;

const c = _foo(a).b;

const d = _foo(a.b);
