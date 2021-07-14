<script>
  const { class: klass, ...props } = $$props;
</script>

<h3
  {...$$restProps}
  class={`block box-border break-normal font-semibold mb-4 mt-6 text-xl${klass ? ` ${klass}` : ""}`}
>
  <slot />
</h3>
