class LSD {
    constructor(img) {
        this.img = img;
    }

    resize() {

    }

    gradient() {
        function m(x,y){
            return this.img[x+y*256];
        }
        for (let x = 0; x < 256 - 1; x++) {
            for (let y = 0; y < 256 - 1; y++) {
                //let gx = this.img[x+1+y*256]+this.img[x+1+(y+1)*256]+
                let gx = (m(x+1,y)+m(x+1,y+1)-m(x,y)-m(x,y+1))/2;
                let gy = (m(x,y+1)+m(x+1,y+1)-m(x,y)-m(x+1,y))/2;
                let LL = Math.atan(gx/(-gy));
            }
        }
    }

    getLines() {
        //let grayImg
    }
}