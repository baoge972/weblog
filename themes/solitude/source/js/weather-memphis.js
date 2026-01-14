function fetchWeather() {
    console.log('开始获取天气数据...');
    const token = "seyregrpl1dc1o60cudohsufiv2ciz";
    const apiUrl = 'https://v3.alapi.cn/api/tianqi?token='+token+'&city=泰安';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应异常');
            }
            return response.json();
        })
        .then(data => {
            console.log('天气数据获取成功:', data);
            if (data.success) {
                updateWeatherData(data.data);
            } else {
                showError('获取天气数据失败');
            }
        })
        .catch((error) => {
            console.error('请求天气数据出错:', error);
            showError('请求天气数据出错');
        });
}
function updateWeatherData(data) {
    console.log('开始更新天气数据...');
    const locationEl = document.querySelector('.card-weather-memphis .location');
    const dateTimeEl = document.querySelector('.card-weather-memphis .date-time');
    const tempEl = document.querySelector('.card-weather-memphis .temperature');
    const weatherNowEl = document.querySelector('.card-weather-memphis .weather-now');
    const weatherRangeEl = document.querySelector('.card-weather-memphis .weather-range');
    const aqiEl = document.querySelector('.card-weather-memphis .air-quality-title');
    
    if (locationEl) locationEl.textContent = data.city;
    if (dateTimeEl) dateTimeEl.textContent = data.date + ' ' + data.update_time.split(' ')[1];
    if (tempEl) tempEl.textContent = data.temp + '°C';
    if (weatherNowEl) weatherNowEl.textContent = data.weather;
    if (weatherRangeEl) weatherRangeEl.textContent = '今日: ' + data.min_temp + '°C - ' + data.max_temp + '°C';
    if (aqiEl) aqiEl.textContent = '空气质量 [AQI: ' + data.aqi.air + ' - ' + data.aqi.air_level + ']';
    
    updateWeatherIcon(data.weather_code);
    console.log('天气数据更新完成');
}
function updateWeatherIcon(weatherCode) {
    let icon = '&#9729;&#65039;';
    switch(weatherCode) {
        case 'qing': icon = '&#9728;&#65039;'; break;
        case 'duoyun': icon = '&#9925;'; break;
        case 'yin': icon = '&#9729;&#65039;'; break;
        case 'yu':
        case 'xiaoyu': icon = '&#127783;&#65039;'; break;
        case 'dayu': icon = '&#127783;&#65039;'; break;
        case 'xue': icon = '&#10052;&#65039;'; break;
        case 'mai': icon = '&#127787;&#65039;'; break;
    }
    const iconEl = document.querySelector('.card-weather-memphis .weather-icon');
    if (iconEl) iconEl.innerHTML = icon;
}
function showError(msg) {
    console.error('显示错误信息:', msg);
    const tempEl = document.querySelector('.card-weather-memphis .temperature');
    const weatherNowEl = document.querySelector('.card-weather-memphis .weather-now');
    const weatherRangeEl = document.querySelector('.card-weather-memphis .weather-range');
    const aqiEl = document.querySelector('.card-weather-memphis .air-quality-title');
    
    if (tempEl) tempEl.textContent = '--';
    if (weatherNowEl) weatherNowEl.textContent = msg;
    if (weatherRangeEl) weatherRangeEl.textContent = '';
    if (aqiEl) aqiEl.textContent = '';
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化天气卡片...');
    fetchWeather();
    var btn = document.querySelector('.card-weather-memphis .refresh-btn');
    if(btn) {
        btn.addEventListener('click', function(){
            console.log('刷新按钮被点击');
            btn.classList.add('spin');
            fetchWeather();
            setTimeout(()=>btn.classList.remove('spin'), 800);
        });
    } else {
        console.error('未找到刷新按钮');
    }
}); 