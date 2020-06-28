<template>
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
                他的文章
            </a-menu-item>
            <a-menu-item key="3">
                <a-icon type="star">
                </a-icon>
                他的收藏
            </a-menu-item>
        </a-menu>
        <transition name="fade-transform" mode="out-in">
            <router-view style="min-height: 500px; margin-top: 20px"/>
        </transition>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "AnotherLayout",
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
                        name: 'anotherSettings',
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
                        name: 'anotherMyArticles',
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
                        name: 'anotherFavourite',
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
    }
</script>

<style scoped>
    .user-layout {
        border: #eeeeee solid 1px;
    }
</style>