import axios, { AxiosResponse } from 'axios';
import Dependencies from './services/dependency/dependencies';

const mockData = {
  repo: 'snipe/snipe-it',
};

interface GithubFileResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

const getFileFromGithub = async (
  repo: string,
  filePath: string,
): Promise<string | Global.UnknownObj<any>> => {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const response: AxiosResponse<GithubFileResponse> = await axios.get(url);
  const encodedContent = Buffer.from(response.data.content, 'base64').toString();

  return filePath.includes('.json')
    ? (JSON.parse(encodedContent) as Global.UnknownObj<any>)
    : encodedContent;
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
