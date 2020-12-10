export interface HealthcheckResponse {
  environment: string;
  isDatabaseConnected: boolean;
  name: string;
  version: string;
}
