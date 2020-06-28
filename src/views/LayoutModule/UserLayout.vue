<template>
    <div>
        <div class="user-layout">
            <a-menu v-model="current" mode="horizontal" @select="jumpToDetail">
                <a-menu-item key="1">
                    <a-icon type="user">
                    </a-icon>
                    个人信息
                </a-menu-item>
                <a-menu-item key="2">
                    <a-icon type="profile">
                    </a-icon>
                    {{Number(currentUserId) === Number(getUserId) ? '我的文章' : '他的文章'}}
                </a-menu-item>
                <a-menu-item key="3">
                    <a-icon type="star">
                    </a-icon>
                    {{Number(currentUserId) === Number(getUserId) ? '我的收藏' : '他的收藏'}}
                </a-menu-item>
                <a-menu-item key="4" v-if="Number(currentUserId) === Number(getUserId)">
                    <a-icon type="team">
                    </a-icon>
                    我的关注
                </a-menu-item>
            </a-menu>
            <transition name="fade-transform" mode="out-in">
                <router-view style="min-height: 500px; margin-top: 20px" :key="$route.fullPath"/>
            </transition>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "UserLayout",
        data() {
            return {
                currentUserId: 0,
                current: []
            }
        },
        computed: {
            ...mapGetters([
                'getUserId'
            ])
        },
        methods: {
            async jumpToDetail({key}) {
                await this.jumpToPage(key)
            },
            async jumpToPage(key) {
                console.log(key)
                key = Number(key)
                if (key === 1) {
                    console.log('settings')
                    console.log(this.currentUserId)
                    console.log(this.current)
                    await this.$router.push({
                        name: 'settings',
                        params: {
                            id: this.currentUserId
                        }
                    })
                }
                else if (key === 2) {
                    console.log('myArticles')
                    console.log(this.currentUserId)
                    console.log(this.current)
                    await this.$router.push({
                        name: 'myArticles',
                        params: {
                            id: this.currentUserId
                        }
                    })
                }
                else if (key === 3) {
                    console.log('favourite');
                    console.log(this.currentUserId)
                    console.log(this.current)
                    await this.$router.push({
                        name: 'favourite',
                        params: {
                            id: this.currentUserId
                        }
                    })
                }
                else if (key === 4) {
                    console.log('followers');
                    console.log(this.currentUserId)
                    console.log(this.current)
                    await this.$router.push({
                        name: 'followers',
                        params: {
                            id: this.currentUserId
                        }
                    })
                }
            }
        },
        async mounted() {
            console.log('mounted');
            this.currentUserId = this.$route.params.userId
            this.current = [this.$route.params.firstPage]
            console.log(this.currentUserId)
            await this.jumpToPage(this.$route.params.firstPage)
        },
        watch: {
            async $route(to, from) {
                console.log(to.path)
                console.log(from.path)
                console.log(this.currentUserId)
                console.log(this.current)
                if (to.path.search('settings') === -1 &&
                    to.path.search('followers') === -1 &&
                    to.path.search('favourite') === -1 &&
                    to.path.search('myArticles') === -1
                ) {
                    this.current = [this.$route.params.firstPage]
                    this.currentUserId = this.$route.params.userId
                    console.log(this.current)
                    console.log(this.currentUserId)
                    await this.jumpToPage(this.$route.params.firstPage)

                }
            }
        }
    }
</script>

<style scoped>
    .user-layout {
        border: #eeeeee solid 1px;
        padding-bottom: 20px;
    }
</style>