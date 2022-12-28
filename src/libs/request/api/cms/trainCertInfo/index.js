const apis = {
  getCategory: {
    method: 'GET',
    url: 'trainCertInfo/getCategory',
    group: 'cms',
    dataType: 'json'
  },
  getCmsCertInfoPage: {
    method: 'GET',
    url: 'trainCertInfo/getCmsCertInfoPage',
    group: 'cms',
    dataType: 'json'
  },
  // getDetails: {method: "POST",url: "trainCertInfo/getDetails/ + data);",group: "cms",dataType: "json"},
  // getItemDetails: {method: "GET",url: "trainCertInfo/getItemDetails/ + type + '/ + data,);",group: "cms",dataType: "json"},
  getList: {
    method: 'GET',
    url: 'trainCertInfo/getList',
    group: 'cms',
    dataType: 'json'
  },
  getRanDomList: {
    method: 'GET',
    url: 'trainCertInfo/getRanDomList',
    group: 'cms',
    dataType: 'json'
  },
  getuserresume: {
    method: 'GET',
    url: 'trainCertInfo/getuserresume',
    group: 'cms',
    dataType: 'form'
  },
  getUserResumeByCertIdAndUserId: {
    method: 'GET',
    url: 'trainCertInfo/getUserResumeByCertIdAndUserId',
    group: 'cms',
    dataType: 'form'
  },
  getUserSpecialService: {
    method: 'GET',
    url: 'trainCertInfo/getUserSpecialService',
    group: 'cms',
    dataType: 'json'
  },
  listCanBuyCertByRealnamePhone: {
    method: 'GET',
    url: 'trainCertInfo/listCanBuyCertByRealnamePhone',
    group: 'cms',
    dataType: 'json'
  },
  page: {
    method: 'GET',
    url: 'trainCertInfo/page',
    group: 'cms',
    dataType: 'json'
  },
  // saveResume: {method: "POST",url: "trainCertInfo/saveResume?openId=' + openId + '&certId=' + cId, data",group: "cms",dataType: "json"},
  updateViews: {
    method: 'GET',
    url: 'trainCertInfo/updateViews',
    group: 'cms',
    dataType: 'json'
  },
  // trainCertInfo: {method: "POST",url: "trainCertInfo?orderNo=' + orderNo, data",group: "cms",dataType: "json"},
  getBrowseHistory: {
    method: 'GET',
    url: 'trainCourse/getBrowseHistory',
    group: 'cms',
    dataType: 'json'
  },
  getCertByUser: {
    method: 'POST',
    url: 'trainCourse/getCertByUser',
    group: 'cms',
    dataType: 'json'
  },
  getOrderCertList: {
    method: 'GET',
    url: 'trainCourse/getOrderCertList',
    group: 'cms',
    dataType: 'json'
  },
  getTrainCourseByAnthor: {
    method: 'POST',
    url: 'trainCourse/getTrainCourseByAnthor',
    group: 'cms',
    dataType: 'json'
  },
  getTrainCourseDeails: {
    method: 'POST',
    url: 'trainCourse/getTrainCourseDeails',
    group: 'cms',
    dataType: 'json'
  },
  getTrainCourseList: {
    method: 'POST',
    url: 'trainCourse/getTrainCourseList',
    group: 'cms',
    dataType: 'json'
  },
  getTrainCourseType: {
    method: 'GET',
    url: 'trainCourse/getTrainCourseType',
    group: 'cms',
    dataType: 'json'
  },
  getUserCertrList: {
    method: 'GET',
    url: 'trainCourse/getUserCertrList',
    group: 'cms',
    dataType: 'json'
  }
}

export default apis
