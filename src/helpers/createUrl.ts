export default function createUrl(
  urlAndBase: string | [url: string, baseUrl: string], // maybe single url or url and base url
  queryParams: { key: string; value: string }[]
): URL {
  const url = Array.isArray(urlAndBase) ? new URL(urlAndBase[0], urlAndBase[1]) : new URL(urlAndBase)

  queryParams.forEach(param => {
    url.searchParams.append(param.key, param.value)
  })

  return url
}
