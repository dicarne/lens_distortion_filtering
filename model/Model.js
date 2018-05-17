const k1std = tf.variable(tf.scalar(0.5));
const k2std = tf.variable(tf.scalar(0.1));
const numInteration = 200;
const learningRate = 1;
const optimizer = tr.train.admin(learningRate);
const lossFunc = judgemode.work;

function TensflowFunc() {
    for(let iter = 0; iter < numInteration; iter++)
    {
        optimizer.minimize(()=>{
            const loss_var = lossFunc();
            return loss_var;
        })
    }
}

