document.addEventListener('DOMContentLoaded', () => {
    // 获取页面元素
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-button');
    const yearInput = document.getElementById('year');
    const schoolInput = document.getElementById('school');
    const majorInput = document.getElementById('major');
    const provinceInput = document.getElementById('province');
    const resultsBody = document.getElementById('results-body');
    const resultsTable = document.getElementById('results-table');
    const noResultsMsg = document.getElementById('no-results');
    const statusSpan = document.getElementById('status');

    let allData = []; // 用于存储加载后的所有数据

    // 函数：获取并加载数据
    async function loadData() {
        statusSpan.textContent = '正在加载数据...'; // 显示加载提示
        try {
            // 重要：确保 'data.json' 文件在同一目录下，或提供正确的路径
            const response = await fetch('data.json');
            if (!response.ok) {
                // 如果网络请求失败
                throw new Error(`HTTP 请求错误! 状态码: ${response.status}`);
            }
            allData = await response.json(); // 解析 JSON 数据
            statusSpan.textContent = `数据加载完成 (${allData.length} 条记录)`; // 显示加载完成信息
            // 可选：初始加载时显示所有数据或部分数据
            // displayResults(allData.slice(0, 50)); // 例如，初始显示前50条
        } catch (error) {
            console.error("加载数据失败:", error); // 在控制台打印错误
            statusSpan.textContent = '数据加载失败!'; // 显示错误提示
            // 在表格中显示错误信息
            resultsBody.innerHTML = `<tr><td colspan="14" style="text-align:center; color: red;">无法加载数据文件 (data.json)。请检查文件是否存在且格式正确。</td></tr>`;
        }
    }

    // 函数：在表格中显示结果
    function displayResults(results) {
        resultsBody.innerHTML = ''; // 清空之前的搜索结果
        noResultsMsg.style.display = 'none'; // 隐藏“无结果”提示

        if (results.length === 0) {
            // 如果没有结果
            noResultsMsg.style.display = 'block'; // 显示“无结果”提示
            statusSpan.textContent = '未找到符合条件的数据。';
        } else {
            // 遍历结果并添加到表格中
            results.forEach(item => {
                const row = resultsBody.insertRow();
                // 确保这里的键名与你的 data.json 文件中的键名完全一致，并且顺序与表头对应
                row.insertCell().textContent = item['年份'] ?? ''; // 使用 ?? '' 防止 null 或 undefined 导致错误
                row.insertCell().textContent = item['学校'] ?? '';
                row.insertCell().textContent = item['硕士类型'] ?? '';
                row.insertCell().textContent = item['专业代码'] ?? '';
                row.insertCell().textContent = item['专业名称'] ?? '';
                row.insertCell().textContent = item['总分'] ?? '';
                row.insertCell().textContent = item['政治'] ?? '';
                row.insertCell().textContent = item['英语'] ?? '';
                row.insertCell().textContent = item['专业课一'] ?? '';
                row.insertCell().textContent = item['专业课二'] ?? '';
                row.insertCell().textContent = item['备注'] ?? '';
                row.insertCell().textContent = item['学校省份'] ?? '';
                row.insertCell().textContent = item['学校属性'] ?? '';
                row.insertCell().textContent = item['隶属'] ?? '';
            });
            statusSpan.textContent = `找到 ${results.length} 条结果。`; // 更新状态信息
        }
    }

    // 函数：执行搜索
    function search() {
        // 获取输入值并去除首尾空格
        const yearQuery = yearInput.value.trim();
        // 对文本输入进行小写转换，以实现不区分大小写的搜索
        const schoolQuery = schoolInput.value.trim().toLowerCase();
        const majorQuery = majorInput.value.trim().toLowerCase();
        const provinceQuery = provinceInput.value.trim().toLowerCase();

        statusSpan.textContent = '正在搜索...'; // 显示搜索状态

        // 使用 Array.filter 过滤数据
        const filteredData = allData.filter(item => {
            // 检查年份（如果输入了年份，则要求精确匹配）
            // 注意：确保 item['年份'] 存在且是数字或可转换为字符串的类型
            const yearMatch = !yearQuery || (item['年份'] && item['年份'].toString() === yearQuery);

            // 检查学校（部分匹配，不区分大小写）
            const schoolMatch = !schoolQuery || (item['学校'] && item['学校'].toLowerCase().includes(schoolQuery));

            // 检查专业名称或代码（部分匹配，不区分大小写）
             const majorMatch = !majorQuery ||
                               (item['专业名称'] && item['专业名称'].toLowerCase().includes(majorQuery)) ||
                               (item['专业代码'] && item['专业代码'].toString().toLowerCase().includes(majorQuery)); // 同时检查代码

             // 检查省份（部分匹配，不区分大小写）
            const provinceMatch = !provinceQuery || (item['学校省份'] && item['学校省份'].toLowerCase().includes(provinceQuery));


            // 只有当所有有效的筛选条件都满足时，才返回 true
            return yearMatch && schoolMatch && majorMatch && provinceMatch;
        });

        displayResults(filteredData); // 显示过滤后的结果
    }

    // 函数：重置搜索条件和结果
    function resetSearch() {
        yearInput.value = '';
        schoolInput.value = '';
        majorInput.value = '';
        provinceInput.value = '';
        resultsBody.innerHTML = ''; // 清空表格结果
        noResultsMsg.style.display = 'none'; // 隐藏无结果提示
        statusSpan.textContent = ''; // 清空状态信息
         // 可选：重置后再次显示初始数据
        // displayResults(allData.slice(0, 50));
    }


    // --- 事件监听器 ---
    searchButton.addEventListener('click', search); // 监听搜索按钮点击
    resetButton.addEventListener('click', resetSearch); // 监听重置按钮点击

    // 可选：允许在输入框中按 Enter 键触发搜索
    [yearInput, schoolInput, majorInput, provinceInput].forEach(input => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                search(); // 按下回车时执行搜索
            }
        });
    });

    // --- 页面加载时执行 ---
    loadData(); // 页面加载完成后立即开始加载数据
});