<template>
<div>
  <div class="index">
    <div class="origin">
      <div class="title">
        ui图片
        <input type="text" v-model="originImageName">
      </div>
      <img :src="originImage" alt="" ref="originImage" @load="loadImage"/>
    </div>
    <div class="current">
      <div class="title">
        前端图片
        <input type="text" v-model="currentImageName">
      </div>
      <img :src="currentImage" alt="" ref="currentImage" @load="loadImage"/>
    </div>
  </div>
  <div class="diff">
    <div class="title">diff图片</div>
    <canvas ref="diff_image" class="canvas"></canvas>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      originImageName: '',
      currentImageName: '',
      imageDatas: []
    }
  },
  computed: {
    originImage () {
      return `../../../static/origin/${this.originImageName}.png`
    },
    currentImage () {
      return `../../../static/current/${this.currentImageName}.png`
    }
  },
  methods: {
    loadImage (e) {
      let imgPath = e.path[0].currentSrc
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imgPath
      setTimeout(() => {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
        this.imageDatas.push(ctx.getImageData(0, 0, image.width, image.height))
      }, 500)
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
  }
  .canvas {
    margin: 0;
    border: 0;
    padding: 0;
  }
}
</style>
