var qid = location.search.match(/qid=([^&#]+)/)[1];
var currentPage = -1;
var loading = false;
function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}
function loadMore (next) {
  if (loading) {
    return
  }
  loading = true;
  $.ajax({
      url: '/answerList?qid=' + qid + '&page=' + (currentPage +  (next ? 1 : -1))
    }).done(function (res) {
      loading = false;
      currentPage += next ? 1 : -1;

      if (res.success) {
        // <img width="48" height="48" src="${item.avatar_url}" />
        const answerList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            return `<div class="item">
            <div class="content">
              <a class="header" >${item.author.name}</a>
              <div class="description aid" data-aid="${item.id}">
                ${item.content}
              </div>
            </div>
          </div>`
          }).join('')}
        </div>`;
        $('.answer-list').html(answerList);

        var list = $('img[data-actualsrc^=https]');
        list.on('click', function () {
          var url = $(this).data('actualsrc');
          var aid = $(this).closest('.description.aid').data('aid');
          var state = $(this).data('state');
          if (state) {
            return;
          }
          $(this).data('state', 1);
          var self = this;
          $.ajax({
            type: 'POST',
            url: '/answer/img',
            data: {
              aid: aid,
              qid: qid,
              src: url
            }
          }).done(function (res) {
            if (res.success) {
              $(self).attr('src', '/public/img/answer/' + res.data);
            } else {
              $(self).data('state', 2);
            }
          })
        });

        $('img[data-actualsrc^="/public"]').each(function () {
          $(this).attr('src', $(this).data('actualsrc'))
        });
      }
    });
}

$('.title').html(decodeURIComponent(location.search.match(/name=([^&#]+)/)[1]))
loadMore(true);

$('body').append('<div class="ui button prev">prev</div>');
$('body').append('<div class="ui button next">next</div>');

$('.next').click(function () {
  loadMore(true);
});
$('.prev').click(function () {
  loadMore();
});



