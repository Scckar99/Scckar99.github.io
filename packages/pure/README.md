# Local Blog Integration Package

The local Astro integration package used by [Scckar's Blog](https://scckar99.github.io/).

This package contains the reusable layouts, components, schemas, utilities and CLI helpers required by the site. It is consumed through the local `file:packages/pure` dependency and is not published independently.

## Usage

Install dependencies from the repository root, then start the development server:

```shell
pnpm install
pnpm run dev
```

#### UnoCSS

UnoCSS is more recommended, and TailwindCSS method will be removed soon.

#### TailwindCSS V3

Set up tailwindcss v3 in your project.

```js
// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // Add astro-pure components in the tailwindcss render config
    './node_modules/astro-pure/components/**/*.astro'
  ]
}

export default config
```

## Cli

```shell
# See all commands
astro-pure help
# Get the info of astro-pure
astro-pure info
# Create a new post in the blog
astro-pure new [options]
```

## License

This project is licensed under the Apache 2.0 License.
