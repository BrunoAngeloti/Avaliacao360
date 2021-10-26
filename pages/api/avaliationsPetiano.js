import credentials from '../../credentials/google_sheets_api.json'

import  {GoogleSpreadsheet}  from 'google-spreadsheet';
import { TextSnippetOutlined } from '@mui/icons-material';

export default async function(req, res) {
  const doc = new GoogleSpreadsheet(credentials.id_google_spreadsheet);

  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo();
  
   if(req.method === 'GET'){
    const sheet = doc.sheetsByTitle[req.query.nameData];//! busca a sheet
    
    const rows = await sheet.getRows();
    const names = rows.map(({petiano,pergunta1,pergunta2,pergunta3,pergunta4,pergunta5,pergunta6,pergunta7,pergunta8,pergunta9,pergunta10,pergunta11,pergunta12,pergunta13}) => {
    
       if(petiano === req.query.name){
        return {
          petiano,pergunta1,pergunta2,
          pergunta3,pergunta4,pergunta5,
          pergunta6,pergunta7,pergunta8,
          pergunta9,pergunta10,pergunta11,
          pergunta12,pergunta13
        } 
       }
        return;
    })
    let infoResponse = names;
    const data = infoResponse.filter((petiano) => {
        if(petiano)
          return petiano
    })

    //! construção das médias e comentarios de todos petianos
    
    //? reduce ira diminuir o array de objetos para um unico objeto somando os valores
    var finalResult = [];
    finalResult.push(data.reduce((a, b) => ({pergunta1: parseInt(a.pergunta1) + parseInt(b.pergunta1)})));
    finalResult.push(data.reduce((a, b) => ({pergunta2: parseInt(a.pergunta2) + parseInt(b.pergunta2)})));
    finalResult.push(data.reduce((a, b) => ({pergunta3: parseInt(a.pergunta3) + parseInt(b.pergunta3)})));
    finalResult.push(data.reduce((a, b) => ({pergunta4: parseInt(a.pergunta4) + parseInt(b.pergunta4)})));
    finalResult.push(data.reduce((a, b) => ({pergunta5: parseInt(a.pergunta5) + parseInt(b.pergunta5)})));
    finalResult.push(data.reduce((a, b) => ({pergunta6: parseInt(a.pergunta6) + parseInt(b.pergunta6)})));
    finalResult.push(data.reduce((a, b) => ({pergunta7: parseInt(a.pergunta7) + parseInt(b.pergunta7)})));
    finalResult.push(data.reduce((a, b) => ({pergunta8: parseInt(a.pergunta8) + parseInt(b.pergunta8)})));
    finalResult.push(data.reduce((a, b) => ({pergunta9: parseInt(a.pergunta9) + parseInt(b.pergunta9)})));
    finalResult.push(data.reduce((a, b) => ({pergunta10: a.pergunta10 + "; " + b.pergunta10})));
    finalResult.push(data.reduce((a, b) => ({pergunta11: a.pergunta11 + "; " + b.pergunta11})));
    finalResult.push(data.reduce((a, b) => ({pergunta12: a.pergunta12 + "; " + b.pergunta12})));
    finalResult.push(data.reduce((a, b) => ({pergunta13: a.pergunta13 + "; " + b.pergunta13})));
    


    //! retornando o objeto já formatado para mostrar na tela
    res.status(200).send({
      data: {
        pergunta1:finalResult[0].pergunta1/data.length,
        pergunta2:finalResult[1].pergunta2/data.length,
        pergunta3:finalResult[2].pergunta3/data.length,
        pergunta4:finalResult[3].pergunta4/data.length,
        pergunta5:finalResult[4].pergunta5/data.length,
        pergunta6:finalResult[5].pergunta6/data.length,
        pergunta7:finalResult[6].pergunta7/data.length,
        pergunta8:finalResult[7].pergunta8/data.length,
        pergunta9:finalResult[8].pergunta9/data.length,
        pergunta10:finalResult[9].pergunta10,
        pergunta11:finalResult[10].pergunta11,
        pergunta12:finalResult[11].pergunta12,
        pergunta13:finalResult[12].pergunta13,
      }
    });
  } 
}
