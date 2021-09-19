import { Registry } from './registries';

export enum FilePath {
  packageJson = 'package.json',
  composerJson = 'composer.json',
}

export class SupportedFile {
  static readonly packageJson = new SupportedFile(FilePath.packageJson, Registry.npm);

  static readonly composerJson = new SupportedFile(FilePath.composerJson, Registry.packagist);

  static readonly allFiles = Object.entries(SupportedFile) as [string, SupportedFile][];

  constructor(public readonly filePath: FilePath, public readonly registry: Registry) {}
}
