<template>
  <nav class="nav">
    <div class="nav-logo">
      <img class="nav-logo-icon" src="@/assets/img/logo.svg" alt="logo" />
      <div class="nav-logo-text">Crypto</div>
    </div>
    <div class="nav-links">
      <router-link
        :class="{ 'active-link': $route.path === '/converter' }"
        class="nav-links-item"
        to="/converter"
        >Конвертер</router-link
      >
      <router-link
        :class="{ 'active-link': $route.path === '/portfolio' }"
        class="nav-links-item"
        to="/portfolio"
        >Портфель</router-link
      >
    </div>
  </nav>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.nav {
  padding: 0 10px;
  background: $second-color;
  min-height: 60px;
  display: flex;
  color: $text-light;
  box-shadow: 1px 1px 6px 6px #ccc;
  &-logo {
    display: flex;
    align-items: center;
    margin-right: 40px;
    user-select: none;
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;
    line-height: 1.1;
    font-size: 30px;
    &-icon {
      height: 40px;
      width: 40px;
      margin-right: 10px;
    }
  }
  &-links {
    width: 15%;

    display: flex;

    &-item {
      height: 100%;
      width: 100%;
      opacity: 0.8;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Work Sans', sans-serif;
      font-weight: 300;
      font-size: 18px;
      color: $text-light;
      transition: all 0.3s ease;
    }
  }
}
.active-link {
  position: relative;
  opacity: 1;
  box-shadow: 4px 0 4px rgba(17, 17, 17, 0.24);
  &::before {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    bottom: 0;
    background-color: #fff;
  }
}
</style>
