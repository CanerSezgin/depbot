import mongoose from 'mongoose';

export default async () => {
  /*  Enhancement Point:
      Add environment variables checks somewhere else that you can run the function when the server is up first time,
      and check all required environments at once. 

      You can create a global config file after this check is done and import it into other files/places 
      or 
      If you still want to use "process.env.ENV_VARIABLE" in another place make sure you tell TS we already checked and we are sure this
      environment variable always be there. (with non-null assertion operator) | "process.env.ENV_VARIABLE!"
    */
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing.');

  try {
    const connection = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    const { db } = connection.connection;
    return db;
  } catch (error) {
    /*  Enhancement Point:
      Handle errors more specifically. Create classes for the cases and throw them instead of common Errors
    */
    if (error instanceof Error) return error;
    if (typeof error === 'string') throw new Error(error);
    throw new Error('Something went wrong while MongoDB Connection');
  }
};
