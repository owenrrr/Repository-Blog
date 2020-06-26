import axios from 'axios'
import {resetRouter} from '@/router'
import {removeToken} from '@/util/auth'

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
    },
    actions: {
        getUserInfo: async ({state, commit}) => {
            let res = await axios.get('http://localhost:3000/user/getUserById', {params: {userId: state.userId}});
            commit('set_userInfo', res.data)
            console.log(state.userInfo)
        },
        logOut: async({ commit }) => {
            console.log('logOut')
            removeToken()
            resetRouter()
            commit('reset_state')
        },
    }
}

export default user