const safeFetch = (url: URL | RequestInfo, opts?: RequestInit) =>
  fetch(url, opts).then((response) => {
    if (response.ok) {
      return response;
    } else {
      return Promise.reject(response);
    }
  });

/**
 * Performs a GET request to the specified URL. Spreads the passed options
 * into fetch, but makes sure that the method is GET. Rejects the promise if
 * the response is not an ok code.
 */
export const get = (url: URL | RequestInfo, opts?: RequestInit) => {
  return safeFetch(url, {
    ...opts,
    method: "get",
  });
};

/**
 * Performs a POST request to the specified URL. Spreads the passed options
 * into fetch, but makes sure that the method is POST. Rejects the promise if
 * the response is not an ok code.
 */
export const post = (url: URL | RequestInfo, opts?: RequestInit) => {
  return safeFetch(url, {
    ...opts,
    method: "post",
  });
};

/**
 * Performs a PUT request to the specified URL. Spreads the passed options
 * into fetch, but makes sure that the method is PUT. Rejects the promise if
 * the response is not an ok code.
 */
export const put = (url: URL | RequestInfo, opts?: RequestInit) => {
  return safeFetch(url, {
    ...opts,
    method: "put",
  });
};
