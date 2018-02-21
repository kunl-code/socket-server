const express = require( 'express' );
const bodyParser = require( 'body-parser');
const path = require( 'path');
const mysql = require('mysql');
const Future = require('fluture');

const app = express();
const client = new mysql.createConnection({ host: 'DEVLSPMDBLX01', user: 'svcTracDev', password : 'Test!@#', multipleStatements :true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function( req, res){
    getTimeSeriesIdentifierMeasure().fork(
        err => {
            res.status(500).send('Error occurred on the server' + err)
        },
        data => {
            res.status(200).send(data);
        }
    )
});

function getTimeSeriesIdentifierMeasure(){
    const sql = 'SELECT tsd.date, tsd.identifier, tsi.description, tsd.measure FROM firm.time_series_data tsd'
     +' INNER JOIN firm.dataset_dictionary dd ON tsd.dataset_dictionary_ID = dd.dataset_dictionary_ID'
     +' INNER JOIN firm.time_series_identifier tsi ON tsi.id = tsd.time_series_data_ext_ID'
     +' inner join (select max(`date`) `date`, identifier from firm.time_series_data group by identifier) tsdMax ON tsdMax.date = tsd.date and tsdMax.identifier = tsd.identifier'
     +' WHERE dd.dataset_type = ?'
     +' ORDER BY tsd.date desc'

    return Future((reject, resolve) => {
            client.query(sql, ['API'], (err, result) => { err ? reject(err) : resolve(result)
        })
    })
}

app.listen(3010, function(){
    console.log('server on 3010');
});



