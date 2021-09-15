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

const getPackage = async (key: string) => {
  const url = `https://registry.npmjs.com/-/v1/search?text=${key}&size=1`;
  const response: AxiosResponse<NpmRegisteryResponse> = await axios.get(url);
  const { objects } = response.data;
  const npmPackage = (objects[0] || {}).package;
  return npmPackage;
};

export { getPackage as default };
