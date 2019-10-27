import { Meteor } from 'meteor/meteor';

import { Rounds } from './rounds/rounds';

Meteor.functions = {
  // Get last round
  getLastRound: () => {
    return _.last(rounds);
  },
  get60DayRounds: () => {
    const cutOffDate = moment().subtract(60, 'days');
    return _.filter(rounds, function(round) {
      return moment(round.registered).isAfter(cutOffDate);
    });
  },
  calcGroupDelta: rounds => {
    let result = [];
    result = _.map(rounds, function(round) {
      const resultArray = _.values(round.result);
      const deltaArray = _.first(
        _.map(resultArray, function(value, key, list) {
          if (key < list.length - 1) {
            temp = list[key + 1] - value;
            return temp;
          }
          return 0;
        }),
        5
      );
      return {
        index: round.index,
        isJackpot: round.isJackpot,
        registered: round.registered,
        result: round.result,
        delta: {
          num1: deltaArray[0],
          num2: deltaArray[1],
          num3: deltaArray[2],
          num4: deltaArray[3],
          num5: deltaArray[4],
        },
      };
    });
    return result;
  },
  calcSum: rounds => {
    let result = [];
    result = _.map(rounds, function(round) {
      return {
        index: round.index,
        sum: _.reduce(
          _.values(round.result),
          function(sum, num) {
            return sum + num;
          },
          0
        ),
      };
    });
    return result;
  },
  selectSum: rounds => {
    let result = [];
    result = _.map(rounds, function(round) {
      return {
        index: round.index,
        sum: round.sum,
      };
    });
    return result;
  },
  calcSkipCount: () => {
    let controlRange = _.range(1, 46);
    const result = [];
    let skipCount = 0;
    let eachNum = 0;
    for (let roundIndex = rounds.length - 1; roundIndex >= 0; roundIndex--) {
      for (let numIndex = 1; numIndex <= 6; numIndex++) {
        eachNum = rounds[roundIndex].result[`num${numIndex}`];
        if (_.contains(controlRange, eachNum)) {
          controlRange = _.without(controlRange, eachNum);
          result.push({
            index: eachNum,
            count: skipCount,
          });
          if (controlRange.length == 0) {
            return result;
          }
        }
      }
      skipCount++;
    }
    return result;
  },
  calcSkipCount: rounds => {
    let controlRange = _.range(1, 46);
    const result = [];
    let skipCount = 0;
    let eachNum = 0;
    for (let roundIndex = rounds.length - 1; roundIndex >= 0; roundIndex--) {
      for (let numIndex = 1; numIndex <= 6; numIndex++) {
        eachNum = rounds[roundIndex].result[`num${numIndex}`];
        if (_.contains(controlRange, eachNum)) {
          controlRange = _.without(controlRange, eachNum);
          result.push({
            index: eachNum,
            count: skipCount,
          });
          if (controlRange.length == 0) {
            return result;
          }
        }
      }
      skipCount++;
    }
    return result;
  },
  calcJackpotPrice: () => {
    return _.last(rounds, 100);
  },
  calcPredictBaseRounds: () => {
    return _.last(rounds, 50);
  },
  // Exponention Growth
  calcExpGrowth: known_y => {
    let known_x = _.range(1, 51);
    let new_x = [51];
    // default values for optional parameters:
    if (typeof known_x === 'undefined') {
      known_x = [];
      for (var i = 1; i <= known_y.length; i++) known_x.push(i);
    }
    if (typeof new_x === 'undefined') {
      new_x = [];
      for (var i = 1; i <= known_y.length; i++) new_x.push(i);
    }
    if (typeof use_const === 'undefined') use_const = true;

    // calculate sums over the data:
    const n = known_y.length;
    let avg_x = 0;
    let avg_y = 0;
    let avg_xy = 0;
    let avg_xx = 0;
    for (var i = 0; i < n; i++) {
      const x = known_x[i];
      const y = Math.log(known_y[i]);
      avg_x += x;
      avg_y += y;
      avg_xy += x * y;
      avg_xx += x * x;
    }
    avg_x /= n;
    avg_y /= n;
    avg_xy /= n;
    avg_xx /= n;

    // compute linear regression coefficients:
    if (use_const) {
      var beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
      var alpha = avg_y - beta * avg_x;
    } else {
      var beta = avg_xy / avg_xx;
      var alpha = 0;
    }

    // compute and return result array:
    const new_y = [];
    for (var i = 0; i < new_x.length; i++) {
      new_y.push(Math.round(Math.exp(alpha + beta * new_x[i])));
    }
    return new_y;
  },
  // Overall frequen
  calcFrequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.values(round.result);
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 1 frequen
  calcNum1Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.first(_.values(round.result));
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 2 frequen
  calcNum2Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.filter(_.values(round.result), function(item, index) {
              return index == 1;
            });
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 3 frequen
  calcNum3Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.filter(_.values(round.result), function(item, index) {
              return index == 2;
            });
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 4 frequen
  calcNum4Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.filter(_.values(round.result), function(item, index) {
              return index == 3;
            });
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 5 frequen
  calcNum5Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.filter(_.values(round.result), function(item, index) {
              return index == 4;
            });
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Number 6 frequen
  calcNum6Frequen: rounds => {
    const frequen = [];
    _.each(
      _.countBy(
        _.flatten(
          _.map(rounds, function(round) {
            return _.filter(_.values(round.result), function(item, index) {
              return index == 5;
            });
          })
        ),
        function(obj) {
          return obj;
        }
      ),
      function(value, key, list) {
        frequen.push({
          index: parseInt(key),
          count: value,
        });
      }
    );
    return frequen;
  },
  // Each number frequen on 45
  calcNum45Frequen: numFrequen => {
    const frequen = [];
    const orderArray = _.range(1, 46);
    _.each(orderArray, function(value, key, list) {
      const item = _.filter(numFrequen, function(freq) {
        return freq.index == value;
      });
      if (item[0] && item[0].count > 0) {
        frequen.push(item[0].count);
      } else {
        frequen.push(0);
      }
    });
    return frequen;
  },
  // Group frequen
  calcGroupFrequen: frequen => {
    const groupFrequenObj = _.groupBy(frequen, function(frequen) {
      return frequen.count;
    });
    const groupFrequen = [];
    for (const property in groupFrequenObj) {
      if (groupFrequenObj.hasOwnProperty(property)) {
        groupFrequen.push({
          index: _.pluck(groupFrequenObj[property], 'index'),
          count: parseInt(property),
        });
      }
    }
    return _.sortBy(groupFrequen, function(frequen) {
      return frequen.count;
    }).reverse();
  },
  // Mean
  calcMean: frequen => {
    if (!frequen || frequen.length == 0) {
      return 0;
    }
    return (
      _.reduce(
        frequen,
        function(memo, frequen) {
          return memo + frequen.count;
        },
        0
      ) / frequen.length
    );
  },
  // One round Odd Even
  calcOneOddEven: roundResult => {
    return _.countBy(roundResult, function(num) {
      return num % 2 == 0 ? 'even' : 'odd';
    });
  },
  // Odd Even
  calcOddEven: frequen => {
    const result = [];
    result.push(
      _.reduce(
        frequen,
        function(memo, frequen) {
          return frequen.index % 2 == 0 ? memo + frequen.count : memo;
        },
        0
      )
    );
    result.push(
      _.reduce(
        frequen,
        function(memo, frequen) {
          return frequen.index % 2 == 1 ? memo + frequen.count : memo;
        },
        0
      )
    );
    return result;
  },
  // One round Low High
  calcOneLowHigh: roundResult => {
    return _.countBy(roundResult, function(num) {
      return num < 23 ? 'low' : 'high';
    });
  },
  // Low High
  calcLowHigh: frequen => {
    const result = [];
    result.push(
      _.reduce(
        frequen,
        function(memo, frequen) {
          return frequen.index >= 23 ? memo + frequen.count : memo;
        },
        0
      )
    );
    result.push(
      _.reduce(
        frequen,
        function(memo, frequen) {
          return frequen.index < 23 ? memo + frequen.count : memo;
        },
        0
      )
    );
    return result;
  },
  // One round Sum
  calcOneSum: roundResult => {
    return _.reduce(
      roundResult,
      function(memo, num) {
        return memo + num;
      },
      0
    );
  },
  // One round Last Num Type
  calcLastNumType: roundResult => {
    return getLastNumType(roundResult);
  },
  calcSeqNumType: roundResult => {
    return getSequenceType(roundResult);
  },
  // Rounds Filter
  filtRoundFull: () => {
    Session.set('usedRounds', rounds);
  },
  filtRoundsLast3: () => {
    Session.set('usedRounds', _.last(rounds, 3));
  },
  filtRoundsLast10: () => {
    Session.set('usedRounds', _.last(rounds, 10));
  },
  filtRoundsLast50: () => {
    Session.set('usedRounds', _.last(rounds, 50));
  },
  filtRoundsLast100: () => {
    Session.set('usedRounds', _.last(rounds, 100));
  },
  filtRoundsWed: () => {
    const filtedRounds = _.filter(rounds, function(round) {
      return moment(round.registered).day() == 3;
    });
    Session.set('usedRounds', filtedRounds);
  },
  filtRoundsFri: () => {
    const filtedRounds = _.filter(rounds, function(round) {
      return moment(round.registered).day() == 5;
    });
    Session.set('usedRounds', filtedRounds);
  },
  filtRoundsSun: () => {
    const filtedRounds = _.filter(rounds, function(round) {
      return moment(round.registered).day() == 0;
    });
    Session.set('usedRounds', filtedRounds);
  },
  filtRoundsJackpot: () => {
    const filtedRounds = _.filter(rounds, function(round) {
      return round.isJackpot;
    });
    Session.set('usedRounds', filtedRounds);
  },
  // Combine Frequen
  calcCombineFrequen: (rounds, setNum) => {
    const result = [];
    const frequen = [];

    _.each(rounds, function(round) {
      _.each(k_combinations(_.values(round.result), setNum), function(combine) {
        frequen.push(combine);
      });
    });

    _.each(
      _.countBy(frequen, function(combine) {
        return combine;
      }),
      function(value, key, list) {
        if (value > 1) {
          result.push({
            index: key.split(','),
            count: value,
          });
        }
      }
    );

    return _.sortBy(result, function(combine) {
      return combine.count;
    }).reverse();
  },
  // General predict Round
  predictRound: () => {
    const c_exponentialNumValue = 1;
    const c_frequenceAllNumValue = 0.75;
    const c_skipCountValue = 0.75;
    const c_randomValue = 0.05;

    const predictRounds = [];

    const numRange = _.range(1, 46);
    let numRangeValue = _.map(numRange, function(num) {
      return {
        index: num,
        value: 0,
      };
    });

    const predictBaseNums = [[], [], [], [], [], []];
    const predictBaseSum = [];

    // Get seed 50  latest Rounds
    const seedRounds = Rounds.find(
      {},
      {
        sort: { index: -1 },
        limit: 50,
      }
    ).fetch();

    const latestRound = seedRounds[0];

    // Build predict Round
    // Initialize Round
    predictRound = {
      index: latestRound.index,
      isJackpot: latestRound.isJackpot,
      price: latestRound.price,
      result: {
        num1: latestRound.result.num1,
        num2: latestRound.result.num2,
        num3: latestRound.result.num3,
        num4: latestRound.result.num4,
        num5: latestRound.result.num5,
        num6: latestRound.result.num6,
      },
      registered: latestRound.registered,
      regISODate: latestRound.regISODate,
      day: latestRound.day,
      odd: latestRound.odd,
      even: latestRound.even,
      low: latestRound.low,
      high: latestRound.high,
      sum: latestRound.sum,
      oddEvenType: latestRound.oddEvenType,
      lowHighType: latestRound.lowHighType,
      sumType: latestRound.sumType,
      lastNumType: latestRound.lastNumType,
      seqNumType: latestRound.seqNumType,
    };

    // region Prediction ***
    // Index
    predictRound.index = latestRound.index + 1;
    // Date
    switch (moment(latestRound.registered).day()) {
      case 3: // Wed
      case 5: // Fri
        predictRound.registered = moment(latestRound.registered).add(2, 'd');
        break;
      case 0: // Sun
        predictRound.registered = moment(latestRound.registered).add(3, 'd');
        break;
    }
    // Result
    // Build seed Nums
    _.each(seedRounds, function(round) {
      // Num 1
      predictBaseNums[0].push(_.first(_.values(round.result)));
      // Num 2
      predictBaseNums[1].push(
        _.filter(_.values(round.result), function(item, index) {
          return index === 1;
        })
      );
      // Num 3
      predictBaseNums[2].push(
        _.filter(_.values(round.result), function(item, index) {
          return index === 2;
        })
      );
      // Num 4
      predictBaseNums[3].push(
        _.filter(_.values(round.result), function(item, index) {
          return index === 3;
        })
      );
      // Num 5
      predictBaseNums[4].push(
        _.filter(_.values(round.result), function(item, index) {
          return index === 4;
        })
      );
      // Num 6
      predictBaseNums[5].push(
        _.filter(_.values(round.result), function(item, index) {
          return index === 5;
        })
      );
      // Sum
      predictBaseSum.push(round.sum);
    });

    // region Get predict Nums
    // Num 1
    const predictNum1 = Meteor.functions.calcExpGrowth(predictBaseNums[0])[0];
    // Num 2
    const predictNum2 = Meteor.functions.calcExpGrowth(predictBaseNums[1])[0];
    // Num 3
    const predictNum3 = Meteor.functions.calcExpGrowth(predictBaseNums[2])[0];
    // Num 4
    const predictNum4 = Meteor.functions.calcExpGrowth(predictBaseNums[3])[0];
    // Num 5
    const predictNum5 = Meteor.functions.calcExpGrowth(predictBaseNums[4])[0];
    // Num 6
    const predictNum6 = Meteor.functions.calcExpGrowth(predictBaseNums[5])[0];
    // Evaluate Numbers Exponential
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum1,
      c_exponentialNumValue
    );
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum2,
      c_exponentialNumValue
    );
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum3,
      c_exponentialNumValue
    );
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum4,
      c_exponentialNumValue
    );
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum5,
      c_exponentialNumValue
    );
    numRangeValue = updateNumEvalGaussian(
      numRangeValue,
      predictNum6,
      c_exponentialNumValue
    );
    // endregion
    // region Get predict All Frequency
    const allFrequen = Meteor.functions.calcFrequen(seedRounds);
    const allFrequenCount = _.uniq(
      _.map(allFrequen, function(frequen) {
        return frequen.count;
      })
    );
    const maxThreeFrequenCount = _.first(
      allFrequenCount.sort((a, b) => b - a),
      3
    );
    _.each(maxThreeFrequenCount, function(element, index, list) {
      _.each(_.where(allFrequen, { count: element }), function(
        element,
        index,
        list
      ) {
        numRangeValue = updateNumEvalTri(
          numRangeValue,
          element.index,
          c_frequenceAllNumValue
        );
      });
    });
    const minThreeFrequenCount = _.last(
      allFrequenCount.sort((a, b) => b - a),
      3
    );
    _.each(minThreeFrequenCount, function(element, index, list) {
      _.each(_.where(allFrequen, { count: element }), function(
        element,
        index,
        list
      ) {
        numRangeValue = updateNumEvalTri(
          numRangeValue,
          element.index,
          c_frequenceAllNumValue
        );
      });
    });
    // endregion
    // region Get predict Skipcount
    const skipCount = Meteor.functions.calcSkipCount(seedRounds);
    const allSkipCount = _.uniq(
      _.map(skipCount, function(skip) {
        return skip.count;
      })
    );
    const maxThreeSkipCount = _.first(allSkipCount.sort((a, b) => b - a), 3);
    _.each(maxThreeSkipCount, function(element, index, list) {
      _.each(_.where(skipCount, { count: element }), function(
        element,
        index,
        list
      ) {
        numRangeValue = updateNumEvalTri(
          numRangeValue,
          element.index,
          c_skipCountValue
        );
      });
    });
    // endregion
    // region Get predict Sum
    predictSum = Meteor.functions.calcExpGrowth(predictBaseSum)[0];
    // endregion
    // region Get predict Random
    const randomSeedNums = _.sample(_.range(1, 46), 6);
    _.each(randomSeedNums, function(element, index, list) {
      numRangeValue = updateNumEvalTri(numRangeValue, element, c_randomValue);
    });
    // endregion

    // Get 6 highest evaluated Numbers
    const predictRoundResult = getNumEval(numRangeValue);

    // Get Final prediction Nummbers
    predictRound.result.num1 = predictRoundResult[0].index;
    predictRound.result.num2 = predictRoundResult[1].index;
    predictRound.result.num3 = predictRoundResult[2].index;
    predictRound.result.num4 = predictRoundResult[3].index;
    predictRound.result.num5 = predictRoundResult[4].index;
    predictRound.result.num6 = predictRoundResult[5].index;
    // endregion Prediction ***

    // Build statistic
    predictRound = buildStatistic(predictRound);

    // Build predict Rounds List
    predictRounds.push(predictRound);

    return predictRounds;
  },
};

function k_combinations(set, k) {
  let i;
  let j;
  let combs;
  let head;
  let tailcombs;

  if (k > set.length || k <= 0) {
    return [];
  }

  if (k == set.length) {
    return [set];
  }

  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i + 1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}
function getLastNumType(combi) {
  const lastNumTypeSymbol = 'Đ';
  const modCombi = _.sortBy(
    _.map(combi, function(num) {
      return num % 10;
    })
  );

  const convert = _.countBy(
    _.values(
      _.countBy(modCombi, function(num) {
        return num;
      })
    ),
    function(num) {
      return num;
    }
  );

  if (convert['1'] === 6) {
    return `${lastNumTypeSymbol}6`;
  }
  if (convert['1'] === 4) {
    return `${lastNumTypeSymbol}5`;
  }
  if (convert['1'] === 3) {
    return `${lastNumTypeSymbol}4`;
  }
  if (convert['1'] === 2) {
    if (convert['2'] === 2) {
      return `${lastNumTypeSymbol}4`;
    }
    if (convert['4'] === 1) {
      return `${lastNumTypeSymbol}3`;
    }
  } else if (convert['1'] === 1) {
    return `${lastNumTypeSymbol}3`;
  } else if (!convert['1']) {
    if (convert['2'] === 1) {
      return `${lastNumTypeSymbol}2`;
    }
    if (convert['2'] === 3) {
      return `${lastNumTypeSymbol}3`;
    }
    if (convert['3'] === 2) {
      return `${lastNumTypeSymbol}2`;
    }
  }
  return `${lastNumTypeSymbol}1`;
}
function getSequenceType(combi) {
  const lastSeqTypeSymbol = 'L';
  const sortedCombi = _.sortBy(combi);
  const modCombi = _.first(
    _.map(sortedCombi, function(value, key, list) {
      if (key < list.length - 1) {
        temp = list[key + 1] - value;
        if (temp === 1) {
          return temp;
        }
        return 0;
      }
      return 0;
    }),
    5
  );

  switch (modCombi.toString()) {
    case '0,0,0,0,0':
      return `${lastSeqTypeSymbol}0`;
    case '0,0,0,0,1':
    case '0,0,0,1,0':
    case '0,0,1,0,0':
    case '0,1,0,0,0':
    case '1,0,0,0,0':
      return `${lastSeqTypeSymbol}2`;
    case '0,0,1,0,1':
    case '0,1,0,0,1':
    case '1,0,0,0,1':
    case '0,1,0,1,0':
    case '1,0,0,1,0':
    case '1,0,1,0,0':
      return `${lastSeqTypeSymbol}2${lastSeqTypeSymbol}2`;
    case '1,0,1,0,1':
      return `${lastSeqTypeSymbol}2${lastSeqTypeSymbol}2${lastSeqTypeSymbol}2`;
    case '0,0,0,1,1':
    case '0,0,1,1,0':
    case '0,1,1,0,0':
    case '1,1,0,0,0':
      return `${lastSeqTypeSymbol}3`;
    case '0,1,0,1,1':
    case '1,0,0,1,1':
    case '1,0,1,1,0':
    case '0,1,1,0,1':
    case '1,1,0,0,1':
    case '1,1,0,1,0':
      return `${lastSeqTypeSymbol}3${lastSeqTypeSymbol}2`;
    case '1,1,0,1,1':
      return `${lastSeqTypeSymbol}3${lastSeqTypeSymbol}3`;
    case '0,0,1,1,1':
    case '0,1,1,1,0':
    case '1,1,1,0,0':
      return `${lastSeqTypeSymbol}4`;
    case '1,0,1,1,1':
    case '1,1,1,0,1':
      return `${lastSeqTypeSymbol}4${lastSeqTypeSymbol}2`;
    case '0,1,1,1,1':
    case '1,1,1,1,0':
      return `${lastSeqTypeSymbol}5`;
    case '1,1,1,1,1':
      return `${lastSeqTypeSymbol}6`;
  }
  return `${lastSeqTypeSymbol}1`;
}
function buildStatistic(round) {
  predictRoundResult = _.values(round.result);
  const oddEven = Meteor.functions.calcOneOddEven(predictRoundResult);
  const lowHigh = Meteor.functions.calcOneLowHigh(predictRoundResult);
  const roundSum = Meteor.functions.calcOneSum(predictRoundResult);
  const lastNumType = Meteor.functions.calcLastNumType(predictRoundResult);
  const seqNumType = Meteor.functions.calcSeqNumType(predictRoundResult);
  let sumType;
  if (roundSum >= 21 && roundSum <= 67) {
    sumType = 'T21-T67';
  } else if (roundSum >= 68 && roundSum <= 114) {
    sumType = 'T68-T114';
  } else if (roundSum >= 115 && roundSum <= 161) {
    sumType = 'T115-T161';
  } else if (roundSum >= 162 && roundSum <= 208) {
    sumType = 'T162-T208';
  } else if (roundSum >= 209 && roundSum <= 255) {
    sumType = 'T209-T255';
  }

  round.odd = oddEven.odd ? oddEven.odd : 0;
  round.even = oddEven.even ? oddEven.even : 0;
  round.low = lowHigh.low ? lowHigh.low : 0;
  round.high = lowHigh.high ? lowHigh.high : 0;
  round.sum = roundSum;
  round.sumType = sumType;
  round.lastNumType = lastNumType;
  round.seqNumType = seqNumType;

  return round;
}
function updateNumEvalTri(numRangeValue, index, value) {
  //  -3  -2  -1  0   1   2   3
  //  .05 .25 .75 1   .75 .25 .05
  let num = 0;

  num = _.findWhere(numRangeValue, { index });
  num.value += value;
  return numRangeValue;
}
function updateNumEvalGaussian(numRangeValue, index, value) {
  //  -3  -2  -1  0   1   2   3
  //  .05 .25 .75 1   .75 .25 .05
  let num = 0;

  if (index - 3 > 0) {
    num = _.findWhere(numRangeValue, { index: index - 3 });
    num.value += value * 0.05;
  }
  if (index - 2 > 0) {
    num = _.findWhere(numRangeValue, { index: index - 2 });
    num.value += value * 0.25;
  }
  if (index - 1 > 0) {
    num = _.findWhere(numRangeValue, { index: index - 1 });
    num.value += value * 0.75;
  }
  num = _.findWhere(numRangeValue, { index });
  num.value += value;
  if (index + 1 < 46) {
    num = _.findWhere(numRangeValue, { index: index + 1 });
    num.value += value * 0.75;
  }
  if (index + 2 < 46) {
    num = _.findWhere(numRangeValue, { index: index + 2 });
    num.value += value * 0.25;
  }
  if (index + 3 < 46) {
    num = _.findWhere(numRangeValue, { index: index + 3 });
    num.value += value * 0.05;
  }
  return numRangeValue;
}
function getNumEval(numRangeValue) {
  numRangeValue = _.sortBy(numRangeValue, 'value');
  const sortedValue = _.last(numRangeValue, 6);
  return _.sortBy(sortedValue, 'index');
}
