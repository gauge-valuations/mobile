/// <reference types="nativewind/types" />

// Allow side-effect and default imports of CSS / CSS-module files so that
// `import "@/global.css"` and `import styles from "./x.module.css"` typecheck.
declare module "*.css";
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
