import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';

import Rounds from './rounds.js';

if (Meteor.isServer) {
  Meteor.methods({
    'insertNewRound.post'(requestData) {
      const { roundIndex } = requestData;
      const { roundDate } = requestData;
      const { roundPrice } = requestData;
      const { roundJackpotCount } = requestData;
      const { roundNo1 } = requestData;
      const { roundNo2 } = requestData;
      const { roundNo3 } = requestData;
      const { roundNo4 } = requestData;
      const { roundNo5 } = requestData;
      const { roundNo6 } = requestData;

      const infinity = 9999999999;
      const skipCount = [];
      const allFrequence = [];
      const pos1Frequence = [];
      const pos2Frequence = [];
      const pos3Frequence = [];
      const pos4Frequence = [];
      const pos5Frequence = [];
      const pos6Frequence = [];

      // Build Basic Round info
      const roundResult = [];
      roundResult.push(roundNo1);
      roundResult.push(roundNo2);
      roundResult.push(roundNo3);
      roundResult.push(roundNo4);
      roundResult.push(roundNo5);
      roundResult.push(roundNo6);

      const oddEven = calcOneOddEven(roundResult);
      const lowHigh = calcOneLowHigh(roundResult);
      const roundSum = calcOneSum(roundResult);
      const lastNumType = calcLastNumType(roundResult);
      const seqNumType = calcSeqNumType(roundResult);

      const roundDelta = [];
      roundDelta.push(roundNo2 - roundNo1);
      roundDelta.push(roundNo3 - roundNo2);
      roundDelta.push(roundNo4 - roundNo3);
      roundDelta.push(roundNo5 - roundNo4);
      roundDelta.push(roundNo6 - roundNo5);

      const oddEvenTypeEven = oddEven.hasOwnProperty('even')
        ? oddEven.even.toString()
        : '0';
      const oddEvenTypeOdd = oddEven.hasOwnProperty('odd')
        ? oddEven.odd.toString()
        : '0';
      const oddEvenType = `C${oddEvenTypeEven} / ${oddEvenTypeOdd}L`;

      const lowHighTypeHigh = lowHigh.hasOwnProperty('high')
        ? lowHigh.high.toString()
        : '0';
      const lowHighTypeLow = lowHigh.hasOwnProperty('low')
        ? lowHigh.low.toString()
        : '0';
      const lowHighType = `T${lowHighTypeHigh} / ${lowHighTypeLow}X`;

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

      // Build Round Skip Count
      if (roundIndex === 1) {
        for (let i = 1; i <= 45; i++) {
          skipCount.push({
            index: i,
            count: infinity,
          });
        }
      } else {
        const previousRound = Rounds.findOne({
          index: roundIndex - 1,
        });
        // const previousRoundSkipCount = RoundsSkipCount.findOne({
        //     index: roundIndex - 1
        // });

        if (previousRound) {
          const previousResult = _.values(previousRound.result);
          const previousSkipCount = previousRound.skipCount;

          for (let i = 1; i <= 45; i++) {
            if (_.contains(roundResult, i) && _.contains(previousResult, i)) {
              skipCount.push({
                index: i,
                count: 0,
              });
              continue;
            }
            if (!_.contains(roundResult, i) && _.contains(previousResult, i)) {
              skipCount.push({
                index: i,
                count: 1,
              });
              continue;
            }
            if (_.contains(roundResult, i) && !_.contains(previousResult, i)) {
              const previousCount = _.findWhere(previousSkipCount, { index: i })
                .count;
              skipCount.push({
                index: i,
                count: previousCount,
              });
            }
            if (!_.contains(roundResult, i) && !_.contains(previousResult, i)) {
              const previousCount = _.findWhere(previousSkipCount, { index: i })
                .count;
              let currentCount;
              if (previousCount === infinity) {
                currentCount = previousCount;
              } else {
                currentCount = previousCount + 1;
              }
              skipCount.push({
                index: i,
                count: currentCount,
              });
            }
          }
        }
      }

      // Build Round All Frequence
      if (roundIndex === 1) {
        for (let i = 1; i <= 45; i++) {
          if (_.contains(roundResult, i)) {
            allFrequence.push({
              index: i,
              count: 1,
            });
          } else {
            allFrequence.push({
              index: i,
              count: 0,
            });
          }
        }
      } else {
        const previousRoundAllFrequence = Rounds.findOne({
          index: roundIndex - 1,
        }).allFrequence;

        if (previousRoundAllFrequence) {
          const previousAllFrequence = previousRoundAllFrequence;

          for (let i = 1; i <= 45; i++) {
            const previousFrequence = _.findWhere(previousAllFrequence, {
              index: i,
            }).count;
            if (_.contains(roundResult, i)) {
              allFrequence.push({
                index: i,
                count: previousFrequence + 1,
              });
            } else {
              allFrequence.push({
                index: i,
                count: previousFrequence,
              });
            }
          }
        }
      }

      // Build Round Each Position Frequence
      if (roundIndex === 1) {
        for (let i = 1; i <= 45; i++) {
          // Pos1
          if (i === roundNo1) {
            pos1Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos1Frequence.push({
              index: i,
              count: 0,
            });
          }
          // Pos2
          if (i === roundNo2) {
            pos2Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos2Frequence.push({
              index: i,
              count: 0,
            });
          }
          // Pos3
          if (i === roundNo3) {
            pos3Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos3Frequence.push({
              index: i,
              count: 0,
            });
          }
          // Pos4
          if (i === roundNo4) {
            pos4Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos4Frequence.push({
              index: i,
              count: 0,
            });
          }
          // Pos5
          if (i === roundNo5) {
            pos5Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos5Frequence.push({
              index: i,
              count: 0,
            });
          }
          // Pos6
          if (i === roundNo6) {
            pos6Frequence.push({
              index: i,
              count: 1,
            });
          } else {
            pos6Frequence.push({
              index: i,
              count: 0,
            });
          }
        }
      } else {
        const previousRoundPosFrequence = Rounds.findOne({
          index: roundIndex - 1,
        });

        if (previousRoundPosFrequence) {
          const previousPos1Frequence = previousRoundPosFrequence.pos1Frequence;
          const previousPos2Frequence = previousRoundPosFrequence.pos2Frequence;
          const previousPos3Frequence = previousRoundPosFrequence.pos3Frequence;
          const previousPos4Frequence = previousRoundPosFrequence.pos4Frequence;
          const previousPos5Frequence = previousRoundPosFrequence.pos5Frequence;
          const previousPos6Frequence = previousRoundPosFrequence.pos6Frequence;

          for (let i = 1; i <= 45; i++) {
            // Pos1
            let previousPosFrequence = _.findWhere(previousPos1Frequence, {
              index: i,
            }).count;
            if (i === roundNo1) {
              pos1Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos1Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
            // Pos2
            previousPosFrequence = _.findWhere(previousPos2Frequence, {
              index: i,
            }).count;
            if (i === roundNo2) {
              pos2Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos2Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
            // Pos3
            previousPosFrequence = _.findWhere(previousPos3Frequence, {
              index: i,
            }).count;
            if (i === roundNo3) {
              pos3Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos3Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
            // Pos4
            previousPosFrequence = _.findWhere(previousPos4Frequence, {
              index: i,
            }).count;
            if (i === roundNo4) {
              pos4Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos4Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
            // Pos5
            previousPosFrequence = _.findWhere(previousPos5Frequence, {
              index: i,
            }).count;
            if (i === roundNo5) {
              pos5Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos5Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
            // Pos6
            previousPosFrequence = _.findWhere(previousPos6Frequence, {
              index: i,
            }).count;
            if (i === roundNo6) {
              pos6Frequence.push({
                index: i,
                count: previousPosFrequence + 1,
              });
            } else {
              pos6Frequence.push({
                index: i,
                count: previousPosFrequence,
              });
            }
          }
        }
      }

      // Build Statistic
      let statisticRate = {};

      if (roundIndex === 1) {
        statisticRate[statisticTranslate(oddEvenType)] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[statisticTranslate(lowHighType)] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[statisticTranslate(sumType)] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[lastNumType] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[seqNumType] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
      } else {
        const previousStatisticRate = Rounds.findOne({
          index: roundIndex - 1,
        }).statisticRate;
        statisticRate = previousStatisticRate;
        if (!previousStatisticRate[statisticTranslate(oddEvenType)]) {
          statisticRate[statisticTranslate(oddEvenType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[statisticTranslate(oddEvenType)] = {
            count:
              previousStatisticRate[statisticTranslate(oddEvenType)].count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (!previousStatisticRate[statisticTranslate(lowHighType)]) {
          statisticRate[statisticTranslate(lowHighType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[statisticTranslate(lowHighType)] = {
            count:
              previousStatisticRate[statisticTranslate(lowHighType)].count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (!previousStatisticRate[statisticTranslate(sumType)]) {
          statisticRate[statisticTranslate(sumType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[statisticTranslate(sumType)] = {
            count: previousStatisticRate[statisticTranslate(sumType)].count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (!previousStatisticRate[lastNumType]) {
          statisticRate[lastNumType] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[lastNumType] = {
            count: previousStatisticRate[lastNumType].count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (!previousStatisticRate[seqNumType]) {
          statisticRate[seqNumType] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[seqNumType] = {
            count: previousStatisticRate[seqNumType].count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
      }

      // Finally build Round info
      const round = {
        index: roundIndex,
        isJackpot: roundJackpotCount > 0,
        jackpotCount: roundJackpotCount,
        price: roundPrice,
        result: {
          num1: roundNo1,
          num2: roundNo2,
          num3: roundNo3,
          num4: roundNo4,
          num5: roundNo5,
          num6: roundNo6,
        },
        registered: moment(roundDate).format('YYYY-MM-DD'),
        regISODate: roundDate,
        day: moment(roundDate).format('ddd'),
        odd: oddEven.odd ? oddEven.odd : 0,
        even: oddEven.even ? oddEven.even : 0,
        low: lowHigh.low ? lowHigh.low : 0,
        high: lowHigh.high ? lowHigh.high : 0,
        sum: roundSum,
        oddEvenType,
        lowHighType,
        sumType,
        lastNumType,
        seqNumType,
        delta: {
          num1: roundDelta[0],
          num2: roundDelta[1],
          num3: roundDelta[2],
          num4: roundDelta[3],
          num5: roundDelta[4],
        },
        skipCount,
        allFrequence,
        pos1Frequence,
        pos2Frequence,
        pos3Frequence,
        pos4Frequence,
        pos5Frequence,
        pos6Frequence,
        statisticRate,
      };

      // Insert new Round to Collection
      Rounds.insert(round);
    },
    'resultRounds.get'(requestData) {
      const resultRounds = Rounds.find(
        {},
        {
          sort: { index: -1 },
        }
      ).fetch();
      return resultRounds;
    },
    'drawResult.get'(requestData) {
      const jsdom = require('jsdom');
      const { JSDOM } = jsdom;
      const { roundIndex } = requestData;
      const s = `0000${roundIndex}`;
      const index = s.substring(roundIndex.toString().length - 1, s.length);
      const result = HTTP.get(
        `http://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/645?id=${index}&nocatche=1`
      );
      if (result) {
        try {
          const resultData = {
            index: 0,
            isJackpot: false,
            price: 12000000000,
            result: {
              num1: 3,
              num2: 4,
              num3: 14,
              num4: 20,
              num5: 25,
              num6: 35,
            },
            registered: '',
            jackpotCount: 0,
          };
          const dom = new JSDOM(result.content);
          const divKetQuaTitle = dom.window.document.querySelectorAll(
            'div[class="chitietketqua_title"]'
          );
          const divDaySoKetQua = dom.window.document.querySelectorAll(
            'div[class="day_so_ket_qua_v2"]'
          );
          const divSoTien = dom.window.document.querySelectorAll(
            'div[class="so_tien"]'
          );
          const divBangChiTiet = dom.window.document.querySelectorAll(
            'div[class="table-responsive"]'
          );

          // Index
          resultData.index = parseInt(
            divKetQuaTitle[0].children[2].children[0].textContent.replace(
              /#/g,
              ''
            )
          );

          // Date
          const splitDays = divKetQuaTitle[0].children[2].children[1].textContent.split(
            '/'
          );
          resultData.registered = `${splitDays[2]}-${splitDays[1]}-${
            splitDays[0]
          }`;

          // Result Numbers
          resultData.result.num1 = parseInt(
            divDaySoKetQua[0].children[0].textContent
          );
          resultData.result.num2 = parseInt(
            divDaySoKetQua[0].children[1].textContent
          );
          resultData.result.num3 = parseInt(
            divDaySoKetQua[0].children[2].textContent
          );
          resultData.result.num4 = parseInt(
            divDaySoKetQua[0].children[3].textContent
          );
          resultData.result.num5 = parseInt(
            divDaySoKetQua[0].children[4].textContent
          );
          resultData.result.num6 = parseInt(
            divDaySoKetQua[0].children[5].textContent
          );

          // Price
          resultData.price = parseInt(
            divSoTien[0].children[0].textContent.replace(/\./g, '')
          );

          // Number of Jackpot
          resultData.jackpotCount = parseInt(
            divBangChiTiet[0].children[0].children[1].children[0].children[2]
              .textContent
          );
          resultData.isJackpot = resultData.jackpotCount > 0;

          console.log(resultData);
          return resultData;
        } catch (ex) {
          throw new Meteor.Error('parse-error', ex.message);
        }
      } else {
        throw new Meteor.Error(
          'get-error',
          'Khong lay duoc ket qua ky ' + '00001'
        );
      }
    },
  });
}

// One round Odd Even
calcOneOddEven = roundResult => {
  return _.countBy(roundResult, function(num) {
    return num % 2 === 0 ? 'even' : 'odd';
  });
};
// One round Low High
calcOneLowHigh = roundResult => {
  return _.countBy(roundResult, function(num) {
    return num < 23 ? 'low' : 'high';
  });
};
// One round Sum
calcOneSum = roundResult => {
  return _.reduce(
    roundResult,
    function(memo, num) {
      return memo + num;
    },
    0
  );
};
// One round Last Number Type
calcLastNumType = roundResult => {
  return getLastNumType(roundResult);
};
// One round Continuos Number Type
calcSeqNumType = roundResult => {
  return getSequenceType(roundResult);
};
getLastNumType = combi => {
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
};
getSequenceType = combi => {
  const lastSeqTypeSymbol = 'L';
  const sortedCombi = _.sortBy(combi);
  const modCombi = _.take(
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
};
statisticTranslate = input => {
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
};
