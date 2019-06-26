<template>
  <div class="document">
    <div class="wiki">
      <div class="top">
        <el-input v-model="wiki_name" placeholder="请输入wiki说明"></el-input>
        <el-input v-model="wiki_href" placeholder="请输入wiki地址"></el-input>
        <el-button type="primary" @click="addWiki">添加一条wiki</el-button>
      </div>
      <el-table
        :data="wikiTableData"
        :row-style=rowStyle
        border
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          label="wiki说明"
        >
        </el-table-column>
        <el-table-column
          prop="href"
          label="wiki地址"
        >
          <template slot-scope="scope">
            <div @click="gotoTargetUrl(scope.row)" class="href">{{scope.row.href}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="删除该条"
          width="680">
          <template slot-scope="scope">
            <div class="delete-btn">
               <el-button
                type="danger"
                @click="handleDeleteWiki(scope.$index, scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="jira">
      <div class="top">
        <el-input v-model="jira_name" placeholder="请输入jira说明"></el-input>
        <el-input v-model="jira_href" placeholder="请输入jira地址"></el-input>
        <el-button type="primary" @click="addJira">添加一条jira</el-button>
      </div>
      <el-table
        :data="jiraTableData"
        :row-style=rowStyle
        border
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          label="jira说明"
        >
        </el-table-column>
        <el-table-column
          prop="href"
          label="jira地址"
        >
          <template slot-scope="scope">
            <div @click="gotoTargetUrl(scope.row)" class="href">{{scope.row.href}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="删除该条"
          width="680">
          <template slot-scope="scope">
            <div class="delete-btn">
               <el-button
                type="danger"
                @click="handleDeleteJira(scope.$index, scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mywork">
      <el-table
        :data="myworkData"
        :row-style=rowStyle
        border
        empty-text="暂无数据">
        <el-table-column
          prop="devTime"
          label="开发时间"
          width="1100"
        >
          <template slot-scope="scope">
            <div class="selectTimeContainer">
              <el-date-picker
                size="large"
                v-model="scope.row.devTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                popper-class="selectTime"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="testTime"
          label="测试时间"
          width="1100"
         >
         <template slot-scope="scope">
            <div class="selectTimeContainer">
              <el-date-picker
                size="large"
                v-model="scope.row.testTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                popper-class="selectTime"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="dev"
          label="开发"
         >
          <template slot-scope="scope">
            <div class="checkbox">
              <el-checkbox v-model="scope.row.dev"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="test"
          label="测试"
        >
          <template slot-scope="scope">
            <div class="checkbox">
              <el-checkbox v-model="scope.row.test"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="product"
          label="上线"
         >
          <template slot-scope="scope">
            <div class="checkbox">
              <el-checkbox v-model="scope.row.product"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="上线时间"
          width="500"
        >
          <template slot-scope="scope">
            <div class="selectTimeContainer">
              <el-date-picker
                v-model="scope.row.endTime"
                type="date"
                placeholder="选择日期"
                popper-class="selectSingleTime">
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="删除该条"
        >
          <template slot-scope="scope">
            <div class="delete-btn">
                <el-button
                type="danger"
                @click="handleDeleteMywork(scope.$index, scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rowStyle: {
        height: '150px'
      },
      wikiTableData: [{
        name: '-',
        href: '-'
      }],
      jiraTableData: [{
        name: '-',
        href: '-'
      }],
      myworkData: [{
        devTime: [],
        testTime: [],
        dev: false,
        test: false,
        product: false,
        endTime: ''
      }],
      wiki_name: '',
      wiki_href: '',
      jira_name: '',
      jira_href: ''
    }
  },
  methods: {
    addWiki () {
      if (this.wiki_name.trim() && this.wiki_href.trim()) {
        this.wikiTableData = [...this.wikiTableData, {
          name: this.wiki_name.trim(),
          href: this.wiki_href.trim()
        }].filter(item => {
          return item.name !== '-'
        })
      }
    },
    handleDeleteWiki (index, row) {
      this.wikiTableData.splice(index, 1)
    },
    addJira () {
      if (this.jira_name.trim() && this.jira_href.trim()) {
        this.jiraTableData = [...this.jiraTableData, {
          name: this.jira_name.trim(),
          href: this.jira_href.trim()
        }].filter(item => {
          return item.name !== '-'
        })
      }
    },
    handleDeleteJira (index, row) {
      this.jiraTableData.splice(index, 1)
    },
    handleDeleteMywork (index, row) {
      this.myworkData.splice(index, 1)
    },
    gotoTargetUrl (row) {
      if (row.href.trim() !== '-') {
        window.open(row.href)
      }
    }
  }
}
</script>

<style lang="scss">
.document {
  .wiki, .jira, .mywork {
    width: 100%;
    margin-bottom: 200px;
    .el-table {
      width: 80%;
      margin: 200px auto;
      border-top: 4px solid #eee;
      border-left: 4px solid #eee;
      .el-table__header-wrapper,
      .el-table__header {
        width: 100%;
      }
      .delete-btn {
        width: 300px;
        height: 100px;
        margin: 0 auto;
        button {
          width: 100%;
          height: 100%;
          border-radius: 20px;
        }
      }
      .el-table__empty-block {
        height: 300px;
        line-height: 300px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
      tr:hover > td {
        background-color: #fff;
      }
      .cell {
        padding: 0;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 20px;
        .href {
          color: blue;
        }
        .href:hover {
          cursor: pointer;
        }
      }
    }
    .top {
      width: 60%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      .el-input {
        width: 800px;
        height: 150px;
        border: 5px solid #eee;
        border-radius: 3px;
        margin-right: 10px;
        input {
          width: 100%;
          height: 100%;
        }
      }
      .el-button {
        border-radius: 20px;
      }
      .el-button .delete-button .el-button--danger {
        width: 1px;
      }
    }
  }
  .mywork {
    .selectTimeContainer {
      width: 100%;
      height: 100px;
      div {
        width: 90%;
        height: 100px;
        line-height: 100px;
        input {
          height: 100px;
          width: 400px;
          line-height: 100px;
        }
        i {
          width: 50px;
        }
        span {
          height: 100%;
          line-height: 200%;
        }
      }
      .el-input__inner {
        margin-left: 20px;
      }
      .el-date-editor {
        text-align: center;
      }
    }
  }
}
.selectTime, .selectSingleTime {
  width: 1500px !important;
  height: 800px !important;
  .el-date-table__row {
    height: 100px;
    width: 800px;
  }
  .el-date-range-picker__header {
    height: 80px;
    line-height: 80px;
  }
  th {
    height: 80px;
    line-height: 80px;
    padding: 0;
  }
  .el-range__close-icon {
    margin-left: 10px;
  }
}
.selectSingleTime {
  width: 800px !important;
  .el-picker-panel__content {
    width: 95%;
    text-align: center;
  }
}
.checkbox {
  .el-checkbox__inner {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: red;
  }
  .is-checked {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #409eff;
    span {
      display: none;
    }
  }
}
</style>
