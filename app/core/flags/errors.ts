export class DuplicateFeatureFlagError extends Error {
  readonly key: string;
  readonly environment: string;

  constructor(key: string, environment: string) {
    super(`Feature flag already exists for key="${key}" env="${environment}"`);
    this.name = 'DuplicateFeatureFlagError';
    this.key = key;
    this.environment = environment;
  }
}
