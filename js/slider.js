//range Slider
const slider = document.getElementById('slider');


if (slider) {
    noUiSlider.create(slider, {
        start: [30000, 60000],
        connect: true,
        step: 1,
        range: {
            'min': 0,
            'max': 100000
        }
    });
};


const firstInput = document.getElementById('slider__input--first');
const secondInput = document.getElementById('slider__input--second');
const inputs = [firstInput, secondInput];

slider.noUiSlider.on('update', function(values, handle){
    inputs[handle].value = Math.round(values[handle]);
});

const setRangeSlider = (i, value) => {
    let rangeArr = [null, null];
    rangeArr[i] = value;

    slider.noUiSlider.set(rangeArr);
};

inputs.forEach((el, index) => {
    el.addEventListener('change', (e) => {
        setRangeSlider(index, e.currentTarget.value);
    });
});
