const crypto = require("node:crypto");
const User = require("./models/User");

const secret = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const createToken = (user) => {
  const payload = encode({
    id: user._id.toString(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const verifyToken = (token) => {
  if (typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest();
  let actual;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.id && decoded.expiresAt > Date.now() ? decoded : null;
  } catch {
    return null;
  }
};

const requireAuthentication = async (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Please sign in to continue" });

  try {
    const user = await User.findById(payload.id).select("username email role");
    if (!user) return res.status(401).json({ message: "Please sign in to continue" });
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication check failed:", error.message);
    res.status(500).json({ message: "Unable to verify your session" });
  }
};

module.exports = { createToken, verifyToken, requireAuthentication };
