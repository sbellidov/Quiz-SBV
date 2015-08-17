// stats_controller.js
var models = require('../models/models.js');


// - El número total de preguntas
// - El número total de comentarios
// - El número medio de comentarios por pregunta
// - El número de preguntas sin comentarios
// - El número de preguntas con comentarios

var stats = {
   total_preguntas:     0,
   total_comentarios:   0,
   com_no_publicados:   0,
   com_si_publicados:   0,
   media_com_preguntas: 0
};

// GET /quizes/stats
exports.calculate = function(req, res, next) {
   
   models.Quiz.count().then(function(data) {
      stats.total_preguntas = data;
   });
   
   models.Comment.count().then(function(data) {
      stats.total_comentarios = data;
   });
   
   models.Comment.count({ where: ["publicado = ?", false] }).then(function(data) {
      stats.com_no_publicados = data;
   });
   
   models.Comment.count({ where: ["publicado = ?", true] }).then(function(data) {
      stats.com_si_publicados = data;
   })
   
   .finally(function(){
      
      if (stats.total_preguntas > 0) {
         stats.media_com_preguntas = (stats.total_comentarios / stats.total_preguntas).toFixed(1);
      };
      
      
      console.log("+++ Hay " + stats.total_preguntas     + " preguntas!");
      console.log("+++ Hay " + stats.total_comentarios   + " comentarios!");
      console.log("+++ Hay " + stats.com_no_publicados   + " comentarios NO publicados");
      console.log("+++ Hay " + stats.com_si_publicados   + " comentarios SI publicados");
      console.log("+++ Hay " + stats.media_com_preguntas + " comentarios por preguntas");
      
      
      // Una vez calculado el valor de todos los items de estadística, se pasa
      // el control al siguiente MW para renderizar el resultado en pantalla
      
      next();
      
   });

};

// GET /quizes/stats
exports.show = function(req, res) {
   
   res.render('stats', { stats: stats, errors: [] });
   
};
