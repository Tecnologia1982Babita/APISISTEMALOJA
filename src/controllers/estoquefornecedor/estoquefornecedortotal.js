const db = require("../../config/databasecloud");

exports.listAllProducts  = async (request, response) => {

const loja = parseInt(request.params.loja);


 const rows = await db.query('select sum(qtd_estoque_total) as total_estoque, sum(preco_total) as total_valor from (\r\
    SELECT nome_fornecedor, codigo, loja, lojas_nome, sum(qtd_estoque) as qtd_estoque_total, \r\
    sum(prcvenda_x_quantidade) as preco_total\r\
   FROM view_estoque \r\
   where loja::integer = '+loja+'\r\
    group by nome_fornecedor, codigo, loja, lojas_nome order by qtd_estoque_total desc ) a limit 1\r\
');




 
 
 
 return response.json(rows.rows);
  };
