import Contact from "../models/Contact.js";

export const getContactsListFilter = (filter, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);

export const getAllUserContactsByFilter = (filter) =>
  Contact.countDocuments(filter);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const removeContactByFilter = (filter) =>
  Contact.findOneAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactByFilter = (filter) => {
  return Contact.findOneAndUpdate(filter, data);
};

export const updateStatusContactByFilter = (filter, body) =>
  Contact.findOneAndUpdate(filter, body, { new: true });
