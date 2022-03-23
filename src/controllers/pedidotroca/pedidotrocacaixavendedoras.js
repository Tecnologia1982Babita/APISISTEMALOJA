const db = require("../../config/database");

exports.listAllProducts  = async (request, response) => {

const data = parseInt(request.params.data);
 
var novadata = "'"+data.toString()+"'";

var vazio = "' - '"


 const rows = await db.query('select  coalesce(q.nomven,g.nomven) as nomven, sum(q.valor_total_pedidos) as valor_total_pedidos, sum(g.valor_total_trocas) as valor_total_trocas,\r\
     sum(( coalesce(q.valor_total_pedidos,0) - coalesce(g.valor_total_trocas,0))) as valor_total from (\r\
     select pedidos.codigovend ||'+vazio+'||nome as nomven,\r\
     sum(pedidos.totalgeral) as valor_total_pedidos,\r\
     pedidos.doctoclie ,\r\
     pedidos.codigovend\r\
     from pedidos \r\
 left join\r\
          vendedores on numero = codigovend \r\
 where pedidos.data ='+novadata+'  group by  pedidos.codigovend,nome,\r\
     pedidos.doctoclie) as q full join\r\
     (select trocas.codigovend ||'+vazio+'||nome as nomven,\r\
     sum(trocas.totalgeral) as valor_total_trocas,\r\
     trocas.doctoclie,\r\
     trocas.codigovend\r\
     from trocas left join\r\
          vendedores on numero = codigovend where  trocas.data ='+novadata+'   group by trocas.nomeclie,trocas.codigovend,nome,\r\
     trocas.doctoclie) as g on q.codigovend = g.codigovend and q.doctoclie = g.doctoclie group by coalesce(q.nomven,g.nomven) order by valor_total desc');




 
 
 
 return response.json(rows.rows);
  };
