import { connect } from 'mongoose';

export const db = async () => {
  return await connect(`mongodb://127.0.0.1:27017/movies`);
};
