// server/middleware/verifyServiceKey.js
export const verifyServiceKey = (req, res, next) => {
  const key = req.headers["x-service-key"] || req.headers["x-devmentor-service-key"];
  if (!key || key !== process.env.SERVICE_KEY) {
    return res.status(401).json({ error: "Unauthorized service" });
  }
  next();
};
