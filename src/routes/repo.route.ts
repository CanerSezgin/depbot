import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import validationMiddleware from '../middlewares/validation.middleware';
import repoService from '../services/repo';
import subscribeService from '../services/subscribe';
import { platforms } from '../services/platforms';

const router = express.Router();

const validations = {
  repo: body('repo').trim().notEmpty().withMessage('You must supply a repo handle'),
  email: body('email').isEmail().withMessage('Email must be valid'),
};

router.post(
  '/subscribe',
  [validations.email, validations.repo, validationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, repo } = req.body as { email: string; repo: string };

      const record = await subscribeService.create(email, repo);

      res.status(200).json({ record });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Some caching strategy (simple one) is implemented while fetching latest Version of dependency
 * Can be improved or extend for the whole flow rather than applying only for getting latest version
 * However the slowest part of the whole flow is fetching latest version of dep.
 * Since a dep. can be also found in different repos, caching this step is crucial. (has to be converted into graceful caching though)
 */
router.post(
  '/dependencies',
  [validations.repo, validationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { repo } = req.body as { repo: string };

      /**
       * Currently only Github is supported. This is why platform is assigned hardcoded. But by using platforms structure
       * ( there is an example for Gitlab ) more than one platform can be supported.
       * When another platform is supported, this endpoint should take platform as parameter
       * or some business logic can be implemented to find platform automatically. Maybe from repo URL
       */
      const platform = new platforms.Github();

      const repoResult = await repoService.get(repo, platform);

      const response = repoResult.map((fileResult) => {
        return {
          meta: {
            repo,
            platform,
            ...fileResult.opts,
            ...fileResult.meta,
          },
          staleDeps: fileResult.staleDependencies,
        };
      });
      res.status(200).json(response);
    } catch (error) {
      console.log(error)
      next(error);
    }
  },
);

export default router;
