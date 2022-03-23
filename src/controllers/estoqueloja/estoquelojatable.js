const db = require("../../config/databasecloud");
const StringBuilder = require("string-builder");

exports.listAllProducts  = async (request, response) => {

const loj_num = parseInt(request.params.loj_num);
const rev_cod = parseInt(request.params.rev_cod);
const item = parseInt(request.params.item);
const codigo_fornecedor = parseInt(request.params.codigo_fornecedor);
const referencia = parseInt(request.params.referencia);
const menor_igual_estq = parseInt(request.params.menor_igual_estq);
const rev_numpag = parseInt(request.params.rev_numpag);

var lojaum = "'1'";
var loj_numa = "'"+loj_num.toString()+"'";


var where = new StringBuilder();

var est = new StringBuilder();

if(item != 0 && item != null){
    where.append(" and item = '"+item+"' ");
}

if(codigo_fornecedor != 0 && codigo_fornecedor != null){
    where.append(" and codigo = '"+codigo_fornecedor+"' ");
}

if(referencia != 0 && referencia != null){
    where.append(" and produtos_sku_cliente = "+referencia+" ");
}

if(rev_numpag != 0 && rev_numpag != null){
    where.append(" and pagina = '"+rev_numpag+"' ");
} 

if(menor_igual_estq != 0 && menor_igual_estq != null){
    est.append(" having sum(g.qtd_estoque) <= "+menor_igual_estq+" ");
 }      
 

 where_rev = "";

if(rev_cod != 0 && rev_cod != null){
    where_rev = " and rev_cod = "+rev_cod+" ";
}else {
    where_rev = " and rev_cod = (select rev_num_rev from erp_revistas where rev_lan is not null and rev_lan < now() order by rev_lan::date desc limit 1) ";
}
 

const rows = await db.query('select g.codigo, g.nome_fornecedor, g.item, g.produtos_descricao , g.pagina,\r\
 g.loja, sum(g.qtd_estoque) as qtd_estoque, sum(g.qtdlogistica) as qtdlogistica,g.preco_basico, g.dat_inc, g.produtos_tamanho, g.tam_nom, g.produtos_sku_cliente\r\
 from (select distinct a.codigo, a.nome_fornecedor, a.item,  a.pagina, \r\
 a.loja, a.qtd_estoque as qtd_estoque, b.qtdlogistica as qtdlogistica, a.preco_basico, a.produtos_descricao, a.dat_inc, a.produtos_tamanho, a.tam_nom, a.produtos_sku_cliente from (\r\
 (SELECT codigo, nome_fornecedor, item, coalesce(erp_produtos.produtos_descricao, desc_basica) as produtos_descricao, pagina, \r\
 loja, sum(qtd_estoque) as qtd_estoque, preco_basico, dat_inc  ,rev_cod , produtos_tamanho, tam_nom, produtos_sku_cliente\r\
 FROM view_estoque \r\
 left join erp_produtos on (erp_produtos.produtos_num_item = view_estoque.item::Integer and erp_produtos.produtos_num_fornecedor = view_estoque.codigo::Integer)\r\
 left join erp_tamanho on(erp_tamanho.tam_cod = erp_produtos.produtos_tamanho)\r\
 where loja = '+loj_numa+' '+where+' '+where_rev+'\r\
 group by codigo, desc_basica, produtos_descricao, nome_fornecedor, item, pagina, produtos_sku_cliente, \r\
 loja, preco_basico, dat_inc  ,rev_cod, produtos_tamanho, tam_nom) a left  join\r\
 (SELECT  distinct  codigo, nome_fornecedor, item, coalesce(erp_produtos.produtos_descricao,desc_basica) as produtos_descricao, pagina, \r\
 loja, sum(qtd_estoque) as qtdlogistica, preco_basico, dat_inc  ,rev_cod, produtos_sku_cliente \r\
 FROM view_estoque \r\
 left join erp_produtos on (erp_produtos.produtos_num_item = view_estoque.item::Integer and erp_produtos.produtos_num_fornecedor = view_estoque.codigo::Integer)\r\
 where loja = '+lojaum+' '+where_rev+'\r\
 group by  codigo, nome_fornecedor, item, pagina, produtos_descricao, desc_basica, produtos_sku_cliente,\r\
 loja, preco_basico, dat_inc  ,rev_cod)b on \r\
 (a.codigo = b.codigo and a.item = b.item and a.pagina = b.pagina and a.rev_cod = b.rev_cod)))g group by g.codigo, g.nome_fornecedor, g.item,  g.pagina, \r\
 g.loja,g.preco_basico, g.dat_inc, g.produtos_descricao, g.produtos_tamanho, g.tam_nom, g.produtos_sku_cliente '+est+' order by g.pagina');  
   

         
 return response.json(rows.rows);
};
