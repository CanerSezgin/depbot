import { Subscription, SubscriptionDoc } from '../models/Subcription';
import BadRequestError from '../utils/errors/bad-request-error';
import ConflictError from '../utils/errors/conflict-error';

const subscribeService = {
  async get(email: string, repo: string): Promise<SubscriptionDoc | null> {
    return Subscription.findOne({ email, repo });
  },
  async getByDayMin(dayMinTime: number) {
    return Subscription.find({ dayMinTime });
  },
  async create(email: string, repo: string): Promise<SubscriptionDoc> {
    const subscription = Subscription.build({ email, repo });
    try {
      await subscription.save();
    } catch (error) {
      /* Enhancement Point: 
         Need better error handling for mongoose errors, ignored for the sake of simplicity.
       */
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new ConflictError(`This email (${email}) is already subscibed into repo: ${repo}`);
      } else {
        throw new BadRequestError(error.message);
      }
    }
    return subscription;
  },
};

export default subscribeService;
