var currentPage = -1;
function loadMore () {
  $.ajax({
      url: '/userList?page=' + (currentPage + 1)
    }).done(function (res) {
      currentPage++;

      if (res.success) {
        // <img width="48" height="48" src="${item.avatar_url}" />
        const userList = `<div class="ui relaxed divided list">
          ${res.data.map((item) => {
            return `<div class="item">
            <div class="content">
              <a class="header" href="https://www.zhihu.com/people/${item.id}" target="_blank">${item.name}</a>
              <div class="description">
                <div class="desc-txt">${item.badge}</div>
              </div>
            </div>
          </div>`
          }).join('')}
        </div>`;
        $('.user-list').append(userList)
      }
    });
}

loadMore();

$('body').append('<div class="ui button">load more</div>');

$('.ui.button').click(function () {
  loadMore();
})