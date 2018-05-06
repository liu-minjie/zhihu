var qid = location.search.match(/qid=([^&#]+)/)[1];
var currentPage = -1;
var loading = false;
function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}
var noPre = true;
var noNext  = false;
var total = 100;
function loadMore (next) {
  if (next) {
    if (noNext) {
      return
    }
  } else {
    if (noPre) {
      return
    }
  }
  if (loading) {
    return
  }
  loading = true;
  $.ajax({
    url: '/answerList?qid=' + qid + '&page=' + (currentPage +  (next ? 1 : -1))
  }).done(function (res) {
    loading = false;
    
    if (!res.data || !res.data.length) {
      total = currentPage;
      noNext = currentPage >= total;
      $('.next').toggleClass('disabled', noNext);
      return
    }
    noNext = currentPage >= total;
    $('.next').toggleClass('disabled', noNext);
    currentPage += next ? 1 : -1;

    noPre = currentPage < 1; 
    $('.prev').toggleClass('disabled', noPre);

    if (res.success) {
      let answerList = `<div class="ui relaxed divided list">
        ${res.data.map((item) => {
          return `<div class="item">
          <div class="content">
            <div class="header">
              <a href="#">${item.author.name}</a>
              <span  class="created">${format(item.created_time * 1000)}</span>
              <div class="tag-list"></div>
            </div>
            <div class="description aid" data-aid="${item.id}">
              ${item.content}
            </div>
            <div class="comment-list"></div>
            <div class="answer-op">
              <i title="删除" data-aid="${item.id}" class="trash outline icon delete"></i>
              <i title="评论" data-aid="${item.id}" class="talk icon ">(${item.comment_count})</i>
            </div>
          </div>
        </div>`
        }).join('')}
      </div>`;

      answerList = `<div class="page${currentPage}">
        <div id="page${currentPage}">page${currentPage}</div>
        ${answerList}
        <div class="page">page${currentPage}</div>
      </div>`
      $('.answer-list').append(answerList);

      $(`.page${currentPage} img[data-actualsrc^="/public"]`).each(function () {
        $(this).attr('src', $(this).data('actualsrc'))
      });
    }
  });
}


$('body').on('click', 'img', function () {
  var src = $(this).attr('src');
  if (src.indexOf('/public') === 0) {
    return;
  }

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
  console.log(src);
});

$('body').on('click', '.delete', function (e) {
  var pass = window.confirm('确定要删除吗');
  if (!pass) {
    return
  }
  var id = $(e.target).data('aid');
  var self = e.target;
  if (id) {
    $.ajax({
      url: '/answer/delete',
      data: {
        id: id
      },
      type: 'POST'
    }).done(function (res) {
      if (res.success) {
        $(self).closest('.item').remove();
      } else {
        alert(res.success);
      }
    })
  }
});

$('body').on('click', '.talk', function (e) {
  var target = $(e.target);
  var id = target.data('aid');
  if (target.data('loaded')) {
    return
  }

  if (id) {
    target.addClass('loading')
    $.ajax({
      url: '/answer/comment',
      data: {
        id: id
      },
      type: 'POST'
    }).done(function (res) {
      target.removeClass('loading')
      target.data('loaded', 1);
      var html = '<ul>';
      res.data.forEach((item) => {
        html += `<li>
          <span class="comment-author">${item.author.name}</span>: 
          <span class="comment-content">${item.content}<span>
        </li>`;
      });
      html += '</ul>';
      target.parent().prev('.comment-list').html(html);
    });
  }
});

$('.title').html(decodeURIComponent(location.search.match(/name=([^&#]+)/)[1]))
loadMore(true);


const fixed = `<div class="fixed">
  <div style="margin: -20px 0 40px 0;"><div class="ui button update">update</div></div>
  <div><div class="ui button prev disabled">prev</div></div>
  <div><div class="ui button next">next</div></div>
</div>`
$('body').append(fixed);

$('.next').click(function () {
  loadMore(true);
});
$('.prev').click(function () {
  loadMore();
});

$('.update').click(function () {
  var pass = window.confirm('确定要更新吗');
  if (!pass) {
    return
  }
  if (loading) {
    return
  }
  loading = true;
  $.ajax({
    url: '/update?qid=' + qid
  }).done(function (res) {
    loading = false;
    if (!res.success) {
      alert(res.message);
    } else {
      if (res.end) {
        $('.update').text('没有更多了')
      } else {
        //window.location.reload();
      }
    }
  });
});



