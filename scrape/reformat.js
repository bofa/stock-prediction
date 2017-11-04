import { fromJS, List, Map } from 'immutable';
import writeJsonFile from 'write-json-file';
import { data as companyNames } from './companies.json';

export const startData = fromJS({
  "DIST": 'DIST.ST',
  "KLOV": 'KLOV-A.ST',
  "CORE": 'CORE.ST',
  "DIOS": 'DIOS.ST',
  "LJGR": 'ATRLJ-B.ST',
  "UTG": 'UTG.ST',
  "CAST": 'CAST.ST',
  "MYCR": 'MYCR.ST',
  "BETS": 'BETS-B.ST',
  "WIHL": 'WIHL.ST',
  "FPAR": 'FPAR.ST',
  "MEAB": 'MEAB-B.ST',
  "BILI": 'BILI-A.ST',
  "HOME": 'HOME-B.ST',
  "SJR": 'SJR-B.ST',
  // "LSG":
  // "JLT":
  "WISE": 'WISE.ST',
  "SALM": 'SALM.OL',
  "BMAX": 'BMAX.ST',
  "SAMAS": 'SAMPO.HE',
  "PNDORA": 'PNDORA.CO',
  "NET": 'NET-B.ST',
  "SHB": 'SHB-A.ST',
  "DEDI": 'DEDI.ST',
  "AXFO": 'AXFO.ST',
  "MATAS": 'MATAS.CO',
  "EPR": 'EPR.OL',
  "SBO": 'SBO.OL',
  "INWI": 'INWI.ST',
  "JM": 'JM.ST',
  "TSLA": 'TSLA',
  "GOOGL": 'GOOGL',
  "NFLX": 'NFLX',
  // "RESURS":
});

const out = startData.map((item, key) => new Map({ yahooKey: item }));

writeJsonFile('src/js/data/reformat.json', out);

