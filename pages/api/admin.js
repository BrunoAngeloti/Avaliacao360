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
     

    if(data.length === 0){
        return res.status(200).send("Avaliação não ativa");
    }
    else{
        return res.status(202).send("Avaliação ativa");
    }

    

  }

  if(req.method === 'POST'){
    const newSheet = doc.sheetsByTitle['Adm']; //! busca a sheet da Adm
    const petianos = doc.sheetsByTitle['Petianos']; //! busca a sheet de Petianos
    
    const rows = await newSheet.getRows();
    const rowsPetianos = await petianos.getRows();
    
    const result = rows.filter(linha => linha.Ano == req.body.name);

    if(result.length === 0){      
        const sheetAvaliation = await doc.addSheet({
            title: `${req.body.name}`, 
            headerValues: [
                'petiano','pergunta1','pergunta2',
                'pergunta3','pergunta4','pergunta5',
                'pergunta6','pergunta7','pergunta8',
                'pergunta9','pergunta10','pergunta11',
                'pergunta12','pergunta13'
            ] 
        });
        const sheetResumAvaliation = await doc.addSheet({ 
            title: `Resumo${req.body.name}`, 
            headerValues: ['Avaliador', 'Avaliados'] 
        });

        const names = rowsPetianos.map(({Petiano}) => {
            return {
              Petiano
            } 
        })

        console.log(names)

        await newSheet.addRow({
            Ano : req.body.name,
            Status: 'inicializado',
        });

        for(let y = 0; y < names.length ; y++){
            await sheetResumAvaliation.addRow({
              Avaliador : names[y].Petiano,
              Avaliados: '',
          });
        }
        return res.status(200).send("Avaliação criada");
    }

    return res.status(400).send("Avaliação já registrada");
    

  }

  if(req.method === 'PUT'){
    const newSheet = doc.sheetsByTitle['Adm'];//! busca a sheet petianos
    
    const rows = await newSheet.getRows();
 
    //! altera a configuração de cadastro aberto da planilha
    if(req.body.cadastro == true){
      if(rows[0].Cadastro === 'Liberado'){
         rows[0].Cadastro = 'Bloqueado'
      }
      else if(rows[0].Cadastro === 'Bloqueado'){
        rows[0].Cadastro = 'Liberado'
      }
    
    await rows[0].save();
    return res.status(201).send({
      data: rows[0].Cadastro
    });
    }

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
     
    rows[data[0].index].Status = 'finalizado';
    
    await rows[data[0].index].save();

    return res.status(200).send("Avaliação finalizada");
    

  }

  if(req.method === 'DELETE'){
    const newSheet = doc.sheetsByTitle['Petianos'];//! busca a sheet petianos
    
    const rows = await newSheet.getRows()


    const index = rows.map(({Petiano}, index) => {
      if(Petiano === req.body.name){
        return {
          Petiano,
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
    
    await rows[data2[0].index].delete();
    
    return res.status(200).send("sucesso");
  } 
}