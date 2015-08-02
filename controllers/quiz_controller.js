// quiz_controller.js
var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
   models.Quiz.findById(quizId).then(
      function(quiz){
         if (quiz) {
            req.quiz = quiz;
            next();
         } else {
            next(new Error('No existe quizId=' + quizId));
         }
      }
   ).catch(function(error) { next(error);});
};

// GET /quizes (lista de quizes)
exports.index = function(req, res) {
   models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs',{ quizes: quizes, errors: []});
   })
};

// GET /quizes/:id
exports.show = function(req, res) {
   res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
   }
   res.render('quizes/answer', {
      quiz: req.quiz,
      respuesta: resultado,
      errors: []
   })
};

// GET /quizes/new
exports.new = function(req, res) {
   var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta"}
   );
   res.render('quizes/new',{quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
   var quiz = models.Quiz.build( req.body.quiz );
   
   quiz
   .validate()
   .then(
      function(err) {
         if (err) {
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
         } else {
            quiz
               // Guarda en la Base de Datos los campos pregunta y respuesta
               .save({fields: ["pregunta", "respuesta"]})
               .then(function(){res.redirect('/quizes')});
         }
      }
   );
};