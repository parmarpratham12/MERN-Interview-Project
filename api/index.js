module.exports = async (req, res) => {
  const { default: app } = await import("../backend/src/server.js");
  return app(req, res);
};
