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


var latin = "'LATIN1'"
var duzentos = "'200'"
var vazio = "''"


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


 

const rows = await db.query('SELECT distinct pedidos.documento, pedidos.data, pedidos.hora, pedidos.codigovend, pedidos.doctoclie, replace(replace(((convert_to(retira_acentuacao(pedidos.nomeclie),'+latin+'))::VARCHAR),'+duzentos+','+vazio+'),'+vazio+','+vazio+') as nomeclie, pedidos.totaldesc,\r\
pedidos.totalacre, pedidos.totalitens, pedidos.totalgeral, pedidos.operador, pedidos.cancelado, pedidos.desc_vista,\r\
pedidos.alteracoes, pedidos.bloqueado,vendedores.nome\r\
FROM pedidos  inner join\r\
ipedidos on ipedidos.documento = pedidos.documento inner join vendedores on  vendedores.numero = codigovend\r\
where pedidos.data>='+novadataini+' and pedidos.data<='+novadatafin+'  '+where+'');

         
 return response.json(rows.rows);
};
