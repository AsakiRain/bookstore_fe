const sleep = async (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, mills);
  });
};
export default sleep;