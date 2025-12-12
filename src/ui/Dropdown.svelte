<!--
  @component
  Dropdown Component
  
  Usage:
  ```svelte
  <script>
    import { Dropdown } from 'kf-css/ui';
  </script>

  <Dropdown label="Options">
    <a href="#" class="block p-s hover:bg-muted-10 text-no-decoration text-body">Item 1</a>
    <button class="block width-100 text-left p-s hover:bg-muted-10 border-none bg-transparent cursor-pointer">Item 2</button>
  </Dropdown>
  ```
-->
<script>
  import { slide } from 'svelte/transition';

  export let label = 'Menu';
  export let open = false;
  export let align = 'left'; // left, right

  function toggle() {
    open = !open;
  }

  function close(e) {
    if (!e.target.closest('.dropdown-container')) {
      open = false;
    }
  }
</script>

<svelte:window on:click={close} />

<div class="relative inline-block dropdown-container">
  <button
    class="inline-flex items-center gap-xs px-m py-s bg-surface border border-muted-20 radius-m hover:bg-muted-10 cursor-pointer transition-colors"
    on:click={toggle}
    aria-expanded={open}
  >
    <slot name="trigger">
      <span class="font-500">{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="transition-transform duration-200 {open ? 'rotate-180' : ''}"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </slot>
  </button>

  {#if open}
    <div
      class="absolute top-100 z-dropdown mt-2xs min-w-[200px] bg-surface border border-muted-20 radius-m shadow-m overflow-hidden {align ===
      'right'
        ? 'right-0'
        : 'left-0'}"
      transition:slide={{ duration: 150 }}
    >
      <div class="flex flex-col py-xs">
        <slot />
      </div>
    </div>
  {/if}
</div>

<style>
  .min-w-\[200px\] {
    min-width: 200px;
  }
  .top-100 {
    top: 100%;
  }
</style>
