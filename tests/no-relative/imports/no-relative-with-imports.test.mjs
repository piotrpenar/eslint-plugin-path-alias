import { resolve } from "path";
import { RuleTester } from "eslint";
import plugin from "../../../dist/index.mjs";

const rule = plugin.rules["no-relative"];
const ruleTester = new RuleTester();

/**
 * @param {import('eslint').RuleTester.ValidTestCase} config
 * @returns {import('eslint').RuleTester.ValidTestCase}
 */
function test(config) {
  const options = config.options?.[0] ?? {};
  return {
    ...config,
    filename: import.meta.filename,
  };
}

ruleTester.run("no-relative-with-imports", rule, {
  valid: [
    test({
      code: `import styles from './a.css'`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `import styles from '../../a'`,
    }),
    test({
      code: `const styles = import('./a.css')`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `const a = import('../../a')`,
      options: [{ exceptions: ["*.css"] }],
    }),
  ],
  invalid: [
    test({
      code: `import a from './a'`,
      output: `import a from '#imports/a'`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `import a from '#imports/a'`,
        }],
      }],
    }),
    test({
      code: `import b from '../b'`,
      output: `import b from '#tests/b'`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `import b from '#tests/b'`,
        }],
      }],
    }),
    test({
      code: `const a = import('./a')`,
      output: `const a = import('#imports/a')`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `const a = import('#imports/a')`,
        }],
      }],
    }),
    test({
      code: `const b = import('../b')`,
      output: `const b = import('#tests/b')`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `const b = import('#tests/b')`,
        }],
      }],
    }),
  ],
});
