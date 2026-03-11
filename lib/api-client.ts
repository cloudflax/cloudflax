type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  next?: NextFetchRequestConfig
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API error ${status}: ${body}`)
    this.name = "ApiError"
  }
}

export async function api<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const { body, ...rest } = options ?? {}

  const res = await fetch(`${process.env.API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(res.status, text)
  }

  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>
  }

  return undefined as T
}
