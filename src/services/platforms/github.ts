// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import axios, { AxiosResponse } from 'axios';

interface GithubFileResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

export default class Github {
  readonly name = 'github';

  async getFileFromGithub(
    repo: string,
    filePath: string,
  ): Promise<string | Global.UnknownObj<any>> {
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    try {
      const response: AxiosResponse<GithubFileResponse> = await axios.get(url);
      const encodedContent = Buffer.from(response.data.content, 'base64').toString();

      return filePath.includes('.json')
        ? (JSON.parse(encodedContent) as Global.UnknownObj<any>)
        : encodedContent;
    } catch (error) {
      return '';
    }
  }
}
