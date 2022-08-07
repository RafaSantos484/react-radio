export async function getSearchResult(radioName) {
  const response = await fetch(
    `http://de1.api.radio-browser.info/json/stations/byname/${radioName}`
  );
  return await response.json();
}
