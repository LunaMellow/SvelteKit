<script>
  const { class: klass, ...props } = $$props;
</script>

<p
  {...$$restProps}
  class={`block box-border break-normal mb-4 mt-0 text-base${klass ? ` ${klass}` : ""}`}
>
  <slot />
</p>
