const apis = {
  getYxdsState: { method: 'GET', url: 'cardGame/getYxdsState', group: 'ums', dataType: 'form' },
  getUserGameStatus: { method: 'GET', url: 'cardGame/getUserGameStatus', group: 'ums', dataType: 'form' },
  killMonster: { method: 'POST', url: 'cardGame/killMonster', group: 'ums' },
  userDrawCard: { method: 'POST', url: 'cardGame/userDrawCard', group: 'ums', dataType: 'form' },
  getUserJoinOrder: { method: 'GET', url: 'cardGame/getUserJoinOrder', group: 'ums', dataType: 'form' }
}

export default apis
