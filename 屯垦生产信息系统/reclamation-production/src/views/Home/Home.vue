<template>
  <ContentWrap>
    <div class="top-select">
      <img src="@/assets/imgs/home/home.png" alt="" />
      <ElPopover
        placement="bottom"
        :width="200"
        trigger="hover"
        content="  本功能通过综合态势管理，利用地理信息系统(GIS)和知识图谱工具，实现了对生产保障资源、需求和行动的全面监控与分析。它采用多样化的表现形式（包括标号、数据表、统计图等）和先进的分析技术（如数据挖掘、聚类分析、科学计量和图形绘制等），以实时、动态的方式查询、展示和分析相关信息。

        特别地，该功能能够将生产单位的特定指标以直观的图形化方式呈现，构建出一个全面反映生产资源态势的“一张图”。这种图形化的态势展现，极大地提高了信息的可读性和决策的便捷性，有效辅助和支撑了能源保障筹划的制定和执行，为企业或组织提供了一个强有力的分析和决策工具。"
      >
        <template #reference>
          <div class="plan"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="为了确保系统的稳定运行及用户的顺畅体验，本功能提供了一套全面的基础配置与维护管理解决方案。通过精心设计的权限管理机制，确保不同角色的用户能够安全登录系统，并根据其权限级别，访问并操作相应的功能模块进行业务处理。这不仅优化了系统的性能和安全性，还提高了业务处理的效率和准确性。"
      >
        <template #reference>
          <div class="sys"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="本功能旨在提供一个灵活且高效的基础数据管理平台，支持多种数据整合方式，包括手动数据录入、文件导入、API接口联动以及通过可视化模板进行个性化定制。这样的设计不仅满足了不同场景下的数据整合需求，还极大地提升了数据处理的便捷性和灵活性。用户可以轻松进行数据的增加、修改、删除操作，并且能够利用强大的数据统计和查询功能，快速获取所需信息，从而有效支撑业务决策和运营分析。"
      >
        <template #reference>
          <div class="baseDataManagement"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="本功能框架旨在提供一个全面的规划管理解决方案，贯穿规划生命周期的每一个阶段：从预定制规划模板开始，经过规划方案的编制与审核，到规划任务的具体分发与执行，直至最终的规划归档。此外，本系统特别强调了流程的可定制性，允许用户根据自身业务需求，自定义各个环节的业务流程，从而实现了高度的灵活性和个性化配置。这种设计不仅确保了规划过程的高效和有序，也大大提升了管理的适应性和实用性。"
      >
        <template #reference>
          <div class="project"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="本功能旨在提供一个全面的年度建设计划执行监控解决方案，实现对整个建设项目从启动到完工的全程跟踪记录。这包括项目进度管理、建设过程监督、建设成果评估以及建设经费使用情况的详细管理。通过系统化地记录和管理这些关键环节，确保项目按照既定计划高效推进，同时也便于及时调整和优化策略，保证项目质量和资金使用的透明性与合理性。"
      >
        <template #reference>
          <div class="situationManagement"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="本功能致力于构建一个高效的业务监管平台，通过综合分析生产与业务数据，创建精准的监管分析模型。它能够定期对规划项目的应用情况、供应保障等关键环节进行深度验证，并通过多样化的报警方式（如信号灯提示、交通图展示、地图闪烁、消息弹出、多媒体图形提示等）及时发出预警，有效地实现对各级业务办理情况的综合评估和监管。"
      >
        <template #reference>
          <div class="businessSupervision"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="right"
        :width="200"
        trigger="hover"
        content="本功能旨在实现数据资产管理的高度集成，根据“两大体系”进行数据同步（推送或引接）的情况，数据接口管理包括接口类别管理、接口数据管理、数据转换管理、数据存储管理等。并且可以自行设定同步选项，如增量（全量）同步、同步频次设定、同步失败处置等功能。记录同步的相应日志，以便于系统管理员可以快速查询同步情况，并对同步错误的数据进行快速定位，发现并解决问题，以保证每次同步可以顺利进行。"
      >
        <template #reference>
          <div class="assetManagement"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="left"
        :width="200"
        trigger="hover"
        content="本功能旨在提供一个全面的工具集管理平台，既服务于决策层的需求，也满足系统运维的实际操作需求。对于决策人员，平台提供了一系列高效的测算工具，这些工具能够基于系统收集的各类业务数据，进行深度分析和辅助决策，帮助决策者做出更加科学和合理的决策。

        同时，为了确保系统的稳定运行，本平台还为系统运维管理人员配备了一整套支持工具，包括用于地图展示、数据处理、业务规则配置等方面的实用工具。这些工具不仅提高了系统的可靠性和安全性，也大大提升了运维效率和灵活性，确保系统能够顺畅运行，满足日常业务需求。

        通过这种双向支持设计，工具集管理平台极大地增强了组织的决策力和运维能力，为业务的高效执行提供了有力保障。"
      >
        <template #reference>
          <div class="tools"></div>
        </template>
      </ElPopover>
      <ElPopover
        placement="top"
        :width="200"
        trigger="hover"
        content="1、物联网设备采集数据（包括温湿度传感器、视频信息采集器、二维条码识别器、RFID识别装置等）、
互联网抓取数据(农技农艺、农业资讯、技术服务等)和生产单位接入数据（生产设施、农机装备、农资农具等）。
2、对数据资源全生命周期进行规划设计、过程控制和质量监督，通过规范化的数据治理，实现数据资源的透明、可管、可控。
3、抽取形成生产基础数据、统计评估数据、保障实力数据等数据集合，构建生产保障态势，服务保障需要。
4、数据标准由共享数据标准和交换数据标准构成。"
      >
        <template #reference>
          <div class="data"></div>
        </template>
      </ElPopover>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ElPopover } from 'element-plus'
</script>
<style lang="less" scoped>
.top-select {
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .plan {
    cursor: pointer;
    position: absolute;
    top: 8%;
    left: 2%;
    width: 11%;
    height: 8%;
  }
  .sys {
    cursor: pointer;
    position: absolute;
    top: 8%;
    left: 17%;
    width: 8%;
    height: 6%;
  }
  .baseDataManagement {
    cursor: pointer;
    position: absolute;
    top: 20%;
    left: 17%;
    width: 8%;
    height: 9%;
    cursor: pointer;
  }
  .project {
    position: absolute;
    top: 34%;
    left: 17%;
    width: 8%;
    height: 9%;
    cursor: pointer;
  }
  .situationManagement {
    position: absolute;
    top: 47%;
    left: 17%;
    width: 8%;
    height: 9%;
    cursor: pointer;
  }
  .businessSupervision {
    position: absolute;
    top: 61%;
    left: 17%;
    width: 8%;
    height: 6%;
    cursor: pointer;
  }
  .assetManagement {
    position: absolute;
    top: 75%;
    left: 17%;
    width: 8%;
    height: 9%;
    cursor: pointer;
  }
  .tools {
    position: absolute;
    top: 8%;
    right: 2%;
    width: 11%;
    height: 8%;
    cursor: pointer;
  }
  .data {
    position: absolute;
    top: 90%;
    left: 2%;
    width: 11%;
    height: 8%;
    cursor: pointer;
  }
}
</style>
