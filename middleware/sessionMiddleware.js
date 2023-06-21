const sessionMiddleware = (req, res, next) => {
    res.locals.username = req.session.username;
    next();
  };
  
  module.exports = sessionMiddleware;