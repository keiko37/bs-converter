<script>
import { Line } from 'vue-chartjs';

export default {
  name: 'AreaChart',
  extends: Line,
  mixins: [Line],
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
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
</script>
