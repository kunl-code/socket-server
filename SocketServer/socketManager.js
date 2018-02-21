const http = require('http');
const io = require('./index.js').io;

module.exports = function(socket){
    console.log('Socket Id: ' + socket.id);   
    setInterval(()=> {
        http.get("http://localhost:3010", (res) =>{        
            let body = '';
    
            res.on('data', (chunk) => {
                body += chunk;
            });
    
            res.on('end', () => {
                io.sockets.emit('timeSeries', body);
            });            
        }).end();
    },10000);    
}