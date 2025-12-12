<!--
  @component
  Drawer Component (Offcanvas)
  
  Usage:
  ```svelte
  <script>
    import { Drawer } from 'kf-css/ui';
    let isOpen = false;
  </script>

  <Drawer bind:open={isOpen} position="right">
    <div class="p-m">
      <h3>Menu</h3>
      <p>Drawer content...</p>
    </div>
  </Drawer>
  ```
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  export let open = false;
  export let position = 'right'; // left, right
  export let size = 'm'; // s, m, l (width on desktop)

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && open) {
      close();
    }
  }

  // Direction logic for transition
  $: xValue = position === 'right' ? 100 : -100;

  // Size classes (desktop only, mobile is full width)
  $: sizeClass =
    {
      s: 'm:max-w-s',
      m: 'm:max-w-m',
      l: 'm:max-w-l',
    }[size] || 'm:max-w-m';
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-modal overflow-hidden"
    aria-modal="true"
    role="dialog"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-surface-90 bg-blur-s"
      transition:fade={{ duration: 200 }}
      on:click={close}
    ></div>

    <!-- Panel -->
    <div
      class="absolute top-0 bottom-0 flex flex-col bg-surface shadow-xl {position ===
      'right'
        ? 'right-0 border-left'
        : 'left-0 border-right'} border-muted-20 width-100 {sizeClass} h-full"
      transition:fly={{ x: xValue * 5, duration: 300, opacity: 1 }}
    >
      <!-- Header (Optional Close Button) -->
      <div class="flex justify-end p-s">
        <button
          class="p-s radius-s hover:bg-muted-20 cursor-pointer border-none bg-transparent text-muted hover:text-title transition-colors"
          on:click={close}
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="flex-grow overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}
