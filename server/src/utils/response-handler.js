export const prepareResponse = (data, message) => {
  return {
    data,
    meta: {
      message,
    },
  };
};
