import Dependencies from './services/dependency/dependencies';

const mockData = {
  repo: 'snipe/snipe-it',
};





/* const getComposerJsonDependencies = (content: ComposerJson) => {
  return { ...content.require, ...content['require-dev'] };
}; */

interface PackageJsonFile {
  dependencies: Global.UnknownObj<string>;
  devDependencies: Global.UnknownObj<string>;
}

const main = async (repo: string) => {
  const packageJson = (await getFileFromGithub(repo, 'package.json')) as PackageJsonFile;
  const dependencyMap = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const packageJsonDeps = await Dependencies.build(dependencyMap);
  

  console.log(packageJsonDeps);
};

main(mockData.repo)
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

console.log();
