import Dependency from './dependency';

export default class Dependencies {
  constructor(public dependencies: Dependency[]) {}

  static async build(dependencyMap: Global.UnknownObj<string>): Promise<Dependencies> {
    const dependencies = await Promise.all(
      Object.entries(dependencyMap).map(async ([key, curVersion]) =>
        Dependency.build(key, curVersion),
      ),
    );
    return new Dependencies(dependencies);
  }

  get staleDependencies(): Dependency[] {
    return this.dependencies.filter((dependency) => !dependency.isUpToDate);
  }

  get noOfStaleDependencies(): number {
    return this.staleDependencies.length;
  }

  get noOfDependencies(): number {
    return this.dependencies.length;
  }
}
