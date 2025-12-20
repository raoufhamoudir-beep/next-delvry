// import { formatToYalidine } from './yalidine.js';
const formatToEcomDelivery = require("./ecom")

 const transformOrderForProvider = (order, provider) => {
  switch (provider) {
    case 'zr_express':
    case 'ecom_delivery':
      return formatToEcomDelivery(order);
    // case 'yalidine':
    //   return formatToYalidine(order);
    default:
      throw new Error('Unknown Provider');
  }
};

module.exports = transformOrderForProvider