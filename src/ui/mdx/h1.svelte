<script>
  const { class: klass, ...props } = $$props;
</script>

<h1
  {...$$restProps}
  class={`block box-border border-b border-solid border-gray-300 break-normal font-semibold mb-4 pb-2.5 text-3xl${
    klass ? ` ${klass}` : ""
  }`}
>
  <slot />
</h1>
