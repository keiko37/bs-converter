<template>
  <div>
    <div class="converter-form">
      <div class="converter-form__select-item">
        <label class="converter-form__select-title" for="field1">Из</label>
        <select
          @change="calcCompare(inputValue)"
          v-model="currency1"
          class="converter-form__select"
          name="field1"
          id="field1"
        >
          <option value="default" disabled>Выберите валюту</option>
          <option
            v-for="currency in currencies"
            :key="currency.value"
            :value="currency"
          >
            {{ currency.title }}
          </option>
        </select>
        <div
          class="converter-form__input-wrapper"
          :data-currency="currency1.id"
        >
          <input
            @keydown="inputActions($event)"
            @input="calcCompare(inputValue)"
            v-model="inputValue"
            class="converter-form__input"
            type="text"
            placeholder="Сумма..."
          />
        </div>
      </div>
      <div @click="swapCurrencies" class="converter-form__swap">
        <button class="converter-form__swap-button">
          <img src="@/assets/img/icons/swap_48dp.svg" alt="" />
        </button>
      </div>
      <div class="converter-form__select-item">
        <label class="converter-form__select-title" for="field2">В</label>
        <select
          @change="calcCompare(inputValue)"
          v-model="currency2"
          class="converter-form__select"
          name="field2"
          id="field2"
        >
          <option value="default" disabled>Выберите валюту</option>
          <option
            v-for="currency in currencies"
            :key="currency.value"
            :value="currency"
          >
            {{ currency.title }}
          </option>
        </select>
        <div
          class="converter-form__input-wrapper"
          :data-currency="currency2.id"
        >
          <input
            @keydown="inputActions($event)"
            @input="calcCompare(inputValue2)"
            v-model="inputValue2"
            class="converter-form__input"
            type="text"
            placeholder="Сумма..."
          />
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <AreaChart
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import { fetchCompare, fetchHistory } from '@/api/api';
import AreaChart from '@/components/converter/AreaChart';

export default {
  name: 'ConverterForm',
  components: { AreaChart },
  data() {
    return {
      inputValue: '1',
      inputValue2: '',
      currency1: { value: 'bitcoin', id: 'btc', title: 'Bitcoin' },
      currency2: { value: 'usd', id: 'usd', title: 'US Dollar' },
      currencies: [
        { value: 'usd', id: 'usd', title: 'US Dollar' },
        { value: 'bitcoin', id: 'btc', title: 'Bitcoin' },
        { value: 'ethereum', id: 'eth', title: 'Ethereum' },
      ],
      swapToggle: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Стоимость валюты',
            backgroundColor: '#370617',
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
      },
    };
  },
  computed: {},
  methods: {
    async inputActions(event) {
      const isValid = this.numberValidate(event, event.target.value);
      if (!isValid) {
        return;
      }

      if (event.target.value === '.') {
        return;
      }

      if (
        this.currency1.value === 'default' ||
        this.currency2.value === 'default'
      ) {
        return;
      }
    },
    async calcCompare(value) {
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];
      let quantity = value === '' ? '1' : this.endDotValidate(value);
      if (this.currency1.value === this.currency2.value) {
        this.inputValue = quantity;
        this.inputValue2 = quantity;
        return;
      }
      if (
        this.currency1.value !== 'default' &&
        this.currency2.value !== 'default'
      ) {
        let resultValue;
        if (this.currency1.value === 'usd') {
          //проверить как работает
          const currency1 = this.currency1;
          const currency2 = this.currency2;
          let responseCompare = await fetchCompare(
            currency2.value,
            currency1.value
          );

          if (value === this.inputValue) {
            resultValue = quantity / responseCompare;
            this.inputValue2 = resultValue;
          }
          if (value === this.inputValue2) {
            resultValue = quantity * responseCompare;
            this.inputValue = resultValue;
          }
          const fetchedHistory = await fetchHistory(
            this.currency2.value,
            this.currency1.id
          );

          this.buildChartData(fetchedHistory);
        } else {
          let responseCompare = await fetchCompare(
            this.currency1.value,
            this.currency2.id
          );
          if (value === this.inputValue) {
            resultValue = quantity * responseCompare;
            this.inputValue2 = resultValue;
          }
          if (value === this.inputValue2) {
            resultValue = quantity / responseCompare;
            this.inputValue = resultValue;
          }
          const fetchedHistory = await fetchHistory(
            this.currency1.value,
            this.currency2.id
          );
          this.buildChartData(fetchedHistory);
        }
      }
    },
    swapCurrencies() {
      [this.currency1, this.currency2] = [this.currency2, this.currency1];
      const whichValue = !this.swapToggle ? this.inputValue2 : this.inputValue;
      this.calcCompare(whichValue);
      this.swapToggle = !this.swapToggle;
    },
    buildChartData(fetchedArray) {
      fetchedArray.forEach((spot) => {
        this.chartData.labels.push(this.convertTimestamp(spot[0]));
        this.chartData.datasets[0].data.push(this.trimNumber(spot[1]));
      });
    },
    trimNumber(number) {
      return Number(number.toString().match(/^(\d{0,5})(\.)?(\d{0,10})?/gm)[0]);
    },
    convertTimestamp(timestamp) {
      const d = new Date(timestamp);
      const yyyy = d.getFullYear();
      const mm = ('0' + (d.getMonth() + 1)).slice(-2);
      const dd = ('0' + d.getDate()).slice(-2);
      const time = dd + '-' + mm + '-' + yyyy;
      return time;
    },
    endDotValidate(value) {
      if (value !== '' && value !== '.') {
        let val = value;
        while (val[val.length - 1] === '.') {
          val = val.substring(0, val.length - 1);
        }
        return val;
      }
      return 1;
    },
    numberValidate(event, inputValue) {
      const acceptedKeys = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '.',
        'Backspace',
        'Delete',
      ];
      if (event.key === 'Backspace' && event.target.value.length === 0) {
        event.target.value = 1;
      }
      if (event.key === '.' && inputValue.includes('.')) {
        event.preventDefault();
        return false;
      }
      if (!acceptedKeys.includes(event.key)) {
        event.preventDefault();
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.calcCompare(this.inputValue);
  },
};
</script>

<style lang="scss" scoped>
.converter-form {
  margin-bottom: 80px;
  width: 100%;
  display: flex;
  &__select-item {
    width: 40%;
    display: flex;
    flex-direction: column;
  }
  &__select-title {
    margin-bottom: 5px;
    color: $text-secondary;
    font-size: 14px;
  }
  &__select {
    border-bottom: 2px solid $border-color;
    padding: 5px 0 12px 0;
    font-size: 18px;
    color: $text-dark;
    background-color: #fff;
  }
  &__input-wrapper {
    position: relative;
    margin-top: 30px;
    &::after {
      content: attr(data-currency);
      transform: translateY(-50%);
      position: absolute;
      top: 50%;
      right: 0;
      font-size: 45px;
      font-weight: 300;
      color: $text-dark;
      opacity: 0.6;
    }
  }
  &__input {
    width: 100%;
    outline: none;
    padding: 0 80px 0 10px;
    font-size: 60px;
    font-weight: 300;
    color: $text-dark;
    opacity: 0.8;
    transition: border-bottom 0.08s ease;
    &:focus {
      border-bottom: 2px solid $border-color;
    }
    &::placeholder {
      font-weight: 300;
    }
  }
  &__swap {
    width: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    cursor: pointer;
    &:hover &-button {
      transform: scale(1.05);
    }
    &-button {
      background-color: transparent;
      border-radius: 50%;
      opacity: 0.9;
      transition: transform 0.2s ease-in-out;
      transition: box-shadow 0.1s ease-in;
      &:active {
        box-shadow: 1px 1px 13px $border-color;
      }
    }
  }
  .chart-wrapper {
    min-height: 500px;
  }
}
</style>
