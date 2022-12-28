const apis = {
  getUserRoleStatus: { method: 'GET', url: 'team/getUserRoleStatus', group: 'ums', dataType: 'form' },
  getGuildTeamIndex: { method: 'GET', url: 'team/getGuildTeamIndex', group: 'ums', dataType: 'form' },
  getTeamDeailsStatistics: { method: 'GET', url: 'team/getTeamDeailsStatistics', group: 'ums', dataType: 'form' },
  getTeamMenberStatistics: { method: 'GET', url: 'team/getTeamMenberStatistics', group: 'ums', dataType: 'form' },
  getGuildDeailsStatistics: { method: 'GET', url: 'team/getGuildDeailsStatistics', group: 'ums', dataType: 'form' },
  getGuildStatistics: { method: 'GET', url: 'team/getGuildStatistics', group: 'ums', dataType: 'form' },
  updateTeamNotice: { method: 'POST', url: 'team/updateTeamNotice', group: 'ums' },
}

export default apis
