import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const getContactsListFilter = (filter, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);

export const getContactById = (contactId) => Contact.findById(contactId);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const removeContactByFilter = (filter) =>
  Contact.findOneAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) => {
  return Contact.findByIdAndUpdate(id, data);
};
export const updateContactByFilter = (filter) => {
  return Contact.findOneAndUpdate(filter, data);
};

export const updateStatusContact = (contactId, body) =>
  Contact.findByIdAndUpdate(contactId, body, { new: true });

export const updateStatusContactByFilter = (filter, body) =>
  Contact.findOneAndUpdate(filter, body, { new: true });
