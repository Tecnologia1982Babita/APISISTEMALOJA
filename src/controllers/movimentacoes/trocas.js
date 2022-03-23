const db = require("../../config/database");
const StringBuilder = require("string-builder");

exports.listAllProducts  = async (request, response) => {

const cpf = parseInt(request.params.cpf);
const fornecedor = parseInt(request.params.fornecedor);
const codvendedor = parseInt(request.params.codvendedor);
const nomclie = parseInt(request.params.nomclie);
const dataini = parseInt(request.params.dataini);
const datafin = parseInt(request.params.datafin);


var novadataini = "'"+dataini.toString()+"'";

var novadatafin = "'"+datafin.toString()+"'";




var where = new StringBuilder();



if(cpf != 0 && cpf != null){
    where.append(" and doctoclie = '"+cpf+"' ");
}

if(fornecedor != 0 && fornecedor != null){
    where.append(" and codigofab = '"+fornecedor+"' ");
}

if(codvendedor != 0 && codvendedor != null){
    where.append(" and codigovend = "+codvendedor+" ");
}

if(nomclie != 0 && nomclie != null){
    where.append(" and nomeclie = '"+nomclie+"' ");
} 


console.log(cpf, fornecedor, codvendedor, dataini, datafin, where);


 

const rows = await db.query('SELECT distinct trocas.documento,  trocas.data,  trocas.hora, codigovend, \r\
doctoclie, nomeclie, totaldesc, totalacre, totalitens, totalgeral,  trocas.operador, \r\
cancelado, alteracoes, bloqueado, vendedores.nome FROM trocas inner join itrocas on itrocas.documento = trocas.documento inner join vendedores on  vendedores.numero = codigovend  \r\
where trocas.data>='+novadataini+' and trocas.data<='+novadatafin+'  '+where+'');

         
 return response.json(rows.rows);
};
