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

    const rows = await newSheet.getRows();
    
    const data = rows.map(({ Petiano, Photo, Email }) => {
        if(req.query.name !== Petiano){
            return {
                Petiano,
            };          
        }
    })

    if(data.length !== 0){
        res.status(200).send({
            data
        });
    }else{
      return res.status(400).send("Não há petianos cadastrados");

    }
  }


  if(req.method === 'PUT'){
    const newSheet = doc.sheetsByTitle['Adm'];//! busca a sheet petianos
    
    const rowsAdm = await newSheet.getRows();
 
    //! altera a configuração de cadastro aberto da planilha
    
      if(rowsAdm[0].Cadastro === 'Liberado'){
         return res.status(200).send("Liberado");
      }
      else if(rowsAdm[0].Cadastro === 'Bloqueado'){
        return res.status(202).send("Bloqueado");
      }
  }
}