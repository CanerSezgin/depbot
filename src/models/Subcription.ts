import mongoose from 'mongoose';
import { getDayTime } from '../utils/time';

interface SubscriptionAttrs {
  repo: string;
  email: string;
}

interface SubscriptionModel extends mongoose.Model<SubscriptionDoc> {
  build(attrs: SubscriptionAttrs): SubscriptionDoc;
}

export interface SubscriptionDoc extends mongoose.Document {
  repo: string;
  email: string;
  dayMinTime: number;
}

const subscriptionSchema = new mongoose.Schema<SubscriptionDoc>(
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
    dayMinTime: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
);

subscriptionSchema.pre('save', function (done) {
  if (this.isNew) {
    const createdAt = this.get('createdAt') as string;
    const dayMinTime = getDayTime(createdAt, 'min');
    this.set('dayMinTime', dayMinTime);
  }
  done();
});

subscriptionSchema.statics.build = (attrs: SubscriptionAttrs) => {
  return new Subscription(attrs);
};

export const Subscription = mongoose.model<SubscriptionDoc, SubscriptionModel>(
  'Subscription',
  subscriptionSchema,
);

subscriptionSchema.index({ email: 1, repo: 1 }, { unique: true });
