export function isObjectNotEmpty(obj?: any): boolean {
  return !!obj && Object.keys(obj)?.length > 0;
}
