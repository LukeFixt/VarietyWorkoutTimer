groups = ['Neck', 'Shoulders', 'Upper Arms', 'Lower Arms', 'Chest', 'Abdomen', 'Back', 'Butt', 'Thighs', 'Calves'];
types = ['Balance', 'Endurance', 'Flexibility', 'Strength'];

chipFilter = $('<span class="chip active"></span>');
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
  typeFilter.append(chipFilter.clone(true).text(type));
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
  const base = {
    title: '',
    desc: '',
    group: random(groups),
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
      .replace('__group', exercise['group'])
      .replace('__type', exercise['type'])
      .replace('__sets', exercise['sets'])
      .replace('__reps', exercise['reps'])
      .replace('__desc', exercise['desc'])
      .replace('__total', time(exercise['total']))
      .replace('__timeActive', time(exercise['timeActive']))
      .replace('__timeRest', time(exercise['timeRest']))
      .replace('__media', exercise['media'])
  );

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
  group: 'Butt',
  type: 'Strength',
  sets: 3,
  reps: 20,
  timeActive: 90,
  timeRest: 60,
})

$('#add').on('click', e => {
  let name = random(groups);
  addExercise({
    title: name,
    group: name
  })
})