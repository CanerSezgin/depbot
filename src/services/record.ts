import { Record, RecordDoc } from '../models/Record';
import BadRequestError from '../utils/errors/bad-request-error';
import ConflictError from '../utils/errors/conflict-error';

const recordService = {
  async get(email: string, repo: string): Promise<RecordDoc | null> {
    return Record.findOne({ email, repo });
  },
  async create(email: string, repo: string): Promise<RecordDoc> {
    const record = Record.build({ email, repo });
    try {
      await record.save();
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
    return record;
  },
};

/* export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
}; */

export default recordService;
