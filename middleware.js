export default function cspMiddleware(req, res, next) {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:;"
    );
    next();
  }
  