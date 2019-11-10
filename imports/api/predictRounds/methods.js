import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';
import { Jobs } from 'meteor/msavin:sjobs';
import * as Functions from '../functions.js';

import Rounds from '../rounds/rounds.js';
import PredictRounds from './predictRounds.js';

if (Meteor.isServer) {
  Meteor.methods({
    'newPredictRound.check'() {
      const last50Rounds = Rounds.find(
        {},
        {
          sort: { index: -1 },
          limit: 50,
        }
      ).fetch();
      const lastRoundIndex = last50Rounds[0]
        ? last50Rounds[0].index
        : undefined;

      const lastPredictRound = PredictRounds.find(
        {},
        {
          sort: { index: -1 },
          limit: 1,
        }
      ).fetch();
      const lastPredictRoundIndex = lastPredictRound
        ? lastPredictRound.index
        : undefined;

      if (
        lastRoundIndex &&
        lastRoundIndex >= lastPredictRoundIndex &&
        lastRoundIndex >= 100
      ) {
        console.log(`Generate New Predict Round ${lastRoundIndex + 1}`);
        const predictRound = Functions.predictRoundFunc(last50Rounds);
        const requestPredictRoundData = {
          roundIndex: predictRound.index,
          roundDate: predictRound.regISODate,
          roundPrice: predictRound.price,
          roundJackpotCount: predictRound.jackpotCount,
          roundNo1: predictRound.result.num1,
          roundNo2: predictRound.result.num2,
          roundNo3: predictRound.result.num3,
          roundNo4: predictRound.result.num4,
          roundNo5: predictRound.result.num5,
          roundNo6: predictRound.result.num6,
        };
        Meteor.call('newPredictRound.post', requestPredictRoundData, err => {
          if (err) {
            console.log(`New Predict Round error ${err.message}`);
            throw new Meteor.Error(
              'get-error',
              `New Predict Round error ${err.message}`
            );
          } else {
            console.log(`New Predict Round ${predictRound.index} generated`);
            throw new Meteor.Error(
              'get-error',
              `New Predict Round ${predictRound.index} generated`
            );
          }
        });
      } else {
        console.log(
          `New Predict Round ${lastPredictRoundIndex} already generated`
        );
        throw new Meteor.Error(
          'get-error',
          `New Predict Round ${lastPredictRoundIndex} already generated`
        );
      }
    },
    'newPredictRound.post'(index) {
      if (index < 101) {
        throw new Meteor.Error('predict-error', 'Chưa đủ dữ liệu để dự đoán');
      }

      const last50Rounds = Rounds.find(
        {},
        {
          sort: { index: -1 },
          limit: 50,
        }
      ).fetch();
      const predictRound = Functions.predictRoundFunc(last50Rounds);
      console.log(predictRound);
      const requestData = {
        roundIndex: predictRound.index,
        roundDate: predictRound.regISODate,
        roundPrice: predictRound.price,
        roundJackpotCount: predictRound.jackpotCount,
        roundNo1: predictRound.result.num1,
        roundNo2: predictRound.result.num2,
        roundNo3: predictRound.result.num3,
        roundNo4: predictRound.result.num4,
        roundNo5: predictRound.result.num5,
        roundNo6: predictRound.result.num6,
      };

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

      const oddEven = Functions.calcOneOddEven(roundResult);
      const lowHigh = Functions.calcOneLowHigh(roundResult);
      const roundSum = Functions.calcOneSum(roundResult);
      const lastNumType = Functions.calcLastNumType(roundResult);
      const seqNumType = Functions.calcSeqNumType(roundResult);

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
      if (roundIndex === 101) {
        for (let i = 1; i <= 45; i++) {
          skipCount.push({
            index: i,
            count: infinity,
          });
        }
      } else {
        const previousRound = PredictRounds.findOne({
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
      if (roundIndex === 101) {
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
        const previousRoundAllFrequence =
          roundIndex > 101
            ? PredictRounds.findOne({
                index: roundIndex - 1,
              }).allFrequence
            : undefined;

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
      if (roundIndex === 101) {
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
        const previousRoundPosFrequence = PredictRounds.findOne({
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

      if (roundIndex === 101) {
        statisticRate[Functions.statisticTranslate(oddEvenType)] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[Functions.statisticTranslate(lowHighType)] = {
          count: 1,
          lastDate: moment(roundDate).format('YYYY-MM-DD'),
        };
        statisticRate[Functions.statisticTranslate(sumType)] = {
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
        const previousStatisticRate =
          roundIndex > 101
            ? PredictRounds.findOne({
                index: roundIndex - 1,
              }).statisticRate
            : undefined;
        statisticRate = previousStatisticRate;
        if (
          !previousStatisticRate ||
          !previousStatisticRate[Functions.statisticTranslate(oddEvenType)]
        ) {
          statisticRate[Functions.statisticTranslate(oddEvenType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[Functions.statisticTranslate(oddEvenType)] = {
            count:
              previousStatisticRate[Functions.statisticTranslate(oddEvenType)]
                .count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (
          !previousStatisticRate ||
          !previousStatisticRate[Functions.statisticTranslate(lowHighType)]
        ) {
          statisticRate[Functions.statisticTranslate(lowHighType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[Functions.statisticTranslate(lowHighType)] = {
            count:
              previousStatisticRate[Functions.statisticTranslate(lowHighType)]
                .count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (
          !previousStatisticRate ||
          !previousStatisticRate[Functions.statisticTranslate(sumType)]
        ) {
          statisticRate[Functions.statisticTranslate(sumType)] = {
            count: 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        } else {
          statisticRate[Functions.statisticTranslate(sumType)] = {
            count:
              previousStatisticRate[Functions.statisticTranslate(sumType)]
                .count + 1,
            lastDate: moment(roundDate).format('YYYY-MM-DD'),
          };
        }
        if (!previousStatisticRate || !previousStatisticRate[lastNumType]) {
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
        if (!previousStatisticRate || !previousStatisticRate[seqNumType]) {
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
      PredictRounds.insert(round);
    },
  });
}
