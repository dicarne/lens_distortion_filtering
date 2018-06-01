'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tools = require('./tools.js');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var evo = new Evo();
var total_count = 0;
var cur_count = 0;
function StartEvo() {
    evo.EvoInit();
    evo.TickInit();
    total_count = 100;
}

function EvoTick() {
    var sta = evo.Tick();
    if (sta === -1) {
        showing = true;
        evo.Selection();
        evo.crossover();
        evo.mutation();
        cur_count++;
        if (cur_count >= total_count) {
            console.log('EVO end.');
            return;
        } else {
            evo.TickInit();
        }
    }
}

var max_chromosome = 9999;
var chromosome_length = 14;

var Evo = function () {
    function Evo() {
        _classCallCheck(this, Evo);
    }
    /**
     * 初始化演化算法
     * @param {*} tk1 校正系数k1
     * @param {*} tk2 校正系数k2
     * @param {*} cross_rate 交换概率
     * @param {*} mutate_rate 变异概率
     * @param {*} populations 最大种群
     */


    _createClass(Evo, [{
        key: 'EvoInit',
        value: function EvoInit() {
            var tk1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var tk2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var cross_rate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.6;
            var mutate_rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.01;
            var populations = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;

            tk1 = parseInt(tk1);
            tk2 = parseInt(tk2);
            if (tk1 < 0 || tk1 > max_chromosome || tk2 < 0 || tk2 > max_chromosome) {
                console.log('param tk1:' + tk1 + ', tk2:' + tk2 + ', one of them is out of range. Init failed.');
                return;
            }
            this.pk1 = tk1;
            this.pk2 = tk2;
            this.cross_rate = cross_rate;
            this.mutate_rate = mutate_rate;
            this.population_count = populations;
            this.population = [];
            for (var i = 0; i < this.population_count; i++) {
                var pop = {
                    pk1: max_chromosome - parseInt(Math.random() * max_chromosome),
                    pk2: max_chromosome - parseInt(Math.random() * max_chromosome),
                    fitness: 0
                };
                this.population.push(pop);
            }
        }
    }, {
        key: 'TickInit',
        value: function TickInit() {
            this.tick_count = this.population.length;
            this.current_tick = 0;
            showing = false;
        }
    }, {
        key: 'Tick',
        value: function Tick() {
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

    }, {
        key: 'CalculateFitness',
        value: function CalculateFitness(index) {
            if (index >= this.population.length) {
                console.log('out of range of [population].');
                return;
            }

            adjustAlphaFactorBase('k1', denormal(this.population[index].pk1));
            adjustAlphaFactorBase('k2', denormal(this.population[index].pk2));
            drawScene(gl2);
            drawScene(gl);
            this.population[index].fitness = red_predict();
        }

        /**
         * 选择最优父母，然后复制种群到达种群上限
         */

    }, {
        key: 'Selection',
        value: function Selection() {
            this.population.sort(function (a, b) {
                return a.fitness - b.fitness;
            });
            this.population = this.population.slice(0, 3);
            var index = 0;
            while (this.population.length < this.population_count) {
                var template_pop = this.population[index % 4];
                var new_pop = {
                    pk1: template_pop.pk1,
                    pk2: template_pop.pk2,
                    fitness: template_pop.fitness
                };
                this.population.push(new_pop);
            }
        }
    }, {
        key: 'crossover',
        value: function crossover() {
            var _this = this;

            this.population.forEach(function (pop) {
                if (Math.random <= _this.cross_rate) {
                    for (var count = 0; count < 5; count++) {
                        var targetPop = _this.population[parseInt(Math.random() * _this.population_count)];
                        var targetIndex = parseInt(Math.random() * max_chromosome);
                        var targetBIt = _tools2.default.GetBit(targetPop.tk1, targetIndex);
                        var thisBit = _tools2.default.GetBit(pop.tk1, targetIndex);
                        targetPop.tk1 = _tools2.default.SetBit(targetPop.tk1, targetIndex, thisBit);
                        pop.tk1 = _tools2.default.SetBit(pop.tk1, targetIndex, targetBIt);
                    }
                }
            });
        }
    }, {
        key: 'mutation',
        value: function mutation() {
            var _this2 = this;

            this.population.forEach(function (pop) {
                if (Math.random <= _this2.mutate_rate) {
                    for (var count = 0; count < 5; count++) {
                        var targetIndex = parseInt(Math.random() * max_chromosome);
                        var thisBit = _tools2.default.GetBit(pop.tk1, targetIndex);
                        var newBit = thisBit === 0 ? 1 : 0;
                        pop.tk1 = _tools2.default.SetBit(pop.tk1, targetIndex, newBit);
                    }
                }
            });
        }
    }, {
        key: 'judge',
        value: function judge() {}
    }]);

    return Evo;
}();

StartEvo();