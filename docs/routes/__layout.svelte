<script context="module">
  import { h1, h2, h3, h4, h5, h6, p } from "../../src/ui/mdx";

  export { h1, h2, h3, h4, h5, h6, p };
</script>

<slot />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
