/* 
Code by: Nolhan Pieroni,
Date: 2023-06-01,

Note: All /// are console.log() for debugging purposes
*/

const DEFAULT_RADIUS = 50;

//let font;
//let shaderCanvas;
//let xPan, yPan;
//let zoom = 1;

let people;
let isMouseDraggingBubble = undefined;
let isFrozen = false;

let mainFriendsId = {};
let BubbleList = [];

function preload() {
  people = loadTable("people.csv", "header");
  /* shaderCanvas = loadShader('shader/canvas.vert', 'shader/canvas.frag')
  font = loadFont('mono'); */
  ///console.log(people);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  /* textFont(font);
  shader(shaderCanvas);
  shaderCanvas.setUniform('u_resolution', [width, height]); */

  //print out the columns
  ///console.log(people['columns']);

  //instantiate the people and the bubbles
  for (let i = 0; i < people['rows'].length; i++) {
    const personName = people['rows'][i]['obj']['peoples'];
    ///console.log('Created Bubble for ' + personName + ' at ' + i);
    mainFriendsId[personName] = i; //get the name for the person using the column name
    BubbleList.push(new Bubble(i, random(DEFAULT_RADIUS, width - DEFAULT_RADIUS), random(DEFAULT_RADIUS, height - DEFAULT_RADIUS), 30, color(random(255), random(255), random(255)), personName));
    ///console.log(BubbleList);
  }

  //setup the friends for the rest of the bubbles
  for (let i = 0; i < BubbleList.length; i++) {

    let friends = [];
    let actualPeopleFriends = people['rows'][i]['arr'];

    for (let j = 0; j < actualPeopleFriends.length; j++) {
      const acutalFriend = actualPeopleFriends[j];
      if (acutalFriend !== '') {
        if(mainFriendsId[acutalFriend] === undefined) {
          ///console.log('Undefined friend: ' + acutalFriend + '. Creating a bubble at ' + BubbleList.length);
          let newBubble = new Bubble(BubbleList.length, random(DEFAULT_RADIUS, width - DEFAULT_RADIUS), random(DEFAULT_RADIUS, height - DEFAULT_RADIUS), 30, color(random(255)), acutalFriend);
          BubbleList.push(newBubble) //add the person to the friends list
          
          mainFriendsId[acutalFriend] = BubbleList.length - 1;
          ///console.warn(BubbleList[i].name, people['rows'][i]['arr']);
          people['rows'][mainFriendsId[acutalFriend]] = {
            'arr': [BubbleList[i].name]
          }
        }

        if(!people['rows'][mainFriendsId[acutalFriend]]['arr'].includes(BubbleList[i].name)) { //if the friend doesn't have the person in their friends list, add it
          people['rows'][mainFriendsId[acutalFriend]]['arr'].push(BubbleList[i].name);
        }
        
        if(!BubbleList[mainFriendsId[acutalFriend]].friends.includes(BubbleList[i].name)) { //if the friend doesn't have the person in their friends list, add it
          ///console.log('Adding ' + BubbleList[i].name + ' to ' + BubbleList[mainFriendsId[acutalFriend]].name + ' friends list');
          BubbleList[mainFriendsId[acutalFriend]].friends.push(BubbleList[i].name);
        }

        friends.push(actualPeopleFriends[j]);
        people['rows'][i]['arr'] = friends;
      }

      
    }

    //is non0reo has this friend, add it to the list
    ///console.log(BubbleList[0].friends.indexOf('BubbleList[i].name'), BubbleList[i].name);
    if(BubbleList[0].friends.includes(BubbleList[i].name)) {
      friends.push('non0reo');
    }

    const friendCount = friends.length;

    BubbleList[i].friends = friends;
    BubbleList[i].r = 2.4 * friendCount + 28;
    ///console.log(BubbleList[i].r);

    //use this HSB color on the bubbles 212, 52, 100
    colorMode(HSB);
    BubbleList[i].color = color(212, 52, map(friendCount, 0, 30, 80, 10));

    ///console.log(BubbleList[i].friends, BubbleList[i].friends.indexOf(BubbleList[i].name), BubbleList[i].name);
    const index = BubbleList[i].friends.indexOf(BubbleList[i].name) + 1;
    if(index > 0) BubbleList[i].friends.splice(BubbleList[i].friends.indexOf(BubbleList[i].name), 1);
  }

  //freeze();
}

function draw() {
  background(15);

  for (let i = 0; i < BubbleList.length; i++) {

    //let actualPeopleFriends = people['rows'][i]['arr'];
    let actualPeopleFriends = BubbleList[i].friends;
    let friendFrom = BubbleList[i].name;

    for (let j = 0; j < actualPeopleFriends.length; j++) {
      if (actualPeopleFriends[j] !== '') {
        stroke(50);
        line(BubbleList[mainFriendsId[friendFrom]].x, BubbleList[mainFriendsId[friendFrom]].y, BubbleList[mainFriendsId[actualPeopleFriends[j]]].x, BubbleList[mainFriendsId[actualPeopleFriends[j]]].y);
      }
    }
  }

  for (let i = 0; i < BubbleList.length; i++) {
    strokeWeight(1);
    stroke(50);

    BubbleList[i].show();
    if(!mouseIsPressed) BubbleList[i].move();
  }
 
  if (mouseIsPressed) {
    //console.log(MouseDraggingBubble);
    if (MouseDraggingBubble !== undefined && MouseDraggingBubble !== null) {
      BubbleList[MouseDraggingBubble].drag();
    } else {
      for (let i = 0; i < BubbleList.length; i++) {
        if(dist(mouseX, mouseY, BubbleList[i].x, BubbleList[i].y) < BubbleList[i].r && MouseDraggingBubble !== null){
          const drag = BubbleList[i].drag();
          if(drag) MouseDraggingBubble = i;
          //console.log(drag);
        } else {
            /* MouseDraggingBubble = null;
            for(bubble of BubbleList) {
              bubble.x += (mouseX - pmouseX) * 0.005;
              bubble.y += (mouseY - pmouseY) * 0.005;
          } */
        }
      }
    }

  } else MouseDraggingBubble = undefined;


  //shader stuff
  /* shaderCanvas.setUniform('u_zoom', [zoom, 0]);
  shaderCanvas.setUniform('u_pan', [xPan - zoom / 2, yPan - zoom / 2]); */

  //rect(0, 0, width, height);


}

function freeze() {
  const playButton = document.getElementById('playButton');
  isFrozen = !isFrozen;
  playButton.innerHTML = (isFrozen) ? 'Play ⏵' : 'Pause ⏸';

  for (let i = 0; i < BubbleList.length; i++) {
    BubbleList[i].freeze(isFrozen);
  }
}

function startBetterView() {
  isFrozen = false;
  playButton.innerHTML = 'Pause ⏸';
  for (let i = 0; i < BubbleList.length; i++) {
    BubbleList[i].freeze(false);
  }
  for (let i = 0; i < BubbleList.length; i++) {
    BubbleList[i].x = width / 2 + random(-50, 50);
    BubbleList[i].y = height / 2 + random(-50, 50);

    const friendCount = BubbleList[i].friends.length;

    const weight = -0.04 * friendCount + 1.47;
    const angle = random(0, 360);
    angleMode(DEGREES);
    velX = cos(angle) * weight * random(0.9, 1.1);
    velY = sin(angle) * weight * random(0.9, 1.1);


    BubbleList[i].velX = velX;
    BubbleList[i].velY = velY;
  }
}

function randomPos() {
  for(bubble of BubbleList) {
    bubble.x = random(DEFAULT_RADIUS, width - DEFAULT_RADIUS);
    bubble.y = random(DEFAULT_RADIUS, height - DEFAULT_RADIUS);
    bubble.velX = random(-0.25, 0.25);
    bubble.velY = random(-0.25, 0.25);
  }
}
