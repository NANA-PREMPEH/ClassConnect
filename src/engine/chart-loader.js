/**
 * ClassConnect - Local Chart Loader
 * Loads Chart.js from the app bundle so analytics remain available offline.
 */

let chartConstructorPromise = null;
let chartRegistered = false;

export async function ensureChartJS() {
  if (!chartConstructorPromise) {
    chartConstructorPromise = import('chart.js').then((module) => {
      const Chart = module.Chart;

      if (!chartRegistered) {
        Chart.register(...module.registerables);
        chartRegistered = true;
      }

      return Chart;
    });
  }

  return chartConstructorPromise;
}
