import semver from 'semver';
import { Registry, getPackage } from '../registries';
import { cached } from '../../utils/cache';

export default class Dependency {
  constructor(
    public key: string,
    public curVersion: string,
    public latestVersion: string,
    public isUpToDate: boolean,
  ) {}

  static async build(key: string, curVersion: string, registry: Registry): Promise<Dependency> {
    const details = await this.getDependencyDetails(key, registry);
    const { version: latestVersion } = details;
    const isUpToDate = this.checkVersions(latestVersion, curVersion);
    return new Dependency(key, curVersion, latestVersion, isUpToDate);
  }

  static async getDependencyDetails(key: string, registry: Registry) {
    const expireIn = 60 * 60; // 1hr
    return cached({ key: `package_${key}`, expire: expireIn }, getPackage, [key, registry]);
  }

  static checkVersions(latestVersion: string, currentVersion: string): boolean {
    // If latestVersion is not fetched for some reason, we will assume current version is up-to-date
    if (!latestVersion) return true;

    // If currentVersion is '*', we will it is always up-to-date
    if (currentVersion === '*') return true;

    return semver.satisfies(latestVersion, currentVersion);
  }
}
