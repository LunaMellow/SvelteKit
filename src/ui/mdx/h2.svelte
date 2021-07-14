<script>
  const { class: klass, ...props } = $$props;
</script>

<h2
  {...$$restProps}
  class={`block box-border border-b border-solid border-gray-300 break-normal font-semibold mb-4 mt-6 pb-1.5 text-2xl${
    klass ? ` ${klass}` : ""
  }`}
>
  <slot />
</h2>
