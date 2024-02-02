const { Board, Motion, Led, Piezo, Sensor } = require("johnny-five");
const board = new Board();

const logArray = []; //the logs stored in an array
let systemArmed = true; 
let sensitivity = 50; //sensitivity value
//initialize board and declare variables for components and their pins
board.on("ready", () => {
  const pir = new Motion(2);//output pin on digital pin 2
  const led = new Led(7);//digital pin 7
  const buzzer = new Piezo(9); //buzzer on digital pin 9
  const potentiometer = new Sensor("A0");//the potentiometer is on analog pin 0
  //eventhandler for potentiometer
  potentiometer.on("change", () => {
    sensitivity = Math.round((potentiometer.scaleTo(0, 100)));//adjust sensitivity of sensor
    console.log("Sensitivity adjusted:", sensitivity);
  });
//event handler for motion sensor calibration
  pir.on("calibrated", () => {
    console.log("Motion sensor calibrated");
  });

  pir.on("motionstart", () => {
    //function to sound alarm if motion is detected
    if (systemArmed) {
      const logMessage = "Intruder detected!";
      console.log(logMessage);
      logArray.push(logMessage);
//sound alarm and flash LED to indicate presense of intruder
      led.on();
      buzzer.play({ song: "C4", beats: 1 / 4, tempo: 100 });
    }
  });
//function to kill alarm once no motion is detected
  pir.on("motionend", () => {
    const logMessage = "Motion ended";
    console.log(logMessage);
    logArray.push(logMessage);
//shut down led and buzzer
    led.off();
    buzzer.off();
  });
});
//display the stored logs in the comand prompt console
setTimeout(() => {
  console.log("Stored logs:", logArray);
}, 3000); // the logsare displayed after 3 seconds
//end
