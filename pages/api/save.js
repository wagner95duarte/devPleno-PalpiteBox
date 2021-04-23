import { GoogleSpreadsheet } from "google-spreadsheet";
import moment from "moment";

const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID); //Dados da planilha

const genCupom = () => {
  const code = parseInt(moment().format("YYMMDDHHmmssSSS"))
    .toString(16)
    .toUpperCase();
  return code.substr(0, 4) + "-" + code.substr(4, 4) + "-" + code.substr(8, 4);
};

export default async (req, res) => {
  try {
    //await doc.useServiceAccountAuth(credentials); //Autenticando planilha
    await doc.useServiceAccountAuth({
      client_email: process.env.SHEET_CLIENT_EMAIL,
      private_key: process.env.SHEET_PRIVATE_KEY,
    });
    await doc.loadInfo(); //Buscando as informações

    const sheet = doc.sheetsByIndex[1]; //Seleciona a planilha
    const data = JSON.parse(req.body);

    const sheetConfig = doc.sheetsByIndex[0]; //Seleciona a planilha
    await sheetConfig.loadCells("A3:B3"); //Seleciona o intervalo da planilha

    const mostrarPromocao = sheetConfig.getCell(2, 0); //Linha coluna
    const textoPromocao = sheetConfig.getCell(2, 1);

    let Cupom = "";
    let Promo = "";

    //Gerar cupom
    if (mostrarPromocao.value === "VERDADEIRO") {
      Cupom = genCupom();
      Promo = textoPromocao.value;
    }

    //Salvando os dados
    await sheet.addRow({
      Nome: data.Nome,
      Email: data.Email,
      Whatsapp: data.Whatsapp,
      Nota: parseInt(data.Nota),
      Data: moment().format("DD/MM/YYYY, HH:mm:ss"),
      Cupom,
      Promo,
    });

    //Mostrar o cupom
    res.end(
      JSON.stringify({
        showCoupon: Cupom !== "",
        Cupom,
        Promo,
      })
    );
  } catch (error) {
    console.log(err);
    res.end("error");
  }
};
