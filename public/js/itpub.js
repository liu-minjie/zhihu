

var loading = false;
$('input[name=search]').keyup(function(e) {
  if (e.keyCode === 13) {
    var val = $(this).val().trim();
    if (loading) {
      return
    }
    loading = true;
    $.ajax({
      url: '/api/itpub',
      data: {key: val}
    }).done(function (res) {
      loading = false;
      const html = `<div class="ui styled accordion name-list">${res.data.map((item) => {
        return `<div class="title">
          <i class="dropdown icon"></i>
          <span><a href="http://www.itpub.net/${item.url}" target="_blank">${item.name}</a></span>
        </div>`;
      }).join('')}</div>`;

      console.log(res.data.length);
      $('.result').html(html);
    });
  }
});