<script>
import { Doughnut } from 'vue-chartjs';

export default {
  name: 'AreaChart',
  extends: Doughnut,
  mixins: [Doughnut],
  props: {
    data: Object,
    options: Object,
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
    };
  },
  methods: {
    update() {
      this.$data._chart.update();
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
</script>
