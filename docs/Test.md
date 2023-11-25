# Test

The main tool for testing is [jest](https://jestjs.io/).

## client

The following dependencies are used for testing the client:

- [jest](https://jestjs.io/)
- [ts-jest](https://www.npmjs.com/package/ts-jest)
- [@types/jest](https://www.npmjs.com/package/@types/jest)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)

### Test conventions and commands

The following conventions are used for testing the client:  
| Type | Convention | Group | Command |
| --- | --- | --- | --- |
| Unit Test | `*.test.ts` or `*.test.tsx` | unit | yarn run test:unit |
| Integration Test | `*.it.test.ts` or `*.it.test.tsx` | integration | yarn run test:int
| End-to-End Test | `*.e2e.test.ts` or `*.e2e.test.tsx` | e2e | yarn run test:e2e |

### Test type

The following test types are used for testing the client:

- Unit Test
- Integration Test
- End-to-End Test

For the detailed description of the test types, see [here](https://www.twilio.com/blog/unit-integration-end-to-end-testing-difference).

The separation of test is based on `group`, as shown in the table above. Each test should include the following:

```typescript
/**
 * getContributionAreaText test
 *
 * @group unit
 */
describe('getContributionAreaText', () => {
  ...
```

Replace `unit` by `integration` or `e2e` for integration and end-to-end tests, respectively.
