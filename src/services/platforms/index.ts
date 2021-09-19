import Github from './github';
import Gitlab from './gitlab';

export type PlatformUnion = Github | Gitlab;

export const platforms = {
  Github,
  Gitlab,
};
