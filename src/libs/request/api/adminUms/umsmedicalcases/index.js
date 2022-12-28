const apis = {
  getUnitStatisticsPage: {
    method: 'GET',
    url: 'umsmedicalcases/getUnitStatisticsPage',
    group: 'adminUms',
    dataType: 'keyValue'
  },
  getProjectEntryRecord: {
    method: 'GET',
    url: 'umsmedicalcases/getProjectEntryRecord',
    group: 'adminUms',
    dataType: 'json'
  },
  page: {
    method: 'GET',
    url: 'umsmedicalcases/page',
    group: 'adminUms',
    dataType: 'json'
  },
  exportData: {
    method: 'POST',
    url: 'umsmedicalcases/exportData',
    group: 'adminUms',
    dataType: 'json'
  },
  exportDataProjectEntryRecord: {
    method: 'POST',
    url: 'umsmedicalcases/exportDataProjectEntryRecord',
    group: 'adminUms',
    dataType: 'json'
  },
  getUnitStatisticsExportData: {
    method: 'POST',
    url: 'umsmedicalcases/getUnitStatisticsExportData',
    group: 'adminUms',
    dataType: 'json'
  },
  getCasesForTreatment: {
    method: 'GET',
    url: 'umsmedicalcases/getCasesForTreatment',
    group: 'adminUms',
    dataType: 'json'
  }
}
export default apis
