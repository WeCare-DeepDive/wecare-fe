
//보호자가 호출하는 부분
const getGuardianRelationMock = () => {
  return Promise.resolve(
    [
        {
          "id": 0,
          "guardianId": 1, // 김보호
          "dependentId": 2, // 이피보
          "partnerName": "이피보", // 이름 추가
          "active": true,
          "relationshipType": "GRANDPARENT",
          "createdAt": "2025-08-02T04:27:34.542Z",
          "updatedAt": "2025-08-02T04:27:34.542Z"
        }
      ]
  );
};

// 의존자가 호출하는 부분
const getDependentRelationMock = () => {
  return Promise.resolve(
    [
      {
        id: 0,
        guardianId: 1, // 김보호
        dependentId: 2, // 이피보
        partnerName: '김보호', // 이름 추가
        active: true,
        relationshipType: 'PARENT',
        createdAt: '2025-08-02T04:27:34.542Z',
        updatedAt: '2025-08-02T04:27:34.542Z',
      },
    ]
  );
};

export default { getGuardianRelationMock, getDependentRelationMock };