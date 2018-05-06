var currentPage = -1;
function bezero (n) {
  return n < 10 ? '0' + n : n;
}
function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '-' + bezero(d.getMonth() + 1) + '-' + bezero(d.getDate());
}

function getTags (tags) {
  return `<div class="tag-list">
    ${tags ? tags.split(',').map((item) => {
      return '<a class="ui label transition visible tag-item">' + item + '</a>'
    }).join('')  : ''}</div>`
}
function loadMore () {
  $.ajax({
      url: '/questionList?page=' + (currentPage + 1)
    }).done(function (res) {
      currentPage++;

      if (res.success) {
        // <img width="48" height="48" src="${item.avatar_url}" />
        let questionList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            return `<div class="item">
            <div class="content">
              <div class="header">
                <a href="/answer?qid=${item.id}&name=${item.title}" target="_blank">${item.title}</a>
              </div>
              <div class="description">
                <span >${format(item.created * 1000)}</span>
                <a class="answer-count" href="https://www.zhihu.com/question/${item.id}" target="_blank">${item.answer_count}个回答</a>
                <i data-tag="${item.tags || ''}" data-qid="${item.id}" class="tag icon"></i>
                ${getTags(item.tags)}
              </div>
            </div>
          </div>`
          }).join('')}
        </div>`;
        questionList = `<div>
          <div id="page${currentPage}">page${currentPage}</div>
          ${questionList}
          <div class="page">page${currentPage}</div>
        </div>`
        $('.question-list').append('<div>' + questionList + '</div>');
        $('#page'  + currentPage)[0].scrollIntoView();
      }
    });
}

loadMore();

$('body').append('<div class="fixed"><div class="ui primary button">load more</div></div>');

$('.ui.button').click(function () {
  loadMore();
});

$('body').append(`<div class="fixed tag-wrap">
    <textarea id="tag" rows="6" cols="20"></textarea>
    <div style="padding: 10px; border: 1px solid #ccc;border-top:0; background: #fff;">
    <div class="ui button add-tag primary">提交</div>
    <div class="ui button cancel" style="margin-left: 10px;">取消</div>
    </div>
  </div>`);

$('textarea').tagsInput({
  onChange: function (input) {
    //$('input[name=keywords]').val(input.val() || '');
  }
});
$('body').on('click', '.tag.icon', function (e) {
  $('.tag-wrap').css('display', 'block');
  var qid = $(e.target).data('qid');
  var tags = $(e.target).data('tag');
  $('.add-tag').data('qid', qid);
  if (tags) {
   $('textarea').importTags(tags);
  }
});

$('.cancel').click(function () {
  $('textarea').importTags('');
  $('.tag-wrap').css('display', 'none');
});

var loading = false;
$('.add-tag').click(function () {
  var qid = $(this).data('qid');
  var tags = $('textarea').val();

  if (qid && tags) {
    if (loading) {
      return
    }
    loading = true;
    $.ajax({
      url: '/question/tag',
      type: 'POST',
      data: {
        id: qid,
        tags: tags
      }
    }).done(function (res) {
      loading = false;
      if (res.success) {
        $('textarea').importTags('');
        $('.tag-wrap').css('display', 'none');
        $('i[data-qid=' + qid + ']').data('tag', tags)
        var container = $('i[data-qid=' + qid + ']').parent();
        if (container.find('.tag-item').length) {
          container.find('.tag-list').remove()
          container.append(getTags(tags))
        } else {
          container.append(getTags(tags))
        }
      }
    });
  }
})