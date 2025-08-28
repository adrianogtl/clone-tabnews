export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected internal error occurred.", {
      cause,
    });

    this.name = "InternalServerError";
    this.action = "Contact support.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed for this endpoint.");

    this.name = "MethodNotAllowedError";
    this.action = "Check if this HTTP method is valid for this endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable.", {
      cause,
    });

    this.name = "ServiceError";
    this.action = "Check if the service is available.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "A validation error occurred.", {
      cause,
    });

    this.name = "ValidationError";
    this.action = action || "Adjust the data sent and try again.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "We couldn't find what you were looking for.", {
      cause,
    });

    this.name = "NotFoundError";
    this.action = action || "Check if your query is correct.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
