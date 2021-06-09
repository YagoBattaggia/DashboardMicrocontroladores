const express = require('express');
var requests = require('request');
const app = express();
const rotinas = require('./public/js/rotinas.js')
var lastTime = Date.now()

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Iniciando servidor web
app.listen(3000 , () => console.log(`Listening on port 3000`));

const WebSocket = require('ws');
// Iniciando servidor websockets
const wss = new WebSocket.Server({ port: 8083 });

let sockets = [];
wss.on('connection', function connection(ws, req) {
    sockets.push(ws);
    console.log(logDate() + ' - \x1b[36m%s\x1b[0m', '[CLIENT CONNECTED] - ' + req.url);

    ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    sockets.forEach(s => s.send(message));
    });

});

wss.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
});

function sendSocketMessage(message, value){
    console.log(`[WEBSOCKETS] Transmitindo mensagem: {"name":${message}, "value":${value}}`)
    sockets.forEach(s => s.send(JSON.stringify({"name":message, "value":value})));
}

function logDate(){
    data = new Date();
    return data.toString();
}

// Função para sleep
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 

async function execRotinas(){
    data = new Date();
    minutos = (data.getMinutes() < 10) ? ('0'+ data.getMinutes()) : data.getMinutes();
    console.log(`Checando Horário! ${data.getHours()}:${minutos}`)
    // Caso a rotina do último minuto não tenha rodado
    if(Math.abs(lastTime - data) > 120000){
        data.setMinutes(data.getMinutes() - 1)
        rot = await rotinas.getRotinaByTime(data);

        if(rot && rot.length >= 1){
            // Itera entre cada rotina
            rot.forEach(function(r){
                console.log(logDate() + " - [ROTINAS] Rodando rotina desatualizada! Nome: " + r.name);
                passoAPassoRotina(r.name, r.passos)
    
            })
        }

    } else {
        rot = await rotinas.getRotinaByTime(data);
        // Se tiver alguma rotina
        if(rot && rot.length >= 1){
            // Itera entre cada rotina
            rot.forEach(function(r){
                console.log(logDate() + " - [ROTINAS] Rodando rotina atualizada! Nome: " + r.name);
                passoAPassoRotina(r.name, r.passos)
            })
        }
    }
    lastTime = data
}

async function passoAPassoRotina(name, passos){
    var prom = []
    // Itera entre cada passo da rotina
    for(passo of passos){
        await Promise.all(prom)
        if(passo[0] == "Alterar Estado"){
            sendSocketMessage(passo[1], passo[2])
        } else if (passo[0] == "Delay"){
            prom.push(sleep(passo[1]))
        }

    }
    console.log(logDate() + " - [ROTINAS] Rotina finalizada! Nome: " + name);
}

// Intervalo de chegagem da hora para rodar rotinas
IntervalChecaHorarios = setInterval(execRotinas, 60000);

// Endpoint para testes de envio de eventos websockets
app.get('/send/:msg', (req, res) => {
    sockets.forEach(s => s.send(req.params.msg));
    console.log('Sending:' + req.params.msg)
    res.sendStatus(200)
})

// Endpoints da API de rotinas
app.get('/rotinas', rotinas.getRotinas)
app.get('/rotinas/:id', rotinas.getRotina)
app.post('/rotinas', rotinas.addRotina)
app.delete('/rotinas', rotinas.delRotina)
app.patch('/rotinas', rotinas.patchRotina)

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/public/index.html');
});