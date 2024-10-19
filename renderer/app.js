const chartDom = document.getElementById('xrd-chart');
if (!chartDom) {
    console.error("Chart DOM element not found.");
} else {
    let myChart = echarts.init(chartDom);
    console.log("ECharts initialized successfully.");
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('xrd-form');
    const errorMessage = document.getElementById('error-message');
    const sourceInfo = document.getElementById('source-info');
    const closestData = document.getElementById('closest-data');
    const chartDom = document.getElementById('xrd-chart');
    let myChart = echarts.init(chartDom);
    let option;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // 获取输入的表单值并进行日志记录
        const sio2 = document.getElementById('sio2').value;
        const na2o = document.getElementById('na2o').value;
        const h2o = document.getElementById('h2o').value;
        const time = document.getElementById('time').value;
        const temperature = document.getElementById('temperature').value;

        console.log('Form Values:', { sio2, na2o, h2o, time, temperature });

        // 显示加载动画
        document.getElementById('loading-spinner').style.display = 'block';

        // 调用 Electron 主进程 API，查找 XRD 数据
        window.electronAPI.findClosestXRD({
            sio2,
            na2o,
            h2o,
            time,
            temperature
        }).then(result => {
            console.log("Received result from Electron:", result); // 输出接收到的结果

            // 隐藏加载动画
            document.getElementById('loading-spinner').style.display = 'none';

            if (result && result.data) {
                // 使用 ECharts 绘制 XRD 图
                drawXRDGraph(result.data);

                sourceInfo.textContent = `来源: ${result.source}, 结果: ${result.result}`;
                closestData.textContent = `SiO2/Al2O3: ${result.sio2}, Na2O/SiO2: ${result.na2o}, H2O/SiO2: ${result.h2o}, 时间: ${result.time} h, 温度: ${result.temperature} ℃`;
                errorMessage.style.display = 'none';
            } else {
                console.warn('No result found for the provided input values.');
                errorMessage.textContent = "未找到相关结果。";
                errorMessage.style.display = 'block';
            }
        }).catch(error => {
            console.error("Error occurred while fetching XRD data:", error); // 捕获和记录错误
            console.log("Detailed error:", error);  // 输出详细错误信息
            document.getElementById('loading-spinner').style.display = 'none'; // 隐藏加载动画
            errorMessage.textContent = "显示图像或查找结果时出错。";
            errorMessage.style.display = 'block';
        });        
    });

    // 绘制 XRD 图表的函数
    function drawXRDGraph(data) {
        const xValues = data.map(item => item["2THETA"]);
        const yValues = data.map(item => item["Cnt2_D1"]);
    
        if (xValues.length === 0 || yValues.length === 0) {
            console.error("Invalid data for chart");
            return;
        }
    
        // 初始图表选项，只设置空的数据
        const option = {
            title: { text: 'XRD 图像' },
            xAxis: { type: 'category', data: [] }, // 初始为空数组
            yAxis: { type: 'value', name: '强度' },
            series: [{
                data: [],
                type: 'line',
                smooth: true,
                animationDurationUpdate: 1000, // 动画时长
                animationEasingUpdate: 'cubicOut' // 动画缓动效果
            }]
        };
    
        // 初始化空图表
        myChart.setOption(option);
    
        let currentIndex = 0;
    
        // 使用 setInterval 逐步绘制图表
        const interval = setInterval(() => {
            if (currentIndex >= xValues.length) {
                clearInterval(interval); // 停止定时器
            } else {
                // 逐步添加数据到图表中
                option.xAxis.data.push(xValues[currentIndex]);
                option.series[0].data.push(yValues[currentIndex]);
    
                // 仅更新数据部分，避免重置整个配置
                myChart.setOption({
                    xAxis: {
                        data: option.xAxis.data
                    },
                    series: [{
                        data: option.series[0].data
                    }]
                });
    
                currentIndex++;
            }
        }, 50); // 每隔 200 毫秒更新一次数据
    }
    
});

