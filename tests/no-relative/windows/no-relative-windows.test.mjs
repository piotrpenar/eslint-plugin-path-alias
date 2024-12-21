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
    filename: "C:\\projects\\my-app\\src\\components\\Button.js",
    options: [
      {
        ...options,
        paths: {
          "@/components": "C:\\projects\\my-app\\src\\components",
          "@/utils": "C:\\projects\\my-app\\src\\utils",
        },
      },
    ],
  };
}

ruleTester.run("no-relative-windows", rule, {
  valid: [
    test({
      code: `import styles from './Button.module.css'`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `import styles from '@/components/Button.module.css'`,
    }),
    test({
      code: `import { utils } from '@/utils/helpers'`,
    }),
    test({
      code: `const styles = import('./Button.module.css')`,
      options: [{ exceptions: ["*.css"] }],
    }),
  ],
  invalid: [
    test({
      code: `import Button from './Button'`,
      output: `import Button from '@/components/Button'`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `import Button from '@/components/Button'`,
        }],
      }],
    }),
    test({
      code: `import { utils } from '../utils/helpers'`,
      output: `import { utils } from '@/utils/helpers'`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `import { utils } from '@/utils/helpers'`,
        }],
      }],
    }),
    test({
      code: `const Button = import('./Button')`,
      output: `const Button = import('@/components/Button')`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `const Button = import('@/components/Button')`,
        }],
      }],
    }),
    test({
      code: `const utils = import('../utils/helpers')`,
      output: `const utils = import('@/utils/helpers')`,
      errors: [{
        message: rule.meta.messages.shouldUseAlias,
        suggestions: [{
          messageId: "suggestAlias",
          output: `const utils = import('@/utils/helpers')`,
        }],
      }],
    }),
  ],
}); 