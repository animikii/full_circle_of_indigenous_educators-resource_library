<script>
  import { createComponent } from './';

  export default createComponent({
    computed: {
      notifications() {
        return [
          { message: 'Session timed out!' }
        ];
      }
    }
  });
</script>
<template>
  <!--
  <div class="notification-tray">
    <div v-for="notification in notifications">
      {{ notification.message }}
    </div>
  </div>
  -->
</template>

<style>
  .notification-tray {
    width: 100%;
    background: rgb(242, 197, 203);
    color: black;
    margin: 2em;
    max-width: 300px;
    margin: auto;
    padding: 1em;
    text-align: center;
    font-weight: bold;
    margin-top: 1em;
  }
</style>
