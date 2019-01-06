var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var dotenv = require('dotenv').config();
console.log(dotenv)
var controlador = require("./controlador.js");


var app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get("/competencias", controlador.obtenerCompetencias);
app.get("/competencias/:id/peliculas", function(req, res) {
  var id = req.params.id;
  controlador.obtenerOpciones(id, res);
});
app.post("/competencias/:id/voto", function(req, res) {
  controlador.votar(req, res);
});
app.get("/competencias/:id/resultados", function(req, res) {
  var id = req.params.id;
  controlador.obtenerResultados(id, res);
});
app.get("/generos", controlador.obtenerGeneros);
app.get("/directores", controlador.obtenerDirectores);
app.get("/actores", controlador.obtenerActores);
app.get("/competencias/:id", function(req, res){
    var id = req.params.id;
    controlador.obtenerCompetencia(id,res);
});
app.post("/competencias", function(req, res) {
  controlador.crearCompetencia(req.body, res);
});
app.delete("/competencias/:id", function(req, res) {
  var id = req.params.id;
  controlador.eliminarCompetencia(id, res);
});
app.delete("/competencias/:id/votos", function(req, res) {
  var id = req.params.id;
  controlador.eliminarVotos(id, res);
});
app.put("/competencias/:id",function(req,res){
  controlador.editarCompetencia(req, res);
});
var puerto = "8080";

app.listen(puerto, function() {
  console.log("Escuchando en el puerto " + puerto);
});
