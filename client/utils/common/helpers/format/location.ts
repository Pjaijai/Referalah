export const formatLocation = (
  city: string | null,
  province: string | null,
  country: string | null
) => {
  return `${city ? city + ", " : ""}${province ? province + ", " : ""}${
    country ?? ""
  }`
}
