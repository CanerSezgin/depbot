import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import validationMiddleware from '../middlewares/validation.middleware';
import recordService from '../services/record';

interface EmailRepo {
  email: string;
  repo: string;
}

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('repo').trim().notEmpty().withMessage('You must supply a repo handle'),
];

router.post(
  '/',
  [...validations, validationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, repo } = req.body as EmailRepo;

      const record = await recordService.create(email, repo);

      res.status(200).json({ record });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
