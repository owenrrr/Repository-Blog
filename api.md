#  api

## url: /user/getuser

- req: username
- res: { user:  { userid, username, password, description, age, sex, impURL } }
- 根据用户名获取用户信息

## url: /user/getuserlist

- req: none
- res: { users:{ total: 列表数目},  users:[ {userid, username, password, description, age, sex, impURL}... ] }
- 获取用户列表

## url: /user/adduser

- req: username, password, sex, age, description
- res: { statue: (1 or 0), userinfo: { userid, username, password, description, sex, age } }
- 根据信息添加用户，username, password为必须属性，其他如不需要可传入null，res中1表示创建成功，反之则失败

## url: /user/updateuser

- req: userid, username, password, sex, age, description
- res: { statue: (1 or 0), userinfo: { userid, username, password, description, sex, age } }
- 根据信息更新用户信息，userid为必须

## url: /favorite/addfavorite

- req: userId, paperId, createTime
- res: { statue: (1 or 0), favorite: {favoriteId, userId, paperId } }
- 根据信息添加收藏,三个参数都为必须

## url: /favorite/removefavorite

- req: userId, paperId
- res: {statue: (1 or 0)}
- 根据userId, paperId删除收藏得文章,两个参数都为必须

## url: /favorite/getuserlist

- req: paperId
- res: { users: { total: 列表数目, userList: [userId...]} }
- 根据paperId获取收藏此文章的用户的Id

## url: /favorite/getpaperlist

- req: userId
- res: { papers: { total: 列表数目, paperList: [paperId...] } }
- 根据userId获取此用户收藏的文章的Id

## url: /paper/getpaper

- req: paperid
- res: { paper: { paperid, userid, starnum, likenum, commentnum, title, createtime, content } }
- 根据paperid获取文章信息

## url: /paper/getpaperlist

- req: none
- res: { papers: { total: 列表数目, papers: { paperid, userid, starnum, likenum, commentnum, title, createtime, content } } }
- 获取文章列表

## url: /paper/addpaper

- req: userid, title, createtime, content
- res: { statue: (1 or 0), paperinfo: { paperid, userid, title, createtime, content } }
- 根据信息添加文章










