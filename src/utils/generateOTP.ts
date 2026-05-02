const generateOTP = (digitLength: number) => {
  const min = Math.pow(10, digitLength - 1);
  const max = Math.pow(10, digitLength) - 1;

  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default generateOTP;