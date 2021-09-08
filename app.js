
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

let savedPalette=[];

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

lockBtn.forEach((button,index)=>{
   
    button.addEventListener("click",(e)=>{
        colorDivs[index].classList.toggle("locked");
        if( colorDivs[index].classList.contains("locked"))
        {
          e.target.innerHTML= `<i class='fas fa-lock'></i>`;
        }
        else 
        {
            e.target.innerHTML= `<i class='fas fa-lock-open'></i>`;
        }
       
    });
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

    if(div.classList.contains('locked')){
        initialColors.push(hexText.innerText);
        return;
    }
    else{
        initialColors.push(chroma(randomColor).hex());
    }





   


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
    

    closeAdjustment[index].addEventListener("click",()=>{
        sliderContainers[index].classList.remove("active");
    });
}


//implement save to palette and local storage stuff 
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput= document.querySelector(".save-container input");
const libraryContainer = document.querySelector('.library-container');
const librarybtn = document.querySelector('.library');
const closelibbtn = document.querySelector('.close-library');

closeSave.addEventListener("click",()=>{
   saveContainer.classList.toggle('active');
});
saveBtn.addEventListener("click",openPalette);

function openPalette(e)
{   const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");

}


submitSave.addEventListener("click",savepalette);

function savepalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.remove('active');
    const name = saveInput.value;
    const colors=[];
    currentHexes.forEach(hex => {
        colors.push(hex.innerText);

        
    });
//generate object
let palettenr = savedPalette.length;
const paletteObj = {name, colors, nr:palettenr};
savedPalette.push(paletteObj);

//save to local storage
savetoLocal(paletteObj);
saveInput.value = "";
//generate palette for ui
const palette = document.createElement('div');
palette.classList.add('custom-palette');
const title = document.createElement('h4');
title.innerText= paletteObj.name;
const preview = document.createElement('div');
preview.classList.add('small-preview');
paletteObj.colors.forEach(smallcolor=>{
    const smalldiv=document.createElement('div');
    smalldiv.style.backgroundColor=smallcolor;
    preview.appendChild(smalldiv);
});

const palettebtn = document.createElement('button');
palettebtn.classList.add('pick-palette-btn');
palettebtn.classList.add(paletteObj.nr);
palettebtn.innerText='Select';

//append to library
palette.appendChild(title);
palette.appendChild(preview);
palette.appendChild(palettebtn);
libraryContainer.children[0].appendChild(palette);

}
function savetoLocal(paletteObj)
{
    let localPalette;
     if( localStorage.getItem('palettes')===null){
         localPalette=[];
     }
     else{
         localPalette.JSON.parse(localStorage.getItem('palettes'));
     }

     localPalette.push(paletteObj);
     localStorage.setItem("palettes",JSON.stringify(localPalette));
}


function openlib(){
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add('active');
    popup.classList.add('active');
}

function closelib(){
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove('active');
    popup.classList.remove('active');
}
console.log(librarybtn);
librarybtn.addEventListener('click',openlib);
closelibbtn.addEventListener('click',closelib);
randomColors();


