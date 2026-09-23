(function () {
  var tbody = document.getElementById('magazine-table-body');
  if (!tbody) return;

  fetch('front_logic/magazine-data.json')
    .then(function (res) { return res.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

      tbody.innerHTML = '';
      posts.forEach(function (post) {
        var tr = document.createElement('tr');

        var dateObj = new Date(post.date);
        var formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });

        tr.innerHTML =
          '<td>' + post.title + '</td>' +
          '<td>' + post.category + '</td>' +
          '<td>' + formattedDate + '</td>' +
          '<td>' + post.platform + '</td>' +
          '<td><a href="' + post.url + '" target="_blank" class="dlink">[Read]</a></td>';

        tbody.appendChild(tr);
      });
    })
    .catch(function () {
      tbody.innerHTML = '<tr><td colspan="5" style="color: var(--text-muted);">Could not load posts -- check magazine-data.json.</td></tr>';
    });
})();