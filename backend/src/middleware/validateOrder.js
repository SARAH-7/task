import { body, param, validationResult } from 'express-validator';
import { getMenuItemById } from '../data/store.js';

export const placeOrderValidation = [
  body('deliveryDetails').isObject().withMessage('deliveryDetails is required'),
  body('deliveryDetails.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be 2–200 characters')
    .matches(/^[\p{L}\s\-'.]+$/u)
    .withMessage('Name must contain only letters, spaces, hyphens or apostrophes'),
  body('deliveryDetails.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be 5–500 characters')
    .matches(/^[\p{L}\p{N}\s,\-.#'/]+$/u)
    .withMessage('Address can only contain letters, numbers, spaces, and common punctuation (e.g. comma, hyphen, period, #)'),
  body('deliveryDetails.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-()]{10,20}$/)
    .withMessage('Phone must be 10–20 digits (may include spaces, dashes, parentheses)'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.menuItemId').trim().notEmpty().withMessage('menuItemId is required'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99'),
  body('items').custom((items) => {
    for (const it of items) {
      const menuItem = getMenuItemById(it.menuItemId);
      if (!menuItem) throw new Error(`Invalid menu item: ${it.menuItemId}`);
    }
    return true;
  }),
];

export const orderIdParamValidation = [
  param('id').trim().notEmpty().withMessage('Order ID is required'),
];

export const updateStatusValidation = [
  param('id').trim().notEmpty().withMessage('Order ID is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'])
    .withMessage('Invalid status'),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
