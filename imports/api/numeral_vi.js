/**
 * Created by isadmin on 4/1/2017.
 */
import numeral from 'numeral';

numeral.register('locale', 'vi', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal(number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: 'VND',
  },
});

// switch between locales
numeral.locale('vi');
