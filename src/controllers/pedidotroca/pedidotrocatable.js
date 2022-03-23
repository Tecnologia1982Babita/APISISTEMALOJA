const db = require("../../config/database");

exports.listAllProducts  = async (request, response) => {

const data = parseInt(request.params.data);
 
var novadata = "'"+data.toString()+"'";

var latin = "'LATIN1'"
var duzentos = "'200'"
var vazio = "''"


 const rows = await db.query('select coalesce(q.doctoclie,g.doctoclie) as docto_cli,replace(replace(((convert_to(retira_acentuacao(coalesce(q.nomeclie,g.nomeclie)),'+latin+'))::VARCHAR),'+duzentos+','+vazio+'),'+vazio+','+vazio+') as nome_cli, q.valor_total_pedidos, g.valor_total_trocas, ( coalesce(q.valor_total_pedidos,0) - coalesce(g.valor_total_trocas,0)) as valor_total from \r\
 (select pedidos.nomeclie,sum(pedidos.totalgeral) as valor_total_pedidos,pedidos.doctoclie from pedidos where pedidos.data ='+novadata+' group by nomeclie,pedidos.doctoclie) as q full join (select trocas.nomeclie,sum(trocas.totalgeral) as valor_total_trocas,trocas.doctoclie from trocas \r\
 where trocas.data ='+novadata+' group by trocas.nomeclie,trocas.doctoclie) as g on g.doctoclie = q.doctoclie;\r\
 ');




 
 
 
 return response.json(rows.rows);
  };
