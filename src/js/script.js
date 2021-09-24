function loadPage(link) {
  const page = $('#page');
  $(page).load(`pages/${link.toLowerCase()}.html`);
  $('title').text(link + ' | Variety Workout Timer');

  $('.appbar a').each((i,e)=>{
    $(e).removeClass('outlined');
  });
  $(`.appbar a[href="#${link}"]`).addClass('outlined');
}

const links = [];
$('.appbar a').each((i, el) => {
  let link = $(el).attr('href').split('#')[1];
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
  let secondsStr = (Number(seconds).toFixed(2)/60).toString().split('.');
  let mins = 0 || Math.round(secondsStr[0]);
  let secs = 0 || Math.round(('.'+secondsStr[1]) * 60);
  
  if(mins < 1) {
    mins = '0'
  }
  if(secs > 0) {
    secs = ('0'+secs).slice(-2)
  } else {
    secs = '00'
  }
  return ([mins, secs].join(':')).trim();
}

function errorWatch(element){
  console.log(element);
  $(element).on('input',(i,e)=>{
    console.log(element);
    if($(element).val() != ''){
      $(element).parent().removeClass('error');
      $(element).off('input');
    }
  })
}