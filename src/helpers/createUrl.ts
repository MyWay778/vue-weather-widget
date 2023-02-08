export default function createUrl(baseUrl: string, queryParams: { key: string; value: string }[]): URL {
  const url = new URL(baseUrl);

  queryParams.forEach(param => {
    url.searchParams.append(param.key, param.value);
  });

  return url;
}
