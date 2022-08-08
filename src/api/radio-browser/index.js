export async function getSearchResult(radioName) {
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/byname/${radioName}`
  );
  return await response.json();
}
