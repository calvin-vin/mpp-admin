export const RenderFieldError = (fieldName: string, errorsAPI: any) => {
  const errorMessages = (errorsAPI as any)?.data?.errors?.[fieldName] || [];

  return errorMessages.length > 0 ? (
    <p className="text-red-500 text-sm mt-1">{errorMessages[0]}</p>
  ) : null;
};
