/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-classes-per-file */

import { PlatformUnion, platforms } from './platforms';
import Dependencies from './dependency/dependencies';
import { Registry } from './registries';

enum FilePath {
  packageJson = 'package.json',
  composerJson = 'composer.json',
}

class SupportedFile {
  static readonly packageJson = new SupportedFile(FilePath.packageJson, Registry.npm);

  static readonly composerJson = new SupportedFile(FilePath.composerJson, Registry.packagist);

  static readonly allFiles = Object.entries(SupportedFile) as [string, SupportedFile][];

  constructor(public readonly filePath: FilePath, public readonly registry: Registry) {}
}

interface IGetFile {
  getFile(repo: string, filePath: string): Promise<string | Global.UnknownObj<any>>;
}

class GetFileAdapter implements IGetFile {
  constructor(public platform: PlatformUnion) {}

  async getFile(repo: string, filePath: string): Promise<string | Global.UnknownObj<any>> {
    if (this.platform instanceof platforms.Github)
      return this.platform.getFileFromGithub(repo, filePath);
    if (this.platform instanceof platforms.Gitlab)
      return this.platform.getFileFromGitlab(repo, filePath);
    return '';
  }
}

const getDependencyMap = (
  filePath: FilePath,
  content: string | Global.UnknownObj<any>,
): Global.UnknownObj<string> => {
  if (filePath === FilePath.packageJson && typeof content === 'object') {
    const dependencies = content.dependencies as Global.UnknownObj<string>;
    const devDependencies = content.devDependencies as Global.UnknownObj<string>;
    return { ...dependencies, ...devDependencies };
  }

  if (filePath === FilePath.composerJson && typeof content === 'object') {
    const require = content.require as Global.UnknownObj<string>;
    const requireDev = content['require-dev'] as Global.UnknownObj<string>;
    return { ...require, ...requireDev };
  }

  return {};
};

const getRepo = async (repo: string, platform: PlatformUnion) => {
  const getFileAdapter: IGetFile = new GetFileAdapter(platform);

  const files = await Promise.all(
    SupportedFile.allFiles.map(async ([_, opts]) => {
      const content = await getFileAdapter.getFile(repo, opts.filePath);
      const dependencyMap = getDependencyMap(opts.filePath, content);
      const dependencies = await Dependencies.build(dependencyMap, opts.registry);
      console.log(
        `Repo: ${repo} | File: ${opts.filePath} | NoOfDeps: ${dependencies.noOfDependencies} | NoOfStaleDeps: ${dependencies.noOfStaleDependencies}`,
      );
      return {
        opts,
        content,
        dependencyMap,
        dependencies: dependencies.list,
        staleDependencies: dependencies.staleDependencies,
      };
    }),
  );

  return files.map(f => f.dependencies);
};

getRepo('snipe/snipe-it', new platforms.Github())
  .then((r) => console.log(r))
  .catch((e) => console.log(e));
