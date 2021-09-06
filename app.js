
//global selections and variables 
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(`.generate`);
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentHexes = document.querySelectorAll(`.color h2`);
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
const lockBtn = document.querySelectorAll(".lock");
let initialColors;

//eventlistenrs
generateBtn.addEventListener("click",()=>{
randomColors();
});
sliders.forEach(slider=>{
slider.addEventListener("input",hslControls);

});
colorDivs.forEach((slider,index)=>{
slider.addEventListener('change',()=>{
    UpdateTextUI(index);
})
});
currentHexes.forEach(hex=>{
hex.addEventListener("click",()=>{
copyToClipboard(hex);
});
});

popup.addEventListener("transitionend",()=>{
        
        popup.children[0].classList.remove('active');
   
        popup.classList.remove('active');
});


adjustBtn.forEach((button,index)=>{
button.addEventListener("click",()=>{
    openAdjustmentPanel(index);
})
});


//functions 
//color generator
function generateHex()
{
    /*const letters = `0123456789ABCDEF`;
    let hash = `#`;
    for(i=0;i<6;i++)
    {
        hash+=letters[Math.floor(Math.random()*16)];
    }
    return hash;*/

    //using chrmoa js we can just  do 
    const hexcolor = chroma.random();
    
    return hexcolor;
    
}


function randomColors()
{
    initialColors=[];
colorDivs.forEach((div,index)=>{

    const hexText = div.children[0];
    const randomColor = generateHex();
    initialColors.push(chroma(randomColor).hex());


    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    checkTextContrast(randomColor,hexText);
    //inititalizing slider settings
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    
    const hue = sliders[0];
    const brightness  = sliders[1];
    const saturation = sliders[2];

colorizeSliders(color, hue, brightness, saturation);

});
//reset inputs
resetInputs();
//check button contrast 
adjustBtn.forEach((button,index)=>{
    checkTextContrast(initialColors[index],button);
    checkTextContrast(initialColors[index],lockBtn[index]);
    
});


}


function checkTextContrast(color,text){
const luminance = chroma(color).luminance(); // checks contrast 
if(luminance>0.5)
{
    text.style.color="black";
}
else{
    text.style.color="white";
}
}


function colorizeSliders(color, hue, brightness, saturation)
{
    //scale saturation
    const noSat = color.set('hsl.s',0);
    const fullSat = color.set('hsl.s',1);
    const scaleSaturation = chroma.scale([noSat,color,fullSat]);

    //scale Brightness
    const midBright= color.set('hsl.l',0.5);
    const scaleBrightness = chroma.scale(['black',midBright,'white']);

    //scale hue
    
    //update input colors 
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSaturation(0)},${scaleSaturation(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBrightness(0)},${scaleBrightness(0.5)},${scaleBrightness(1)})`;


    hue.style.backgroundImage= `linear-gradient(to right,rgb(204,204,204),rgb(204,204,75),rgb(204,75,204),rgb(75,204,204),rgb(75,75,204),rgb(75,204,75),rgb(204,75,75),rgb(75,75,75))`;
}



function hslControls(e)
{
    const index = e.target.getAttribute("data-brightness")||
    e.target.getAttribute("data-saturation")||
    e.target.getAttribute("data-hue");

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness  = sliders[1];
    const saturation = sliders[2];
    const bgcolor = initialColors[index];
    let color = chroma(bgcolor).set(`hsl.s`,saturation.value).set(`hsl.h`,hue.value).set(`hsl.l`,brightness.value);

    colorDivs[index].style.backgroundColor=color;

    //colorize slider inputs 

    colorizeSliders(color,hue, brightness,saturation);
    
}



function UpdateTextUI(index)
{
    const ActiveDiv = colorDivs[index];
    const color = chroma(ActiveDiv.style.backgroundColor);
    const textHex = ActiveDiv.querySelector('h2');
    const icons = ActiveDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    checkTextContrast(color,textHex);
    for(icon of icons ){
        checkTextContrast(color,icon);
    }
}



function resetInputs(){
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider=>{
        if(slider.name === 'hue')
        {
            const Color = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(Color).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        else if(slider.name === 'brightness')
        {   
            const Color = initialColors[slider.getAttribute('data-brightness')];
            const brightnessValue = chroma(Color).hsl()[2];
            
            slider.value = (brightnessValue*100)/100;
            
        }
        else if(slider.name === 'saturation')
        {
            const Color = initialColors[slider.getAttribute('data-saturation')];
            const saturationValue = chroma(Color).hsl()[1];
            
            slider.value = (saturationValue*100)/100;
        }

    });
}



function copyToClipboard(hex){
   
    const el = document.createElement('textarea');
    el.value=hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //pop up animation 
    popup.classList.add("active");
    popup.children[0].classList.add("active");   

}

function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle("active");
    console.log();

    sliderContainers[index].children[0].addEventListener("click",()=>{
        sliderContainers[index].classList.remove("active");
    });
}
randomColors();


