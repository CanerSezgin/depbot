export default class Gitlab {
  readonly name = 'gitlab';

  async getFileFromGitlab(
    repo: string,
    filePath: string,
  ): Promise<string | Global.UnknownObj<any>> {
    console.log('Get File from GITLAB | Not Implemented', { repo, filePath });
    return '';
  }
}
