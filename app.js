
//global selections and variables 
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(`.generate`);
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentHexes = document.querySelectorAll(`.color h2`);
let initialColors;


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
    console.log(hexcolor);
    return hexcolor;
    
}


function randomColors()
{
colorDivs.forEach((div,index)=>{

    const hexText = div.children[0];
    const randomColor = generateHex();


    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    checkTextContrast(randomColor,hexText);
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
randomColors();
