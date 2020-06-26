import axios from 'axios'

const getDefaultState = () => {
    return {
        userId: 0,
        userInfo: {
            userId: 0,
            userName: '',
            password: '',
            description: '',
            sex: -1,
            age: 0,
            imgURL: '',
            email: ''
        },
        activePaperId: 0,  // 用于点入文章细看
        tempList: [],
    }
}

const user = {
    state : getDefaultState(),

    mutations : {
        reset_state: function(state) {
            state.userInfo = {
                userId: 0,
                userName: '',
                password: '',
                description: '',
                sex: -1,
                age: 0,
                imgURL: '',
                email: ''
            };
            state.activePaperId = 0;  // 用于点入文章细看
            state.tempList = [];
            state.userId = 0;
        },
        set_userInfo (state, data) {
            state.userInfo = data
        },
        set_userId (state, data) {
            state.userId = data
        },
        set_paperId (state, paperId){
            state.activePaperId = paperId
        },
        setList(state, list){
            state.tempList = list
        },
    },
    actions: {
        getUserInfo: async ({state, commit}) => {
            let res = await axios.get('http://localhost:3000/user/getUserById', {params: {userId: state.userId}});
            commit('set_userInfo', res.data)
            console.log(state.userInfo)
        }
    }
}

export default user