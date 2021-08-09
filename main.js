let inputUrl = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require ("request");
let cheerio = require ("cheerio");

let scoreCardObj = require("./scoreCard");

// request 1
request(inputUrl, cb);
function cb(error, response, html) {
    if(error) {
        console.log(error);
    }
    else if(response.statusCode == 404) { 
        console.log("Page Not Found") 
    }
    else {
        getViewAllResultPageLink(html);
    }
}

//extraction 1
function getViewAllResultPageLink(html) {
    let searchTool = cheerio.load(html);
    let viewAllResult= searchTool(" .widget-items.cta-link  ");
    let anchorElem = viewAllResult.find("a");
    let link = anchorElem.attr("href");
    let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
    // console.log(fullAllMatchPageLink);

    // request 2  for new page link
    // go to all match page 
    request(fullAllMatchPageLink, allMatchPageCb);
}

function allMatchPageCb(error, response, html) {
    if(error) {
        console.log(error);
    }
    else if(response.statusCode == 404) { 
        console.log("Page Not Found") 
    }
    else {
        getAllMatchScoreCardLinks(html);
    }
}

// extraction 2
function getAllMatchScoreCardLinks(html) {
    console.log("```````````````````````````````````");
    let searchTool = cheerio.load(html);
    let anchorScorecardArr = searchTool(` a[data-hover="Scorecard" ] `); // reached <a> tag of scorecard
    // console.log(anchorArr.length);
    for(let i = 0; i < anchorScorecardArr.length; i++) {
         let scoreCardUrlsArr = searchTool(anchorScorecardArr[i]).attr("href"); // attr usage: attribute href ke uder jo hai vo dedo
         let fullscoreCardPageUrls = `https://espncricinfo.com${scoreCardUrlsArr}`;
        //  console.log(fullscoreCardPageUrls);
        scoreCardObj.psm(fullscoreCardPageUrls);
        
    }
    console.log("```````````````````````````````````");

}
