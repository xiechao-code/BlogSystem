<template>
  <div id="app">
    <div class="container">
      <Alert show-icon closable>公告：本博客系统相关功能，敬请等待完善！</Alert>
      <Menu theme="light" active-name="1" class="menu">
        <MenuGroup>
            <MenuItem name="1">
                个人资料
            </MenuItem>
            <MenuItem name="2">
                我的收藏
            </MenuItem>
            <MenuItem name="3">
                我的关注
            </MenuItem>
            <MenuItem name="4">
                我的粉丝
            </MenuItem>
            <MenuItem name="5" to="/Myblog">
                我的博客
            </MenuItem>
        </MenuGroup>
      </Menu>
      <div class="content">
        <div class="personal_data">
          <h2>个人资料</h2>
          <div style="padding: 8px 0;position:relative">
            <div class="avatar">
              <img ref="avatar"/>
            </div> 
            <h3>ID: {{username}}</h3>
            <span @click="drawer = true" class="changeAvatar">修改头像</span>
            <Drawer title="修改头像" placement="left" :closable="true" v-model="drawer">
              <!-- 上传头像 -->
              <form>
                <input type="file" name="avatar" @change="getFile($event)">
                <Button type="primary" @click="submitForm($event)" style="margin-top:20px">确定上传</button>
              </form>
            </Drawer>
          </div>
          <div v-for="item in userdata" v-bind:key="item._id"  class="data-list">
            <p>昵称：{{item.nickname}}</p>
            <p>实名：{{item.truename}}</p>
            <p>性别：{{item.sex}}</p>
            <p>生日：{{item.birthday}}</p>
            <p>行业：{{item.Industry}}</p>
            <p>职位：{{item.job}}</p>
            <p>简介：{{item.introduction}}</p>
          </div>
          <div v-show="flag" class="data-list2">
            <p>昵称：无</p>
            <p>实名：无</p>
            <p>性别：无</p>
            <p>生日：无</p>
            <p>行业：无</p>
            <p>职位：无</p>
            <p>简介：无</p>
          </div>
          <span @click="value1 = true" class="changedata-btn">修改资料</span>
        </div>
      </div>
      <Drawer title="修改资料" :closable="true" v-model="value1" width="400" class="form-list">
        <div>
          <label>昵称:</label>
          <Input v-model="nickname" placeholder="输入昵称" style="width:200px" />
        </div>
        <div>
          <label>实名:</label>
          <Input v-model="truename" placeholder="输入实名" style="width:200px" />
        </div>
        <div>
          <label>职位:</label>
          <Input v-model="job" placeholder="输入职位" style="width:200px" />
        </div>
        <div>
          <label>性别:</label>
          <RadioGroup v-model="sex">
            <Radio label="男"></Radio>
            <Radio label="女"></Radio>
          </RadioGroup>
        </div>
        <div>
          <label>生日:</label>
          <DatePicker type="date" placeholder="请选择日期" style="width: 200px" v-model="birthday"></DatePicker>
        </div>
        <div>
          <label>行业:</label>
          <Select v-model="Industry" style="width:200px">
            <Option v-for="item in industry" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <label>简介:</label>
          <Input v-model="introduction" type="textarea" :rows="4" placeholder="请输入简介" />
        </div>
        <Button type="primary" @click="submit">确定</Button>
      </Drawer>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      flag:true,
      value1: false ,//控制修改个人资料的抽屉显示
      username:this.$store.state.username,
      nickname:'',
      truename:'',
      job:'',
      sex:'男',
      birthday:'',
      Industry:'',
      industry: [
                  {
                      value: '请选择',
                      label: '请选择'
                  },
                  {
                      value: '计算机软件',
                      label: '计算机软件'
                  },
                  {
                      value: '计算机硬件',
                      label: '计算机硬件'
                  },
                  {
                      value: '电子.微电子',
                      label: '电子.微电子'
                  },
                  {
                      value: '互联网.电子商务',
                      label: '互联网.电子商务'
                  },
                  {
                      value: 'IT服务',
                      label: 'IT服务'
                  }
              ],
      introduction:'',
      userdata:[],
      file:'' , //上传的文件
      drawer:false  //修改头像抽屉
    }
  },
  created(){
    this.findUserData();
  },
  methods:{
    submit(){
      this.$axios.get('/dochangeuserdate',{
        params:{
          'username':this.$store.state.username,
          'nickname':this.nickname,
          'truename':this.truename,
          'job':this.job,
          'sex':this.sex,
          'birthday':this.birthday,
          'Industry':this.Industry,
          'introduction':this.introduction
        }
      }).then(result=>{
        if(result.data=='1'){
          this.$Message.success("资料修改成功");
          this.value1 = false;
          this.findUserData();
        }
        if(result.data=='2'){
          this.$Message.success("资料修改成功");
          this.value1 = false;
          this.findUserData();
        }
      })
    },
    findUserData(){
      this.$axios.get('/dofinduserdata',{
        params:{
          'username':this.$store.state.username
        }
      }).then(result=>{
        if(result.data!=''){
          this.flag = false;
          this.userdata = result.data;
        //绑定输入框的值，当点击修改时，把这些作为默认值显示在输入框
          this.truename = result.data[0].truename;
          this.nickname = result.data[0].nickname;
          this.job = result.data[0].job;
          this.sex = result.data[0].sex;
          this.birthday = result.data[0].birthday;
          this.Industry = result.data[0].Industry;
          this.introduction = result.data[0].introduction;
        }
        //因为刷新页面让先前存在vuex里的头像数据没有了，所以进入这个页面，
        //先从session里取到头像(因为session里面登录时就写入了头像，刷新不会消失)，再把值传回vuex
        this.$store.commit('getAvatar',JSON.parse(sessionStorage.getItem("avatar")));
        this.$refs.avatar.src="../../../static/avatar/"+this.$store.state.avatar+"";
      })
    },
    getFile(e){
      this.file = e.target.files[0];  //得到上传的文件
    },
    submitForm(e){
      e.preventDefault();
      let formData = new FormData;
      formData.append('file',this.file);  //图片文件
      formData.append('username',this.$store.state.username);  //文本文件

      let config = {  //设置请求头
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }

      this.$axios.post("/dosetavatar",formData,{config}).then(result=>{
        if(result.data=='1'){
          this.$Message.success("上传成功!");
          this.drawer = false;
          setTimeout(function () {
            window.location = "/Usercenter";  //刷新页面头像才会重新载入
          },1000);
          window.clearTimeout();
        }
      })
    }
  }
}
</script>

<style scoped>
#app .container{
  width: 1200px;
  margin:0 auto;
  height: 550px;
  background-color:#fff;
  padding-top: 30px;
}
.menu{
  float: left;
}
.content{
  width: 900px;
  height: 500px;
  float: left;
  margin-left: 1px;
  padding: 30px;
}
.content .personal_data h2{
  color: #373737;
  height: 65px;
  border-bottom: 1px solid #ccc;
}
.content .personal_data h3{
  color: #373737;
  height: 55px;
  border-bottom: 1px solid #ccc;
  display: inline-block;
  margin-left: 46px;
  font-size: 20px;
  width: 82%;
}
.content .personal_data .changeAvatar{
  position: absolute;
  left: 18px;
  top: 120px;
  font-size: 16px;
  color: #2e8cf0;
  cursor: pointer;
}
.form-list div{
  margin-bottom: 10px;
}
.avatar{
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: 50px;
  border: 1px solid #ddd;
  float: left;
}
.avatar img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.data-list,.data-list2{
  font-size: 14px;
  color: #4d4d4d;
  margin-left: 148px;
  line-height: 30px;
}
.changedata-btn{
  font-size: 16px;
  color: #ff7600;
  cursor: pointer;
  position: relative;
  top: -204px;
  left: 775px;
}
</style>
