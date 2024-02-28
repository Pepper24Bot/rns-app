
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://ec2-44-196-59-240.compute-1.amazonaws.com:8000/subgraphs/name/graphprotocol/ens",
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
