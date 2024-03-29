import {
  getContactsListFilter,
  getContactByFilter,
  addContact,
  updateContactByFilter,
  removeContactByFilter,
  updateStatusContactByFilter,
  getAllUserContactsByFilter,
} from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const result = await getContactsListFilter({ owner }, { skip, limit });
    const total = await getAllUserContactsByFilter({ owner });
    res.json({ total, result });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  try {
    const result = await getContactByFilter({ _id: id, owner });
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const { id } = req.params;
    const result = await removeContactByFilter({ _id: id, owner }, req.body);
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
    const { _id: owner } = req.user;

    const result = await addContact({ ...req.body, owner });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const { error } = updateContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await updateContactByFilter({ _id: id, owner }, req.body);

    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusOfContact = async (req, res, next) => {
  const { _id: owner } = req.user;

  try {
    const { error } = updateContactStatusSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await updateStatusContactByFilter(
      { _id: id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Contact with id=${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
