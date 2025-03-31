let data = [];

// 加载数据
fetch('data.json')
  .then(response => response.json())
  .then(jsonData => data = jsonData);

// 即时搜索功能
document.getElementById('searchInput').addEventListener('input', function(e) {
  search(e.target.value);
});

function search(keyword) {
  const results = data.filter(item => 
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(keyword.toLowerCase())  
    )
  );
  
  // 更新表格
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = results.map(item => `
    <tr>
      <td>${item.年份}</td>
      <td>${item.学校}</td>
      <td>${item.专业名称}</td>
      <td>${item.总分}</td>
    </tr>
  `).join('');
}
