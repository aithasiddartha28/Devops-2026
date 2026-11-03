const test = require("node:test");
const assert = require("node:assert/strict");
const { createToken, verifyToken } = require("../authentication");

test("signed access tokens preserve the user ID", () => {
  const token = createToken({ _id: "user-123" });
  assert.equal(verifyToken(token).id, "user-123");
});

test("tampered and malformed access tokens are rejected", () => {
  const token = createToken({ _id: "user-123" });
  const [payload] = token.split(".");
  assert.equal(verifyToken(`${payload}.${"a".repeat(43)}`), null);
  assert.equal(verifyToken("not-a-token"), null);
});
