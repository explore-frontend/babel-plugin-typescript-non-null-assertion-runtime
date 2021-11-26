import babelSyntaxTypescript from '@babel/plugin-syntax-typescript';
import type * as b from '@babel/core';

interface TravelState {
  needHelper?: boolean;
  helperUniqueName?: string;
}

interface PluginOptions {
  assertFunctionName?: string;
  assertMessage?: string;
  errorMessageIncludeSource?: boolean;
}

function getPluginOptions(pass: babel.PluginPass) {
  return pass.opts as PluginOptions;
}

function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null;
}

function assertDef<T>(v: T): asserts v is NonNullable<T> {
  if (!isDef(v)) {
    throw new Error('Must be defined');
  }
}

function last<T>(v: readonly T[] | undefined | null): T {
  if (!v?.length) {
    throw new Error('Index out of range');
  }
  return v[v.length - 1];
}

const defaultNullAssertMessage = 'NonNull assertion failed';
const defaultNullAssertFunctionName = 'nonNull';

function getPluginAssertMessage(opts: PluginOptions, postfix?: string) {
  const message = opts.assertMessage ?? defaultNullAssertMessage;
  if (!postfix) {
    return message;
  }

  return `${message}: '${postfix}'`;
}

export default function plugin(babel: typeof b): babel.PluginObj {
  const { types: t, template } = babel;

  const helper =
    template.statement(`function NON_NULL_ASSERT_NAME (expr, message = DEFAULT_NULL_ASSERT_MESSAGE) {
        if (expr === undefined || expr === null) {
            throw new Error(message);
        }
        return expr;
    }`);

  const travelStateStack: TravelState[] = [];

  return {
    inherits: babelSyntaxTypescript,
    visitor: {
      Program: {
        enter(path, state) {
          const opts = getPluginOptions(state);
          const innerState: TravelState = {
            needHelper: false,
            helperUniqueName: path.scope.generateUid(
              opts.assertFunctionName ?? defaultNullAssertFunctionName
            )
          };
          travelStateStack.push(innerState);
        },
        exit(path, state) {
          const opts = getPluginOptions(state);
          const innerState = travelStateStack.pop();
          assertDef(innerState);

          if (innerState.needHelper) {
            assertDef(innerState.helperUniqueName);
            const stmt = helper({
              DEFAULT_NULL_ASSERT_MESSAGE: t.stringLiteral(
                getPluginAssertMessage(opts)
              ),
              NON_NULL_ASSERT_NAME: t.identifier(innerState.helperUniqueName)
            });
            path.node.body.unshift(stmt);
          }
        }
      },
      TSNonNullExpression(path, state) {
        if (
          t.isAssignmentExpression(path.parent) &&
          path.parent.left === (path.node as babel.Node)
        ) {
          return;
        }

        const opts = getPluginOptions(state);

        const innerState = last(travelStateStack);
        innerState.needHelper = true;
        assertDef(innerState.helperUniqueName);

        path.replaceWith(
          t.callExpression(
            t.identifier(innerState.helperUniqueName),
            [
              path.node.expression,
              opts.errorMessageIncludeSource
                ? t.stringLiteral(
                    getPluginAssertMessage(
                      opts,
                      path.get('expression').getSource()
                    )
                  )
                : undefined
            ].filter(isDef)
          )
        );
      }
    }
  };
}
