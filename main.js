// npm init -y 
// npm i request 
// npm install cheerio 

const url = "https://github.com/topics"; 
const request = require("request");
const cheerio = require("cheerio"); 
const fs = require("path");
const path = require("path");  
const pdfkit = require("pdfkit"); 


request(url, function(err,response,html){
    if(err){
        console.log(err);
    } else{
        extractHTML(html);
    }
}) 

function extractHTML(html){
    let $ = cheerio.load(html); 
   //exctracting topic links  
   
   let topicLink =  $(".no-underline.d-flex.flex-column.flex-justify-center"); 
    
 for(let i=0;i<topicLink.length;i++){
    let href = $(topicLink[i]).attr("href");  
    let topic = href.split("/").pop(); 
    console.log(`Topic ${i+1} ${topic}`);
    let topicPageLink = "https://github.com" + href ;  
    // console.log(topicPageLink);
   getTopicRepoPage(topicPageLink,topic);
 }
}  

// Getting Repos of the topic 

function getTopicRepoPage(topicPageLink,topic){

    request(topicPageLink, function(err,response,html){
        if(err){
            console.log("Error while Loading repos " , err);
        }else {
            extractRepo(html);
        }
    })

} 

function extractRepo(html){
    let $ = cheerio.load(html);
   // url of Repos   
     let h3 = $(".f3.color-fg-muted.text-normal.lh-condensed");
    //  console.log(topic);
     for(let i =0 ; i<8;i++){
           let TwoAnker = $(h3[i]).find("a");
           let link = $(TwoAnker[1]).attr("href"); 
        //    console.log(link); 
        let fullLink = `https://github.com${link}/issues`;
        // console.log(fullLink); 
        let repoName = link.split("/").pop();
        getIssuesPageHTML(fullLink,repoName);

     }
}  

// Issues of the Repo 

function getIssuesPageHTML(fullLink,repoName){
    request(fullLink, function(err,response,html){
        if(err){
            console.log("Error getting issues Page" , err);
        } else {
            // console.log(html); 
            getIssues(html);
        }
    })  
}
 
function getIssues(html){
    let $ = cheerio.load(html); 
    let issuesElem = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"); 
     let arr = []; 
     for(let i=0; i<issuesElem.length; i++){
        let link = $(issuesElem[i]).attr("href"); 
      //   console.log(link); 
        arr.push(link);
     } 
  
  //    console.log(arr);  
     let folderPath = path.join(__dirname,topic);
  dirCreater(folderPath);
     let filepath = path.join(folderPath, repoName + ".json"); 
     fs.writeFileSync(filepath,JSON.stringify(arr)); 
     
  } 


function dirCreater(folderPath){

    if(fs.existSync(folderPath) == false){
        fs.mkdirSync(folderPath);
    } 

}

