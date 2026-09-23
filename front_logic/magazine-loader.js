(function () {
  var tbody          = document.getElementById('magazine-table-body');
  var categorySelect = document.getElementById('magazine-filter-category');
  var sortSelect      = document.getElementById('magazine-filter-sort');
  if (!tbody) return;

  var allPosts = [];

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function renderTable() {
    var categoryValue = categorySelect ? categorySelect.value : 'all';
    var sortValue      = sortSelect ? sortSelect.value : 'desc';

    var posts = allPosts.filter(function (post) {
      return categoryValue === 'all' || post.category === categoryValue;
    });

    posts.sort(function (a, b) {
      var diff = new Date(a.date) - new Date(b.date);
      return sortValue === 'asc' ? diff : -diff;
    });

    if (posts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="color: var(--text-muted);">No posts in this category yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    posts.forEach(function (post) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + post.title + '</td>' +
        '<td>' + post.category + '</td>' +
        '<td>' + formatDate(post.date) + '</td>' +
        '<td>' + post.platform + '</td>' +
        '<td><a href="' + post.url + '" target="_blank" class="dlink">[Read]</a></td>';
      tbody.appendChild(tr);
    });
  }

  function populateCategoryFilter(categories) {
    if (!categorySelect) return;
    categories.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      opt.title = cat.description || '';
      categorySelect.appendChild(opt);
    });
  }

  Promise.all([
    fetch('front_logic/magazine-data.json').then(function (res) { return res.json(); }),
    fetch('front_logic/magazine-categories.json').then(function (res) { return res.json(); })
  ])
    .then(function (results) {
      allPosts = results[0];
      var categories = results[1];

      populateCategoryFilter(categories);
      renderTable();

      if (categorySelect) categorySelect.addEventListener('change', renderTable);
      if (sortSelect) sortSelect.addEventListener('change', renderTable);
    })
    .catch(function () {
      tbody.innerHTML = '<tr><td colspan="5" style="color: var(--text-muted);">Could not load posts -- check magazine-data.json and magazine-categories.json.</td></tr>';
    });
})();