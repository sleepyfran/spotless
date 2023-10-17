/**
 * Type-safe way of referring to a field of a table.
 */
export const fieldNameOf = <T>(name: keyof T) => name;
