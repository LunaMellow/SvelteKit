import type { IconifyIcon } from "@iconify/svelte";
import type { SvelteComponentTyped } from "svelte";

interface Props extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["button"]> {
  block?: boolean;
  color?: "danger" | "dark" | "info" | "light" | "primary" | "secondary" | "success" | "warning";
  disabled?: boolean;
  icon?: IconifyIcon | null;
  iconPos?: "cover" | "leading" | "trailing";
  loading?: boolean;
  outline?: boolean;
  shape?: "default" | "circle" | "pill" | "round";
  size?: "lg" | "md" | "sm";
}

export default class Button extends SvelteComponentTyped<
  Props,
  { click: WindowEventMap["click"]; dblclick: WindowEventMap["dblclick"] },
  {
    default: {
      block: false;
      color: "primary";
      disabled: false;
      icon: null;
      iconPos: "cover";
      loading: false;
      outline: false;
      shape: "default";
      size: "md";
    };
  }
> {}
