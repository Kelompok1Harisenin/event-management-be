const Joi = require('joi');

const enumEventTypes = ['Online', 'Offline'];

const createEvent = {
  formData: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    eventType: Joi.string()
      .valid(...enumEventTypes)
      .required(),
    attendeeQuota: Joi.number().integer().required(),
    availableQuota: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    location: Joi.string().required(),
    price: Joi.number().required(),
  }),
  file: Joi.object({
    fieldname: Joi.string().valid('image').required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png').required(),
    size: Joi.number().required(),
  }),
};

const getEvents = {
  query: Joi.object().keys({
    title: Joi.string(),
  }),
};

const getEventById = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const removeEvent = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  removeEvent,
};
