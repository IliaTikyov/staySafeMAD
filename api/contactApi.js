import { apiRequest } from "./apiClient";

export const getContacts = async () => {
  return await apiRequest("/contacts");
};

export const getContactById = async (contactID) => {
  return await apiRequest(`/contacts/${contactID}`);
};

export const createContact = async (contactData) => {
  return await apiRequest("/contacts", "POST", contactData);
};

export const updateContact = async (contactData) => {
  const { ContactID, ...updatedFields } = contactData;
  return await apiRequest(`/contacts/${ContactID}`, "PUT", updatedFields);
};

export const deleteContact = async (contactID) => {
  return await apiRequest(`/contacts/${contactID}`, "DELETE");
};
