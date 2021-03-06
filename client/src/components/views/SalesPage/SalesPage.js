import React, {useState, useEffect} from 'react';
import { USER_SERVER } from '../../Config';
import { Card } from 'react-bootstrap';
import axios from 'axios';


function HistoryPage(props) {

    const [data, setData] = useState({ pagos: [] });

    useEffect(async () => {
        const result = await axios(`${USER_SERVER}/getSales`);
        console.log(result.data);
        setData(result.data);
    }, []);

    const fecha = (date) => {
        let hora = parseInt(date.slice(11, 13)) - 3;
        if (hora<10) { hora = "0" + hora.toString() };
        let fecha = date.slice(0, 10) + " a las " + hora + date.slice(13, 16) + "hs - Argentina";
        return fecha
    };

    const importe = (quantity, price) => {
        let importe = quantity*price;
        return importe
    };

    const diaDeCobro = (timestamp) => {
        let suma = timestamp + 1209600000;   // restarle 3 horas
        let diaDeCobro = new Date(suma);
        diaDeCobro = diaDeCobro.toISOString().slice(0, 10) + " a las " + diaDeCobro.toISOString().slice(11, 16) + "hs";

        // el {diaDeCobro(item.product[0].dateOfPurchase)}

        return diaDeCobro
    }

    let estiloAnch = {width:'75%', margin:'2rem auto'};
    try {
        if (window.screen.width<=767) {
            estiloAnch = {width:'100%', margin:'2rem auto'};
        }
    } catch(e) {};


    return (
        <div style={estiloAnch}>
            
            <div style={{textAlign:'center', margin:'2rem auto'}}>
                <h1 style={{backgroundColor:'violet', height:'70px', lineHeight:'1.6'}}>VENTAS</h1>
            </div>

            
            
                {data.pagos.map(item => (
                    <Card style={{marginBottom:'20px', backgroundColor:'#eeeeee'}} key={item.mpJSON.id}>
                        <Card.Body>
                            <Card.Text style={{margin:'2.5% 7% 3% 7%', fontSize:'1.1rem'}}>
                                <span> Fecha: {fecha(item.createdAt)} {item.product[0].dateOfPurchase} <br/> </span>
                                <span> Vendidos: {
                                    item.product.map(article => {
                                        return (
                                            <span key={article.id}> <br/>
                                                &nbsp;&nbsp;-{article.name} | id: {article.id} | cantidad: {article.quantity} | precio: ${article.price} | <span style={{fontWeight:'600'}}> Total: ${importe(article.quantity, article.price)} </span>
                                            </span>
                                        )
                                    })
                                } <br/> <span style={{fontWeight:'600'}}> Total por venta: ${item.mpJSON.transaction_amount} - Neto a recibir: ${item.mpJSON.transaction_details.net_received_amount} </span> <br/> </span>
                                <span> Usuario: {item.user.email} <br/> </span>
                                <span> Método de pago: {item.mpJSON.payment_method_id} - {item.mpJSON.payment_type_id} <br/> </span>
                                <span> Identificador de pago: {item.mpJSON.id} <br/> Estado: {item.mpJSON.status} {item.mpJSON.status_detail} <br/> </span>
                                <span> Referencia externa: {item.mpJSON.external_reference} </span>
                                
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            
        </div>
    )
}


export default HistoryPage
