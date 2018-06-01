//import * as tools from "tools";


function StartEvo() {
    evo.EvoInit();
    evo.TickInit();
    total_count = 1000;
}

function EvoTick() {
    var sta = evo.Tick();
    if (sta === -1) {
        showing = true;
        evo.Selection();
        var fit = evo.population[0].fitness
        evo.Crossover();
        evo.Mutation();
        cur_count++;
        if (cur_count >= total_count || fit < 40000) {
            console.log('EVO end.');
            return;
        } else {
            evo.TickInit();
        }
    }
}

var max_chromosome = 0b10011100001111;
var chromosome_length = 14;

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
    EvoInit(tk1 = 0, tk2 = 0, cross_rate = 0.6, mutate_rate = 0.1, populations = 20) {
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

        adjustAlphaFactorBase('k1', denormal(this.population[index].pk1/10000));
        adjustAlphaFactorBase('k2', denormal(this.population[index].pk2/10000));
        drawScene(gl2);
        Judge();
        this.population[index].fitness = red_predict();
    }

    /**
     * 选择最优父母，然后复制种群到达种群上限
     */
    Selection() {
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
     * 交换片段
     */
    Crossover() {
        this.population.forEach(pop => {
            if (Math.random() <= this.cross_rate) {
                for (var count = 0; count < 2; count++) {
                    var targetPop = this.population[parseInt(Math.random() * this.population_count)];
                    var targetIndex = parseInt(Math.random() * chromosome_length);
                    var targetBIt = GetBit(targetPop.pk1, targetIndex);
                    var thisBit = GetBit(pop.pk1, targetIndex);
                    targetPop.pk1 = SetBit(targetPop.pk1, targetIndex, thisBit);
                    pop.pk1 = SetBit(pop.pk1, targetIndex, targetBIt);
                }
            }
            if (Math.random() <= this.cross_rate) {
                for (var count = 0; count < 2; count++) {
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

    judge() {

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

var evo = new Evo();
var total_count = 0;
var cur_count = 0;