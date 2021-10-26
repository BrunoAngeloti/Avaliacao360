import credentials from '../../credentials/google_sheets_api.json'

import  {GoogleSpreadsheet}  from 'google-spreadsheet';

export default async function(req, res) {
  const doc = new GoogleSpreadsheet(credentials.id_google_spreadsheet);

  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo();

  if(req.method === 'POST'){
    const newSheet = doc.sheetsByTitle['Petianos'];//! busca a sheet petianos
    const sheetAdm = doc.sheetsByTitle['Adm'];

    const rows = await newSheet.getRows();
    const rowsAdm = await sheetAdm.getRows();


    const result = rows.filter(linha => linha.Petiano == req.body.name);

    if(result.length === 0){
      //! NÃO ESTA CADASTRADO MAS PODE SE CADASTRAR
      if(rowsAdm[0].Cadastro === 'Liberado'){
        await newSheet.addRow({
          Petiano:req.body.name,
          Photo:req.body.photo,
          Email:req.body.email
        });
        return res.status(200).send("Usuario cadastrado com sucesso");
      }else{
        return res.status(400).send("Cadastro não está habilitado no momento");
      }    
    }

    return res.status(202).send("Usuario Já Cadastrado");
    

  }


  /*if(req.method === 'DELETE'){
    const newSheet = doc.sheetsByTitle[req.body.name];//! busca a sheet
    await newSheet.delete();//! deleta a sheet
    return res.status(200).send("sucesso");
  }*/

  /* if(req.method === 'POST'){
    const sheet = doc.sheetsByTitle[req.body.name];//! busca a sheet
    
    const rows = await sheet.getRows();
    const names = rows.map(({petiano,pergunta1,pergunta2,pergunta3,pergunta4,pergunta5,pergunta6,pergunta7,pergunta8,pergunta9,pergunta10,pergunta11,pergunta12,pergunta13}) => {
    
       if(petiano === 'andre'){
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
    //console.log(rows);
    
    return res.status(200).send(names);
  } */




 // loads document properties and worksheets
//console.log(doc.title);

//const sheet = doc.sheetsByTitle["Página7"]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

//await doc.addSheet(0)

//const testeName = await sheet.sheetId;
//await doc.deleteSheet(testeName);
//const rows = await sheet.getRows()




//const sheet = doc.sheetsByTitle["petiano7"]; //! para adicionar 
//await sheet.addRow({pergunta1:"undefined",pergunta2:"undedined",pergunta3:"undefined"});


//const newSheet = doc.sheetsByTitle["petiano"];//! busca a sheet
//await newSheet.delete();

/* 
const names = rows.map(({Avaliador, avaliação, desempenho}) => {
  return {
    Avaliador,
    avaliação,
    desempenho
  }
}) */



//res.send({
  //aba:testeName,
  
//})

// adding / removing sheets
//const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
//await newSheet.delete();
}