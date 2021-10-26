import credentials from '../../credentials/google_sheets_api.json'

import  {GoogleSpreadsheet}  from 'google-spreadsheet';

export default async function(req, res) {
  const doc = new GoogleSpreadsheet(credentials.id_google_spreadsheet);

  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo();

  if(req.method === 'GET'){
    const newSheet = doc.sheetsByTitle['Adm'];//! busca a sheet petianos
      
    const rows = await newSheet.getRows();
    let petianoDates = [];

    const dates = rows.map(({Ano, Status},index) => {
        if(Status === 'finalizado'){
            return {
                Ano,
            } 
        }
         return;
     })
 
    let infoResponse = dates;
    const data = infoResponse.filter((avaliation) => {
        if(avaliation)
            return avaliation
    })
     

    for(let i=0; i < data.length ; i++){
        const sheetAux = doc.sheetsByTitle['Resumo'+data[i].Ano];//! busca a sheet pelo ano
        const rowsAux = await sheetAux.getRows();
        
        const index = rowsAux.map(({Avaliador, Avaliados}, index) => {
            if(Avaliador === req.query.name){
              return {
                Avaliador,
              } 
            }
             return;
          })
      
          let infoResponse = index;
          const data2 = infoResponse.filter((index) => {
              if(index)
                return index
          })
      
          if(data2.length > 0){
              petianoDates.push(data[i].Ano);
             
          }
          console.log(data2);

    }

    if(petianoDates.length > 0){
        res.status(200).send({
            data: petianoDates
        });
    }else{
        return res.status(400).send("Nenhuma data");
    }
}
}

  