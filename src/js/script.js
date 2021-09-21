function loadPage(link) {
  const page = $('#page');
  $(page).load(`pages/${link.toLowerCase()}.html`);
  $('title').text(link + ' | Variety Workout Timer');

  $('*[data-page]').each((i,e)=>{
    $(e).removeClass('outlined');
  })
  $(`[data-page="${link}"]`).addClass('outlined');
}

const links = [];
$('*[data-page]').each((i, el) => {
  let link = $(el).data('page');
  links.push(link);
  $(el).on('click', e => {
    loadPage(link);
  });
});

$(document).ready(e => {
  const current = window.location.hash.split('#')[1];
  if (links.includes(current)) {
    loadPage(current);
  } else {
    loadPage('Dashboard');
  }
})

function random(num, max = null, floor = true) {
  if(typeof num === 'object'){
    return num[Math.floor(Math.random() * num.length)];
  }
  if(typeof num === 'number' && typeof max === 'number' )
  if (floor) {
    if (max == null) {
      return Math.floor(Math.random() * num);
    } else {
      return Math.floor(num + (Math.random() * max));
    }
  } else {
    if (max == null) {
      return Math.random() * num;
    } else {
      return num + (Math.random() * max);
    }
  }
}

function time(seconds){
  let secondsStr = (seconds.toFixed(2)/60).toString().split('.');
  let mins = 0 || Math.floor(secondsStr[0]);
  let secs = 0 || Math.floor(('.'+secondsStr[1]) * 60);
  
  if(mins > 0) {
    mins += 'm';
  } else {
    mins = ''
  }
  if(secs > 0) {
    secs += 's';
  } else {
    secs = ''
  }
  return ([mins, secs].join(' ')).trim();
}