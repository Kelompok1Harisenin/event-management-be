const httpStatus = require('http-status');
const { Event } = require('../models');
const { organizerRepository } = require('../repositories');
const { ApiError, messages } = require('../utils');
const config = require('../config/config');
const supabase = require('../config/supabase');

const bucketName = config.supabase.bucket;

const uploadImage = async (uploadedImage, title) => {
  try {
    const { buffer } = uploadedImage;
    const uniqueId = new Date().getTime();

    const titleStr = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '');
    const filePath = `events/${titleStr}-${uniqueId}`;
    const { error } = await supabase.storage.from(bucketName).upload(filePath, buffer);

    if (error) {
      throw new ApiError(httpStatus.CONFLICT, error);
    }

    const imageUrl = `${config.supabase.url}/storage/v1/object/public/${bucketName}/${filePath}`;
    return imageUrl;
  } catch (error) {
    throw new ApiError(httpStatus.CONFLICT, error.message);
  }
};

const createEvent = async (data, imageFile) => {
  const {
    organizerId,
    title,
    description,
    eventType,
    attendeeQuota,
    availableQuota,
    startDate,
    endDate,
    location,
    price,
  } = data;

  if (!imageFile) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.IMAGE_NOT_FOUND);
  }

  const image = await uploadImage(imageFile, title);
  const organizer = await organizerRepository.findByPk(organizerId);
  if (!organizer) {
    throw new ApiError(httpStatus.NOT_FOUND, messages.ORGANIZER_NOT_FOUND);
  }

  const createdEvent = await Event.create({
    organizerId,
    title,
    description,
    eventType,
    attendeeQuota,
    availableQuota,
    image,
    startDate,
    endDate,
    location,
    price,
  });

  return createdEvent;
};

module.exports = {
  createEvent,
};
