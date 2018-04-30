var currentPage = -1;
function format (date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}
function loadMore () {
  $.ajax({
      url: '/questionList?page=' + (currentPage + 1)
    }).done(function (res) {
      currentPage++;

      if (res.success) {
        // <img width="48" height="48" src="${item.avatar_url}" />
        const questionList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            return `<div class="item">
            <div class="content">
              <a class="header" href="/answer?qid=${item.id}&name=${item.title}" target="_blank">${item.title}</a>
              <div class="description">
                ${format(item.created * 1000)}
              </div>
            </div>
          </div>`
          }).join('')}
        </div>`;
        $('.question-list').append(questionList)
      }
    });
}

loadMore();

$('body').append('<div class="ui button">load more</div>');

$('.ui.button').click(function () {
  loadMore();
});