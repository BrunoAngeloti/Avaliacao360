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
    const newSheet = doc.sheetsByTitle[req.body.nameData];//! busca a sheet
    const SheetResumo = doc.sheetsByTitle["Resumo"+req.body.nameData];//! busca a sheet

    await newSheet.addRow({
        petiano:req.body.petiano,
        pergunta1:req.body.data[0],
        pergunta2:req.body.data[1],
        pergunta3:req.body.data[2],
        pergunta4:req.body.data[3],
        pergunta5:req.body.data[4],
        pergunta6:req.body.data[5],
        pergunta7:req.body.data[6],
        pergunta8:req.body.data[7],
        pergunta9:req.body.data[8],
        pergunta10:req.body.data[9],
        pergunta11:req.body.data[10],
        pergunta12:req.body.data[11],
        pergunta13:req.body.data[12]
    });

    
    const rows = await SheetResumo.getRows()
    
    const index = rows.map(({Avaliador}, index) => {
      if(Avaliador === req.body.avaliador){
        return {
          index
        } 
      }
       return;
    })

    let infoResponse = index;
    const data = infoResponse.filter((index) => {
        if(index)
          return index
    })
    
   
    if(rows[data[0].index].Avaliados == null){
      rows[data[0].index].Avaliados = req.body.petiano + ',';
    }else{
      rows[data[0].index].Avaliados = rows[data[0].index].Avaliados + req.body.petiano + ',';
    }
  
    await rows[data[0].index].save();



    return res.status(200).send("sucesso");
  }
}