const getters = {
    userInfo: (state) => state.user.userInfo,
    getUserId: (state) => state.user.userId,
    paperId: (state) => state.user.activePaperId,
    getList: (state) => state.user.tempList,
}

export default getters