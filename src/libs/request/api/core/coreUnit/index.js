const apis = {
  listUnitsNameByType: { method: 'GET', url: 'coreUnit/listUnitsNameByType', group: 'core', dataType: 'form' },
  listSubjectGroupBySameProjectDoctorId: { method: 'GET', url: 'coreUnit/listSubjectGroupBySameProjectDoctorId', group: 'core', dataType: 'keyValue' },
  isReceiveByUnitId: { method: 'GET', url: 'coreUnit/isReceiveByUnitId', group: 'core', dataType: 'form' },
}
export default apis
