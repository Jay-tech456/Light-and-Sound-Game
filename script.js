// Global Variables
const clueHoldTime = 1000;

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence


var patternLength = 8;        // fixed array size for the pattern 

//var pattern = [2, 2, 4, 3, 1, 2, 4, 3 ];  // Defult pattern 
var pattern = []                         // for the secret random pattern 


var progress = 0;                       // how far along the player is in guessing the pattern


var gamePlaying = false;
var tonePlaying = false;
var volume = .5;
var guessCounter = 0;


      // Generate the random pattern 
for(var count = 0; count < patternLength; count++) {
  pattern[count] = Math.floor((Math.random() * 6) + 1)
}


function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;

    // swap the start and stop buttons
    document.getElementById("Startbtn").classList.add("hidden");
    document.getElementById("stopbtn").classList.remove("hidden");
  
    playClueSequence(); // Something is wrong here 
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("Startbtn").classList.remove("hidden");
  document.getElementById("stopbtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 196.00,
  2: 220.00,
  3: 246.94,
  4: 261.63,
  5: 293.66,
  6:320
}
function playTone(btn,len){
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
  tonePlaying = true;
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
    tonePlaying = true
   
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
let delay = nextClueWaitTime; //set delay to initial wait time
  guessCounter = 0;
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
  for(var count = 0; count < patternLength; count++) 
  {
  pattern[count] = Math.floor((Math.random() * 6) + 1)
  }
}

function winGame(){
  stopGame();
  alert("Game Over. You won.");
  
    for(var count = 0; count < patternLength; count++) 
    {                                                        // Keep the pattern as random as possible 
    pattern[count] = Math.floor((Math.random() * 6) + 1)
    }
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){                                          // to see if you are playing the game, if not, it will return 
    return;
  }

  if (btn == pattern[guessCounter]) 
  {
    if(guessCounter == progress) 
    {
      progress++;
      if (progress == patternLength) // If player guessed the pattern 8 times in the row, then they win 
      {
        winGame();
        return;
      }
      playClueSequence();
    }  
    else 
    {
      guessCounter++;
    }
  } else {
    loseGame();
    return;
  }
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
