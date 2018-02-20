import axios from 'axios';

const Cookie = '__cfduid=de9cc98662ca3d4d696328ee8820a363d1513747353; ARRAffinity=4ee8329667445e85fddd42eaf6e3212550bb2188722e873b8cd7b7c0423843c5; __utma=182498229.761015667.1513747357.1513747357.1513747357.1; __utmc=182498229; __utmz=182498229.1513747357.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; ai_user=69AkY|2017-12-20T05:22:36.960Z; borsdata=050C40F5C71CD55E4797BD410C779A46753517A77CB805EF408334B375EC6F2DE77070F8E4901A7EBD46B855B0133A6EC09BC2ABA561A1D6C22BFB333B78BD1C70C773EA0B5E5B98B0C1466F99B2E61FF952EE8E; __RequestVerificationToken=rEaUC87J3Lp-HAaeFmI8zCwAKABMfpR_cZbZnM_MDnU9QX2VoTIF1UCv1GaXTbNriE6-1q9kWeMHeaGPRb5V3pQFCM81; __utmb=182498229.3.10.1513747357; ai_session=jhMta|1513747357174|1513747369780.94';

axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=granges&kpiId=63`,{
  headers: { Cookie }})
  .then(console.log);


// axios.post('https://borsdata.se/complist/GetCompanies', {"filter":{"KpiFilter":[{"CategoryId":9,"AdditionalId":151,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":1}]}})
//   .then(reponse => reponse.data.data)
//   .then(console.log)
