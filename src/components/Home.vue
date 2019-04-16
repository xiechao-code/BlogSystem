<template>
  <div class="hello">
    <Content :style="{padding: '0 150px'}">
      <Card>
          <div style="min-height: 500px;">
              <div style="background:#eee;padding: 20px">
                <Card :bordered="false">
                    <p slot="title">No border title</p>
                    <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
                </Card><br>
                <Card :bordered="false">
                    <p slot="title">No border title</p>
                    <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
                </Card><br>
                <Card :bordered="false">
                    <p slot="title">No border title</p>
                    <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
                </Card>
            </div>
          </div>
      </Card>
    </Content>
  </div>
</template>

<script>
export default {
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-card {
    margin-top: 15px;
} 
</style>
