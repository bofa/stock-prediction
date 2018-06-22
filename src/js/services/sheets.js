import axios from 'axios';
import { fromJS, Map } from 'immutable';

const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
const sheetId = '/183-e_Hf_ZLD4D-91TtqpI35C6TQO_HanD-NKg-XjvAY';
const sheetRange = '/values/A:J';
const apiKey = 'AIzaSyC8N3IAsa8l-D_bEQbEM1G8-ZVhkzWMpKM';

const url = baseUrl + sheetId + sheetRange;

const dummyData = {
  data: {
    "range": "Sheet1!A1:J994",
    "majorDimension": "ROWS",
    "values": [
      [
          "namn",
          "key",
          "keyGoogle",
          "keyBorsdata",
          "currency",
          "price",
          "priceFallback",
          "leverageNordnet",
          "leverageKnockout",
          "leverageSuper"
      ],
      [
          "Matas",
          "CPH:MATAS",
          "CPH:MATAS",
          "matas",
          "DKK",
          "62.6",
          "",
          "75%",
          "30%",
          "35%"
      ],
      [
          "Pandora",
          "CPH:PNDORA",
          "CPH:PNDORA",
          "",
          "DKK",
          "483",
          "",
          "75%",
          "30%",
          "35%"
      ],
    ]
  }
};

export function getSheetData () {
  const promise = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? new Promise((resolve) => resolve(dummyData))
    : axios.get(url, { params: { key: apiKey }});

  return promise.then(response => fromJS(response.data.values)
    .map((company, _, companies) => company.map((field, index) =>
      [companies.getIn([0, index]), field]
    ))
    .remove(0)
    .map(data => new Map(data))
    .map(company => company
      .update('price', Number)
      .set('margin', new Map({
        avanza: Number(company.get('leverageSuper').replace('%', '') / 100),
        nordnet: Number(company.get('leverageKnockout').replace('%', '') / 100)
      }))
      .update('leverageKnockout', l => Number(l.replace('%', '') / 100))
      .update('leverageNordnet', l => Number(l.replace('%', '') / 100))
      .update('leverageSuper', l => Number(l.replace('%', '') / 100))
    )
  );
}
