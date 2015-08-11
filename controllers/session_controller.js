// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
   if (req.session.user) {
      next();
   } else {
      res.redirect('/login');
   }
};

// GET /login --- Formulario de login
exports.new = function(req, res) {
   var errors = req.session.errors || {};
   req.session.errors = {}
   res.render('sessions/new',{errors: errors});
};

// POST /login --- crear la sesión
exports.create = function(req, res) {
   var login      = req.body.login;
   var password   = req.body.password;
   
   var userController = require('./user_controller');
   userController.autenticar(login, password, function(error, user) {
      
      // Si hay error retornamos mensajes de error de sesión
      if (error) {
         req.session.errors = [{"message": 'Se ha producido un error:'+ error}];
         res.redirect("/login");
         return;
      }
      
      // Crear req.session.user y guardar campos id y username
      // La sesiónse define por la existencia de: req.session.user
      req.session.user = {id:user.id, username:user.username};
      
      // Redirecciona al path anterior a login
      res.redirect(req.session.redir.toString()); 
   });
};

// DELETE /logout --- Destruir sesión
exports.destroy = function(req, res) {
   
   // Destruye la sesión eliminando req.session.user
   delete req.session.user;
   
   // Redirecciona al path anterior a logout
   res.redirect(req.session.redir.toString()); 
};