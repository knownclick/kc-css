<!--
  @component
  Switch Component (Toggle)
  
  Usage:
  ```svelte
  <script>
    import { Switch } from 'kf-css/ui';
    let checked = false;
  </script>

  <Switch bind:checked>Enable Notifications</Switch>
  ```
-->
<script>
  import { createEventDispatcher } from 'svelte';
  export let checked = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function toggle() {
    if (!disabled) {
      checked = !checked;
      dispatch('change', checked);
    }
  }
</script>

<label
  class="inline-flex items-center gap-s cursor-pointer {disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''}"
>
  <div class="relative inline-block width-60 height-30">
    <input type="checkbox" class="hidden" bind:checked {disabled} on:change />
    <!-- Track -->
    <div
      class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 radius-full transition-colors duration-200"
      class:bg-muted-30={!checked}
      class:bg-primary={checked}
    ></div>
    <!-- Thumb -->
    <div
      class="absolute top-2.5 left-2.5 bg-white radius-full transition-transform duration-200 shadow-s"
      style="width: 25px; height: 25px; transform: translateX({checked
        ? '30px'
        : '0'});"
    ></div>
  </div>
  <span class="text-body font-500 user-select-none">
    <slot />
  </span>
</label>

<style>
  /* Custom sizing for specific pixel perfection */
  .width-60 {
    width: 60px;
  }
  .height-30 {
    height: 30px;
  }
  .top-2\.5 {
    top: 2.5px;
  }
  .left-2\.5 {
    left: 2.5px;
  }
</style>
