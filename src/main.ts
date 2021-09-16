import axios, { AxiosResponse } from 'axios';
import semver from 'semver';
import getNpmPackage from './services/npmRegistery';

import { client } from './lib/redis';
import { cached } from './utils/cache';

const username = 'snipe';
const repo = 'snipe-it';

interface GithubFileResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

interface PackageJson {
  devDependencies: Global.UnknownObj;
  dependencies: Global.UnknownObj;
}

interface ComposerJson {
  require: Global.UnknownObj;
  'require-dev': Global.UnknownObj;
}

const isVersionUpToDate = (currentVersion: string, latestVersion: string): boolean => {
  return semver.satisfies(latestVersion, currentVersion);
};

const getFileFromGithub = async (
  userName: string,
  repoName: string,
  filePath: string,
): Promise<string | Global.UnknownObj> => {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const response: AxiosResponse<GithubFileResponse> = await axios.get(url);
  const encodedContent = Buffer.from(response.data.content, 'base64').toString();

  return filePath.includes('.json')
    ? (JSON.parse(encodedContent) as Global.UnknownObj)
    : encodedContent;
};

const getPackageJsonDependencies = (content: PackageJson) => {
  return { ...content.devDependencies, ...content.dependencies };
};
const getComposerJsonDependencies = (content: ComposerJson) => {
  return { ...content.require, ...content['require-dev'] };
};

const main = async () => {
  // const npmPackage = await getNpmPackage('axios');
  console.log(typeof client)
  //const r = client.del('package_axios');
  await cached({ key: 'package_axios', expire: 5 }, getNpmPackage, ['axios']);
  //console.log({ r });
  throw new Error('hi');
  const packageJson = (await getFileFromGithub(username, repo, 'package.json')) as PackageJson;
  const composerJson = (await getFileFromGithub(username, repo, 'composer.json')) as ComposerJson;

  const packageJsonDependencies = getPackageJsonDependencies(packageJson);
  const composerJsonDependencies = getComposerJsonDependencies(composerJson);

  console.log({ packageJson, composerJson, packageJsonDependencies, composerJsonDependencies });
};

main()
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

console.log(isVersionUpToDate('^0.20.1', '0.20.5'));
