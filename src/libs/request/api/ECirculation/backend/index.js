const apis = {
  login: { method: 'POST', url: 'backend/login', group: 'ECirculation', dataType: 'keyValue' },
  searchDevice: { method: 'POST', url: 'backend/searchDevice', group: 'ECirculation', dataType: 'keyValue' },
  unbindingDevice: { method: 'POST', url: 'backend/unbindingDevice', group: 'ECirculation', dataType: 'keyValue' },
  searchUser: { method: 'POST', url: 'backend/searchUser', group: 'ECirculation', dataType: 'keyValue' },
  searchTreatmentRecord: { method: 'POST', url: 'backend/searchTreatmentRecord', group: 'ECirculation', dataType: 'keyValue' }
}

export default apis
