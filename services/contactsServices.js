import Contact from "../models/Contacts.js";

export const listContacts = async () => Contact.find();

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const removeContact = async (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = async (data) => Contact.create(data);

export const updateContactById = async (id, data) => {
  // console.log(id, data);
  return Contact.findByIdAndUpdate(id);
};

export const updateStatusContact = async (contactId, body) => {
  // console.log(contactId, body);
  Contact.findByIdAndUpdate(contactId, body, { new: true });
};
