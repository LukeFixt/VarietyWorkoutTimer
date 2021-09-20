function loadPage(link){
  const page = $('#page');
  $(page).load(`pages/${link.toLowerCase()}.html`);
  $('title').text(link + ' | Variety Workout Timer');
  window.location = '#' + link;
}

const links = [];
$('*[data-page]').each((i,el) => {
  let link = $(el).data('page');
  links.push(link);
  $(el).on('click',e => {
    loadPage(link);
  });
});

$(document).ready(e=>{
  const current = window.location.hash.split('#')[1];
  if(links.includes(current)){
    loadPage(current);
  } else {
    loadPage('Dashboard');
  }
})