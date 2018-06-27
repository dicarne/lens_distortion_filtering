
class JudgeTools {
    constructor(mat1, mat2) {
        this.img1 = mat1;
        this.img2 = mat2;
        this.PSNR = null;
        this.RMSE = null;
        this.MSE = null;
    }
    /**
     * 计算信噪比
     */
    getPSNR() {
        if (this.MSE == null)
            this.MSE = this.getMSE();
        let psnr = 10 * Math.log10((255 ** 2) / this.MSE);
        this.PSNR = psnr;
        return psnr;
    }
    /**
     * 计算均方差
     */
    getMSE() {
        let compareMat = this.absdiff(this.img1, this.img2);
        compareMat = compareMat.map((x) => x ** 2);
        let summat = this.matSum(compareMat);
        let sse = summat[0] + summat[1] + summat[2];
        let mse = sse / this.img1.length;
        return mse;
    }
    /**
     * 计算均方根误差
     */
    getRMSE() {
        this.RMSE = Math.sqrt(this.getMSE(this.img1, this.img2));
        //return this.getMSE(this.img1, this.img2);
        return this.RMSE;
    }
    /**
     * 计算差值的误差
     * @param {Array} mat1 
     * @param {Array} mat2 
     */
    absdiff(mat1, mat2) {
        let res = new Array(mat1.length);
        for (let i = 0; i < mat1.length; i++) {
            var compare = Math.abs(mat1[i] - mat2[i]);
            res[i] = compare;
        }
        return res;
    }
    /**
     * 计算图像每个分量的和
     * @param {Array} mat 
     */
    matSum(mat) {
        let res = new Array(3);
        res[0] = 0;
        res[1] = 0;
        res[2] = 0;
        for (let i = 0; i < mat.length; i++) {
            const element = mat[i];
            res[i % 3] += element;
        }
        return res;
    }

}