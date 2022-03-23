const db = require("../../config/database");

exports.listAllProducts  = async (request, response) => {

const data = parseInt(request.params.data);
 
var novadata = "'"+data.toString()+"'";




 const rows = await db.query(' select  sum(q.valor_total_pedidos) as valor_total_pedidos, sum(g.valor_total_trocas) as valor_total_trocas,  \r\
 sum(( coalesce(q.valor_total_pedidos,0) - coalesce(g.valor_total_trocas,0))) as valor_total from ( \r\
 select pedidos.nomeclie, \r\
 sum(pedidos.totalgeral) as valor_total_pedidos, pedidos.doctoclie  \r\
 from pedidos where pedidos.data ='+novadata+'  group by  nomeclie,pedidos.doctoclie) as q full join  \r\
 (select trocas.nomeclie, \r\
 sum(trocas.totalgeral) as valor_total_trocas, \r\
 trocas.doctoclie  \r\
 from trocas where  trocas.data ='+novadata+'   group by trocas.nomeclie,trocas.doctoclie) as g on g.doctoclie = q.doctoclie');




 
 
 
 return response.json(rows.rows);
  };
