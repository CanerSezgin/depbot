import npm from './npm';
import packagist from './packagist';

export enum Registry {
  'npm' = 'npm',
  'packagist' = 'packagist',
}

interface Package {
  name: string;
  version: string;
}

export const getPackage = async (key: string, registry: Registry): Promise<Package> => {
  console.log({ key, registry });
  switch (registry) {
    case Registry.npm:
      return npm(key);

    case Registry.packagist:
      return packagist(key);

    default:
      return { name: key, version: '' };
  }
};
