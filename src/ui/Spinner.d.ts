import type { SvelteComponentTyped } from "svelte";

interface Props extends svelte.JSX.HTMLAttributes<SVGElementTagNameMap["svg"]> {
  color?:
    | "danger"
    | "dark"
    | "info"
    | "light"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "white";
  size?: "lg" | "md" | "sm";
}

export default class Spinner extends SvelteComponentTyped<
  Props,
  // eslint-disable-next-line
  {},
  {
    default: {
      color: "primary";
      size: "md";
    };
  }
> {}
