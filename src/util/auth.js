import Cookies from 'js-cookie'

const TokenKey = 'MYBLOG-TOKEN'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    console.log('remove token')
    return Cookies.remove(TokenKey)
}