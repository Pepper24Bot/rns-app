
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  documents: "app/**/*.graphql",
  generates: {
    "app/redux/graphql/hooks.ts": {
      plugins: ['typescript', 'typescript-operations', {
        'typescript-rtk-query': {
          importBaseApiFrom: 'app/redux/baseSlice',
          exportHooks: true,
          // TODO: Figure out why typescript-resolver causes duplicate resolver identifier
          // typescript-operations does not have module.hot
          // overrideExisting: 'module.hot?.status() === "apply"',
        }
      }],
    },
  }
};

export default config;
