const DEFAULT_RADIUS = 50;

let people;
let isMouseDraggingBubble = false;

let mainFriendsId = {};
let BubbleList = [];

function preload() {
  people = loadTable("people.csv", "header");
  console.log(people);

  

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //print out the columns
  console.log(people['columns']);

  //instantiate the people and the bubbles
  for (let i = 0; i < people['rows'].length; i++) {
    const personName = people['rows'][i]['obj']['peoples'];
    console.log('Created Bubble for ' + personName + ' at ' + i);
    mainFriendsId[personName] = i; //get the name for the person using the column name
    BubbleList.push(new Bubble(i, random(DEFAULT_RADIUS, width - DEFAULT_RADIUS), random(DEFAULT_RADIUS, height - DEFAULT_RADIUS), 30, color(random(255), random(255), random(255)), personName));
    console.log(BubbleList);
  }

/*   //setup the friends for the first bubble (me)
  let allFriends = [];
  for (let i = 0; i < people['rows'][0].length; i++) {
    allFriends.push(people['rows'][0][i]);
  }

  BubbleList[0].friends = allFriends;
  BubbleList[0].r = 80;
  console.log(BubbleList[0].r); */

  
  //setup the friends for the rest of the bubbles

  for (let i = 0; i < BubbleList.length; i++) {

    let friends = [];
    //console.log(i, people['rows'], people['rows'])
    //console.log(i, people['rows'], people['rows'])
    //console.log(i, people['rows'][i]['arr'], people['rows'][i]['obj']['peoples'])
    let actualPeopleFriends = people['rows'][i]['arr'];
    //console.log(actualPeopleFriends);

    for (let j = 0; j < actualPeopleFriends.length; j++) {
      const acutalFriend = actualPeopleFriends[j];
      if (acutalFriend !== '') {
        if(mainFriendsId[acutalFriend] === undefined) {
          console.log('Undefined friend: ' + acutalFriend + '. Creating a bubble at ' + BubbleList.length);
          let newBubble = new Bubble(BubbleList.length, random(DEFAULT_RADIUS, width - DEFAULT_RADIUS), random(DEFAULT_RADIUS, height - DEFAULT_RADIUS), 30, color(random(255)), acutalFriend)
          //.friends.push(people['rows'][i]['obj']['peoples']);
          //console.log(newBubble);
          BubbleList.push(newBubble) //add the person to the friends list
          
          mainFriendsId[acutalFriend] = BubbleList.length - 1;
          console.warn(BubbleList[i].name, people['rows'][i]['arr']);
          people['rows'][mainFriendsId[acutalFriend]] = {
            'arr': [BubbleList[i].name]
          }
        }
        
        //console.log(BubbleList, BubbleList[mainFriendsId[acutalFriend]]);
        //console.log(BubbleList[mainFriendsId[acutalFriend]], mainFriendsId[acutalFriend], acutalFriend);
        if(!BubbleList[mainFriendsId[acutalFriend]].friends.includes(BubbleList[i].name)) { //if the friend doesn't have the person in their friends list, add it
          console.log('Adding ' + BubbleList[i].name + ' to ' + BubbleList[mainFriendsId[acutalFriend]].name + ' friends list');
          BubbleList[mainFriendsId[acutalFriend]].friends.push(BubbleList[i].name);
        }


        friends.push(actualPeopleFriends[j]);
        people['rows'][i]['arr'] = friends;
      }

      
    }

    //is non0reo has this friend, add it to the list
    console.log(BubbleList[0].friends.indexOf('BubbleList[i].name'), BubbleList[i].name);
    if(BubbleList[0].friends.includes(BubbleList[i].name)) {
      friends.push('non0reo');
    }

    //console.log(friends);

    const friendCount = friends.length;

    BubbleList[i].friends = friends;
    BubbleList[i].r = 2.8 * friendCount + 25;
    console.log(BubbleList[i].r);

    //use this HSB color on the bubbles 212, 52, 100
    colorMode(HSB);
    BubbleList[i].color = color(212, 52, map(friendCount, 0, 20, 80, 20));



    console.log(BubbleList[i].friends, BubbleList[i].friends.indexOf(BubbleList[i].name), BubbleList[i].name);
    const index = BubbleList[i].friends.indexOf(BubbleList[i].name) + 1;
    if(index > 0) BubbleList[i].friends.splice(BubbleList[i].friends.indexOf(BubbleList[i].name), 1);
  }
}

function draw() {
  background(15);


  //draw the links between the first bubble and the rest of the bubbles (me)
  /* for (let i = 1; i < BubbleList.length; i++) {
    stroke(50);
    line(BubbleList[0].x, BubbleList[0].y, BubbleList[i].x, BubbleList[i].y);
  } */



  for (let i = 0; i < BubbleList.length; i++) {
    //console.log(`${i} : ${people['columns'][i]} ${mainFriendsId[people['columns'][i]]}`);
    
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
    BubbleList[i].move();
  }
 
  if (mouseIsPressed) {
    for (let i = 0; i < BubbleList.length; i++) {
      if(dist(mouseX, mouseY, BubbleList[i].x, BubbleList[i].y) < BubbleList[i].r){
        BubbleList[i].drag();
      }
      
    }
  }

}

function freeze(e) {
  if (e === true) {
    for (let i = 0; i < BubbleList.length; i++) {
      BubbleList[i].freeze(true);
    }
  } else {
    for (let i = 0; i < BubbleList.length; i++) {
      BubbleList[i].freeze(false);
    }
  }
}

function startBetterView() {
  for (let i = 0; i < BubbleList.length; i++) {
    BubbleList[i].x = width / 2;
    BubbleList[i].y = height / 2;

    const friendCount = BubbleList[i].friends.length;

    //Apply the force to the bubbles depending on the friend count, the more friends, the less force
    velX = random(-1, 1) * (1 / (friendCount / 2)) * 4;
    velY = random(-1, 1) * (1 / (friendCount / 2)) * 4;


    BubbleList[i].velX = velX;
    BubbleList[i].velY = velY;
  }
}