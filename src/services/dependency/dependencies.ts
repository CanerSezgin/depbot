import { Registry } from '../registries';
import Dependency from './dependency';

export default class Dependencies {
  constructor(public list: Dependency[]) {}

  static async build(
    dependencyMap: Global.UnknownObj<string>,
    registry: Registry,
  ): Promise<Dependencies> {
    /* Enhancement Point: 
      Throwing countless (for unknown number of dependencies) parallel requests can be dangerous. 
      Creating some chunks and handle those one by one would be suggested.
      
      or 
      simply use "es6-promise-pool" in order set concurrency 
      https://www.npmjs.com/package/es6-promise-pool
    */
    const dependencies = await Promise.all(
      Object.entries(dependencyMap).map(async ([key, curVersion]) =>
        Dependency.build(key, curVersion, registry),
      ),
    );
    return new Dependencies(dependencies);
  }

  get staleDependencies(): Dependency[] {
    return this.list.filter((dependency) => !dependency.isUpToDate);
  }

  get noOfStaleDependencies(): number {
    return this.staleDependencies.length;
  }

  get noOfDependencies(): number {
    return this.list.length;
  }
}
