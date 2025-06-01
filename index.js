
//First we want to Load all DOM 

document.addEventListener("DOMContentLoaded",function(){

const searchButton= document.getElementById("search-btn");
const usernameInput= document.getElementById("user-input");
const statsContainer= document.querySelector(".stats-container")
const easyProgressCircle= document.querySelector(".easy-progress");
const mediumProgressCircle= document.querySelector(".medium-progress")
const hardProgressCircle= document.querySelector(".hard-progress");
const easyLabel= document.getElementById("easy-label");
const mediumLabel= document.getElementById("medium-label");
const hardLabel= document.getElementById("hard-label");
const cardStatsContainer= document.querySelector(".stats-cards");

//return true or false based on a regeular expression(regex):

function validateUsername(username){
 if(username.trim()=== ""){  //username.trim() removes any leading and trailing spaces from the input.
  alert("username should not be empty"); //If the result is an empty string, it shows an alert: "username should not be empty".The function returns false, stopping further checks.
  return false;
 }

 const regex = /^[a-zA-Z0-9_-]+$/; //This is the pattern used to validate the username.

 const isMatching= regex.test(username); //The .test() method checks if the username matches the regex pattern.Returns true if it matches, otherwise false.

 if(!isMatching){
   alert("Invalid Username:"); //If the username does not match the pattern, it shows an alert: "Invalid Username".
 }
 return isMatching; //The function returns true if the username is valid.Returns false if it is invalid.
 
}

async function fetchUserDetails(username){
  const url= `https://leetcode-stats-api.herokuapp.com/${username}`;
  try{
    searchButton.textContent="Searching...";
    searchButton.disabled= true;
    const response= await fetch(url);
    console.log("Response status:", response.status);
    statsContainer.style.setProperty("display","none");


    if(!response.ok){
      throw new Error("Unable to fetch the user details ");
    }
    const parsedData= await response.json();
    console.log("Logging data:", parsedData);

    displayUserData(parsedData);
  }
  catch(error){
    statsContainer.innerHTML=`<p>${error.message}</p>`;
    
  }
  finally{
    searchButton.textContent="Search";
    searchButton.disabled= false;
    // Show the stats container after data is fetched or if error occurs
     statsContainer.style.setProperty("display", "block");
  }
 }


//Update Progress Circle
function updateProgress(solved,total,label,circle){
  const progressDegree= (solved/total)*100;
  circle.style.setProperty("--progress-degree", `${progressDegree}%`);
  label.textContent= `${solved}/${total}`;
}

//Display User Data on the UI
function displayUserData(parsedData) {
  const totalQues = parsedData.totalQuestions;
  const totalEasyQues = parsedData.totalEasy;
  const totalMediumQues = parsedData.totalMedium;
  const totalHardQues = parsedData.totalHard;
  
  const solvedTotalQues = parsedData.totalSolved;
  const solvedTotalEasyQues = parsedData.easySolved;
  const solvedTotalMediumQues = parsedData.mediumSolved;
  const solvedTotalHardQues = parsedData.hardSolved;
  
  updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
  updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
  updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
  
  const cardsData= [
    {label:"Overall Submissions" ,value:parsedData.totalSolved},
    {label:"Overall Easy Submissions" ,value:parsedData.easySolved},
    {label:"Overall Medium Submissions" ,value:parsedData.mediumSolved},
    {label:"Overall Hard Submissions" ,value:parsedData.hardSolved},
  ];

  console.log("Card's Data: ", cardsData);

  cardStatsContainer.innerHTML= cardsData.map( data=>{
    return `
    <div class="card">
    <h4>${data.label}</h4>
    <p>${data.value}</p>
    </div>
    `
  }).join("");
}


searchButton.addEventListener("click", function(){
  const username= usernameInput.value; //For taking username:
  console.log("logging in username:" ,username);
  if(validateUsername(username)) {
    fetchUserDetails(username); //fetch value for given userdetails using API
  }
})
})
