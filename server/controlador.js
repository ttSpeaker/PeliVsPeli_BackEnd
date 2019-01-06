var conDb = require("./conexionDb.js");

function obtenerCompetencias(req, res) {
  var sqlQuery = "select id, nombre from competicion";
  console.log(conDb);
  conDb.query(sqlQuery, function(error, resp) {
    res.send(resp);
  });
}
function competenciaQuery(data) {
  var sql =
    "SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor on actor_pelicula.actor_id = actor.id JOIN director_pelicula dp ON dp.pelicula_id = pelicula.id";
  var paramsCount = false;
  if (data.genero_id) {
    sql = sql.concat(" WHERE genero_id =" + data.genero_id);
    paramsCount = true;
  }
  if (data.actor_id) {
    if (paramsCount) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" actor_id =" + data.actor_id);
    paramsCount = true;
  }
  if (data.director) {
    if (paramsCount) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" dp.director_ID =" + data.director);
    paramsCount = true;
  }
  sql = sql.concat(" ORDER BY rand() LIMIT 2;");
  return sql;
}
function obtenerOpciones(id, res) {
  var sqlCompetencia = "select * from competicion where id =" + id + ";";
  conDb.query(sqlCompetencia, function(error, respCompetencia) {
    if (respCompetencia.length > 0) {
      var sqlOpciones = competenciaQuery(respCompetencia[0]);
      conDb.query(sqlOpciones, function(error, respPeli) {
        var opciones = {
          competencia: respCompetencia[0].nombre,
          peliculas: respPeli
        };
        res.send(opciones);
      });
    } else {
      return res.status(404).json("No se encontro la competencia");
    }
  });
}
function votar(req, res) {
  var competenciaId = req.params.id;
  var peliculaId = req.body.idPelicula;
  var verifPeli = "SELECT * FROM pelicula where id =" + peliculaId + ";";
  conDb.query(verifPeli, function(error, resp) {
    if (resp) {
      var verifComp =
        "SELECT * FROM competicion where id =" + competenciaId + ";";
      conDb.query(verifComp, function(error, respuesta) {
        if (respuesta) {
          var verifVoto =
            "SELECT * FROM votos_pelicula where competencia_id=" +
            competenciaId +
            " AND pelicula_id=" +
            peliculaId +
            ";";
          conDb.query(verifVoto, function(error, respVerifVoto) {
            if (respVerifVoto.length > 0) {
              var sql =
                "UPDATE votos_pelicula SET cantidad = cantidad +1 where competencia_id=" +
                competenciaId +
                " AND pelicula_id=" +
                peliculaId +
                ";";
              conDb.query(sql, function(error, respuestaVoto) {
                res.status(200).json("Voto agregado");
              });
            } else {
              var sql =
                "INSERT INTO votos_pelicula (competencia_id, pelicula_id, cantidad) values(+" +
                competenciaId +
                ", " +
                peliculaId +
                ", 1);";
              conDb.query(sql, function(error, respuestaVoto) {
                res.status(200).json("Voto agregado");
              });
            }
          });
        } else {
          return res.status(404).json("Competencia no encontrada");
        }
      });
    } else {
      return res.status(404).json("Pelicula no encontrada");
    }
  });
}
function obtenerResultados(id, res) {
  sqlVerifComp = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(sqlVerifComp, function(error, resultComp) {
    if (error) {
      return res.status(500);
    } else if (resultComp) {
      sql =
        "SELECT p.id as pelicula_id, titulo, poster, cantidad as votos FROM votos_pelicula vot JOIN pelicula p ON vot.pelicula_id = p.id JOIN competicion c ON vot.competencia_id=c.id WHERE c.id=" +
        id +
        " order by cantidad DESC LIMIT 3;";
      conDb.query(sql, function(error, resp) {
        if (error) {
          return res.status(500);
        } else {
          var data = {
            competencia: resultComp[0].titulo,
            resultados: resp
          };
          res.send(data);
        }
      });
    } else {
      return res.status(404).json("Competencia no encontrada");
    }
  });
}
function crearCompetencia(params, res) {
  var titulo = params.nombre;
  var genero = params.genero;
  var actor = params.actor;
  var director = params.director;
  var verifComp = "SELECT * FROM competicion where nombre='" + titulo + "'";
  conDb.query(verifComp, function(error, resultVerif) {
    if (error) {
      return res.status(500);
    }
    if (resultVerif.length != 0) {
      return res.status(422).json("La competencia ya existe");
    }
    var sql =
      "INSERT INTO competicion (nombre, genero_id, actor_id, director) values ('" +
      titulo +
      "'";
    if (genero != 0) {
      sql = sql.concat(", " + genero);
    } else {
      sql = sql.concat(", NULL");
    }
    if (actor != 0) {
      sql = sql.concat(", " + actor);
    } else {
      sql = sql.concat(", NULL");
    }
    if (director != 0) {
      sql = sql.concat(", " + director);
    } else {
      sql = sql.concat(", NULL");
    }
    sql = sql.concat(");");
    conDb.query(sql, function(error, resp) {
      if (error) {
        return res.status(500);
      }
      res.status(200);
    });
  });
}
function eliminarCompetencia(id, res) {
  var verifComp = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(verifComp, function(error, resultVerif) {
    if (resultVerif.length == 0) {
      return res.status(404).json("La competencia no existe");
    }
    sqlEliminar = "DELETE FROM votos_pelicula where competencia_id=" + id + ";";
    conDb.query(sqlEliminar, function(error, respVotos) {
      if (error) {
        return res.status(500);
      }
      var sql = "DELETE FROM competicion where id =" + id + ";";
      conDb.query(sql, function(error, respCompetiencia) {
        if (error) {
          return res.status(500);
        }
        res.status(200);
      });
    });
  });
}
function eliminarVotos(id, res) {
  var verifComp = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(verifComp, function(error, resultVerif) {
    if (resultVerif.length == 0) {
      return res.status(404).json("La competencia no existe");
    }
    sqlEliminar = "DELETE FROM votos_pelicula where competencia_id=" + id + ";";
    conDb.query(sqlEliminar, function(error, resp) {
      if (error) {
        return res.status(500);
      }
      res.status(200);
    });
  });
}
function editarCompetencia(req, res) {
  var id = req.params.id;
  var verifComp = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(verifComp, function(error, resultVerif) {
    if (resultVerif.length == 0) {
      return res.status(404).json("La competencia no existe");
    }
    var nombre = req.body.nombre;
    sqlEditar ="UPDATE competicion SET nombre='" + nombre + "' where id=" + id + ";";
    conDb.query(sqlEditar, function(error, resp) {
      if (error) {
        return res.status(500);
      }
      res.status(200);
    });
  });
}
function obtenerGeneros(req, res) {
  sql = "SELECT * FROM genero ORDER BY nombre;";
  conDb.query(sql, function(error, resp) {
    if (error) {
      return res.status(500);
    }
    res.send(resp);
  });
}
function obtenerDirectores(req, res) {
  sql =
    "SELECT dp.director_id as id, p.director as nombre FROM pelicula p JOIN director_pelicula dp ON dp.pelicula_id = p.id ORDER BY nombre;";
  conDb.query(sql, function(error, resp) {
    if (error) {
      return res.status(500);
    }
    res.send(resp);
  });
}
function obtenerActores(req, res) {
  sql = "SELECT * FROM actor ORDER BY nombre;";
  conDb.query(sql, function(error, resp) {
    if (error) {
      return res.status(500);
    }
    res.send(resp);
  });
}
function obtenerCompetencia(id, res) {
  var sql = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(sql, function(error, result) {
    if (error) {
      return res.status(500);
    }
    if (result.length == 0) {
      return res.status(404).json("La competencia no existe");
    }
    var sqlColumns = "SELECT c.id as id, c.nombre as nombre";
    var sqlTables = " FROM competicion c";
    if (result[0].actor_id) {
      sqlColumns = sqlColumns.concat(", a.nombre as actor_nombre");
      sqlTables = sqlTables.concat(" JOIN actor a ON a.id=c.actor_id");
    }
    if (result[0].genero_id) {
      sqlColumns = sqlColumns.concat(", g.nombre as genero_nombre");
      sqlTables = sqlTables.concat(" JOIN genero g ON g.id=c.genero_id");
    }
    if (result[0].director) {
      sqlColumns = sqlColumns.concat(", d.nombre as director_nombre");
      sqlTables = sqlTables.concat(" JOIN director d ON c.director=d.id");
    }
    var sqlCompetencia = sqlColumns.concat(
      sqlTables + " WHERE c.id=" + id + ";"
    );
    conDb.query(sqlCompetencia, function(error, resultComp) {
      if (error) {
        return res.status(500);
      }
      res.send(resultComp[0]);
    });
  });
}

module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones,
  votar: votar,
  obtenerResultados: obtenerResultados,
  crearCompetencia: crearCompetencia,
  eliminarCompetencia: eliminarCompetencia,
  eliminarVotos: eliminarVotos,
  obtenerGeneros: obtenerGeneros,
  obtenerDirectores: obtenerDirectores,
  obtenerActores: obtenerActores,
  obtenerCompetencia: obtenerCompetencia,
  editarCompetencia: editarCompetencia
};
