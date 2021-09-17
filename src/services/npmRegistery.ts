import axios, { AxiosResponse } from 'axios';

interface NpmRegisteryResponse {
  objects: { package: NpmPackage }[];
  total: number;
  time: string;
}

interface NpmPackage {
  name: string;
  scope: string;
  version: string;
}

export default async (key: string): Promise<NpmPackage> => {
  const url = `https://registry.npmjs.com/-/v1/search?text=${key}&size=1`;
  const response: AxiosResponse<NpmRegisteryResponse> = await axios.get(url);
  const { objects } = response.data;
  const npmPackage = (objects[0] || {}).package;
  return npmPackage;
};
