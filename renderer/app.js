document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('xrd-form');
    const imgElement = document.getElementById('xrd-image');
    const resultCard = document.getElementById('result-card');
    const errorMessage = document.getElementById('error-message');
    const sourceInfo = document.getElementById('source-info');
    const closestData = document.getElementById('closest-data');  // 用于显示最近似数据

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        // 显示加载动画
        document.getElementById('loading-spinner').style.display = 'block';
    
        const sio2 = document.getElementById('sio2').value;
        const na2o = document.getElementById('na2o').value;
        const h2o = document.getElementById('h2o').value;
        const time = document.getElementById('time').value;
        const temperature = document.getElementById('temperature').value;
    
        window.electronAPI.findClosestXRD({
            sio2,
            na2o,
            h2o,
            time,
            temperature
        }).then(result => {
            console.log("Received result:", result);
            
            // 隐藏加载动画
            document.getElementById('loading-spinner').style.display = 'none';
    
            if (result) {
                imgElement.src = result.img;
                imgElement.style.display = 'block';
                sourceInfo.textContent = `来源: ${result.source}, 结果: ${result.result}`;
                closestData.textContent = `SiO2/Al2O3: ${result.sio2}, Na2O/SiO2: ${result.na2o}, H2O/SiO2: ${result.h2o}, 时间: ${result.time} h, 温度: ${result.temperature} ℃`;
                resultCard.classList.add('animate__fadeIn');
                resultCard.style.display = 'block';
                errorMessage.style.display = 'none';
            } else {
                errorMessage.textContent = "未找到相关结果。";
                errorMessage.style.display = 'block';
                resultCard.style.display = 'none';
            }
        }).catch(error => {
            console.error("Error displaying result:", error);
            document.getElementById('loading-spinner').style.display = 'none'; // 隐藏加载动画
            errorMessage.textContent = "显示图像或查找结果时出错。";
            errorMessage.style.display = 'block';
            resultCard.style.display = 'none';
        });
    });
    
});
