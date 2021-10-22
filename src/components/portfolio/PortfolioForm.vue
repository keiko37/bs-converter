<template>
  <div class="portfolio-form">
    <div class="portfolio-form__wallet">
      <div class="portfolio-form__amount-card">
        <h3 class="portfolio-form__amount-title">
          Общая стоимость криптовалют в портфеле
        </h3>
        <div class="portfolio-form__amount">${{ totalAmount }}</div>
      </div>
      <div class="portfolio-form__management">
        <h2 class="portfolio-form__management-title">Управление валютами</h2>
        <div
          v-for="item in portfolio"
          :key="item.currency.id"
          class="portfolio-form__management-item"
        >
          <div class="portfolio-form__management-currency">
            {{ item.currency.title }}
          </div>
          <div class="portfolio-form__management-quantity">
            {{ item.quantity }}
          </div>
          <div class="portfolio-form__management-actions">
            <button
              @click="increaseQuantity(item.currency.id)"
              class="portfolio-form__management-button"
            >
              Добавить
            </button>
            <button
              @click="decreaseQuantity(item.currency.id)"
              class="portfolio-form__management-button"
            >
              Убрать
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="portfolio-form__chart">
      <DoughnutChart
        ref="amount_chart"
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import { fetchCompare } from '@/api/api';
import DoughnutChart from '@/components/portfolio/DoughnutChart';

export default {
  name: 'PortfolioForm',
  components: { DoughnutChart },
  data() {
    return {
      portfolio: [
        {
          currency: { value: 'bitcoin', id: 'btc', title: 'Bitcoin' },
          quantity: 3,
        },
        {
          currency: { value: 'ethereum', id: 'eth', title: 'Ethereum' },
          quantity: 16,
        },
      ],
      totalAmount: 0,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['#370617', '#03071e'],
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: '10px',
        hoverBackgroundColor: 'red',
        hoverBorderWidth: '10px',
      },
    };
  },
  methods: {
    async currencyPrice(currency) {
      return await fetchCompare(currency, 'usd');
    },
    increaseQuantity(currency) {
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];
      const foundCurrency = this.portfolio.find(
        (item) => item.currency.id === currency
      );
      foundCurrency.quantity = foundCurrency.quantity + 1;
      this.calcTotalAmount();
      this.rebuildChart();
      return foundCurrency.quantity + 1;
    },
    decreaseQuantity(currency) {
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];
      const foundCurrency = this.portfolio.find(
        (item) => item.currency.id === currency
      );
      if (foundCurrency.quantity <= 0) {
        return foundCurrency.quantity;
      }
      foundCurrency.quantity = foundCurrency.quantity - 1;
      this.calcTotalAmount();
      this.rebuildChart();
      return foundCurrency.quantity - 1;
    },
    async calcTotalAmount() {
      let result = await this.portfolio.reduce(async (total, current) => {
        const totalValue = await total;
        let currencyValue = await this.currencyPrice(current.currency.value);
        const currencyQuantity = current.quantity;
        const currentAmount = currencyValue * currencyQuantity;
        return totalValue + currentAmount;
      }, 0);
      this.totalAmount = await result.toFixed(0);
      return result.toFixed(0);
    },
    rebuildChart() {
      this.portfolio.forEach(async (item) => {
        const currencyValue = await this.currencyPrice(item.currency.value);
        const currencyAmount = currencyValue * item.quantity;
        this.chartData.labels.push(item.currency.title);
        this.chartData.datasets[0].data.push(currencyAmount);
        this.$refs.amount_chart.update();
      });
    },
  },
  async mounted() {
    await this.calcTotalAmount();
    this.rebuildChart();
  },
};
</script>

<style lang="scss" scoped>
.portfolio-form {
  width: 100%;
  display: flex;
  &__wallet {
    width: 45%;
    padding: 15px;
  }
  &__amount-card {
    margin-bottom: 30px;
    padding: 35px 25px;
    background-color: #03071ed0;
    color: $text-light-op;
    border-radius: 16px;
  }
  &__amount-title {
    margin-bottom: 10px;
    font-size: 16px;
  }
  &__amount {
    font-size: 58px;
    font-weight: 600;
  }
  &__management {
    padding: 15px 10px;
  }
  &__management-title {
    margin-bottom: 25px;
    font-size: 26px;
  }
  &__management-item {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #370617f6;
    color: $text-light;
    border-radius: 10px;
    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }
  &__management-currency {
    flex-basis: 30%;
  }
  &__management-quantity {
    flex-basis: 20%;
  }
  &__management-actions {
    display: flex;
    justify-content: space-between;
    flex-basis: 40%;
  }
  &__management-button {
    padding: 0.5em 1em;
    color: $text-light;
    background-color: #03071ece;
    border-radius: 10px;
  }
  &__chart {
    width: 45%;
  }
}
</style>
