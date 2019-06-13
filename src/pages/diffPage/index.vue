<template>
<div>
  <div class="index">
    <div class="origin">
      <div class="title">ui图片</div>
      <img :src="originImage" alt="" ref="originImage" @load="loadImage"/>
    </div>
    <div class="current">
      <div class="title">前端图片</div>
      <img :src="currentImage" alt="" ref="currentImage" @load="loadImage"/>
    </div>
  </div>
  <div class="diff">
    <div class="title">diff图片</div>
    <canvas id="diff_image" class="canvas"></canvas>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      originImage: '../../../static/origin/ic_hot.png',
      currentImage: '../../../static/current/ic_new.png',
      imageDatas: []
    }
  },
  methods: {
    loadImage (e) {
      let imgPath = e.path[0].currentSrc
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let image = new Image()
      image.src = imgPath
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
      this.imageDatas.push(ctx.getImageData(0, 0, image.width, image.height))
    }
  },
  mounted () {
    setTimeout(() => {
      const originPixel = this.imageDatas[0].data
      const currentPixel = this.imageDatas[1].data
      const diffData = originPixel.map((item, index) => {
        return originPixel[index] - currentPixel[index]
      })
      let canvas = document.getElementById('diff_image')
      let ctx = canvas.getContext('2d')
      canvas.width = this.imageDatas[0].width
      canvas.height = this.imageDatas[0].height
      let result = ctx.createImageData(canvas.width, canvas.height)
      for (let i = 0; i <= result.data.length - 4; i = i + 4) {
        let pixelColor = Math.sqrt(diffData[i] * diffData[i] + diffData[i + 1] * diffData[i + 1] + diffData[i + 2] * diffData[i + 2])
        result.data[i + 0] = 255 - pixelColor
        result.data[i + 1] = 255 - pixelColor
        result.data[i + 2] = 255 - pixelColor
        result.data[i + 3] = 255
      }
      ctx.putImageData(result, 0, 0)
    }, 1000)
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
  }
  .canvas {
    margin: 0;
    border: 0;
    padding: 0;
  }
}
</style>
