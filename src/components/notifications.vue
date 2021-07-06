<script>
  import { createComponent } from './';

  export default createComponent({
  });
</script>
<template>
  <div v-if='notifications.length' class="notification-tray">
    <div class='notification' v-for="notification in notifications">
      {{ notification.message }}
      <a href='#' v-on:click='notification.action'>{{ notification.actionLabel }}</a>
    </div>

  </div>
</template>

<style>
  .notification-tray {
    width: 100%;
    color: black;
    margin: 2em;
    max-width: 300px;
    margin: auto;
    text-align: center;
    font-weight: bold;
    margin-top: 1em;
  }

  .notification {
    background: rgb(242, 197, 203);
    margin-bottom: 16px;
    padding: 1em;
  }
</style>
