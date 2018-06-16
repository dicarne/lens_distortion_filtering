//import * as tools from "tools";


function StartEvo() {
    evo.EvoInit();
    evo.TickInit();
    total_count = 100;
    cur_count = 0;
}

function EvoTick() {
    var sta = evo.Tick();
    if (sta === -1) {
        showing = true;
        evo.showBest();
        evo.Selection();
        var fit = 255 * 3 * 256 * 256 - evo.population[0].fitness
        evo.Crossover();
        evo.Mutation();
        cur_count++;
        if (cur_count >= total_count || fit < 60000) {
            console.log('EVO end.');
            return;
        } else {
            UpdateChart1();
            evo.TickInit();
        }
    }
}

var max_chromosome = 0b10011100001111;
var chromosome_length = 14;
var bestk1 = 0, bestk2 = 0;
class Evo {

    constructor() {
    }
    /**
     * 初始化演化算法
     * @param {*} tk1 校正系数k1
     * @param {*} tk2 校正系数k2
     * @param {*} cross_rate 交换概率
     * @param {*} mutate_rate 变异概率
     * @param {*} populations 最大种群
     */
    EvoInit(tk1 = 0, tk2 = 0, cross_rate = 0.8, mutate_rate = 0.2, populations = 20) {
        tk1 = parseInt(tk1);
        tk2 = parseInt(tk2);
        if (tk1 < 0 || tk1 > max_chromosome || tk2 < 0 || tk2 > max_chromosome) {
            console.log(`param tk1:${tk1}, tk2:${tk2}, one of them is out of range. Init failed.`);
            return;
        }
        this.pk1 = tk1;
        this.pk2 = tk2;
        this.cross_rate = cross_rate;
        this.mutate_rate = mutate_rate;
        //this.population_count = populations;
        this.population_count = scale;
        this.population = [];
        for (var i = 0; i < this.population_count; i++) {
            var pop = {
                pk1: max_chromosome - parseInt(Math.random() * max_chromosome),
                pk2: max_chromosome - parseInt(Math.random() * max_chromosome),
                fitness: 0,
            }
            this.population.push(pop);
        }
        bestfit = this.population[0];
    }

    TickInit() {
        this.tick_count = this.population.length;
        this.current_tick = 0;
        showing = false;
    }

    Tick() {
        if (this.current_tick >= this.tick_count) {
            console.log('calculate end.');
            return -1;
        }
        this.CalculateFitness(this.current_tick);
        this.current_tick++;
        return 0;
    }

    /**
     * 计算单个个体的适应值
     * @param index 当前个体在population数组中的位置
     */
    CalculateFitness(index) {
        if (index >= this.population.length) {
            console.log('out of range of [population].');
            return;
        }

        adjustAlphaFactorBase('k1', denormal(pk2k(this.population[index].pk1)));
        adjustAlphaFactorBase('k2', denormal(pk2k(this.population[index].pk2)));
        drawScene(gl2);
        Judge();
        this.population[index].fitness = 255 * 3 * 256 * 256 - red_predict();
    }

    /**
     * 选择
     */
    Selection() {
        //this.SelectBest();
        this.RandomChoose();
    }
    /**
     * 交换片段
     */
    Crossover() {
        this.CrossoverContinuous();
        //this.CrossoverScatter();
    }
    /**
     * 变异
     */
    Mutation() {
        this.population.forEach(pop => {
            if (Math.random() <= this.mutate_rate) {
                for (var count = 0; count < 1; count++) {
                    var targetIndex = parseInt(Math.random() * chromosome_length);
                    var thisBit = GetBit(pop.pk1, targetIndex);
                    var newBit = (thisBit === 0) ? 1 : 0;
                    pop.pk1 = SetBit(pop.pk1, targetIndex, newBit);
                }
            }
            if (Math.random() <= this.mutate_rate) {
                for (var count = 0; count < 1; count++) {
                    var targetIndex = parseInt(Math.random() * chromosome_length);
                    var thisBit = GetBit(pop.pk2, targetIndex);
                    var newBit = (thisBit === 0) ? 1 : 0;
                    pop.pk2 = SetBit(pop.pk2, targetIndex, newBit);
                }
            }
        });
    }
    /**
     * 画出最佳的
     */
    showBest() {

        this.population.forEach(item => {
            if (item.fitness > bestfit.fitness) bestfit = item;
        });

        bestk1 = pk2k(bestfit.pk1);
        bestk2 = pk2k(bestfit.pk2);
        drawBest(glbest);
        red2();
        createTexture(glbestcom, bestcompare.data);
        drawJudge(glbestcom);
    }
    /**
     * 轮盘法随机选择保留的个体
     */
    RandomChoose() {
        var rateList = [];
        var totalFitness = this.population.reduce((p, c) => p + c.fitness, 0);
        this.population.forEach(pop => {
            rateList.push((pop.fitness / totalFitness));
        });
        for (var i = 1; i < rateList.length; i++) {
            rateList[i] += rateList[i - 1];
        }
        var newpopulation = [];
        while (newpopulation.length <= this.population_count) {
            var hitTarget = Math.random();
            var index = 0;
            for (index = 0; rateList[index] <= hitTarget; index++) { }
            newpopulation.push({
                pk1: this.population[index].pk1,
                pk2: this.population[index].pk2,
                fitness: this.population[index].fitness,
            });
        }
        this.population = newpopulation;
    }
    /**
     * 选择最棒的四个个体，进行复制
     */
    SelectBest() {
        this.population.sort((a, b) => a.fitness - b.fitness);
        this.population = this.population.slice(0, 3);
        var index = 0;
        while (this.population.length < this.population_count) {
            var template_pop = this.population[index % 4];
            var new_pop = {
                pk1: template_pop.pk1,
                pk2: template_pop.pk2,
                fitness: template_pop.fitness,
            }
            this.population.push(new_pop);
        }
    }
    /**
     * 交换染色体片段
     */
    CrossoverContinuous() {
        this.population.forEach(pop => {
            if (Math.random() <= this.cross_rate) {
                var startIndex = parseInt(Math.random * 7);
                for (var count = 0; count < 7; count++) {
                    var targetPop = this.population[parseInt(Math.random() * this.population_count)];
                    var targetIndex = startIndex + count;
                    var targetBIt = GetBit(targetPop.pk1, targetIndex);
                    var thisBit = GetBit(pop.pk1, targetIndex);
                    targetPop.pk1 = SetBit(targetPop.pk1, targetIndex, thisBit);
                    pop.pk1 = SetBit(pop.pk1, targetIndex, targetBIt);
                }
            }
            if (Math.random() <= this.cross_rate) {
                var startIndex = parseInt(Math.random * 7);
                for (var count = 0; count < 7; count++) {
                    var targetPop = this.population[parseInt(Math.random() * this.population_count)];
                    var targetIndex = startIndex + count;
                    var targetBIt = GetBit(targetPop.pk2, targetIndex);
                    var thisBit = GetBit(pop.pk2, targetIndex);
                    targetPop.pk2 = SetBit(targetPop.pk2, targetIndex, thisBit);
                    pop.pk2 = SetBit(pop.pk2, targetIndex, targetBIt);
                }
            }
        });
    }
    /**
     * 交换不连续片段
     */
    CrossoverScatter() {
        this.population.forEach(pop => {
            if (Math.random() <= this.cross_rate) {
                for (var count = 0; count < 4; count++) {
                    var targetPop = this.population[parseInt(Math.random() * this.population_count)];
                    var targetIndex = parseInt(Math.random() * chromosome_length);
                    var targetBIt = GetBit(targetPop.pk1, targetIndex);
                    var thisBit = GetBit(pop.pk1, targetIndex);
                    targetPop.pk1 = SetBit(targetPop.pk1, targetIndex, thisBit);
                    pop.pk1 = SetBit(pop.pk1, targetIndex, targetBIt);
                }
            }
            if (Math.random() <= this.cross_rate) {
                for (var count = 0; count < 4; count++) {
                    var targetPop = this.population[parseInt(Math.random() * this.population_count)];
                    var targetIndex = parseInt(Math.random() * chromosome_length);
                    var targetBIt = GetBit(targetPop.pk2, targetIndex);
                    var thisBit = GetBit(pop.pk2, targetIndex);
                    targetPop.pk2 = SetBit(targetPop.pk2, targetIndex, thisBit);
                    pop.pk2 = SetBit(pop.pk2, targetIndex, targetBIt);
                }
            }
        });
    }
}


/**
 * 设置指定位置的比特
 * @param {*} value 指定数字
 * @param {*} changeIndex 指定位置
 * @param {*} aimBit 目标比特
 */
function SetBit(value, changeIndex, aimBit) {
    return (value & ~(1 << changeIndex)) | (aimBit << changeIndex);
}
/**
 * 获取指定位置上的比特位
 * @param {*} value 指定的数字
 * @param {*} index 指定的位置
 */
function GetBit(value, index) {
    return value >> index & 1;
}

function pk2k(value){
    return (value/10000-0.5)*0.5;
}

var evo = new Evo();
var total_count = 0;
var cur_count = 0;
var fitlist = [];
var worsefitlist = [];
var genlist = [];
function UpdateChart1() {
    var myChart = echarts.init(document.getElementById("chart1"));
    var ScatterChart = echarts.init(document.getElementById("chart2"));
    var maxfit = evo.population[0].fitness;
    var minfit = maxfit;
    var scattermap = [];
    evo.population.forEach(pop => {
        if (pop.fitness > maxfit) maxfit = pop.fitness;
        if (pop.fitness < minfit) minfit = pop.fitness;
        scattermap.push([pk2k(pop.pk1),pk2k(pop.pk2),((pop.fitness-30000000)/2000000)**2]);
    });
    fitlist.push((maxfit/1000000)-40);
    worsefitlist.push((( minfit - 30000000)/1000000)**2);
    genlist.push(cur_count);
    myChart.setOption({
        xAxis: {
            data: genlist
        },
        yAxis: {},
        series: [{
            name: 'best fitness',
            type: 'line',
            data: fitlist
        }],
    });
    ScatterChart.setOption({
        series: [{
            symbolSize: function(scattermap){return scattermap[2];},
            data: scattermap,
            type: 'scatter'
          }]
    })
    //, {
    //    name: 'worst fitness',
    //    type: 'line',
    //    data: worsefitlist
    //}
}