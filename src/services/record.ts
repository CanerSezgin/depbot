import { Record, RecordDoc } from '../models/Record';

const recordService = {
  async get(email: string, repo: string): Promise<RecordDoc | null> {
    return Record.findOne({ email, repo });
  },
  async create(email: string, repo: string): Promise<RecordDoc> {
    const record = Record.build({ email, repo });
    await record.save();
    return record;
  },
};

/* export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
}; */

export default recordService;
