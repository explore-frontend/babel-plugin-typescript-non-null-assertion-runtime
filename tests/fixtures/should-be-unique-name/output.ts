function _foo7(expr, message = "NonNull assertion failed") {
  if (expr === undefined || expr === null) {
    throw new Error(message);
  }

  return expr;
}

if (Math.random() < 1) {
  const foo = 1;
  const _foo = 1;
  const _foo2 = 1;
  const __foo = 1;
}

_foo7(undefined);

class _foo4 {
  _foo3 = 1;
}

const _foo3 = 2;

function _foo5() {
  const _foo6 = 42;
}
