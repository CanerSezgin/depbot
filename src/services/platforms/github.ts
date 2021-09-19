import axios, { AxiosResponse } from 'axios';

interface GithubFileResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

export default class Github {
  async getFileFromGithub(
    repo: string,
    filePath: string,
  ): Promise<string | Global.UnknownObj<any>> {
    console.log('Get File from GITHUB', { repo, filePath }, !!this);
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const response: AxiosResponse<GithubFileResponse> = await axios.get(url);
    const encodedContent = Buffer.from(response.data.content, 'base64').toString();

    return filePath.includes('.json')
      ? (JSON.parse(encodedContent) as Global.UnknownObj<any>)
      : encodedContent;
  }
}
