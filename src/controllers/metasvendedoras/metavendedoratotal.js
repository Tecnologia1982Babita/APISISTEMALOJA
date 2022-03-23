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

console.log()


const rows = await db.query('	select  coalesce((((((venda-meta)*-1)*100)/((case when((meta) = 0) then 1 else ((meta)) end)))::numeric(10,2)),0) as procentagemfalta, \r\
coalesce(((((venda)*100)/((case when((meta) = 0) then 1 else ((meta)) end)))::numeric(10,2)),0) as porcentagemvenda,\r\
((venda-meta)*-1) as falta,\r\
* from (\r\
select codigovend,ven_nome,sum(venda) as venda, sum(meta) as meta from (\r\
select * from (\r\
select \r\
metven_datini,\r\
coalesce(erp_meta_vendedora.ven_cod) as codigovend,\r\
  coalesce(erp_vendedores.ven_nome,meta_vendas_total.ven_nome) as ven_nome, \r\
coalesce(sum(valor),0) as venda, \r\
metven_valdiaria as meta,\r\
  case when(coalesce((metven_valdiaria-sum(valor)),0) < 0) then ((coalesce(metven_valdiaria-sum(valor),0))*-1) else (coalesce(metven_valdiaria-sum(valor),0)) end as falta\r\
from (select sum(metven_valdiaria) as metven_valdiaria,\r\
  metven_datini,\r\
  ven_cod,\r\
  loj_cod,\r\
  rev_cod\r\
 from erp_meta_vendedora where metven_datini>='+novadatainicial+' and metven_datini<='+novadatafinal+'  group \r\
 by ven_cod,loj_cod,rev_cod,metven_datini ) as erp_meta_vendedora left join erp_vendedores on erp_meta_vendedora.ven_cod = ven_numero and loj_cod = ven_loja \r\
full join meta_vendas_total on erp_meta_vendedora.ven_cod = codigovend and loja_origem = loj_cod and data = metven_datini and rev_cod = produtos_revista \r\
where (metven_datini>='+novadatainicial+' and metven_datini<='+novadatafinal+') and \r\
(loj_cod ='+novaloja+') group by case when((rev_cod) > 2) then '+colecao+' else case when(rev_cod = 1) then '+revistaregular+' else '+revistaplus+' end end,coalesce(erp_vendedores.ven_nome,meta_vendas_total.ven_nome),metven_valdiaria,metven_datini,erp_meta_vendedora.ven_cod)a)b group by codigovend,ven_nome order by ven_nome)a\r\
');
   

         
 return response.json(rows.rows);
};
