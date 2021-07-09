<template>
  <a class='resource-review-submission' target="_blank" href="https://airtable.com/shrN7dbggyC43DhUu">
    <button class='btn'>Submit a Review</button>
  </a>
</template>

<style>
  .resource-review-submission {
    text-decoration: none;
  }

  .btn {
    margin: 0;
    margin-top: 16px;
    display: block;
    color: var(--color-primary);
    background: white;
    border: 1px solid var(--color-primary);
    padding: 8px 16px;
    border-radius: 5px;      
    transition: background 300ms, color 300ms;
    font-size: 1em;
    text-decoration: none;
  }

  .btn:hover, .btn:focus, .btn:active  {
    color: white;
    background: var(--color-primary);
    cursor: pointer;
  }

</style>
