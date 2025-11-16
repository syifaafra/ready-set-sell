// ============================================
// Validation Utilities using Joi
// ============================================

const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Username tidak boleh kosong',
      'string.min': 'Username minimal 3 karakter',
      'string.max': 'Username maksimal 30 karakter',
      'string.alphanum': 'Username hanya boleh huruf dan angka'
    }),

  kelompok: Joi.string()
    .valid('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')
    .required()
    .messages({
      'any.only': 'Kelompok harus A-H',
      'string.empty': 'Kelompok tidak boleh kosong'
    }),

  tanggal_main: Joi.date()
    .required()
    .messages({
      'date.base': 'Format tanggal tidak valid',
      'any.required': 'Tanggal main tidak boleh kosong'
    }),

  waktu_main: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Format waktu harus HH:MM (contoh: 14:30)',
      'string.empty': 'Waktu main tidak boleh kosong'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'string.empty': 'Username tidak boleh kosong'
    })
});

// Game decision validation schema
const decisionSchema = Joi.object({
  kuartil: Joi.number()
    .integer()
    .min(1)
    .max(8)
    .required()
    .messages({
      'number.base': 'Kuartil harus berupa angka',
      'number.min': 'Kuartil minimal 1',
      'number.max': 'Kuartil maksimal 8'
    }),

  marketing_1: Joi.string()
    .allow('', null)
    .max(100),

  marketing_2: Joi.string()
    .allow('', null)
    .max(100),

  marketing_3: Joi.string()
    .allow('', null)
    .max(100),

  supplier_a: Joi.number()
    .integer()
    .min(0)
    .default(0),

  supplier_b: Joi.number()
    .integer()
    .min(0)
    .default(0),

  supplier_c: Joi.number()
    .integer()
    .min(0)
    .default(0),

  supplier_d: Joi.number()
    .integer()
    .min(0)
    .default(0),

  offline_price: Joi.number()
    .integer()
    .min(0)
    .default(0),

  online_price: Joi.number()
    .integer()
    .min(0)
    .default(0),

  kas_tersedia: Joi.number()
    .integer()
    .min(0)
    .default(0),

  rating_offline: Joi.number()
    .min(0)
    .max(5)
    .default(0),

  rating_online: Joi.number()
    .min(0)
    .max(5)
    .default(0),

  pembeli_offline: Joi.number()
    .integer()
    .min(0)
    .default(0),

  pembeli_online: Joi.number()
    .integer()
    .min(0)
    .default(0),

  revenue_offline: Joi.number()
    .integer()
    .min(0)
    .default(0),

  revenue_online: Joi.number()
    .integer()
    .min(0)
    .default(0)
});

// Validation middleware generator
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage,
        details: error.details
      });
    }

    req.validatedBody = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  decisionSchema,
  validate
};