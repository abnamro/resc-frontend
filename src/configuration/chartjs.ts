import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

export function chartJsSetup() {
    ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement);
}
