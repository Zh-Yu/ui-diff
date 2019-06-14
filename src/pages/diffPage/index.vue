<template>
<div>
  <div class="index">
    <div class="origin">
      <div class="title">
        ui图片
        <input type="file" accept="image/*" @change="selectUIPic">
      </div>
      <img :src="UIPicSrc" alt="" ref="originImage">
    </div>
    <div class="current">
      <div class="title">
        前端图片
        <input type="text" v-model="feLink" placeholder="请输入对应的链接地址">
        <button @click="confirm">确认</button>
      </div>
      <img :src="FEPicSrc" alt="" ref="currentImage"/>
    </div>
  </div>
  <div class="diff">
    <div class="title">diff图片</div>
    <div>
      <button @click="diff">比较</button>
    </div>
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
        if (this.UIPicSrc !== e.target.result) {
          this.UIPicSrc = e.target.result
          this.loadImage(this.UIPicSrc, 0)
        }
      }
    },
    confirm () {
      // 发请求通知node截图带width,height参数
      if (this.ImageWidth === 0) {
        alert('请先选择ui图')
        return
      }
      api({
        url: 'http://account.jetbrains.com:3000',
        params: {
          width: this.ImageWidth,
          height: this.ImageHeight,
          url: this.feLink
        },
        dataType: 'arraybuffer'
      }).then(res => {
        this.FEPicSrc = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        this.loadImage(this.FEPicSrc, 1)
      })
    },
    async loadImage (imagePath, index) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imagePath
      image.onload = async () => {
        this.ImageWidth = image.width
        this.ImageHeight = image.height
        await ctx.drawImage(image, 0, 0, this.ImageWidth, this.ImageHeight)
        this.imageDatas[index] = await ctx.getImageData(0, 0, this.ImageWidth, this.ImageHeight)
      }
    },
    diff () {
      let canvas = this.$refs['diff_image']
      let ctx = canvas.getContext('2d')
      canvas.width = this.ImageWidth > 0 ? this.ImageWidth : 0
      canvas.height = this.ImageHeight > 0 ? this.ImageHeight : 0
      let result = ctx.createImageData(canvas.width, canvas.height)
      if (this.imageDatas.length === 2) {
        const originPixel = this.imageDatas[0].data
        const currentPixel = this.imageDatas[1].data
        const diffData = originPixel.map((item, index) => {
          return Math.abs(currentPixel[index] - originPixel[index])
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
