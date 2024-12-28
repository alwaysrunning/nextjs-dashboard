/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import  { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts'
import moment from 'moment';
import './index.css';

declare global {
  interface Window {
    HandleTooltipDetailClick: ()=> void;
    Url: string;
  }
}

window.HandleTooltipDetailClick = () => {
  window.open(window.Url);
};

// 添加类型定义
interface TaskNode {
  TaskName: string;
  InCharge: string;
  RefId: string;
  EarlyStart: number;
  EarlyEnd: number;
  ActualStart: number;
  ActualEnd: number;
}

interface ProjectData {
  name: string;
  actualStartTime: number;
  actualValue: number;
  earlyStartTime: number;
  earlyValue: number;
}

const Echarts = () => {
  /** 模拟接口数据 */
  const NodeList = [
    {
      TaskName: "测试状态1",
      InCharge: "andy",
      RefId: "11111111",
      EarlyStart: moment().valueOf(),
      EarlyEnd: moment().add(2, 'hours').valueOf(),
      ActualStart: moment().valueOf(),
      ActualEnd: moment().add(2, 'hours').valueOf(),
    },
    {
      TaskName: "测试状态2",
      InCharge: "kerry",
      RefId: "22222222",
      EarlyStart: moment().add(2, 'hours').valueOf(),
      EarlyEnd: moment().add(4, 'hours').valueOf(),
      ActualStart: moment().add(2, 'hours').valueOf(),
      ActualEnd: moment().add(4, 'hours').valueOf(),
    },
    {
      TaskName: "测试状态3",
      InCharge: "loading",
      RefId: "3333333",
      EarlyStart: moment().add(4, 'hours').valueOf(),
      EarlyEnd: moment().add(6, 'hours').valueOf(),
      ActualStart: moment().add(4, 'hours').valueOf(),
      ActualEnd: moment().add(6, 'hours').valueOf(),
    },
    {
      TaskName: "测试状态4",
      InCharge: "grace",
      RefId: "44444444",
      EarlyStart: moment().add(6, 'hours').valueOf(),
      EarlyEnd: moment().add(7, 'hours').valueOf(),
      ActualStart: moment().add(6, 'hours').valueOf(),
      ActualEnd: moment().add(7, 'hours').valueOf(),
    },
  ]

  // 将数据提取到 useMemo 中
  const { projectIds, maxTime, minTime, xLen } = useMemo(() => {
    const projectIds = NodeList.map((rule) => ({
      name: rule.RefId,
      actualStartTime: rule.ActualStart,
      actualValue: rule.ActualEnd - rule.ActualStart,
      earlyStartTime: rule.EarlyStart,
      earlyValue: rule.EarlyEnd - rule.EarlyStart
    }));

    const maxTime = moment().add(1, 'day').valueOf();
    const minTime = moment().valueOf();
    const xLen = Math.max((maxTime - minTime) / 1000 / 3600);

    return { projectIds, maxTime, minTime, xLen };
  }, []);

  // 图表配置使用 useMemo 优化
  const options = useMemo(() => ({
    legend: {
      data: [
        {
          name: '预计完成时间',
          itemStyle: {
            color: {
              type: 'linear',
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(130, 163, 184, 0.4)',
                },
                {
                  offset: 1,
                  color: 'rgba(130, 163, 184, 0.4)',
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        {
          name: '实际完成时间',
          itemStyle: {
            color: {
              type: 'linear',
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(78, 204, 174, 0.4)',
                },
                {
                  offset: 1,
                  color: 'rgba(78, 204, 174, 0.4)',
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
    },
    tooltip: {
      triggerOn: 'mousemove',
      position(point: any[]) {
        return [point[0], point[1]];
      },
      extraCssText: 'z-index: 99; width:auto;height:auto;padding:0;border:none;pointer-events: auto;',
      trigger: 'item',
      enterable: true,
      formatter: (params: any) => {
        const { data } = params;
        const { name } = data;
        const index = NodeList.findIndex((node) => node.RefId === name);
        const rule: any = NodeList[index] || {};
        window.Url = `https://www.baidu.com?TaskId=11&ProjectId=22`
        return `<div class="GanttChart">
      <div class="wrap">
        <div class="container1" onclick="HandleTooltipDetailClick()">
          <div class="content1">
            <div class="text2">任务名称</div>
            <div class="text3">${rule?.TaskName ? rule.TaskName : '-'}</div>
          </div>
          <div class="content2">
            <div class="main">
              <div class="text4">负责人</div>
            </div>
            <div class="main1">
              <div class="text5">${rule?.InCharge || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
`;
      },
    },
    dataZoom: [
      {
        type: 'slider',
        width: 1,
        show: projectIds?.length > 8,
        yAxisIndex: [0],
        left: '131px',
        showDataShadow: false,
        showDetail: false,
        realtime: true,
        start: 0,
        end: (Math.min(8, projectIds.length) / projectIds.length) * 100,
        borderColor: 'transparent',
      },
      {
        type: 'inside',
        yAxisIndex: [0],
        show: projectIds?.length > 8,
        start: 1,
        end: 50,
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
      },
      {
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'weakFilter',
        height: 1,
        show: xLen > 10,
        start: 0,
        end: (Math.min(9, xLen) / xLen) * 100,
        showDetail: false,
        zoomLock: true,
        bottom: 70,
        z: 10,
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        filterMode: 'weakFilter',
        show: xLen > 10,
        start: 0,
        end: 26,
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
      },
    ],
    grid: {
      containLabel: false,
      left: '140px',
      right: '60px',
    },
    xAxis: {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e5e6eb',
        },
      },
      type: 'value',
      min: minTime,
      max: maxTime,
      interval: 3600 * 1000,
      axisLabel: {
        formatter(e:any) {
          return echarts.format.formatTime('hh:mm\nMM-dd', e, false);
        },
        color: '#797D91',
        margin: 20,
      },
    },
    yAxis: {
      type: 'category',
      data: projectIds.map((v) => v.name),
      name: '任务ID',
      nameTextStyle: {
        align: 'right',
        padding: [0, 40, 0, 0],
        color: '#797D91',
      },
      axisLine: {
        lineStyle: {
          color: '#e5e6eb', // y 轴线的颜色
        },
      },
      axisLabel: {
        padding: [0, 8, 0, 0],
        color: 'rgba(32, 38, 72, 1)', // y 轴标签的颜色
      },
    },
    series: [
      {
        data: projectIds.map((v) => ({ name: v.name, value: v.earlyStartTime })),
        type: 'bar',
        stack: '预计完成时间',
        name: '预计完成时间',
        barGap: 0,
        barWidth: '20px',
        itemStyle: {
          color: 'transparent',
        },
      },
      {
        data: projectIds.map((v) => ({ name: v.name, value: v.earlyValue })),
        type: 'bar',
        stack: '预计完成时间',
        barWidth: '20px',
        name: '预计完成时间',
        itemStyle: {
          normal: {
            borderRadius: [4, 4, 4, 4],
            color() {
              // 颜色渐变，使用 earlyValue 进行比例换算，占比百分之3
              const gradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(130, 163, 184, 0.4)' },
                { offset: 1, color: 'rgba(130, 163, 184, 0.4)' },
              ]);
              return gradient;
            },
          },
          emphasis: {
            borderRadius: [4, 4, 4, 4],
            color: '#82A3B8',
          },
        },
      },
      {
        data: projectIds.map((v) => ({ name: v.name, value: v.actualStartTime })),
        type: 'bar',
        stack: '实际完成时间',
        barWidth: '20px',
        name: '实际完成时间',
        itemStyle: {
          color: 'transparent',
        },
      },
      {
        data: projectIds.map((v) => ({ name: v.name, value: v.actualValue })),
        type: 'bar',
        barWidth: '20px',
        stack: '实际完成时间',
        name: '实际完成时间',
        itemStyle: {
          normal: {
            borderRadius: [4, 4, 4, 4],
            color() {
              const gradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(78, 204, 174, 0.4)' },
                { offset: 1, color: 'rgba(78, 204, 174, 0.4)' },
              ]);
              return gradient;
            },
          },
          emphasis: {
            borderRadius: [4, 4, 4, 4],
            color: '#4ECCAE',
          },
        },
      },
      {
        name: '预警线',
        type: 'line',
        showSymbol: false,
        markLine: {
          symbol: 'none',
          tooltip: {
            show: false,
          },
          data: [
            {
              name: '预警时间',
              xAxis: moment().add(5, 'hours').valueOf(),
              lineStyle: {
                type: 'dashed',
                color: '#E37318',
                normal: {
                  width: 1,
                  color: '#E37318',
                },
                emphasis: {
                  width: 1,
                  color: '#E37318',
                },
              },
              label: {
                show: true,
                position: 'end',
                formatter: '{b}',
                fontSize: 10,
                color: '#E37318',
                backgroundColor: '#FFF1E9',
                padding: 4,
              },
            },
            {
              name: '承诺时间',
              xAxis: moment().add(6, 'hours').valueOf(),
              lineStyle: {
                type: 'dashed',
                color: 'rgba(229, 69, 69, 1)',
                normal: {
                  width: 1,
                  color: 'rgba(229, 69, 69, 1)',
                },
                emphasis: {
                  width: 1,
                  color: 'rgba(229, 69, 69, 1)',
                },
              },
              label: {
                show: true,
                position: 'end',
                formatter: '{b}',
                fontSize: 10,
                color: 'rgba(229, 69, 69, 1)',
                backgroundColor: 'rgba(251, 224, 224, 1)',
                padding: 4,
              },
            },
          ],
        },
      },
    ],
  }), [projectIds, maxTime, minTime, xLen]);

  // 将图表实例保存在 ref 中
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // 初始化图表
    const chartDom = document.getElementById('main');
    if (!chartDom) return;
    
    chartRef.current = echarts.init(chartDom);
    chartRef.current.setOption(options);

    // 添加窗口大小自适应
    const handleResize = () => {
      chartRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
    };
  }, [options]);

  return (
    <div style={{ position: 'relative' }}>
      <div id="main" style={{ height: '600px', width: '100%' }} />
    </div>
  );
};

export default Echarts;