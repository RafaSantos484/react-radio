export async function getSearchResult(radioName) {
  const init = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    mode: "cors",
    cache: "default",
  };
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/byname/${radioName}`,
    init
  );

  return await response.json();
}
