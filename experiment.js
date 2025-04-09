// https://daniblu.github.io/colored_dots_jspsych_experiment/

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        // Keep only trials where participant_id is defined
        const experiment_data = jsPsych.data.get().filterCustom(trial => {
        return trial.participant_id !== undefined;
        }).json();
        fetch("https://script.google.com/macros/s/AKfycbwMy_WEkTTpaYqz0aA8zTDrajwE7j_tHmUAAvWE_rxvBnuOWov144zltm8iG-Iaqjo6/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: experiment_data })
        });
        console.log("Data sent to Google Sheets");  // Debugging
        console.log(experiment_data);
    }
});

// Initialize timeline
const timeline = [];


///// DEFINE CONSTANTS OF THE EXPERIMENT /////

const participant_id = jsPsych.randomization.randomID(10);
const conditions = [1, 2];
const randomized_conditions = jsPsych.randomization.shuffle(conditions);

const learning_stimuli = [['red', 'green', 'green'], ['blue', 'blue', 'green'], ['green', 'blue', 'green'], ['green', 'blue', 'green'], ['red', 'red', 'green'], ['green', 'red', 'red'], ['red', 'blue', 'green'], ['red', 'red', 'green'], ['red', 'red', 'blue'], ['blue', 'red', 'blue']];
const learning_correct = ['green', 'green', 'green', 'green', 'red', 'green', 'green', 'red', 'red', 'blue'];
const test_stimuli_1 = [['green', 'red', 'blue'], ['green', 'green', 'blue'], ['blue', 'red', 'blue'], ['red', 'green', 'green'], ['red', 'red', 'blue'], ['red', 'red', 'green'], ['red', 'green', 'red'], ['blue', 'green', 'blue'], ['red', 'green', 'blue'], ['red', 'blue', 'green']];
const test_correct_1 = ['green', 'green', 'blue', 'green', 'red', 'red', 'green', 'green', 'green', 'green'];
const test_stimuli_2 = [['blue', 'blue', 'green'], ['red', 'red', 'blue'], ['green', 'green', 'red'], ['green', 'blue', 'green'], ['green', 'red', 'blue'], ['blue', 'green', 'green'], ['blue', 'red', 'blue'], ['blue', 'green', 'blue'], ['blue', 'blue', 'green'], ['green', 'green', 'blue']];
const test_correct_2 = ['blue', 'red', 'red', 'blue', 'green', 'green', 'blue', 'blue', 'blue', 'green'];

const press_space_text = "<p><b style='font-size:14px; position: absolute; bottom: 0; left: 0; width: 100%; text-align: center;'>Press SPACE to continue</b></p>";
const press_RGB_text = "<p><b style='font-size:14px; position: absolute; bottom: 0; left: 0; width: 100%; text-align: center;'>Press R, G, or B</b></p>";

const informed_consent_text = "<p style='text-align: left; font-size:13px;'>I voluntarily agree to participate in this study by engaging in a behavioral task and providing responses to the follow-up questions. I am informed that the experiment is hosted via GitHub Pages and all data is transmitted securely to a Google Sheet using Google Apps Script, where the data is stored temporarily in accordance with standard data protection practices on Google's cloud infrastructure. I am informed that the data will be analyzed anonymously by Aarhus University. I acknowledge that no personally identifiable information will be collected. I agree that my anonymized data may be used for research purposes and stored for a minimum of 10 years. I have had sufficient time to consider my participation and am prepared to proceed with the study. I understand that my participation is voluntary, and I may withdraw at any time during the study without needing to provide a reason, and this will have no negative consequences for me. I have carefully read the study’s participant information and this consent declaration.</p><p style='text-align: left; font-size:13px;'>ONCE YOU CLICK THE CONSENT BUTTON, THE EXPERIMENT WILL GO INTO FULLSCREEN. YOU CAN EXIT AT ANY TIME BY PRESSING ESC.</p>"

const consent_form = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `
    <h3 style="text-align: left;">Experiment consent form</h3>
    <p style="text-align: left; font-size:12px;">Before anything, please read the <a href="participant_info.html" target="_blank">participant information</a> carefully.</p>
    ${informed_consent_text}`,
    button_label: "I consent",
  };

const cursor_off = {
    type: jsPsychCallFunction,
    func: function() {
        document.body.style.cursor = 'none';  // Hide cursor
    }
};

const cursor_on = {
    type: jsPsychCallFunction,
    func: function() {
        document.body.style.cursor = 'auto';  // Show cursor
    }
};

const instructions = {type: jsPsychInstructions,
    pages: [
    '<p style="text-align: left;">In this experiment, you will be shown sets of three colored dots. Your task is to choose the correct color. The dots will be red, blue, or green, and dots of the same color can appear together. There is a secret rule that enables you to identify the correct color among the three dots.</p>' + '<br>' + '<p style="position: absolute; bottom: 0; left: 0; width: 100%; font-size:30px;">→</p>',
    '<img src="images/example_stimulus_1.png", style="width: 315px; height: 250px;" ></img>' + '<br>' + '<p style="text-align: left;">Here is an example of a set of dots. For instance, the secret rule could be that the color of the top dot, always tells you which dot has the correct color. The rule further dictates that if the top dot is green, the left dot has the correct color. If it is red, the top dot has the correct color, and if it is blue, the right dot has the correct color. Given this rule, the correct color in this case would be red.</p>' + '<br>' + '<p style="position: absolute; bottom: 0; left: 0; width: 100%; font-size:30px;">←  →</p>',
    '<img src="images/example_stimulus_2.png", style="width: 315px; height: 250px;" ></img>' + '<br>' + '<p style="text-align: left;">Here is another example of a set of dots. Given the same rule as before (you may go back and remind yourself), the correct color in this case would be red.</p>' + '<p style="position: absolute; bottom: 0; left: 0; width: 100%; font-size:30px;">←  →</p>',
    '<p style="text-align: left;">The secret rule always has the same structure. That is, one of the dot locations (left, top or right) will always serve as a cue for which dot has the correct color, and each color of the cue will always uniquely refer to one of the three dots (for example, if the cue dot is green, that will always refer to the left dot).</p>' + '<p style="text-align: left;">On the following pages, you will get to familiarize yourself with the task. You will get told what the rule is, and must indicate the correct color based on it.</p>' + '<p></p>' + '<p style="position: absolute; bottom: 0; left: 0; width: 100%; font-size:30px;">←  →</p>'
    ],
}

const post_demo_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p style="text-align: left;">You have completed the test rounds. Further instructions for the actual experiment will follow on the next page.</p>${press_space_text}`,
    choices: [' ']
};

const condition_1_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p style="text-align: left;">A new secret rule has now been set. It will remain unchanged throughout the following rounds. Here is how each round will proceed: You will be shown three dots and you will be told which color is correct. Based on this, you must try to identify the secret rule. In each round, your understanding of the secret rule will be tested on a different set of dots. You should strive to get as many correct responses as possible, although you will not be told whether your response was correct or incorrect. There is no time limit.</p>${press_space_text}`,
    choices: [' ']
};

const condition_2_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p style="text-align: left;">A new secret rule has now been set. It will remain unchanged throughout the following rounds. Here is how each round will proceed: You will see three dots and must report which color you think is the correct one. Based on the feedback, you must try to identify the secret rule. You should strive to get as many correct responses as possible. There is no time limit.</p>${press_space_text}`,
    choices: [' ']
};

const black_frame = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: 'NO_KEYS',
    trial_duration: 1000
};

const exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0
  }

const thank_you_frame = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p>The experiment is over. Thank you very much for participating. You may close the tab now.</p>',
    choices: 'NO_KEYS',
    trial_duration: 100,
};

////// FUNCTIONS //////

function drawDots(canvas, colors) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let positions = [
        {x: canvas.width / 4 - 40, y: (canvas.height * 3) / 4}, // Bottom-left dot
        {x: canvas.width / 2, y: canvas.height / 4},  // Top dot
        {x: (canvas.width * 3) / 4 + 40, y: (canvas.height * 3) / 4} // Bottom-right dot
    ];
    
    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, 30, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.strokeStyle = colors[i];
        ctx.fill();
        ctx.stroke();
    }
}   

function rgbToColorName(key) {
    if (key === 'r') return 'red';
    if (key === 'g') return 'green';
    if (key === 'b') return 'blue';
    return 'SCRIPT ERROR';
  }


function generateNewDemoTrial() {
    const colors = jsPsych.randomization.sampleWithoutReplacement(['red', 'red', 'green', 'green', 'blue', 'blue'], 3);
    const positions = ['LEFT', 'TOP', 'RIGHT'];
    const cue_location = jsPsych.randomization.sampleWithoutReplacement(positions, 1)[0];
    let shuffled_positions = jsPsych.randomization.shuffle(positions);
    let color_map = {
        green: shuffled_positions[0],
        red: shuffled_positions[1],
        blue: shuffled_positions[2],
    };
    let dot_positions = {
        LEFT: 0,
        TOP: 1,
        RIGHT: 2
    };
    let cue_color = colors[dot_positions[cue_location]];
    let target_location = color_map[cue_color];
    let correct_color = colors[dot_positions[target_location]];

    const prompt = `
        <p>The cue is the <strong>${cue_location}</strong> dot.</p>
        <p>A green cue refers to the <strong>${color_map.green}</strong> dot, 
        a red cue refers to the <strong>${color_map.red}</strong> dot, 
        and a blue cue refers to the <strong>${color_map.blue}</strong> dot.</p>
        <p>Given this rule, please indicate the correct color.</p>
    `;

    return {
        colors,
        prompt,
        correct_color
    };
}

///// EXPERIMENT /////

timeline.push(consent_form);
timeline.push(cursor_off);
timeline.push(instructions);

// DEMO TRIALS – 3 consecutive correct responses required
let correctStreak = 0;

// Dummy initial trial data — real data will be generated dynamically
const dummy_trial = {
  colors: ['red', 'green', 'blue'],
  prompt: '',
  correct_color: 'green'
};

const demo_trial_loop = {
  timeline: [{
    type: jsPsychCanvasKeyboardResponse,
    css_classes: ['center-canvas'],
    canvas_size: [500, 500],
    stimulus: function(c) {
      const trial = jsPsych.timelineVariable('trial');
      drawDots(c, trial.colors);
    },
    prompt: function() {
      const trial = jsPsych.timelineVariable('trial');
      return trial.prompt + press_RGB_text;
    },
    choices: ['r', 'g', 'b'],
    on_start: function(trial) {
      const newTrial = generateNewDemoTrial();
      trial.data = {
        colors: newTrial.colors,
        correct_color: newTrial.correct_color,
        prompt: newTrial.prompt
      };
      trial.stimulus = function(c) {
        drawDots(c, newTrial.colors);
      };
      trial.prompt = newTrial.prompt + press_RGB_text;
    },
    on_finish: function(data) {
      const correct = (
        (data.response === 'r' && data.correct_color === 'red') ||
        (data.response === 'g' && data.correct_color === 'green') ||
        (data.response === 'b' && data.correct_color === 'blue')
      );
      data.correct = correct;
      data.response_color = rgbToColorName(data.response);
      if (correct) {
        correctStreak++;
      } else {
        correctStreak = 0;
      }
    }
  },
  {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      const last = jsPsych.data.get().last(1).values()[0];
      return `<p><strong>${last.correct ? 'Correct' : 'Incorrect'}.</strong> The correct color was <b style='color:${last.correct_color}'>${last.correct_color}</b>.</p>`;
    },
    choices: 'NO_KEYS',
    trial_duration: 2000
  }],
  timeline_variables: [{ trial: dummy_trial }],  // Initial dummy trial
  loop_function: function() {
    return correctStreak < 3;
  }
};

timeline.push(demo_trial_loop, post_demo_instructions);

// Loop through each trial
for (let condition of randomized_conditions) {
    
    if (condition === 1) {

        timeline.push(condition_1_instructions);

        for (let i = 0; i < learning_stimuli.length; i++) {

            let trial_data = {
                participant_id: participant_id,
                condition: condition,
                trial: i + 1,
                learning_stimulus: learning_stimuli[i].join(","),
                learning_correct: learning_correct[i],
                test_stimulus: test_stimuli_1[i].join(","),
                test_correct: test_correct_1[i]
            };

            const learning_frame = {
                type: jsPsychCanvasKeyboardResponse,
                canvas_size: [500, 500],
                stimulus: function(c) { drawDots(c, learning_stimuli[i]); },
                prompt: `<p>The correct color is <b style='color:${learning_correct[i]}'>${learning_correct[i]}</b></p>${press_space_text}`,
                choices: [' '],
                on_finish: function(data) {
                    trial_data.rt_learning = data.rt;
                }
            };

            const certainty_frame = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: `<p>How well do you feel you know the secret rule?</p><img src="images/certainty_scale.png" style="width: 570px; height: 100px;"></img>`,
                choices: ['1', '2', '3', '4', '5'],
                on_finish: function(data) {
                    trial_data.certainty = data.response;
                }
            };

            const test_frame = {
                type: jsPsychCanvasKeyboardResponse,
                canvas_size: [500, 500],
                stimulus: function(c) { drawDots(c, test_stimuli_1[i]); },
                choices: ['r', 'g', 'b'],
                prompt: `<p>Which color is correct?</p>${press_RGB_text}`,
                on_finish: function(data) {
                    trial_data.test_response = rgbToColorName(data.response);
                    trial_data.rt_test = data.rt;
                }
            };

            const response_frame = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: function() {
                    const response_color_name = trial_data.test_response;
                    return `<p>Your response: <b style="color:${response_color_name};">${response_color_name}<b></p>`;
                },
                choices: 'NO_KEYS',
                trial_duration: 1500
            };

            timeline.push(learning_frame, certainty_frame, black_frame, test_frame, response_frame, black_frame);
        
            if (i === Math.floor(learning_stimuli.length / 2) - 1 || i === learning_stimuli.length - 1) {

                const rule_frame = {
                    type: jsPsychSurveyText,
                    questions: [
                        {prompt: "Briefly write your best guess(es) of what you think the secret rule is at this point.", rows: 4, columns: 60}
                    ],
                    on_finish: function(data) {
                        trial_data.rule_guess = data.response.Q0;
                    }
                };
                timeline.push(cursor_on, rule_frame, cursor_off, black_frame);
            } 
            
            const save_trial_data = {
                type: jsPsychCallFunction,
                func: function() {
                    jsPsych.data.write(trial_data);
                }
            };
            timeline.push(save_trial_data);
        }

    } else if (condition === 2) {

        timeline.push(condition_2_instructions);

        for (let i = 0; i < test_stimuli_2.length; i++) {

            let trial_data = {
                participant_id: participant_id,
                condition: condition,
                trial: i + 1,
                test_stimulus: test_stimuli_2[i].join(","),
                test_correct: test_correct_2[i]
            };

            const test_frame = {
                type: jsPsychCanvasKeyboardResponse,
                canvas_size: [500, 500],
                stimulus: function(c) { drawDots(c, test_stimuli_2[i]); },
                choices: ['r', 'g', 'b'],
                prompt: `<p>Which color is correct?</p>${press_RGB_text}`,
                on_finish: function(data) {
                    trial_data.test_response = rgbToColorName(data.response);
                    trial_data.rt_test = data.rt;
                }
            };

            // const feedback_frame = {
            //     type: jsPsychHtmlKeyboardResponse,
            //     stimulus: function() {
            //         // return "Your response: " + trial_data.test_response + lineBreak + "Correct answer: " + trial_data.test_correct; (the color words should be colored)
            //         return `<p>Your response: <b style="color:${trial_data.test_response};">${trial_data.test_response}</b></p>` +
            //             `<p>Correct answer: <b style="color:${trial_data.test_correct};">${trial_data.test_correct}</b></p>`;
            //     },
            //     choices: 'NO_KEYS',
            //     trial_duration: 2000,
            // };

            //another version of a feedback_frame that shows drawDots(c, test_stimuli_2[i]) at the top of the screen, and the feedback text below
            const feedback_frame = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = 500;
                    canvas.height = 500;
                    drawDots(canvas, test_stimuli_2[i]);
                    const response_color_name = trial_data.test_response;
                    return `<div style="text-align: center;">${canvas.outerHTML}</div>` +
                        `<p>Your response: <b style="color:${response_color_name};">${response_color_name}<b></p>` +
                        `<p>Correct answer: <b style="color:${trial_data.test_correct};">${trial_data.test_correct}</b></p>${press_space_text}`;
                },
                choices: [' ']
            }; 

            const certainty_frame = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: '<p>How well do you feel you know the secret rule?</p><img src="images/certainty_scale.png" style="width: 570px; height: 100px;"></img>',
                choices: ['1', '2', '3', '4', '5'],
                on_finish: function(data) {
                    trial_data.certainty = data.response;
                }
            };

            timeline.push(test_frame, feedback_frame, certainty_frame, black_frame);

            if (i === Math.floor(test_stimuli_2.length / 2) - 1 || i === test_stimuli_2.length - 1) {

                const rule_frame = {
                    type: jsPsychSurveyText,
                    questions: [
                        {prompt: "Briefly write your best guess(es) of what you think the secret rule is at this point.", rows: 4, columns: 60}
                    ],
                    on_finish: function(data) {
                        trial_data.rule_guess = data.response.Q0;
                    }
                };
                timeline.push(cursor_on, rule_frame, cursor_off, black_frame);
            } 
            
            const save_trial_data = {
                type: jsPsychCallFunction,
                func: function() {
                    jsPsych.data.write(trial_data);
                }
            };
            timeline.push(save_trial_data);

        }
    }
}

// Outro
timeline.push(exit_fullscreen);
timeline.push(cursor_on);
timeline.push(thank_you_frame);

// Launch experiment
jsPsych.run(timeline);
