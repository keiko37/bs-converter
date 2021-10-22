<template>
  <div class="converter container">
    <h1 class="title">Конвертер криптовалют</h1>
    <ConverterForm />
  </div>
</template>

<script>
import ConverterForm from '@/components/converter/ConverterForm';

export default {
  name: 'Converter',
  components: { ConverterForm },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.converter {
  padding-top: 60px;
  color: $text-dark;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
}
.title {
  user-select: none;
  margin-bottom: 55px;
  font-weight: 600;
  font-size: 42px;
  opacity: 0.8;
}
</style>
