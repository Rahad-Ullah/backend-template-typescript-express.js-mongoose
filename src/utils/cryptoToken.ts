import crypto from 'crypto';

const cryptoToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export default cryptoToken;
