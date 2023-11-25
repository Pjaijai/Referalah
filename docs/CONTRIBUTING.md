### Commit

- **Install dependencies:**

  ```bash
  yarn install
  ```

  ### Committing Changes

- Use the following command to commit changes:

  ```bash
  yarn commit
  ```

  This will prompt you to follow conventional commit message conventions using Commitizen.

### Releasing New Versions

- Use the following command to release a new version:

  ```bash
  yarn release
  ```

  This command uses Standard Version to automatically bump the version, update the changelog, and create a Git tag.

### Creating branch

Naming your branch with category. For example `feature/i-go-to-school-by-bus`. Please create new branch based on `development` branch and created PR point to `development`.

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| hotfix        | for quickly fixing critical issues,usually with a temporary solution |
| bugfix        |                           for fixing a bug                           |
| feature       |             for adding, removing or modifying a feature              |
| doc           |                               document                               |
| refactor      |                             refactoring                              |
| test          |                    Adding test or modifying test                     |

### Creating Pull Request

Naming your PR with category. For example `Feature/I Go To School By Bus`

| Category Word |                               Meaning                                |
| ------------- | :------------------------------------------------------------------: |
| HotFix        | for quickly fixing critical issues,usually with a temporary solution |
| BugFix        |                           for fixing a bug                           |
| Feature       |             for adding, removing or modifying a feature              |
| Doc           |                               document                               |
| refactor      |                             refactoring                              |
| Test          |                    Adding test or modifying test                     |
