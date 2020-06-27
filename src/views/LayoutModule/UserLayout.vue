<template>
    <div>
        <a-menu v-model="current" mode="horizontal" @select="jumpToDetail">
            <a-menu-item key="1">
                <a-icon type="user">
                </a-icon>
                个人信息
            </a-menu-item>
            <a-menu-item key="2">
                <a-icon type="profile">
                </a-icon>
                {{currentUserId === getUserId ? '我的文章' : '他的文章'}}
            </a-menu-item>
            <a-menu-item key="3">
                <a-icon type="star">
                </a-icon>
                {{currentUserId === getUserId ? '我的收藏' : '他的收藏'}}
            </a-menu-item>
            <a-menu-item key="4">
                <a-icon type="team">
                </a-icon>
                {{currentUserId === getUserId ? '我的关注' : '他的关注'}}
            </a-menu-item>
        </a-menu>
        <transition name="fade-transform" mode="out-in">
            <router-view style="min-height: 500px; margin-top: 20px"/>
        </transition>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "UserLayout",
        data() {
            return {
                currentUserId: this.$route.params.userId,
                current: [this.$route.params.firstPage]
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
                    await this.$router.push({
                        name: 'settings',
                        params: {
                            userId: this.currentUserId
                        }
                    })
                }
                else if (key === 2) {
                    console.log('myArticles')
                    await this.$router.push({
                        name: 'myArticles',
                        params: {
                            userId: this.currentUserId
                        }
                    })
                }
                else if (key === 3) {
                    console.log('favourite');
                    await this.$router.push({
                        name: 'favourite',
                        params: {
                            userId: this.currentUserId
                        }
                    })
                }
                else if (key === 4) {
                    console.log('followers');
                    await this.$router.push({
                        name: 'followers',
                        params: {
                            userId: this.currentUserId
                        }
                    })
                }
            }
        },
        async mounted() {
            console.log('mounted');
            await this.jumpToPage(this.$route.params.firstPage)
        },
        watch: {
            async $route(to, from) {
                console.log(to.path)
                console.log(from.path)
                if (to.path.substring(0, 16) !== from.path.substring(0, 16)) {
                    await this.jumpToPage(this.$route.params.firstPage)
                    this.current = [this.$route.params.firstPage]
                }
            }
        }
    }
</script>

<style scoped>

</style>