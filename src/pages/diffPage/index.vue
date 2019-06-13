<template>
<div>
  <div class="index">
    <div class="origin">
      <div class="title">
        ui图片
        <input type="file" accept="image/*" @change="selectUIPic">
      </div>
      <img :src="UIPicSrc" alt="" ref="originImage" @load="loadUIImage">
    </div>
    <div class="current">
      <div class="title">
        前端图片
        <input type="text" v-model="feLink" placeholder="请输入对应的链接地址">
        <button @click="confirm">确认</button>
      </div>
      <img :src="FEPicSrc" alt="" ref="currentImage" @load="loadFEImage"/>
    </div>
  </div>
  <div class="diff">
    <div class="title">diff图片</div>
    <canvas ref="diff_image" class="canvas"></canvas>
  </div>
</div>
</template>

<script>
import api from '@api/axios.js'
export default {
  data () {
    return {
      UIPicSrc: '',
      FEPicSrc: '',
      feLink: '',
      ImageWidth: 0,
      ImageHeight: 0,
      imageDatas: []
    }
  },
  methods: {
    selectUIPic (e) {
      var reader = new FileReader()
      reader.readAsDataURL(e.srcElement.files[0])
      reader.onload = (e) => {
        this.UIPicSrc = e.target.result
      }
    },
    loadUIImage (e) {
      let imgPath = e.target.currentSrc
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imgPath
      setTimeout(() => {
        this.ImageWidth = image.width
        this.ImageHeight = image.height
        ctx.drawImage(image, 0, 0)
        this.imageDatas.push(ctx.getImageData(0, 0, this.ImageWidth, this.ImageHeight))
      }, 500)
    },
    loadFEImage (e) {
      let imgPath = e.target.currentSrc
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imgPath
      setTimeout(() => {
        ctx.drawImage(image, 0, 0)
        this.imageDatas.push(ctx.getImageData(0, 0, this.ImageWidth, this.ImageHeight))
      }, 500)
    },
    confirm () {
      // 发请求通知node截图带width,height参数
      api({
        url: 'http://account.jetbrains.com:3000',
        params: {
          width: this.ImageWidth,
          height: this.ImageHeight,
          url: this.feLink
        }
      }).then(res => {
        console.log(res)
      })
    }
  },
  watch: {
    imageDatas (value) {
      let canvas = this.$refs['diff_image']
      let ctx = canvas.getContext('2d')
      canvas.width = value.length > 1 ? value[0].width : 10
      canvas.height = value.length > 1 ? value[0].height : 10
      let result = ctx.createImageData(canvas.width, canvas.height)
      if (value.length === 2) {
        const originPixel = value[0].data
        const currentPixel = value[1].data
        const diffData = originPixel.map((item, index) => {
          return originPixel[index] - currentPixel[index]
        })
        for (let i = 0; i <= result.data.length - 4; i = i + 4) {
          let pixelColor = Math.sqrt(diffData[i] * diffData[i] + diffData[i + 1] * diffData[i + 1] + diffData[i + 2] * diffData[i + 2])
          result.data[i + 0] = 255 - pixelColor
          result.data[i + 1] = 255 - pixelColor
          result.data[i + 2] = 255 - pixelColor
          result.data[i + 3] = 255
        }
      }
      ctx.putImageData(result, 0, 0)
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.index {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .origin, .current, .diff {
    width: 50%;
    .title {
      margin-bottom: 20px;
    }
    img {
      width: 100%;
    }
  }
  .canvas {
    margin: 0;
    border: 0;
    padding: 0;
  }
}
</style>
