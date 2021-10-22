<template>
  <div class="portfolio container">
    <h1 class="portfolio__title">Криптовалютный портфель</h1>
    <PortfolioForm />
  </div>
</template>

<script>
import PortfolioForm from '@/components/portfolio/PortfolioForm';

export default {
  name: 'Portfolio',
  components: {
    PortfolioForm,
  },
};
</script>

<style lang="scss" scoped>
.portfolio {
  margin-bottom: 50px;
  padding-top: 60px;
  color: $text-dark;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  &__title {
    user-select: none;
    margin-bottom: 55px;
    font-weight: 600;
    font-size: 42px;
    opacity: 0.8;
  }
}
</style>
