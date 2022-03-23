const db = require("../../config/database");
//const StringBuilder = require("string-builder");

exports.listAllProducts  = async (request, response) => {

const data = parseInt(request.params.data);


var LATIN1 = "'LATIN1'";
var duzentos = "'200'";

var vazio = "''";

var novadata = "'"+data.toString()+"'";




const rows = await db.query('select docto_cli, nome_cli, valor_total_pedidos, valor_total_trocas, valor_total, \r\
case when (coalesce(p.caipag_valor,0)) between valor_total - 005 and valor_total + 005 then 1 else 0 end as caixa from ( select coalesce(q.doctoclie,g.doctoclie) \r\
as docto_cli,replace(replace(((convert_to(retira_acentuacao(coalesce(q.nomeclie,g.nomeclie)),'+LATIN1+'))::VARCHAR),'+duzentos+','+vazio+'),'+vazio+','+vazio+') as nome_cli, \r\
q.valor_total_pedidos, g.valor_total_trocas, ( coalesce(q.valor_total_pedidos,0) - coalesce(g.valor_total_trocas,0)) as valor_total \r\
from (select pedidos.nomeclie,sum(pedidos.totalgeral) as valor_total_pedidos,pedidos.doctoclie from pedidos where pedidos.data ='+novadata+' \r\
group by nomeclie,pedidos.doctoclie) as q full join (select trocas.nomeclie,sum(trocas.totalgeral) as valor_total_trocas,trocas.doctoclie from trocas \r\
where trocas.data ='+novadata+' group by trocas.nomeclie,trocas.doctoclie) as g on g.doctoclie = q.doctoclie ) ab full join (select sum(caipag_valor) as caipag_valor,\r\
 caipag_cpfcnpj from erp_caixa_pagamento where caipag_data_caixa ='+novadata+' group by caipag_cpfcnpj) p on p.caipag_cpfcnpj = ab.docto_cli order by caixa desc, nome_cli');
   

         
 return response.json(rows.rows);
};
