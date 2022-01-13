export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

/**
 * The status of an HTTP response.
 */
export enum HttpStatusCode {
  /**
   * Indicates that everything is okay so far and that the client should continue or ignore the response.
   */
  Continue = 100,

  /**
   * Indicates the protocol the server is going to use.
   */
  SwitchingProtocol = 101,

  /**
   * The server has received the request and is still processing it.
   */
  Processing = 102,

  /**
   * Allow the user agent to start preloading resources.
   */
  EarlyHints = 103,

  /**
   * The request has succeeded.
   */
  Ok = 200,

  /**
   * The request has succeeded and a new resource has been created.
   */
  Created = 201,

  /**
   * Indicates that the request has been accepted but not yet processed.
   */
  Accepted = 202,

  /**
   * The response is coming from a third-party source.
   */
  NonAuthoritativeInformation = 203,

  /**
   * There is no content to send for this request.
   */
  NoContent = 204,

  /**
   * Asks the client to reset the document.
   */
  ResetContent = 205,

  /**
   * The response contains a portion of the total response.
   */
  PartialContent = 206,

  /**
   * The response contains multiple status codes.
   */
  MultiStatus = 207,

  /**
   * The response contains multiple possible responses.
   */
  MultipleChoice = 300,

  /**
   * This resource has been moved to a different URL.
   */
  MovedPermanently = 301,

  /**
   * This resource has been moved temporarily. The URI may change in the future.
   */
  Found = 302,

  /**
   * Suggest that the client goes to a different source.
   */
  SeeOther = 303,

  /**
   * Tells the client that the response has not been modified. Useful for caching.
   */
  NotModified = 304,

  /**
   * Same as 302 but the client must use the same HTTP method as before.
   */
  TemporaryRedirect = 307,

  /**
   * Same as 301 but the client must use the same HTTP method as before.
   */
  PermanentRedirect = 308,

  /**
   * The server could not understand the request due to invalid syntax.
   */
  BadRequest = 400,

  /**
   * The client is not authenticated.
   */
  Unauthorized = 401,

  /**
   * The client is not authorized to access this resource.
   */
  Forbidden = 403,

  /**
   * The server can not find the requested resource.
   */
  NotFound = 404,

  /**
   * The resource exists but the method is not valid.
   */
  MethodNotAllowed = 405,

  /**
   * Could not find any content which matches the criteria given by the client.
   */
  NotAcceptable = 406,

  /**
   * Same as a 401 but requires a proxy.
   */
  ProxyAuthenticationRequired = 407,

  /**
   * Indicates the a connection has stayed open too long and the server intends to shut the connection.
   */
  RequestTimeout = 408,

  /**
   * Request conflicts with the current server state.
   */
  Conflict = 409,

  /**
   * Indicates that the resource has been permanently deleted.
   */
  Gone = 410,

  /**
   * Request rejected because `Content-Length` was not set.
   */
  LengthRequired = 411,

  /**
   * Server does not meet preconditions indicated by the client.
   */
  PreconditionFailed = 412,

  /**
   * Request is too large for the server to handle.
   */
  PayloadTooLarge = 413,

  /**
   * The URI of the request is longer than the server can process.
   */
  URITooLong = 414,

  /**
   * The server does not support the requested media type.
   */
  UnsupportedMediaType = 415,

  /**
   * The range specified by the `Range` header is not valid.
   */
  RangeNotSatisfiable = 416,

  /**
   * The expectation given by the `Expect` header can't be met.
   */
  ExpectationFailed = 417,

  /**
   * Server cannot brew coffee as it is a teapot.
   */
  ImATeapot = 418,

  /**
   * The syntax of the request is good but the semantics are not.
   */
  UnprocessableEntity = 422,

  /**
   * The server cannot perform the request without upgrading to a different protocol.
   */
  UpgradeRequired = 426,

  /**
   * The server requires that the request be conditional.
   */
  PreconditionRequired = 428,

  /**
   * The client has sent too many requests.
   */
  TooManyRequests = 429,

  /**
   * The server is unable to process the request since the headers are too large.
   */
  RequestHeaderFieldsTooLarge = 431,

  /**
   * The resource cannot be legally provided.
   */
  UnavailableForLegalReasons = 451,

  /**
   * The server has encountered an error which it does not know how to handle.
   */
  ServerError = 500,

  /**
   * The request method is not implemented.
   */
  NotImplemented = 501,

  /**
   * The server got a bad response while acting as a gateway.
   */
  BadGateway = 502,

  /**
   * The server is not ready to handle the request.
   */
  ServiceUnavailable = 503,

  /**
   * The server timed out while acting as a gateway.
   */
  GatewayTimeout = 504,

  /**
   * HTTP version used in the request is not supported.
   */
  HTTPVersionNotSupported = 505,

  /**
   * The server is not configured correctly to handle content negotation.
   */
  VariantAlsoNegotiates = 506,

  /**
   * The server is unable to store the data necessary for the request.
   */
  InsufficientStorage = 507,

  /**
   * An infinite loop has been detected.
   */
  LoopDetected = 508,

  /**
   * The request requires extensions to be handled by the server.
   */
  NotExtended = 510,

  /**
   * The client needs to authenticate to access the network.
   */
  NetworkAuthenticationRequired = 511,
}

// Normally, namespaces are dumb. In this case, we're using the namespace to
// add "static methods" to an enum.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HttpStatusCode {
  /**
   * Is the response information?
   */
  export function isInformational(status: HttpStatusCode): boolean {
    return status >= 100 && status <= 199
  }

  /**
   * Is the response a success?
   */
  export function isSuccessful(status: HttpStatusCode): boolean {
    return status >= 200 && status <= 299
  }

  /**
   * Is the response a redirect?
   */
  export function isRedirect(status: HttpStatusCode): boolean {
    return status >= 300 && status <= 399
  }

  /**
   * Was there an error caused by the client?
   */
  export function isClientError(status: HttpStatusCode): boolean {
    return status >= 400 && status <= 499
  }

  /**
   * Was there an error caused by the server?
   */
  export function isServerError(status: HttpStatusCode): boolean {
    return status >= 500 && status <= 599
  }
}

/**
 * Converts an object to query parameters.
 *
 * ```js
 * toQueryParameters({ a: 1, b: 'two' }) === 'a=1&b=two'
 * ```
 */
export const toQueryParameters = (
  obj: Record<string | number, unknown>,
): string =>
  Object.keys(obj).reduce((query, key) => {
    const val = obj[key]
    if (val === null || val === undefined) {
      return query
    }

    if (query) {
      query += '&'
    }

    return `${query}${key}=${encodeURIComponent(
      Object.prototype.toString.call(val),
    )}`
  }, '')
