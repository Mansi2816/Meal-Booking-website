async function validJson(err, req, res, next) {
    if(err instanceof SyntaxError) return res.status(400).send({ error : " Bad Request", message : "Invalid JSON" });
    next();
  }
  
  module.exports = validJson;