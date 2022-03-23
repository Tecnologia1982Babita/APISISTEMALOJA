const db = require("../../config/databasecloud");

exports.listAllProducts  = async (request, response) => {


var total = "'Total'";
var vintecinco = "'25'";
var vazio= "''";
var verdadeiro = "'true'"; 
var falso = "'false'";
var diamaiusculo = "'Day'";
var mes = "'month'";
var ummes = "'1 month'";
var umdia = "'1 day'";
var mesmaiuculo = "'Month'";
var anomaisuclo = "'Year'" ;

var data = "'2021-10-20 16:30:01.632883-02'";

var novadatafinal = "'"+data+"'";

console.log(total, vintecinco, vazio, verdadeiro, falso, diamaiusculo, mes,ummes,ummes, mesmaiuculo,anomaisuclo,data)


 const rows = await db.query('Select distinct query.Loja, query.Total, Case When (query.Loja = 99) Then '+total+' \r\
 Else erp_lojas.loj_nom End As loj_nom, case when(ordem = '+vintecinco+') then '+vazio+' \r\
 else (case when((substr((age(now(),((data_atualiza||'+vazio+'||hora_atualiza)::timestamp)))::varchar,4,2)::integer) <= 10) \r\
 then '+verdadeiro+' else '+falso+' end) end::boolean as parado, query.Total-(metloj_valmen/quantosdiasmesnovo((Extract('+'Day'+' \r\
from (date_trunc('+anomaisuclo+',now()) + INTERVAL'+ummes+' - INTERVAL'+ummes+')))::integer, (Extract('+mesmaiuculo+' '+data+'))::varchar,\r\
 (Extract('+mesmaiuculo+' from '+data+'))::varchar))::numeric(8,2) As diferencavalor, (query.Total)::numeric(8,2) As Total1, (metloj_valmen)::numeric(8,2) \r\
  As mensal ,(metloj_valmen/case when query.Loja <> 2 then (quantosdiasmesnovo((Extract('+diamaiusculo+' from (date_trunc('+anomaisuclo+',now()) + INTERVAL'+ummes+' - \r\
 INTERVAL'+ummes+')))::integer, (Extract('+mesmaiuculo+' from '+data+'))::varchar, (Extract('+mesmaiuculo+' from '+data+'))::varchar))\r\
  else metloj_dias end)::numeric(8,2) As diaria , metloj_valmen::numeric(8,2), ((((query.Total)*100)/(metloj_valmen/(quantosdiasmesnovo\r\
    ((Extract('+diamaiusculo+' from (date_trunc('+anomaisuclo+',now()) + INTERVAL'+ummes+' - INTERVAL'+ummes+')))::integer,(Extract\r\
      ('+mesmaiuculo+' from '+data+'))::varchar, (Extract('+mesmaiuculo+' from '+data+'))::varchar))))::numeric(10,2)) as \r\
      faltapor,erp_atualizacao.data_atualiza, erp_atualizacao.hora_atualiza, Case When (query.Loja = 99) Then '+falso+'\r\
      Else case when(ordem = '+vintecinco+') then '+falso+' else (case when((metloj_valmen/quantosdiasmesnovo\r\
        ((Extract('+diamaiusculo+' from (date_trunc('+anomaisuclo+',now()) + INTERVAL'+ummes+' - INTERVAL'+ummes+')))::integer,\r\
        (Extract('+mesmaiuculo+' from '+data+'))::varchar, (Extract('+mesmaiuculo+' from '+data+'))::varchar)) < query.Total)\r\
 then '+verdadeiro+' else '+falso+' end) end end::boolean as metamensalicon \r\
  From erp_lojas Full Join\r\
                 erp_atualizacao On (erp_lojas.loj_num =\r\
                 erp_atualizacao.loja_origem) full join\r\
                 erp_metas_lojas eml on cod_loja = erp_lojas.loj_num and metloj_status = 1 full join\r\
                 (Select view_total_pedidos_trocas.loja_origem As Loja,\r\
                 Sum(view_total_pedidos_trocas.valor) As Total,\r\
                 Null As ordem\r\
                 From view_total_pedidos_trocas\r\
                 Where (view_total_pedidos_trocas.data >= '+data+' and view_total_pedidos_trocas.data <= '+data+')\r\
                 Group By view_total_pedidos_trocas.loja_origem\r\
                 union\r\
                 Select 99 As Loja,Sum(view_total_pedidos_trocas.valor) As Total,\r\
                 Null As ordem\r\
                 From view_total_pedidos_trocas\r\
                 Where (view_total_pedidos_trocas.data >= '+data+' and view_total_pedidos_trocas.data <= '+data+' and loja_origem <> 2)\r\
                 Order By Total) query On (query.Loja = erp_lojas.loj_num)\r\
                 Where\r\
                 (query.Loja Is Not Null)\r\
                 order by faltapor desc');



              
 
 return response.json(rows.rows);

 
  };

/*
  

select metadiaria, metamensal from (
    select sum(metven_valdiaria_acessorios+metven_valdiaria_revista+metven_valdiaria_colecao)as metadiaria
    from erp_meta_vendedora
    inner join erp_lojas on erp_lojas.loj_num = erp_meta_vendedora.loj_cod
    inner join erp_atualizacao On erp_lojas.loj_num = erp_atualizacao.loja_origem
    where metven_datini between '20211014' and '20211014' 
    and metven_datfim between '20211014' and '20211014' 
    )b
    full join
    (
 
     select sum(metven_valdiaria_acessorios+metven_valdiaria_revista+metven_valdiaria_colecao)as metamensal 
   from erp_meta_vendedora where metven_datini between  
   (SELECT date_trunc('MONTH','20211001')) and (SELECT (date_trunc('MONTH', '20211031') + INTERVAL '1 MONTH - 1 day'))  
   and metven_datfim between (SELECT date_trunc('MONTH','20211001')) and (SELECT (date_trunc('MONTH', '2021-10-31')  + INTERVAL '1 MONTH - 1 day'))
    )a on 1=1





select meta_dia, coalesce(loj_cod,99) as loj_cod, coalesce(loj_nom,'TOTAL') as loj_nom, coalesce(venda_total,0.00) as venda_total, 
   coalesce((venda_total-meta_dia),-meta_dia) as diferenca_valor,
   case when meta_dia::integer = 0 then 0 else (((coalesce(venda_total,0)*100)/meta_dia)) end::numeric(10,2) as falta_porcent, data_atualiza, hora_atualiza from(
   select sum(metven_valdiaria_acessorios+metven_valdiaria_revista+metven_valdiaria_colecao)as meta_dia, erp_meta_vendedora.loj_cod, loj_nom, 
   data_atualiza, hora_atualiza
   from erp_meta_vendedora
   inner join erp_lojas on erp_lojas.loj_num = erp_meta_vendedora.loj_cod
   inner join erp_atualizacao On erp_lojas.loj_num = erp_atualizacao.loja_origem
   where metven_datini between '20211001' and '20211031' 
   and metven_datfim between '20211001' and '20211031'
   group by erp_meta_vendedora.loj_cod, loj_nom, data_atualiza, hora_atualiza) meta_diaria
   
   full join
   
   (
   Select view_total_pedidos_trocas.loja_origem As Loja,
   Sum(view_total_pedidos_trocas.valor) As venda_total
   From view_total_pedidos_trocas
   Where (view_total_pedidos_trocas.data >= '20211001' and view_total_pedidos_trocas.data <= '20211031')
   Group By view_total_pedidos_trocas.loja_origem
   union
   Select 99 As Loja,
   Sum(view_total_pedidos_trocas.valor) As venda_total
   From view_total_pedidos_trocas
   Where (view_total_pedidos_trocas.data >= '20211001' and view_total_pedidos_trocas.data <= '20211031')
   )vendas On (vendas.Loja = meta_diaria.loj_cod) order by falta_porcent desc*/