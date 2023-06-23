const sessionMiddleware = (req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.roles = req.session.roles;
    next();
  };
  
  module.exports = sessionMiddleware;