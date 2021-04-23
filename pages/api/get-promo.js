import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID); //Dados da planilha

const fromBase64 = (value) => {
  const buff = Buffer.from(value, "base64");
  return buff.toString("ascii");
};

export default async (req, res) => {
  try {
    //await doc.useServiceAccountAuth(credentials); //Autenticando planilha
    await doc.useServiceAccountAuth({
      client_email: process.env.SHEET_CLIENT_EMAIL,
      private_key: process.env.SHEET_PRIVATE_KEY,
    });

    await doc.loadInfo(); //Buscando as informações

    const sheet = doc.sheetsByIndex[0]; //Seleciona a planilha
    await sheet.loadCells("A3:B3"); //Seleciona o intervalo da planilha

    const mostrarPromocao = sheet.getCell(2, 0); //Linha coluna
    const textoPromocao = sheet.getCell(2, 1);

    res.end(
      JSON.stringify({
        showCoupon: mostrarPromocao.value === "VERDADEIRO",
        message: textoPromocao.value,
      })
    );
  } catch (error) {
    res.end(
      JSON.stringify({
        showCoupon: false,
        message: "",
      })
    );
  }
};
