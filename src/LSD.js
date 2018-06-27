class LSD {
    constructor(img) {
        this.img = img;
        this.T = 30;
        this.pixelList = [];
        this.pickPixel = [];
    }

    resize() {

    }

    gradient() {

        let plist = [];
        function m(x, y) {
            return this.img[(x + y * 256) * 4 + 1];
        }
        for (let x = 0; x < 256 - 1; x++) {
            for (let y = 0; y < 256 - 1; y++) {
                //let gx = this.img[x+1+y*256]+this.img[x+1+(y+1)*256]+
                let gx = (m(x + 1, y) + m(x + 1, y + 1) - m(x, y) - m(x, y + 1)) / 2;
                let gy = (m(x, y + 1) + m(x + 1, y + 1) - m(x, y) - m(x + 1, y)) / 2;
                plist.push({
                    x: x,
                    y: y,

                    LLA: LLA,
                    G: Math.sqrt(gx ** 2, gy ** 2)
                });
            }
        }
        this.pixelList = plist.sort((a, b) => a.G < b.G);
        function findP(list){
            for (let index = 0; index < list.length; index++) {
                if(list[index].G<2/0.5) return index;
            }
        }
        this.pickPixel = plist.slice()
    }

    getLines() {
        //let grayImg
    }
}