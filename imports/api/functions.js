import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// import { Rounds } from './rounds/rounds';

// Get last round
export function getLastRound() {
  return _.last(rounds);
}
export function get60DayRounds() {
  const cutOffDate = moment().subtract(60, 'days');
  return _.filter(rounds, function(round) {
    return moment(round.registered).isAfter(cutOffDate);
  });
}
export function calcGroupDelta(rounds) {
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
}
export function calcSum(rounds) {
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
}
export function selectSum(rounds) {
  let result = [];
  result = _.map(rounds, function(round) {
    return {
      index: round.index,
      sum: round.sum,
    };
  });
  return result;
}
export function calcSkipCount(rounds) {
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
}
export function calcJackpotPrice() {
  return _.last(rounds, 100);
}
export function calcPredictBaseRounds() {
  return _.last(rounds, 50);
}
// Exponention Growth
export function calcExpGrowth(known_y) {
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
}
// Overall frequen
export function calcFrequen(rounds) {
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
}
// Number 1 frequen
export function calcNum1Frequen(rounds) {
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
}
// Number 2 frequen
export function calcNum2Frequen(rounds) {
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
}
// Number 3 frequen
export function calcNum3Frequen(rounds) {
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
}
// Number 4 frequen
export function calcNum4Frequen(rounds) {
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
}
// Number 5 frequen
export function calcNum5Frequen(rounds) {
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
}
// Number 6 frequen
export function calcNum6Frequen(rounds) {
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
}
// Each number frequen on 45
export function calcNum45Frequen(numFrequen) {
  const frequen = [];
  const orderArray = _.range(1, 46);
  _.each(orderArray, function(value, key, list) {
    const item = _.filter(numFrequen, function(freq) {
      return freq.index === value;
    });
    if (item[0] && item[0].count > 0) {
      frequen.push(item[0].count);
    } else {
      frequen.push(0);
    }
  });
  return frequen;
}
// Group frequen
export function calcGroupFrequen(frequen) {
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
}
// Mean
export function calcMean(frequen) {
  if (!frequen || frequen.length === 0) {
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
}
// One round Odd Even
export function calcOneOddEven(roundResult) {
  return _.countBy(roundResult, function(num) {
    return num % 2 === 0 ? 'even' : 'odd';
  });
}
// Odd Even
export function calcOddEven(frequen) {
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
}
// One round Low High
export function calcOneLowHigh(roundResult) {
  return _.countBy(roundResult, function(num) {
    return num < 23 ? 'low' : 'high';
  });
}
// Low High
export function calcLowHigh(frequen) {
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
}
// One round Sum
export function calcOneSum(roundResult) {
  return _.reduce(
    roundResult,
    function(memo, num) {
      return memo + num;
    },
    0
  );
}
// One round Last Num Type
export function calcLastNumType(roundResult) {
  return getLastNumType(roundResult);
}
export function calcSeqNumType(roundResult) {
  return getSequenceType(roundResult);
}
// Rounds Filter
export function filtRoundFull() {
  Session.set('usedRounds', rounds);
}
export function filtRoundsLast3() {
  Session.set('usedRounds', _.last(rounds, 3));
}
export function filtRoundsLast10() {
  Session.set('usedRounds', _.last(rounds, 10));
}
export function filtRoundsLast50() {
  Session.set('usedRounds', _.last(rounds, 50));
}
export function filtRoundsLast100() {
  Session.set('usedRounds', _.last(rounds, 100));
}
export function filtRoundsWed() {
  const filtedRounds = _.filter(rounds, function(round) {
    return moment(round.registered).day() == 3;
  });
  Session.set('usedRounds', filtedRounds);
}
export function filtRoundsFri() {
  const filtedRounds = _.filter(rounds, function(round) {
    return moment(round.registered).day() == 5;
  });
  Session.set('usedRounds', filtedRounds);
}
export function filtRoundsSun() {
  const filtedRounds = _.filter(rounds, function(round) {
    return moment(round.registered).day() == 0;
  });
  Session.set('usedRounds', filtedRounds);
}
export function filtRoundsJackpot() {
  const filtedRounds = _.filter(rounds, function(round) {
    return round.isJackpot;
  });
  Session.set('usedRounds', filtedRounds);
}
// Combine Frequen
export function calcCombineFrequen(rounds, setNum) {
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
}
export function generate(combs, selectedNums) {
  const output = [];
  let ret = [];
  let index = 1;
  const combine = [];
  selectedNums = _.sortBy(selectedNums, function(num) {
    return num;
  });
  for (let i = 0; i < combs.length; i++) {
    ret = [];
    for (let j = 0; j < combs[i].length; j++) {
      const tv = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(combs[i].charAt(j));
      ret.push(selectedNums[tv]);
    }
    shortedRet = _.sortBy(ret);
    result = {
      num1: shortedRet[0],
      num2: shortedRet[1],
      num3: shortedRet[2],
      num4: shortedRet[3],
      num5: shortedRet[4],
      num6: shortedRet[5],
    };
    oddEven = calcOneOddEven(shortedRet);
    lowHigh = calcOneLowHigh(shortedRet);
    sum = calcOneSum(shortedRet);
    if (sum > 208) {
      sumType = 'T209 - T255';
    } else if (sum > 161) {
      sumType = 'T162 - T208';
    } else if (sum > 114) {
      sumType = 'T115 - T161';
    } else if (sum > 67) {
      sumType = 'T68 - T114';
    } else {
      sumType = 'T21 - T67';
    }
    lastNumType = calcLastNumType(shortedRet);
    seqNumType = calcSeqNumType(shortedRet);
    output.push({
      index: `tổ hợp ${index++}`,
      isJackpot: false,
      jackpotCount: 0,
      price: 12000000000,
      ref: combs[i],
      result,
      odd: oddEven.odd ? oddEven.odd : 0,
      even: oddEven.even ? oddEven.even : 0,
      low: lowHigh.low ? lowHigh.low : 0,
      high: lowHigh.high ? lowHigh.high : 0,
      sum,
      sumType,
      lastNumType,
      seqNumType,
    });
  }
  return output;
}
// General predict Round
export function predictRoundFunc(seedRounds) {
  const cExponentialNumValue = 1;
  const cFrequenceAllNumValue = 0.75;
  const cSkipCountValue = 0.75;
  const cRandomValue = 0.05;

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
  const latestRound = seedRounds[0];

  // Build predict Round
  // Initialize Round
  let predictRound = {
    index: latestRound.index,
    isJackpot: false,
    jackpotCount: 0,
    price: 12000000000,
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
  predictRound.regISODate = new Date(predictRound.registered);

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
  const predictNum1 = calcExpGrowth(predictBaseNums[0])[0];
  // Num 2
  const predictNum2 = calcExpGrowth(predictBaseNums[1])[0];
  // Num 3
  const predictNum3 = calcExpGrowth(predictBaseNums[2])[0];
  // Num 4
  const predictNum4 = calcExpGrowth(predictBaseNums[3])[0];
  // Num 5
  const predictNum5 = calcExpGrowth(predictBaseNums[4])[0];
  // Num 6
  const predictNum6 = calcExpGrowth(predictBaseNums[5])[0];
  // Evaluate Numbers Exponential
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum1,
    cExponentialNumValue
  );
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum2,
    cExponentialNumValue
  );
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum3,
    cExponentialNumValue
  );
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum4,
    cExponentialNumValue
  );
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum5,
    cExponentialNumValue
  );
  numRangeValue = updateNumEvalGaussian(
    numRangeValue,
    predictNum6,
    cExponentialNumValue
  );
  // endregion
  // region Get predict All Frequency
  const allFrequen = calcFrequen(seedRounds);
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
        cFrequenceAllNumValue
      );
    });
  });
  const minThreeFrequenCount = _.last(allFrequenCount.sort((a, b) => b - a), 3);
  _.each(minThreeFrequenCount, function(element, index, list) {
    _.each(_.where(allFrequen, { count: element }), function(
      element,
      index,
      list
    ) {
      numRangeValue = updateNumEvalTri(
        numRangeValue,
        element.index,
        cFrequenceAllNumValue
      );
    });
  });
  // endregion
  // region Get predict Skipcount
  const skipCount = calcSkipCount(seedRounds);
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
        cSkipCountValue
      );
    });
  });
  // endregion
  // region Get predict Sum
  predictSum = calcExpGrowth(predictBaseSum)[0];
  // endregion
  // region Get predict Random
  const randomSeedNums = _.sample(_.range(1, 46), 6);
  _.each(randomSeedNums, function(element, index, list) {
    numRangeValue = updateNumEvalTri(numRangeValue, element, cRandomValue);
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
  // predictRounds.push(predictRound);

  return predictRound;
}

export function k_combinations(set, k) {
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
export function getLastNumType(combi) {
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
export function getSequenceType(combi) {
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
export function statisticTranslate(input) {
  let output = '';
  switch (input) {
    // Odd Even 1st way
    case 'C0 / 6L':
      output = 'CL06';
      break;
    case 'C1 / 5L':
      output = 'CL15';
      break;
    case 'C2 / 4L':
      output = 'CL24';
      break;
    case 'C3 / 3L':
      output = 'CL33';
      break;
    case 'C4 / 2L':
      output = 'CL42';
      break;
    case 'C5 / 1L':
      output = 'CL51';
      break;
    case 'C6 / 0L':
      output = 'CL60';
      break;
    // Odd Even 2st way
    case 'CL06':
      output = 'C0 / 6L';
      break;
    case 'CL15':
      output = 'C1 / 5L';
      break;
    case 'CL24':
      output = 'C2 / 4L';
      break;
    case 'CL33':
      output = 'C3 / 3L';
      break;
    case 'CL42':
      output = 'C4 / 2L';
      break;
    case 'CL51':
      output = 'C5 / 1L';
      break;
    case 'CL60':
      output = 'C6 / 0L';
      break;
    // Low High 1st way
    case 'T0 / 6X':
      output = 'TX06';
      break;
    case 'T1 / 5X':
      output = 'TX15';
      break;
    case 'T2 / 4X':
      output = 'TX24';
      break;
    case 'T3 / 3X':
      output = 'TX33';
      break;
    case 'T4 / 2X':
      output = 'TX42';
      break;
    case 'T5 / 1X':
      output = 'TX51';
      break;
    case 'T6 / 0X':
      output = 'TX60';
      break;
    // Odd Even 2st way
    case 'TX06':
      output = 'T0 / 6X';
      break;
    case 'TX15':
      output = 'T1 / 5X';
      break;
    case 'TX24':
      output = 'T2 / 4X';
      break;
    case 'TX33':
      output = 'T3 / 3X';
      break;
    case 'TX42':
      output = 'T4 / 2X';
      break;
    case 'TX51':
      output = 'T5 / 1X';
      break;
    case 'TX60':
      output = 'T6 / 0X';
      break;
    // Sum 1st way
    case 'T21 - T67':
      output = 'T21';
      break;
    case 'T68 - T114':
      output = 'T68';
      break;
    case 'T115 - T161':
      output = 'T115';
      break;
    case 'T162 - T208':
      output = 'T162';
      break;
    case 'T209 - T255':
      output = 'T209';
      break;
    // Sum 2st way
    case 'T21':
      output = 'T21 - T67';
      break;
    case 'T68':
      output = 'T68 - T114';
      break;
    case 'T115':
      output = 'T115 - T161';
      break;
    case 'T162':
      output = 'T162 - T208';
      break;
    case 'T209':
      output = 'T209 - T255';
      break;
  }
  return output;
}
export function buildStatistic(round) {
  const predictRoundResult = _.values(round.result);
  const oddEven = calcOneOddEven(predictRoundResult);
  const lowHigh = calcOneLowHigh(predictRoundResult);
  const roundSum = calcOneSum(predictRoundResult);
  const lastNumType = calcLastNumType(predictRoundResult);
  const seqNumType = calcSeqNumType(predictRoundResult);
  let sumType;
  if (roundSum >= 21 && roundSum <= 67) {
    sumType = 'T21 - T67';
  } else if (roundSum >= 68 && roundSum <= 114) {
    sumType = 'T68 - T114';
  } else if (roundSum >= 115 && roundSum <= 161) {
    sumType = 'T115 - T161';
  } else if (roundSum >= 162 && roundSum <= 208) {
    sumType = 'T162 - T208';
  } else if (roundSum >= 209 && roundSum <= 255) {
    sumType = 'T209 - T255';
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
export function updateNumEvalTri(numRangeValue, index, value) {
  //  -3  -2  -1  0   1   2   3
  //  .05 .25 .75 1   .75 .25 .05
  let num = 0;

  num = _.findWhere(numRangeValue, { index });
  num.value += value;
  return numRangeValue;
}
export function updateNumEvalGaussian(numRangeValue, index, value) {
  //  -3  -2  -1  0   1   2   3
  //  .05 .25 .75 1   .75 .25 .05
  let num;

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
export function getNumEval(numRangeValue) {
  const sortedNumRangeValue = _.sortBy(numRangeValue, 'value');
  const sortedValue = _.last(sortedNumRangeValue, 6);
  return _.sortBy(sortedValue, 'index');
}
