const page = $('#page');
$('*[data-page]').each((i,el) => {
  let link = $(el).data('page');
  $(el).on('click',e => {
    $(page).load(`pages/${link}.html`);
  });
});