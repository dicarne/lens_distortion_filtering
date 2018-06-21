/**
 * 计算信噪比
 * @param {*} img1 对比图像1
 * @param {*} img2 对比图像2
 */
function getPSNR(img1, img2){
    let compareMat = absdiff(img1,img2,compareMat);
    compareMat = compareMat.map((x)=>x**2);
    let summat = matSum(compareMat);
    let sse = summat[0]+summat[1]+summat[2];
    let mse = sse/3*img1.length;
    let psnr = 10*Math.log10((255**2)/mse);
    return psnr;
}

function absdiff(mat1,mat2){
    let res = new Array(mat1.length);
    for (let i = 0; i < mat1.length; i++) {
        var compare = Math.abs(mat1[i] - mat2[i]);
        res[i] = compare;
    }
    return res;
}

function matSum(mat){
    let res = new Array(3);
    for (let i = 0; i < mat.length; i++) {
        const element = mat[i];
        res[i%3]+=element;
    }
    return res;
}

