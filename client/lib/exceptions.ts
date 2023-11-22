export class PostNotFoundError extends Error {
  constructor(message = "搵唔到街招資料，請稍後再試。") {
    super(message)
    this.name = "PostNotFoundError"
  }
}
