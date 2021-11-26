# babel-plugin-typescript-non-null-assertion-runtime

## Summary

TypeScript has [non-null-assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) to assert some expression is not `nullable`.  
But it's a type only feature. Which means nothing will happend if the `non-nullable` value is `nullable`. It's a little hard to call it an `assertion`.

This plugin will adds runtime assert into all TypeScript `non-null-assertion`. And also we can add some additional easily.

With runtime assertion, we may find bugs as early as possible.

## Install

1. Run `yarn add babel-plugin-typescript-non-null-assertion-runtime --dev`
2. Setup your babel config file. You can see [using-a-plugin](https://babeljs.io/docs/en/plugins#using-a-plugin)


## Example

If we have below code:

```ts
const a = {
    b: 1,
};

a!.b = 1;
a.b! = 2;
const c = a!.b;
const d = a.b!;
```

And it will transform to:

```ts
function _nonNull(expr, message = "NonNull assertion failed") {
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
```

## Options

- `assertFunctionName`: optional, name of assert function.
- `assertMessage`: optional, error message of assert.
- `errorMessageIncludeSource`: optional, include assert expression into error message.
