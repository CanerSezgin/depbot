import axios, { AxiosResponse } from 'axios';
import semver from 'semver';

const username = 'snipe';
const repo = 'snipe-it';

type UnknownObj = {
  [key: string]: any;
};

interface GithubFileResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

interface PackageJson {
  devDependencies: UnknownObj;
  dependencies: UnknownObj;
}

interface ComposerJson {
  require: UnknownObj;
  'require-dev': UnknownObj;
}

const isVersionUpToDate = (currentVersion: string, latestVersion: string): boolean => {
  return semver.satisfies(latestVersion, currentVersion);
};

const getFileFromGithub = async (
  userName: string,
  repoName: string,
  filePath: string,
): Promise<string | UnknownObj> => {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const response: AxiosResponse<GithubFileResponse> = await axios.get(url);
  const encodedContent = Buffer.from(response.data.content, 'base64').toString();

  return filePath.includes('.json') ? (JSON.parse(encodedContent) as UnknownObj) : encodedContent;
};

const getPackageJsonDependencies = (content: PackageJson) => {
  return { ...content.devDependencies, ...content.dependencies };
};
const getComposerJsonDependencies = (content: ComposerJson) => {
  return { ...content.require, ...content['require-dev'] };
};

const main = async () => {
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
