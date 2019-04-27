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
          <div>
            <Avatar class="avatar" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
          </div>
          <div v-for="item in userdata" v-bind:key="item._id">
            <h2>ID: {{item.username}}</h2>
            <p>昵称：{{item.nicheng}}</p>
            <p>实名：{{item.truename}}</p>
            <p>性别：{{item.sex}}</p>
            <p>生日：{{item.birthday}}</p>
            <p>行业：{{item.Industry}}</p>
            <p>职位：{{item.job}}</p>
            <p>简介：{{item.introduction}}</p>
          </div>
          <span @click="value1 = true">修改资料</span>
        </div>
      </div>
      <Drawer title="修改资料" :closable="true" v-model="value1" width="500">
        <div>
          <label>昵称:</label>
          <Input v-model="nicheng" placeholder="Enter something..." style="width:200px" />
        </div>
        <div>
          <label>实名:</label>
          <Input v-model="truename" placeholder="Enter something..." style="width:200px" />
        </div>
        <div>
          <label>职位:</label>
          <Input v-model="job" placeholder="Enter something..." style="width:200px" />
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
          <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="birthday"></DatePicker>
        </div>
        <div>
          <label>行业:</label>
          <Select v-model="Industry" style="width:200px">
            <Option v-for="item in industry" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <label>简介:</label>
          <Input v-model="introduction" type="textarea" :rows="4" placeholder="Enter something..." />
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
      value1: false ,//控制抽屉显示
      username:this.$store.state.username,
      nicheng:'',
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
      userdata:[]
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
          'nicheng':this.nicheng,
          'truename':this.truename,
          'job':this.job,
          'sex':this.sex,
          'birthday':this.birthday,
          'Industry':this.Industry,
          'introduction':this.introduction
        }
      }).then(result=>{
        window.location='/Usercenter';
        if(result.data=='2'){
          this.$Message.warning("资料修改成功");
          window.location='/Usercenter';
        }
      })
    },
    findUserData(){
      this.$axios.get('/dofinduserdata',{
        params:{
          'username':this.$store.state.username
        }
      }).then(result=>{
        this.userdata = result.data;
        console.log(this.birthday);
      })
    }
  }
}
</script>

<style scoped>
#app .container{
  width: 1200px;
  margin:0 auto;
  height: 600px;
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
</style>
