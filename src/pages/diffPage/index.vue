<template>
  <div class="diffUI">
    <div class="select">
      <div class="origin">
        <div>
          <div class="title">
            ui图片
          </div>
          <input type="file" accept="image/*" @change="selectUIPic">
        </div>
        <img :src="UIPicSrc" alt="" ref="originImage">
      </div>
      <div class="current">
        <div>
          <div class="title">
            前端图片
          </div>
          <input type="text" v-model="feLink" placeholder="请输入对应的链接地址">
          <button @click="confirm">确认</button>
          <button @click="goto">转到</button>
          <button @click="withCookie = !withCookie" :class="{withCookie}">cookie</button>
        </div>
        <img :src="FEPicSrc" alt="" ref="currentImage"/>
      </div>
    </div>
    <div class="diff">
      <div class="title">diff图片</div>
      <div>
        <button @click="diff">比较</button>
        <button @click="makeDiffResult">生成图片</button>
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
      imageDatas: [],
      withCookie: false,
      fileName: ''
    }
  },
  methods: {
    selectUIPic (e) {
      let file = e.srcElement.files[0]
      this.fileName = file.name
      if (this.UIPicSrc !== window.URL.createObjectURL(file)) {
        this.UIPicSrc = window.URL.createObjectURL(file)
      }
      this.loadImage(this.UIPicSrc, 0)
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
          // devices: 是否是移动设备
          // specialDomToWailt: dom选择器，是否等某元素渲染完成
        },
        withCredentials: this.withCookie,
        dataType: 'arraybuffer'
      }).then(res => {
        let data = new Blob([res.data])
        this.FEPicSrc = window.URL.createObjectURL(data)
        this.loadImage(this.FEPicSrc, 1)
      })
    },
    async loadImage (imagePath, index) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imagePath
      image.onload = async () => {
        if (index === 0) {
          this.ImageWidth = image.width
          this.ImageHeight = image.height
        }
        canvas.width = this.ImageWidth > 0 ? this.ImageWidth : 0
        canvas.height = this.ImageHeight > 0 ? this.ImageHeight : 0
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
        if (originPixel.length !== currentPixel.length) {
          alert('请重新获取前端图片截图')
          return
        }
        const diffData = originPixel.map((item, index) => {
          return currentPixel[index] - originPixel[index]
        })
        for (let i = 0; i <= result.data.length - 4; i = i + 4) {
          let pixelColor = Math.sqrt(diffData[i] * diffData[i] + diffData[i + 1] * diffData[i + 1] + diffData[i + 2] * diffData[i + 2])
          pixelColor = pixelColor * 255 / 441
          result.data[i + 0] = 255 - pixelColor
          result.data[i + 1] = 255 - pixelColor
          result.data[i + 2] = 255 - pixelColor
          result.data[i + 3] = 255
        }
        ctx.putImageData(result, 0, 0)
      }
    },
    goto () {
      window.open(this.feLink)
    },
    makeDiffResult () {
      let canvas = this.$refs['diff_image']
      var MIME_TYPE = 'image/png'
      var imgURL = canvas.toDataURL(MIME_TYPE)
      var dlLink = document.createElement('a')
      dlLink.download = `${this.fileName}_result.png`
      dlLink.href = imgURL
      dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':')
      document.body.appendChild(dlLink)
      dlLink.click()
      document.body.removeChild(dlLink)
    }
  }
}
</script>

<style lang="scss" scoped>
.diffUI {
  height: 100%;
  display: flex;
  margin-left: 100px;
}
.select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  width: 50%;
  .origin, .current {
    height: 50%;
    .title {
      margin-bottom: 30px;
      font-size: 60px;
      font-weight: bold;
    }
    img {
      height: calc(100% - 300px);
    }
    input {
      height: 100px;
      margin-bottom: 30px;
    }
  }
  .origin {
    input {
      width: 620px;
    }
  }
  .current {
    input {
      width: 500px;
    }
    .withCookie {
      background-color: #b6d7a8;
    }
  }
}
.diff {
  flex-grow: 1;
  .title {
    margin-bottom: 30px;
    font-size: 60px;
    font-weight: bold;
  }
}
.canvas {
  margin: 0;
  border: 0;
  padding: 0;
}
button {
  width: 300px;
  margin-bottom: 30px;
  background-color: #eee;
  border-radius: 20px;
  height: 120px;
}
</style>
