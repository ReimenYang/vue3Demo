const apis = {
  getTreatmentRecord: {
    method: 'GET',
    url: 'direcipe/getTreatmentRecord',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  getTreatmentScheme: {
    method: 'GET',
    url: 'direcipe/getTreatmentScheme',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  getTreatmentRecordExportData: {
    method: 'POST',
    url: 'direcipe/getTreatmentRecordExportData',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  getTreatmentSchemeExport: {
    method: 'POST',
    url: 'direcipe/getTreatmentSchemeExport',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  getTreatmentSchemeDetail: {
    method: 'GET',
    url: 'direcipe/getTreatmentSchemeDetail',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  getTreatmentSchemeRecord: {
    method: 'GET',
    url: 'direcipe/getTreatmentSchemeRecord',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  saveTreatment: {
    method: 'POST',
    url: 'direcipe/saveTreatment',
    group: 'adminSsyypt',
    dataType: 'formData'
  },
  countTreatmentPrescriptions: {
    method: 'GET',
    url: 'direcipe/countTreatmentPrescriptions',
    group: 'adminSsyypt',
    dataType: 'keyValue'
  },
  countTreatments: {
    method: 'GET',
    url: 'direcipe/countTreatments',
    group: 'adminSsyypt',
    dataType: 'keyValue'
  },
  patientRecords: {
    method: 'GET',
    url: 'direcipe/patientRecords',
    group: 'adminSsyypt',
    dataType: 'formData'
  },
  patientRecordsExportData: {
    method: 'POST',
    url: 'direcipe/patientRecordsExportData',
    group: 'adminSsyypt',
    dataType: 'json'
  },
  treatmentStatistics: {
    method: 'GET',
    url: 'direcipe/treatmentStatistics',
    group: 'adminSsyypt',
    dataType: 'formData'
  }
}
export default apis
