// TODO: pasar a action
import { validateProviderName, validateProviderURL } from "@/actions/provider-actions";

export const validateProvider = async (name: string, url: string, oldName:string | undefined, oldUrl: string | undefined) => {
  try {
    const errorList: { field: "name" | "url"; message: string }[] = [];
    const nameIsValid = await validateProviderName(name);
    if (!nameIsValid && name !== oldName) {
      errorList.push({
        field: "name",
        message: "El nombre del proveedor ya está registrado en el sistema.",
      });
    }
    const urlIsValid = await validateProviderURL(url);
    if (!urlIsValid && url !== oldUrl) {
      errorList.push({
        field: "url",
        message: "La URL del proveedor ya está registrada en el sistema.",
      });
    }
    return errorList;
  } catch (error) {
    throw error;
  }
}