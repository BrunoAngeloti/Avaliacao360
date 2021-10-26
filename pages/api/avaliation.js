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
    const newSheet = doc.sheetsByTitle['Petianos'];//! busca a sheet petianos
    const SheetResumo = doc.sheetsByTitle["Resumo"+req.query.nameData];//! busca a sheet
    
    const rows2 = await SheetResumo.getRows()
    
    const index = rows2.map(({Avaliador, Avaliados}, index) => {
      if(Avaliador === req.query.name){
        return {
          Avaliador,
          Avaliados,
          index
        } 
      }
       return;
    })

    let infoResponse = index;
    const data2 = infoResponse.filter((index) => {
        if(index)
          return index
    })

    var avaliados;
    if(data2[0].Avaliados != null){
      avaliados = data2[0].Avaliados.split(",")
    }else{  
      avaliados = [];
    }
    

    const rows = await newSheet.getRows();
    
    const data = rows.map(({ Petiano, Photo, Email }) => {
        if(req.query.name !== Petiano){
            if(avaliados.includes(Petiano)){
              return {
                  Petiano,
                  Photo,
                  Email,
                  Checked: true
              };
            }else{
              return {
                Petiano,
                Photo,
                Email,
                Checked: false
              };
            }
            
        }
    })


    if(data.length !== 0){
        res.status(200).send({
            title: doc.title,
            data
        });
    }else{
      return res.status(400).send("Não há petianos cadastrados");

    }

  }

  if(req.method === 'POST'){
    const newSheet = doc.sheetsByTitle['Adm'];//! busca a sheet petianos
    
    const rows = await newSheet.getRows();
 
    //!altera o status da sheet
    const dates = rows.map(({Ano, Status},index) => {
    
        if(Status === 'inicializado'){
            return {
                Ano,
                Status,
                index
            } 
        }
         return;
     })
 
    let infoResponse = dates;
    const data = infoResponse.filter((avaliation) => {
        if(avaliation)
        return avaliation
    })
     
    if(data.length > 0){
      res.status(200).send({
        data: rows[data[0].index].Ano
      });
    }else{
      return res.status(400).send("Não existe avaliação");
    }

  }
}