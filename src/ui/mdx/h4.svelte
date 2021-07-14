<script>
  const { class: klass, ...props } = $$props;
</script>

<h4
  {...$$restProps}
  class={`block box-border break-normal font-semibold mb-4 mt-6 text-base${
    klass ? ` ${klass}` : ""
  }`}
>
  <slot />
</h4>
