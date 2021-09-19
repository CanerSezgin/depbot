import axios, { AxiosResponse } from 'axios';

interface PackagestResponse {
  minified: string;
  packages: {
    [key: string]: Package[];
  };
  time: string;
}

interface Package {
  name: string;
  version: string;
}

export default async (key: string): Promise<Package> => {
  try {
    const url = `https://repo.packagist.org/p2/${key}.json`;
    const response: AxiosResponse<PackagestResponse> = await axios.get(url);
    const latestPackage = response.data.packages[key][0];
    return latestPackage;
  } catch (error) {
    return { name: key, version: '' };
  }
};
