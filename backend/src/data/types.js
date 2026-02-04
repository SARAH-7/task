/**
 * Shared types (JSDoc) for order and menu.
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} image
 *
 * @typedef {Object} OrderItem
 * @property {string} menuItemId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 *
 * @typedef {Object} DeliveryDetails
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 *
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} status
 * @property {DeliveryDetails} deliveryDetails
 * @property {OrderItem[]} items
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

export {};
