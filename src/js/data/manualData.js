import { fromJS } from 'immutable';

export const saftyMargin = 0.65;

export const intrest = fromJS({
  avanza: 0.0175,
  nordnet: 0.0099
});

export default fromJS({
	"AXFO": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.32
    },
		"yahooKey": "AXFO.ST"
	},
	"SBO": {
		"yahooKey": "SBO.OL"
	},
	"BMAX": {
		"yahooKey": "BMAX.ST"
	},
	"BETS": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.30
    },
		"yahooKey": "BETS-B.ST"
	},
	"JM": {
		"yahooKey": "JM.ST"
	},
	"BILI": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.24
    },
		"yahooKey": "BILI-A.ST"
	},
	"WISE": {
		"yahooKey": "WISE.ST"
	},
	"NFLX": {
		"yahooKey": "NFLX"
	},
	"DEDI": {
		"yahooKey": "DEDI.ST"
	},
	"DIST": {
		"yahooKey": "DIST.ST"
	},
	"EPR": {
		"yahooKey": "EPR.OL"
	},
	"UTG": {
		"yahooKey": "UTG.ST"
	},
	"KLOV": {
		"yahooKey": "KLOV-A.ST"
	},
	"DIOS": {
		"yahooKey": "DIOS.ST"
	},
	"LJGR": {
		"yahooKey": "ATRLJ-B.ST"
	},
	"GOOGL": {
		"yahooKey": "GOOGL"
	},
	"SHB": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.32
    },
		"yahooKey": "SHB-A.ST"
	},
	"SALM": {
		"yahooKey": "SALM.OL"
	},
	"SAMAS": {
		"yahooKey": "SAMPO.HE"
	},
	"MATAS": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.3
    },
		"yahooKey": "MATAS.CO"
	},
	"TSLA": {
		"yahooKey": "TSLA"
	},
	"WIHL": {
		"yahooKey": "WIHL.ST"
	},
	"INWI": {
		"yahooKey": "INWI.ST"
	},
	"PNDORA": {
    "margin": {
      "avanza": 0.35,
      "nordnet": 0.30
    },
		"yahooKey": "PNDORA.CO"
	},
	"MEAB": {
		"yahooKey": "MEAB-B.ST"
	},
	"SJR": {
    "margin": {
      "avanza": 0.0,
      "nordnet": 0.16
    },
		"yahooKey": "SJR-B.ST"
	},
	"FPAR": {
		"yahooKey": "FPAR.ST"
	},
	"MYCR": {
		"yahooKey": "MYCR.ST"
	},
	"NET": {
		"yahooKey": "NET-B.ST"
	},
	"HOME": {
    "margin": {
      "avanza": 0.0,
      "nordnet": 0.8
    },
		"yahooKey": "HOME-B.ST"
	},
	"CAST": {
		"yahooKey": "CAST.ST"
	},
	"CORE": {
		"yahooKey": "CORE.ST"
  },
  "malmbergs": {
    "margin": {
      "avanza": 0.0,
      "nordnet": 0.16
    },
  }
});
