import semver from 'semver';
import getNpmPackage from '../npmRegistery';
import { cached } from '../../utils/cache';

export default class Dependency {
  constructor(
    public key: string,
    public curVersion: string,
    public latestVersion: string,
    public isUpToDate: boolean,
  ) {}

  static async build(key: string, curVersion: string): Promise<Dependency> {
    const details = await this.getDependencyDetails(key);
    const { version: latestVersion } = details;
    const isUpToDate = this.checkVersions(latestVersion, curVersion);
    return new Dependency(key, curVersion, latestVersion, isUpToDate);
  }

  static async getDependencyDetails(key: string) {
    return cached({ key: `package_${key}`, expire: 50 }, getNpmPackage, [key]);
  }

  static checkVersions(latestVersion: string, currentVersion: string): boolean {
    return semver.satisfies(latestVersion, currentVersion);
  }
}
