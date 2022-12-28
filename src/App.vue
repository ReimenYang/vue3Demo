<template>
  <!-- <div id="app"> -->
  <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/userCenter">userCenter</router-link> -->
  <router-view />
  <!-- </div> -->
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "./assets/css/reset.scss";
@import "./assets/fonts/iconfont.css";
@import "//at.alicdn.com/t/font_2392208_a7gmltr3jdp.css";
#app {
  /* display: flex; */
  height: 100%;
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
