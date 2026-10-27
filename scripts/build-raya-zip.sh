#!/bin/bash
# Build a complete standalone raya-magazine project ZIP that the user can download,
# extract, and run with just `npm install` + `npm run dev`.

set -e

SRC="/home/z/my-project"
TMP="/tmp/raya-magazine-pkg"
OUT="/home/z/my-project/download/raya-magazine.zip"

rm -rf "$TMP" "$OUT"
mkdir -p "$TMP/raya-magazine"

cd "$TMP/raya-magazine"

# 1) package.json — pinned working versions
cat > package.json <<'JSON'
{
  "name": "raya-magazine",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.1.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "lucide-react": "^0.460.0",
    "sonner": "^1.7.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "tw-animate-css": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "16.1.3"
  }
}
JSON

# 2) next.config.ts
cat > next.config.ts <<'TS'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
TS

# 3) tsconfig.json
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
JSON

# 4) postcss.config.mjs
cat > postcss.config.mjs <<'MJS'
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
MJS

# 5) eslint.config.mjs
cat > eslint.config.mjs <<'MJS'
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
MJS

# 6) .gitignore
cat > .gitignore <<'GIT'
node_modules
.next
*.log
.env*
GIT

# 7) next-env.d.ts
cat > next-env.d.ts <<'TS'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
TS

# 8) src/app/globals.css
mkdir -p src/app src/components/ui src/components/raya src/lib public
cp "$SRC/src/app/globals.css" src/app/globals.css

# 9) src/app/layout.tsx
cp "$SRC/src/app/layout.tsx" src/app/layout.tsx

# 10) src/app/page.tsx
cp "$SRC/src/app/page.tsx" src/app/page.tsx

# 11) Raya components
cp "$SRC/src/components/raya/"*.tsx src/components/raya/

# 12) shadcn/ui components (button, input, sonner) — pull from current project
cp "$SRC/src/components/ui/button.tsx" src/components/ui/
cp "$SRC/src/components/ui/input.tsx" src/components/ui/
cp "$SRC/src/components/ui/sonner.tsx" src/components/ui/

# 13) lib/utils.ts
cp "$SRC/src/lib/utils.ts" src/lib/

# 14) components.json (for shadcn)
cat > components.json <<'JSON'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
JSON

# 15) README — how to run
cat > README.md <<'MD'
# مجلة راية المستقبل — Raya Future Magazine

موقع مجلة طلابية إلكترونية بُني بـ Next.js 16 + TypeScript + Tailwind CSS 4.

## التشغيل

```bash
npm install
npm run dev
```

افتح المتصفح على: http://localhost:3000

## المتطلبات
- Node.js 18+
- npm 9+
MD

# Verify everything is in place
echo "=== Project structure ==="
find . -type f -not -path "./node_modules/*" | sort

# Build the ZIP (skip node_modules to keep it small)
cd "$TMP"
zip -r "$OUT" raya-magazine -x "*/node_modules/*" "*/.next/*"

echo ""
echo "=== ZIP created ==="
ls -lh "$OUT"
