let timerObj = {
  minutes: 0,
  seconds: 0,
  timerId: 0
};

function playAlarmSound() {
  let amount = 6;
  let audio = new Audio('Timer_Sound_Effect.mp3');

  function repeatSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  for (let i = 0; i < amount; i++) {
    setTimeout(repeatSound, 1200 * i);
  }
}

function updateValue(key, value) {
  if (value < 0) {
    value = 0;
    console.log('Positive value only');
  }

  if (key == 'seconds') {
    if (value < 10) {
      value = '0' + value;
    }

    if (value > 59) {
      value = 59;
    }
  }

  $('#' + key).html(value || 0);
  timerObj[key] = value;
}

(function detectChanges(key) {
  let input = '#' + key + '-input';
  $(input).change(function() {
    updateValue(key, $(input).val());
  });
  return arguments.callee;
})('minutes')('seconds');

function startTimer() {
  buttonManager(['start', false], ['stop', true], ['pause', true]);
  freezeInput();

  timerObj.timerId = setInterval(function() {
    timerObj.seconds--;
    if (timerObj.seconds < 0) {
      if (timerObj.minutes == 0) {
        playAlarmSound();
        return stopTimer();
      }

      timerObj.seconds = 59;
      timerObj.minutes--;
    }

    updateValue('minutes', timerObj.minutes);
    updateValue('seconds', timerObj.seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerObj.timerId);
  buttonManager(['start', true], ['stop', false], ['pause', false]);
  unfreezeInput();
  updateValue('minutes', 0);
  updateValue('seconds', 0);
  $('#minutes-input').val('0');
  $('#seconds-input').val('0');
  $('#start-button').html('Start');
}

function pauseTimer() {
  buttonManager(['start', true], ['stop', true], ['pause', false]);
  clearInterval(timerObj.timerId);
  $('#start-button').html('Resume');
}

function buttonManager(...buttonsArray) {
  for (let i = 0; i < buttonsArray.length; i++) {
    let button = '#' + buttonsArray[i][0] + '-button';
    if (buttonsArray[i][1]) {
      $(button).removeAttr('disabled');
    } else {
      $(button).attr('disabled', 'disabled');
    }
  }
}

function freezeInput() {
  $('#minutes-input').attr('disabled', 'disabled');
  $('#seconds-input').attr('disabled', 'disabled');
}

function unfreezeInput() {
  $('#minutes-input').removeAttr('disabled');
  $('#seconds-input').removeAttr('disabled');
}
