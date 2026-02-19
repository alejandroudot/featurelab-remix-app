export class DuplicateFeatureFlagError extends Error {
  readonly key: string;

  constructor(key: string) {
    super(`Feature flag already exists for key="${key}"`);
    this.name = 'DuplicateFeatureFlagError';
    this.key = key;
  }
}
