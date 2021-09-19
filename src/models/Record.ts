import mongoose from 'mongoose';

interface RecordAttrs {
  repo: string;
  email: string;
}

interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
}

export interface RecordDoc extends mongoose.Document {
  repo: string;
  email: string;
  sendEmailTime: string;
}

const recordSchema = new mongoose.Schema<RecordDoc>(
  {
    email: {
      type: String,
      required: true,
      immutable: true,
    },
    repo: {
      type: String,
      required: true,
      immutable: true,
    },
    sendEmailTime: {
      type: String,
    },
  },
  { timestamps: true },
);

recordSchema.statics.build = (attrs: RecordAttrs) => {
  return new Record(attrs);
};

export const Record = mongoose.model<RecordDoc, RecordModel>('Record', recordSchema);

recordSchema.index({ email: 1, repo: 1 }, { unique: true });
