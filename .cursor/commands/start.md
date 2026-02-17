# start

Run the project setup and development server. Execute steps in order. On Windows PowerShell, use `;` instead of `&&` when chaining commands.

---

## Step 1: Install Dependencies

```bash
pnpm install
```

If this fails, ensure Node.js 20+ and pnpm 9.15.4+ are installed. TypeScript errors during install are normal and won't prevent the app from running.

---

## Step 2: Configure Git Line Endings (Windows)

On Windows, run:

```bash
git config core.autocrlf false
```

This preserves LF line endings and prevents Prettier/ESLint errors. Skip on macOS/Linux.

---

## Step 3: Fix Formatting

```bash
pnpm format
```

Fixes any line ending or Prettier issues. Run before lint to avoid false positives.

---

## Step 4: Verify Lint

```bash
pnpm lint
```

If there are fixable errors, run:

```bash
pnpm lint:fix
```

Warnings are acceptable; errors must be resolved before proceeding.

---

## Step 5: Start Development Server

```bash
pnpm dev
```

Run in background. The app opens at `http://localhost:5173/` (or another port if 5173 is in use). Tell the user to click **Setup** in the top bar or go to `/setup` for the setup wizard.

---

## Summary

1. `pnpm install`
2. `git config core.autocrlf false` (Windows only)
3. `pnpm format`
4. `pnpm lint` (and `pnpm lint:fix` if needed)
5. `pnpm dev` (background)

Report each step's result. If any step fails, stop and report the error before proceeding.
