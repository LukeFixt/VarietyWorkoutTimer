groups = ['Neck', 'Shoulders', 'Upper Arms', 'Lower Arms', 'Chest', 'Abdomen', 'Back', 'Butt', 'Thighs', 'Calves'];
types = ['Balance', 'Endurance', 'Flexibility', 'Strength'];

chipFilter = $('<button class="chip active ms-1 mb-1 elevation-0" tabindex="0"></button>');
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


chipSelect = $('<label class="chip checkbox"><input type="checkbox"><span></span></label>');

chipSelect.on('click', e => {
  $(e.target).parents('div').removeClass('error')
  if ($(e.target).parents('.chip').find('input').is(':checked')) {
    $(e.target).parents('.chip').addClass('active');
  } else {
    $(e.target).parents('.chip').removeClass('active');
  }
});

groupAdd = $('[name=group-add]');
groups.forEach(group => {
  chip = chipSelect.clone(true);
  chip.find('span').text(group);
  groupAdd.append(chip);
});

chipSelect.on('click', e => {
  $(e.target).parents('span').find('.active').toggleClass('active').find('input').prop('checked', false);
  $(e.target).parents('.chip').addClass('active');
  $(e.target).parents('.chip').find('input').prop('checked', true);
});

typeAdd = $('[name=type-add]');

types.forEach(type => {
  chip = chipSelect.clone(true);
  chip.find('span').text(type);
  typeAdd.append(chip);
});

function filter(cardParent, item) {
  let clicked = false;
  if (item.target != undefined) {
    clicked = true;
    item = $(item.target);
  }

  $(cardParent).children().each((i, card) => {
    if ($(card).text().includes(item.text())) {
      if (card.filter == undefined) {
        card.filter = 1;
      }
      if (item.hasClass('active') && clicked) {
        card.filter++;
      } else {
        card.filter--;
      }
      if (card.filter > 0) {
        $(card).show();
      } else {
        $(card).hide();
      }
    }
  });
}

baseExercise = {
  title: '',
  desc: '',
  groups: [],
  type: '',
  sets: 3,
  reps: 10,
  timeActive: 60,
  timeRest: 30,
  media: '',
  total: 0
}

function addExercise(newExercise) {
  const base = baseExercise;
  baseExercise.id = (new Date()).getTime();
  const exercise = {
    ...base,
    ...newExercise
  }
  exercise.total = exercise.sets * (exercise.timeActive + exercise.timeRest);

  const temp = $('#tempExercise').clone().removeClass('hidden').removeAttr('id');
  temp.html(
    temp.html()
      .replace('__title', exercise.title)
      .replace('__groups', exercise.groups.join('</div><div class="chip me-1 mb-1">'))
      .replaceAll('__type', exercise.type)
      .replace('__sets', exercise.sets)
      .replace('__reps', exercise.reps)
      .replace('__desc', exercise.desc)
      .replace('__total', time(exercise.total))
      .replace('__timeActive', time(exercise.timeActive))
      .replace('__timeRest', time(exercise.timeRest))
      .replace('__media', exercise.media)
  );

  temp.data('exercise',exercise);

  let active = $('<div class="active"></div>').width((exercise.timeActive / (exercise.total / 100)).toString() + '%');
  let rest = $('<div class="rest"></div>').width((exercise.timeRest / (exercise.total / 100)).toString() + '%');

  for (i = 0; i < exercise.sets; i++) {
    active.clone().appendTo(temp.find('.timeline'));
    rest.clone().appendTo(temp.find('.timeline'));
  }

  $('.ripple-e', temp).on('click', e => {
    editExercise(temp.data('exercise'), true);
  });


  $('.chip:not(.active)', groupFilter).each((i, e) => {
    $(e).click().addClass('unclick');
  })
  $('.chip:not(.active)', typeFilter).each((i, e) => {
    $(e).click().addClass('unclick');
  })

  replace = false;

  $('#exerciseGrid > div').each((i,e)=>{
    console.log(i, $(e).data('exercise').id, exercise.id)
    if($(e).data('exercise').id == exercise.id){
      replace = true;
      $(e).after(temp);
      $(e).remove();
    }
  });

  if(!replace){
    temp.appendTo($('#exerciseGrid'));
  }

  $('.chip.unclick', groupFilter).each((i, e) => {
    $(e).click().removeClass('unclick');
  })
  $('.chip.unclick', typeFilter).each((i, e) => {
    $(e).click().removeClass('unclick');
  })
  console.log(exercise)
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

createExercise = $('#createExercise');

function editExercise(exercise, update = false) {
  papa = $('.dialog-content', createExercise);
  if (update) {
    $('.dialog-header').text('Edit Exercise');
    $('#add').text('Update');
    $(papa).data('id', exercise.id);
  } else {
    $('.dialog-header').text('New Exercise');
    $('#add').text('Add');
    $(papa).data('id',(new Date()).getTime());
  }

  $('[name=group-add] .chip', papa).each((i, e) => {
    if (exercise.groups.includes($(e).text())) {
      $(e).addClass('active');
      $(e).find('input').prop('checked', true);
    } else {
      $(e).removeClass('active');
      $(e).find('input').prop('checked', false);
    }
  });

  $('[name=type-add] .chip', papa).each((i, e) => {
    if ($(e).text() == exercise.type) {
      $(e).addClass('active');
      $(e).find('input').prop('checked', true);
    } else {
      $(e).removeClass('active');
      $(e).find('input').prop('checked', false);
    }
  });

  console.log($(papa).data('id'))

  $('[name=title]', papa).val(exercise.title);
  $('[name=desc]', papa).val(exercise.desc);
  $('[name=sets]', papa).val(exercise.sets);
  $('[name=reps]', papa).val(exercise.reps);
  $('[name=timeActive]', papa).val(exercise.timeActive);
  $('[name=timeRest]', papa).val(exercise.timeRest);
  $('[name=media]', papa).val(exercise.media);

  updateNewTime();
}


function updateNewTime() {
  papa = $('#newTime');
  sets = Number($('[name=sets]', createExercise).val());
  active = Number($('[name=timeActive]', createExercise).val());
  rest = Number($('[name=timeRest]', createExercise).val());

  total = sets * (active + rest);

  $('#total', papa).text(time(total));
  $('#timeActive', papa).text(time(active));
  $('#timeRest', papa).text(time(rest));
}

updateNewTime();

$('input[type="number"]', createExercise).each((i, e) => {
  $(e).on('input', ev => {
    updateNewTime();
  });
})

$('#newExercise').on('click', e => {
  editExercise(baseExercise);
})


$('#add', createExercise).on('click', e => {
  papa = $('.dialog-content', createExercise);

  typeCount = 0;
  $('[name=type-add] .active', papa).each((i, e) => typeCount++);
  if (typeCount == 0) {
    $('[name=type-add]', papa).parent().addClass('error');
    Material.Snackbar({ message: "You must select a Type" });
  }

  groupCount = 0;
  $('[name=group-add] .active', papa).each((i, e) => groupCount++);
  if (groupCount == 0) {
    $('[name=group-add]', papa).parent().addClass('error');
    Material.Snackbar({ message: "You must select at least one Group" });
  }

  if ($('[name=title]', papa).val() == '') {
    $('[name=title]', papa).parent().addClass('error');

    errorWatch($('[name=title]', papa));

    Material.Snackbar({ message: "The exercise needs a Title" });
  } else {
    $('[name=title]', papa).parent().removeClass('error');
  }

  if (papa[0].checkValidity() && groupCount && typeCount) {
    group = [];
    $('[name=group-add] .active', papa).each((i, e) => group.push($(e).text()));

    type = [];
    $('[name=type-add] .active', papa).each((i, e) => type.push($(e).text()));

    console.log($(papa).data('id'));

    addExercise({
      title: $('[name=title]', papa).val(),
      desc: $('[name=desc]', papa).val(),
      groups: group,
      type: type,
      sets: Number($('[name=sets]', papa).val()),
      reps: Number($('[name=reps]', papa).val()),
      timeActive: Number($('[name=timeActive]', papa).val()),
      timeRest: Number($('[name=timeRest]', papa).val()),
      media: $('[name=media]', papa).val(),
      total: 0,
      id: $(papa).data('id')
    })
    createExercise.removeClass('open');
  }
});

$('#cancel', createExercise).on('click', e => {
  // if(confirm('Are you sure you want to cancel making a new exercise?')){
  createExercise.removeClass('open');
  // }
});