const express = require('express');

const metaslojasgeraldia = require('./controllers/metaslojasgeral/metaslojageraldia');

const pedidotrocatable = require('./controllers/pedidotroca/pedidotrocatable');

const pedidotrocacaixavendedoras = require('./controllers/pedidotroca/pedidotrocacaixavendedoras');

const pedidotrocacaixatotais = require('./controllers/pedidotroca/pedidotrocacaixatotais');

const estoquefornecedortotal = require('./controllers/estoquefornecedor/estoquefornecedortotal');

const estoquefornecedortablefor = require('./controllers/estoquefornecedor/estoquefornecedortablefor');

const estoquefornecedortable = require('./controllers/estoquefornecedor/estoquefornecedortable');

const estoquelojatable= require('./controllers/estoqueloja/estoquelojatable');

const pedidotrocacaixatable = require('./controllers/pedidotrocacaixa/pedidotrocacaixatable');

const metavendedoratotal = require('./controllers/metasvendedoras/metavendedoratotal');

const metavendedoratotalrev = require('./controllers/metasvendedoras/metavendedoratotalrev');

const metavendedoravend = require('./controllers/metasvendedoras/metavendedoravend');

const pedidos = require('./controllers/movimentacoes/pedidos');

const trocas = require('./controllers/movimentacoes/trocas');

const entradas = require('./controllers/movimentacoes/entradas');

const devolucoes = require('./controllers/movimentacoes/devolucoes');

const cancelamentos = require('./controllers/movimentacoes/cancelamentos');








const routes = express.Router();



//routes.post('/checkproinsert/:array',checkproinsert.createProduct);

routes.get('/metaslojasgeraldia/',metaslojasgeraldia.listAllProducts);

routes.get('/pedidotrocatable/:data',pedidotrocatable.listAllProducts);

routes.get('/pedidotrocacaixavendedoras/:data',pedidotrocacaixavendedoras.listAllProducts);

routes.get('/pedidotrocacaixatotais/:data',pedidotrocacaixatotais.listAllProducts);

routes.get('/estoquefornecedortotal/:loja',estoquefornecedortotal.listAllProducts);

routes.get('/estoquefornecedortablefor/:dataini/:datafin/:codigofor/:loja',estoquefornecedortablefor.listAllProducts);

routes.get('/estoquefornecedortable/:dataini/:datafin/:loja',estoquefornecedortable.listAllProducts);

routes.get('/estoquelojatable/:loj_num/:rev_cod/:item/:codigo_fornecedor/:referencia/:menor_igual_estq/:rev_numpag',estoquelojatable.listAllProducts);

routes.get('/pedidotrocacaixatable/:data',pedidotrocacaixatable.listAllProducts);

routes.get('/metavendedoratotal/:dataini/:datafin/:loja',metavendedoratotal.listAllProducts);

routes.get('/metavendedoratotalrev/:dataini/:datafin/:loja',metavendedoratotalrev.listAllProducts);

routes.get('/metavendedoravend/:dataini/:datafin/:loja',metavendedoravend.listAllProducts);

routes.get('/pedidos/:dataini/:datafin/:cpf/:fornecedor/:codvendedor/:nomclie',pedidos.listAllProducts);

routes.get('/trocas/:dataini/:datafin/:cpf/:fornecedor/:codvendedor/:nomclie',trocas.listAllProducts);

routes.get('/entradas/:dataini/:datafin/:cpf/:fornecedor/:codvendedor/:nomclie',entradas.listAllProducts);

routes.get('/devolucoes/:dataini/:datafin/:cpf/:fornecedor/:codvendedor/:nomclie',devolucoes.listAllProducts);

routes.get('/cancelamentos/:dataini/:datafin/:cpf/:fornecedor/:codvendedor/:nomclie',cancelamentos.listAllProducts);













module.exports = routes;
