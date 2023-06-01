const CONFUSION_MODE = true; //change this to true to see the number of friends instead of the number of friends + me
const changeDistance = 0;


class Bubble {
    constructor(id, x, y, r, color, name) {
        this.id = id;
        this.friends = [];

        this.x = x;
        this.y = y;
        this.velX = random(-0.25, 0.25);
        this.velY = random(-0.25, 0.25);
        this.r = r;
        this.color = color;
        this.name = name;
    }

    show() {
        if(dist(mouseX, mouseY, this.x, this.y) < this.r) {
            for(let i = 0; i < this.friends.length; i++) {
                let friend = BubbleList[mainFriendsId[this.friends[i]]];
                stroke(255);
                strokeWeight(5);
                line(this.x, this.y, friend.x, friend.y);
                strokeWeight(1);
                stroke(50);
            }
        }
        

        fill(this.color);
        ellipse(this.x, this.y, this.r * 2);
        fill(255);
        textAlign(CENTER);
        textSize(20);
        text(this.name, this.x, this.y);

        //disyplay the number of friends under the name
        textSize(12);
        if(CONFUSION_MODE) text(this.friends.length, this.x, this.y + 20);
        else text(this.friends.length - 1 + ' + Me', this.x, this.y + 20);

    }

    move() {
        this.x += this.velX;
        this.y += this.velY;

        if (this.x > width + changeDistance - this.r || this.x < this.r - changeDistance) this.velX *= -1;
        if (this.y > height + changeDistance - this.r || this.y < this.r - changeDistance) this.velY *= -1;

    }

    changeColor(color) {
        this.color = color;
    }

    drag() {
        this.x = mouseX;
        this.y = mouseY;

        return true;
    }

    freeze(isFrozen) {
        if (isFrozen) {
            this.velX = 0;
            this.velY = 0;
        } else {
            this.velX = random(-0.25, 0.25);
            this.velY = random(-0.25, 0.25);
        }
    }
    
}