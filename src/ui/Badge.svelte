<!--
  @component
  Badge Component
  
  Usage:
  ```svelte
  <script>
    import { Badge } from 'kf-css/ui';
  </script>

  <Badge variant="success">Active</Badge>
  <Badge variant="error" pill>Failed</Badge>
  ```
-->
<script>
  export let variant = 'primary'; // primary, success, warning, error, muted
  export let pill = false;

  const variants = {
    primary: 'bg-primary-10 text-primary-d-2 border-primary-20',
    success: 'bg-success-10 text-success-d-2 border-success-20',
    warning: 'bg-warning-10 text-warning-d-2 border-warning-20',
    error: 'bg-error-10 text-error-d-2 border-error-20',
    muted: 'bg-muted-10 text-muted-d-2 border-muted-20',
  };
</script>

<span
  class="inline-flex items-center px-xs py-2xs text-xs font-600 line-height-1 border {pill
    ? 'radius-full'
    : 'radius-s'} {variants[variant] || variants.primary} whitespace-nowrap"
>
  <slot />
</span>

<style>
  .py-2xs {
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }
  .px-xs {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .text-xs {
    font-size: 0.75rem;
  }
</style>
