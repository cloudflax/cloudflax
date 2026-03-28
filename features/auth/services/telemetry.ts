const authMetrics = {
  unauthorized401: 0,
  refreshSuccess: 0,
  refreshFailure: 0,
  forcedLogout: 0,
}

type AuthMetricName = keyof typeof authMetrics

export function trackAuthMetric(metric: AuthMetricName) {
  authMetrics[metric] += 1
  console.info("[auth-metrics]", { ...authMetrics })
}
