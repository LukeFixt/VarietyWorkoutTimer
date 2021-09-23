groups = ['Neck', 'Shoulders', 'Upper Arms', 'Lower Arms', 'Chest', 'Abdomen', 'Back', 'Butt', 'Thighs', 'Calves'];
types = ['Balance', 'Endurance', 'Flexibility', 'Strength'];

chipFilter = $('<span class="chip active ms-1 mb-1"></span>');
chipFilter.on('click', e => {
  $(e.target).toggleClass('active');
  filter($('#exerciseGrid'), e);
});

groupFilter = $('#group-filter');
groups.forEach(group => {
  groupFilter.append(chipFilter.clone(true).text(group));
});

typeFilter = $('#type-filter');
types.forEach(type => {
  typeFilter.append(chipFilter.clone(true).addClass(type).text(type));
});

chipFilter.off().on('click', e => {
  $(e.target).toggleClass('active');
});


groupAdd = $('#group-add');
groups.forEach(group => {
  groupAdd.append(chipFilter.clone(true).removeClass('active').text(group));
});

typeAdd = $('#type-add');

chipFilter.off().on('click', e => {
  $('.active',typeAdd).removeClass('active');
  $(e.target).toggleClass('active');
});

types.forEach(type => {
  typeAdd.append(chipFilter.clone(true).removeClass('active').text(type));
});

function filter(cardParent, item) {
  let clicked = false;
  if(item.target != undefined){
    clicked = true;
    item = $(item.target);
  }
  
  $(cardParent).children().each((i, card) => {
    if ($(card).text().includes(item.text())) {
      if(card.filter == undefined){
        card.filter = 1;
      }
      if (item.hasClass('active') && clicked) {
        card.filter++;
      } else {
        card.filter--;
      }
      if(card.filter > 0){
        $(card).show();
      } else {
        $(card).hide();
      }
    }
  });
}

function addExercise(newExercise) {
  console.log(newExercise)
  const base = {
    title: '',
    desc: '',
    groups: [random(groups)],
    type: random(types),
    sets: random(3, 5),
    reps: random(10, 20),
    timeActive: random(90, 120),
    timeRest: random(30, 60),
    media: '',
    total: 0
  }
  const exercise = {
    ...base,
    ...newExercise
  }
  exercise['total'] = exercise['sets'] * (exercise['timeActive'] + exercise['timeRest']);

  const temp = $('#tempExercise').clone().removeClass('hidden').removeAttr('id');
  temp.html(
    temp.html()
      .replace('__title', exercise['title'])
      .replace('__groups', exercise['groups'].join('</div><div class="chip me-1 mb-1">'))
      .replaceAll('__type', exercise['type'])
      .replace('__sets', exercise['sets'])
      .replace('__reps', exercise['reps'])
      .replace('__desc', exercise['desc'])
      .replace('__total', time(exercise['total']))
      .replace('__timeActive', time(exercise['timeActive']))
      .replace('__timeRest', time(exercise['timeRest']))
      .replace('__media', exercise['media'])
  );

  temp.exercise = exercise;

  let active = $('<div class="active"></div>').width((exercise['timeActive'] / (exercise['total'] / 100)).toString() + '%');
  let rest = $('<div class="rest"></div>').width((exercise['timeRest'] / (exercise['total'] / 100)).toString() + '%');

  for (i = 0; i < exercise['sets']; i++) {
    active.clone().appendTo(temp.find('.timeline'));
    rest.clone().appendTo(temp.find('.timeline'));
  }


  $('.chip:not(.active)',groupFilter).each((i,e)=>{
    $(e).click().addClass('unclick');
  })
  $('.chip:not(.active)',typeFilter).each((i,e)=>{
    $(e).click().addClass('unclick');
  })

  temp.appendTo($('#exerciseGrid'));

  $('.chip.unclick',groupFilter).each((i,e)=>{
    $(e).click().removeClass('unclick');
  })
  $('.chip.unclick',typeFilter).each((i,e)=>{
    $(e).click().removeClass('unclick');
  })
}
addExercise({
  title: 'Standing Lunge',
  groups: ['Butt'],
  type: 'Strength',
  sets: 3,
  reps: 20,
  timeActive: 90,
  timeRest: 60,
})

$('#add').on('click', e => {
  papa = $('#newExercise .dialog-content');

  group = [];
  $('#group-add .active',papa).each((i,e)=>group.push($(e).text()));

  type = [];
  $('#type-add .active',papa).each((i,e)=>type.push($(e).text()));
  
  addExercise({
    title: $('#title',papa).val(),
    desc: $('#desc',papa).val(),
    groups: group,
    type: type,
    sets: Number($('#sets',papa).val()),
    reps: Number($('#reps',papa).val()),
    timeActive: Number($('#timeActive',papa).val()),
    timeRest: Number($('#timeRest',papa).val()),
    media: $('#media',papa).val(),
    total: 0
  })
})

function updateNewTime(){
  papa = $('#newTime');
  sets = Number($('#newExercise #sets').val());
  active = Number($('#newExercise #timeActive').val());
  rest = Number($('#newExercise #timeRest').val());

  total = sets * (active + rest);
  
  $('#total',papa).text(time(total));
  $('#timeActive',papa).text(time(active));
  $('#timeRest',papa).text(time(rest));
}

updateNewTime();

$('#newExercise input[type="number"]').each((i,e)=>{
  $(e).on('input',ev=>{
    updateNewTime()
  });
})



dataMin();