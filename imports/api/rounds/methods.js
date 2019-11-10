import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';
import { Jobs } from 'meteor/msavin:sjobs';
import * as Functions from '../functions.js';

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
        const previousStatisticRate = Rounds.findOne({
          index: roundIndex - 1,
        }).statisticRate;
        statisticRate = previousStatisticRate;
        if (!previousStatisticRate[Functions.statisticTranslate(oddEvenType)]) {
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
        if (!previousStatisticRate[Functions.statisticTranslate(lowHighType)]) {
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
        if (!previousStatisticRate[Functions.statisticTranslate(sumType)]) {
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

          return resultData;
        } catch (ex) {
          throw new Meteor.Error('parse-error', ex.message);
        }
      } else {
        throw new Meteor.Error('get-error', 'Không lấy được kết quả');
      }
    },
    'allJobs.start'() {
      // if (
      //   !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
      //   !Roles.userIsInRole(Meteor.userId(), 'admin')
      // ) {
      //   throw new Meteor.Error('Not authorized');
      // }

      Jobs.start();
    },
    'allJobs.stop'() {
      // if (
      //   !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
      //   !Roles.userIsInRole(Meteor.userId(), 'admin')
      // ) {
      //   throw new Meteor.Error('Not authorized');
      // }

      Jobs.stop();
    },
    'getResultJob.register'() {
      Jobs.register({
        'httpResult645.get'() {
          const instance = this;

          const maxRound = Rounds.find(
            {},
            {
              fields: {
                index: 1,
              },
              sort: { index: -1 },
              limit: 1,
            }
          ).fetch();
          const maxRoundIndex = maxRound && maxRound[0] ? maxRound[0].index : 0;
          const roundIndex = maxRoundIndex + 1;

          const jsdom = require('jsdom');
          const { JSDOM } = jsdom;
          const s = `0000${roundIndex}`;
          const index = s.substring(roundIndex.toString().length - 1, s.length);
          const result = HTTP.get(
            `http://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/645?id=${index}&nocatche=1`
          );
          if (result) {
            instance.replicate({
              in: {
                minutes: 1,
              },
            });

            // alternatively, you can use instance.remove to save storage
            instance.success(result.result);

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
                divBangChiTiet[0].children[0].children[1].children[0]
                  .children[2].textContent
              );
              resultData.isJackpot = resultData.jackpotCount > 0;

              const newRoundRequestData = {
                roundIndex: resultData.index,
                roundDate: new Date(resultData.registered),
                roundPrice: resultData.price,
                roundJackpotCount: resultData.jackpotCount,
                roundNo1: resultData.result.num1,
                roundNo2: resultData.result.num2,
                roundNo3: resultData.result.num3,
                roundNo4: resultData.result.num4,
                roundNo5: resultData.result.num5,
                roundNo6: resultData.result.num6,
              };
              Meteor.call('insertNewRound.post', newRoundRequestData, error => {
                if (error) {
                  console.log(`Errot insert new round ${resultData.index}`);
                } else {
                  console.log(
                    `Successfully insert new round ${resultData.index}`
                  );

                  Meteor.call(
                    'newPredictRound.post',
                    resultData.index + 1,
                    err => {
                      if (err) {
                        console.log(
                          `Errot forecase new round ${resultData.index + 1}`
                        );
                      } else {
                        console.log(
                          `Successfully forecast new round ${resultData.index +
                            1}`
                        );
                      }
                    }
                  );
                }
              });
            } catch (ex) {
              console.log(ex.message);
            }
          } else {
            instance.reschedule({
              in: {
                minutes: 1,
              },
            });
          }
        },
      });

      // Kickstart Jobs
      console.log('Kickstart httpResult645.get');
      Jobs.run('httpResult645.get', {
        singular: true,
      });
    },
    'getResultJob.start'() {
      console.log('Start httpResult645.get');
      Jobs.start('httpResult645.get');
    },
    'getResultJob.stop'() {
      console.log('Stop httpResult645.get');
      Jobs.stop('httpResult645.get');
    },
    'getResultJob.clear'() {
      console.log('Clear httpResult645.get');
      Jobs.clear('*', 'httpResult645.get', r => console.log(r));
    },
  });
}
