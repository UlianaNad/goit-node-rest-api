import Contact from "../models/Contacts.js";

export const listContacts = async () => Contact.find();

export const getContactById = async (contactId) => Contact.findById(contactId);

export const removeContact = async (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = async (data) => Contact.create(data);

export const updateContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data);
};

export const updateStatusContact = async (contactId, body) =>
  Contact.findByIdAndUpdate(contactId, body, { new: true });
