const formatToswift = require("./swift")
const formatToEcomDelivery = require("./ecom")

const transformOrderForProvider = (order, provider) => {
  switch (provider) {
    case 'ecom_delivery':
      return formatToEcomDelivery(order);
    case 'swift_express':
      return formatToswift(order);
    default:
      throw new Error('Unknown Provider');
  }
};

module.exports = transformOrderForProvider