import {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
  updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }

    res.json({
      message: "Delete is success!",
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    console.log(error);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await updateContactById(id, req.body);
    // console.log(result);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusOfContact = async (req, res, next) => {
  try {
    const { error } = updateContactStatusSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    console.log(id);
    const result = await updateStatusContact(id, req.body);
    console.log(result);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
