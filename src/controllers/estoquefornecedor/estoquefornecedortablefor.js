const db = require("../../config/databasecloud");

exports.listAllProducts  = async (request, response) => {

const dataini = parseInt(request.params.dataini);
const datafin = parseInt(request.params.datafin);
const codigofor = parseInt(request.params.codigofor);
const loja = parseInt(request.params.loja);
 
var novadataini = "'"+dataini.toString()+"'";
var novadatafin = "'"+datafin.toString()+"'";
var pedido = "'PE'";
var troca = "'TR'"

console.log(dataini,datafin)


 const rows = await db.query('SELECT est.nome_fornecedor, est.codigo, est.loja, est.lojas_nome, est.qtd_estoque_total::integer, \r\
                  est.preco_total, coalesce(vend.qtd_venda_total,0)::integer as qtd_venda_total, coalesce(vend.venda_total,0.00) as venda_total \r\
                  from (\r\
                  SELECT nome_fornecedor, codigo, loja, \r\
                  lojas_nome, qtd_estoque_total, preco_total FROM (\r\
                  SELECT nome_fornecedor, codigo, loja, lojas_nome, sum(qtd_estoque) as qtd_estoque_total, \r\
                  sum(prcvenda_x_quantidade) as preco_total\r\
                  FROM view_estoque \r\
                  where loja::integer = '+loja+' AND codigo::integer = '+codigofor+'\r\
                  group by nome_fornecedor, codigo, loja, lojas_nome order by qtd_estoque_total desc )a\r\
                  where (a.qtd_estoque_total <> 0 or a.preco_total <> 0) order by qtd_estoque_total desc\r\
                  )est left join\r\
                  (\r\
                  SELECT for_nom, fornecedor, loja, loj_nom, sum(CASE WHEN tipo_movimentacao = '+pedido+' \r\
                  THEN qtde_total ELSE -(qtde_total) end) as qtd_venda_total, sum(CASE WHEN tipo_movimentacao = '+pedido+' \r\
                  THEN totalvenda ELSE -(totalvenda) end) as venda_total from (	\r\
                  SELECT for_nom, fornecedor, loja, loj_nom, sum(qtde)::integer as qtde_total, sum(totalval) as totalvenda, \r\
                  tipo_movimentacao\r\
                  FROM view_movimentacao_fornecedor \r\
                  where (tipo_movimentacao = '+pedido+' or tipo_movimentacao = '+troca+') and data::date between '+novadataini+' and '+novadatafin+'\r\
                  and loja::integer = '+loja+'  AND fornecedor::integer = '+codigofor+'\r\
                  group by fornecedor, loja, tipo_movimentacao, loj_nom, for_nom order by fornecedor )a\r\
                  group by a.for_nom, a.fornecedor, a.loja, a.loj_nom order by venda_total desc\r\
                  )vend ON est.codigo::integer = vend.fornecedor order by codigo desc\r\
 ');




 
 
 
 return response.json(rows.rows);
  };
