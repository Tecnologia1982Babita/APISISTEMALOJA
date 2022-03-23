const db = require("../../config/databasecloud");
//const StringBuilder = require("string-builder");

exports.listAllProducts  = async (request, response) => {

const datainicial = parseInt(request.params.dataini);

const datafinal = parseInt(request.params.datafin);

const loja = parseInt(request.params.loja);

var novaloja = "'"+loja.toString()+"'";

var colecao = "'COLEÇÃO'";
var revistaregular = "'REVISTA REGULAR'";

var revistaplus = "'REVISTA PLUS'";

var novadatainicial = "'"+datainicial.toString()+"'";


var novadatafinal = "'"+datafinal.toString()+"'";




const rows = await db.query('select   case when((produtos_revista) > 2) then '+colecao+' else case when(produtos_revista = 1) then '+revistaregular+' else '+revistaplus+' end end as rev_nom,coalesce((((((venda-meta)*-1)*100)/((case when((meta) = 0) then 1 else ((meta)) end)))::numeric(10,2)),0) as procentagemfalta, \r\
coalesce(((((venda)*100)/((case when((meta) = 0) then 1 else ((meta)) end)))::numeric(10,2)),0) as porcentagemvenda,\r\
((venda-meta)*-1) as falta,\r\
* from (\r\
select  produtos_revista,sum(venda) as venda, sum(meta) as meta from (\r\
select * from (\r\
select \r\
case when((rev_cod) > 2) then '+colecao+' else case when(rev_cod = 1) then '+revistaregular+' else '+revistaplus+' end end as rev_nom,\r\
coalesce(rev_cod,0) as produtos_revista,\r\
coalesce(sum(valor),0) as venda, \r\
metven_valdiaria as meta,\r\
  case when(coalesce((metven_valdiaria-sum(valor)),0) < 0) then ((coalesce(metven_valdiaria-sum(valor),0))*-1) else (coalesce(metven_valdiaria-sum(valor),0)) end as falta\r\
from (select sum(metven_valdiaria) as metven_valdiaria,\r\
  loj_cod,\r\
  rev_cod\r\
  from erp_meta_vendedora where metven_datini>='+novadatainicial+' and metven_datini<='+novadatafinal+'and loj_cod='+novaloja+' group \r\
 by loj_cod,rev_cod) as erp_meta_vendedora \r\
full join meta_vendas_total on  loja_origem = '+novaloja+' and data>='+novadatainicial+' and data<='+novadatafinal+' and rev_cod = produtos_revista \r\
where \r\
(loj_cod ='+novaloja+') group by metven_valdiaria,rev_cod)a)b group by produtos_revista)a');

 return response.json(rows.rows);
};
