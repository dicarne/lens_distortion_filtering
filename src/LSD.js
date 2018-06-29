class LSD {
    constructor(img) {
        this.img = img;
        this.T = 30;
        this.pixelList = [];
        this.pickPixel = [];
        this.region = [];
        this.lines = [];
    }

    resize() {

    }
    im(x, y) {
        return this.img[(x + y * 256) * 4 + 1];
    }
    gradient() {

        let plist = [];

        for (let x = 0; x < 256 - 1; x++) {
            for (let y = 0; y < 256 - 1; y++) {
                let gx = (this.im(x + 1, y) + this.im(x + 1, y + 1) - this.im(x, y) - this.im(x, y + 1)) / 2;
                let gy = (this.im(x, y + 1) + this.im(x + 1, y + 1) - this.im(x, y) - this.im(x + 1, y)) / 2;
                if (gy == 0) gy = 0.000001;
                plist.push({
                    x: x,
                    y: y,
                    LLA: Math.atan(gx / (-gy)),
                    G: Math.sqrt(gx ** 2, gy ** 2),
                    USED: false
                });
            }
        }
        let pixelList = plist.sort((a, b) => b.G - a.G);
        function findP(list) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].G < (2 / Math.sin(22.5 * Math.PI / 180))) return index;
            }
        }
        this.pickPixel = pixelList.slice(0, findP(pixelList));
    }

    grow(k) {

        let region = [];
        region.push(this.pickPixel[k]);
        let llaRegion = this.pickPixel[k].LLA;
        let Sx = Math.cos(llaRegion * Math.PI / 180);
        let Sy = Math.sin(llaRegion * Math.PI / 180);
        region.forEach(P => {
            let nei = this.Neighborhood(P);
            nei.forEach(Q => {
                if (Q.USED == false && Math.abs(llaRegion - Q.LLA) < 22.5) {
                    Q.USED = true;
                    region.push(Q);
                    Sx = Sx + Math.cos(Q.LLA * Math.PI / 180);
                    Sy = Sy + Math.sin(Q.LLA * Math.PI / 180);
                    llaRegion = Math.atan(Sy / Sx);
                }
            });
        });
        return region;
    }

    Rectangle(region){
        let cx = region.reduce((p,c)=>p+(c.G*c.x),0)/region.reduce((p,c)=>p+c.G,0);
        let cy = region.reduce((p,c)=>p+(c.G*c.y),0)/region.reduce((p,c)=>p+c.G,0);
        let mxx = region.reduce((p,c)=>p.G*((p.x-cx)**2),0)/region.reduce((p,c)=>p+c.G,0);
        let myy = region.reduce((p,c)=>p.G*((p.y-cy)**2),0)/region.reduce((p,c)=>p+c.G,0);
        let mxy = region.reduce((p,c)=>p+(c.G*(c.x-xc)*(c.y-cy)),0)/region.reduce((p,c)=>p+c.G,0);
        return {cx:cx,xy:cy,m:[[mxx,mxy],[mxy,myy]]};
    }

    getLines() {
        this.gradient();
        let lines = [];
        for (let i = 0; i < this.pickPixel.length; i++) {
            if (this.pickPixel[i].USED == false) {
                lines.push(this.grow(i));
            }
        }
        this.lines = lines;
        //this.draw();

        lines.forEach(lineregion => {
            lineregion.rect = this.Rectangle(lineregion);
        });
        return this.img;
    }

    drawRect(rect){
        
    }

    draw() {
        this.lines.forEach(pl => {
            pl.forEach(pix => {
                this.img[(pix.x + pix.y * 256) * 4] = 255;
                this.img[(pix.x + pix.y * 256) * 4 + 1] = 0;
                this.img[(pix.x + pix.y * 256) * 4 + 2] = 0;
            });
        });
    }

    Neighborhood(p) {
        let list = [];
        let t = this.pickPixel.find((k) => (k.x == p.x - 1) && (k.y == p.y - 1));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x) && (k.y == p.y - 1));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x + 1) && (k.y == p.y - 1));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x - 1) && (k.y == p.y));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x + 1) && (k.y == p.y));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x + 1) && (k.y == p.y + 1));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x) && (k.y == p.y + 1));
        if (t != undefined) list.push(t);
        t = this.pickPixel.find((k) => (k.x == p.x - 1) && (k.y == p.y + 1));
        if (t != undefined) list.push(t);
        return list;
    }
}