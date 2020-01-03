import '@formatjs/intl-pluralrules/polyfill-locales';
import {UnifiedNumberFormat} from '../src/core';

const LOCALES = [
  'en',
  'en-GB',
  'da',
  'de',
  'es',
  'fr',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'nb',
  'nl',
  'pl',
  'pt',
  'ru',
  'sv',
  'th',
  'tr',
  'uk',
  'zh',
  'en-BS',
  'en-US',
];

LOCALES.forEach(locale => {
  UnifiedNumberFormat.__addLocaleData(
    require(`../dist/locale-data/${locale}.json`)
  );
});

function test() {
  it('should lookup locale correctly', function() {
    expect(
      new UnifiedNumberFormat('en-BS', {
        style: 'unit',
        unit: 'bit',
      }).format(1000)
    ).toBe('1,000 bit');
    expect(
      new UnifiedNumberFormat('en-BS', {
        style: 'unit',
        unit: 'celsius',
      }).format(1000)
    ).toBe('1,000°C');
    expect(
      new UnifiedNumberFormat('en-BS', {
        style: 'unit',
        unit: 'gallon',
      }).format(1000)
    ).toBe('1,000 gal US');
  });

  it('supportedLocalesOf should return correct result based on data loaded', function() {
    expect(
      UnifiedNumberFormat.supportedLocalesOf(['zh', 'en-US', 'af'])
    ).toEqual(['zh', 'en-US']);
    expect(UnifiedNumberFormat.supportedLocalesOf(['af'])).toEqual([]);
  });
  it('should not crash if unit is not specified', function() {
    expect(new UnifiedNumberFormat().resolvedOptions().unit).toBeUndefined();
  });

  // Some test262
  describe('test262 examples', function() {
    const tests = [
      ['0.000345', '345E-6', '3,45E-4'],
      ['0.345', '345E-3', '3,45E-1'],
      ['3.45', '3,45E0', '3,45E0'],
      ['34.5', '34,5E0', '3,45E1'],
      ['543', '543E0', '5,43E2'],
      ['5430', '5,43E3', '5,43E3'],
      ['543000', '543E3', '5,43E5'],
      ['543211.1', '543,211E3', '5,432E5'],
    ];

    it('10000', function() {
      expect(
        new UnifiedNumberFormat('th', {
          notation: 'compact',
          signDisplay: 'exceptZero',
          compactDisplay: 'short',
        }).format(10000)
      ).toBe('+10K');
    });

    for (const [number, engineering, scientific] of tests) {
      it(`number ${number}`, function() {
        const nfEngineering = new UnifiedNumberFormat('de-DE', {
          notation: 'engineering',
        });
        expect(nfEngineering.format(+number)).toBe(engineering);
        const nfScientific = new UnifiedNumberFormat('de-DE', {
          notation: 'scientific',
        });
        expect(nfScientific.format(+number)).toBe(scientific);
      });
    }
  });
}

// Node v8 does not have formatToParts and v12 has native NumberFormat.
describe('UnifiedNumberFormat', test);