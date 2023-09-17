import {
  Madrigal,
  Song,
  createMadrigal,
  createSong,
  extractNamesMixed,
  extractNamesPure,
  madrigalIsSinger,
  sortedMadrigals,
  filterSongsWithMadrigals,
  getMostSpecialMadrigal,
} from './madrigal';

test('Remove this test and uncomment the other tests below', () => {
  expect(1 + 1).toEqual(2);
});



describe('createMadrigal', () => {
  test('no gift', () => {
    expect(createMadrigal('Mirabel', 15)).toStrictEqual({ name: 'Mirabel', age: 15 });
  });

  test('with gift', () => {
    expect(
      createMadrigal('Mirabel', 15, 'butterflies')
    ).toStrictEqual({ name: 'Mirabel', age: 15, gift: 'butterflies' });
  });
});

describe('createSong', () => {
  test.each([
    {
      name: 'Columbia, Mi Encanto',
      singers: '',
      expected: { name: 'Columbia, Mi Encanto', singers: '' }
    },
    {
      name: 'Turn It Down',
      singers: 'Dolores',
      expected: { name: 'Turn It Down', singers: 'Dolores' }
    },
    {
      name: 'What Else Can I Do',
      singers: ['Isabella', 'Mirabel'],
      expected: { name: 'What Else Can I Do', singers: ['Isabella', 'Mirabel'] }
    },
  ])('($name, $singers) => $expected', ({ name, singers, expected }) => {
    expect(createSong(name, singers)).toStrictEqual(expected);
  });
});

describe('Encanto tests', () => {
  // ====================================================================== //
  // Creating Madrigal Family
  // ====================================================================== //

  const pedro = createMadrigal('Pedro', 76);
  const abuela = createMadrigal('Alma', 75);

  const casita = createMadrigal('Casita', 50, 'Draws, Floors, Doors');
  const bruno = createMadrigal('Bruno', 50, 'Visions');

  const pepa = createMadrigal('Pepa', 50, 'Weather-Controlling Mood');
  const felix = createMadrigal('Felix', 50);
  const dolores = createMadrigal('Dolores', 22, 'Super Hearing');
  const camilo = createMadrigal('Camilo', 15, 'Shapeshifting');
  const antonio = createMadrigal('Antonio', 5, 'Talking to Animals');

  const julieta = createMadrigal('Julieta', 50, 'Healing Meals');
  const augustine = createMadrigal('Augustine', 50);
  const isabella = createMadrigal('Isabella', 22, 'Flower Creation');
  const luisa = createMadrigal('Luisa', 19, 'Super Strength');
  const mirabel = createMadrigal('Mirabel', 15);

  const madrigalFamily: Madrigal[] = [
    pedro, abuela, casita, bruno,
    pepa, felix, dolores, camilo, antonio,
    julieta, augustine, isabella, luisa, mirabel,
  ];
  const madrigalNames: string[] = [
    pedro.name, abuela.name, casita.name, bruno.name,
    pepa.name, felix.name, dolores.name, camilo.name, antonio.name,
    julieta.name, augustine.name, isabella.name, luisa.name, mirabel.name,
  ];

  // ====================================================================== //
  // Creating Songs
  // Playlist https://youtube.com/playlist?list=PLKPn7hqvUwgx-ddMdUbOTIHshyg-iQCIa
  // Bonus Dolores Song: https://www.youtube.com/watch?v=GcHijBTHk4Y
  // ====================================================================== //

  const theFamilyMadrigal = createSong('The Family Madrigal', [mirabel.name, abuela.name]);
  const waitingOnAMiracle = createSong('Waiting on a Miracle', mirabel.name);
  const surfacePressure = createSong('Surface Pressure', luisa.name);
  const weDontTalkAboutBruno = createSong("We Don't Talk About Bruno", [
    abuela.name, pepa.name, felix.name, dolores.name,
    camilo.name, isabella.name, mirabel.name,
  ]);
  const whatElseCanIDo = createSong('What Else Can I Do?', [isabella.name, mirabel.name]);
  const dosOruguitas = createSong('Dos Oruguitas', pedro.name);
  const turnItDown = createSong('Turn It Down', dolores.name);
  const allOfYou = createSong('All Of You', madrigalNames);

  const songs: Song[] = [
    theFamilyMadrigal, waitingOnAMiracle, surfacePressure,
    weDontTalkAboutBruno, whatElseCanIDo, dosOruguitas,
    allOfYou, turnItDown,
  ];
  const songNames: string[] = [
    theFamilyMadrigal.name, waitingOnAMiracle.name, surfacePressure.name,
    weDontTalkAboutBruno.name, whatElseCanIDo.name, dosOruguitas.name,
    allOfYou.name, turnItDown.name,
  ];

  // ====================================================================== //

  describe('extractNames', () => {
    describe.each([
      { extractFunction: extractNamesMixed },
      { extractFunction: extractNamesPure },
    ])('$extractFunction.name', ({ extractFunction }) => {
      test.each([
        // Empty case
        { input: [], expected: [] },
        // Madrigals only
        { input: [mirabel], expected: [mirabel.name] },
        { input: [dolores, camilo], expected: [dolores.name, camilo.name] },
        { input: madrigalFamily, expected: madrigalNames },
        // Songs only
        { input: [surfacePressure], expected: [surfacePressure.name] },
        { input: [turnItDown, allOfYou], expected: [turnItDown.name, allOfYou.name] },
        { input: songs, expected: songNames },
      ])('Expected: $expected', ({ input, expected }) => {
        expect(extractFunction(input)).toStrictEqual(expected);
      });
    });

    test.each([
      { input: [luisa, surfacePressure], expected: [luisa.name, surfacePressure.name] },
      { input: [...songs, ...madrigalFamily], expected: [...songNames, ...madrigalNames] },
    ])('extractNameMixed => $expected', ({ input, expected }) => {
      expect(extractNamesMixed(input)).toStrictEqual(expected);
    });
  });

  describe('madrigalIsSinger', () => {
    test.each([
      { singer: mirabel, song: createSong('new', ''), expected: false },
      { singer: mirabel, song: surfacePressure, expected: false },
      { singer: luisa, song: surfacePressure, expected: true },
      { singer: bruno, song: weDontTalkAboutBruno, expected: false },
      { singer: dolores, song: weDontTalkAboutBruno, expected: true },
    ])('($song.name, $singer.name) => $expected', ({ singer, song, expected }) => {
      expect(madrigalIsSinger(singer, song)).toBe(expected);
    });
  });

  describe('sortMadrigal', () => {
    describe.each([
      { name: 'empty', madrigals: [], expected: [] },
      { name: 'one item', madrigals: [dolores], expected: [dolores] },
      { name: 'two items no swap age', madrigals: [antonio, dolores], expected: [antonio, dolores] },
      { name: 'two items swap age', madrigals: [dolores, antonio], expected: [antonio, dolores] },
      { name: 'two items no swap name', madrigals: [dolores, isabella], expected: [dolores, isabella] },
      { name: 'two items swap name', madrigals: [isabella, dolores], expected: [dolores, isabella] },
      {
        name: 'whole family',
        madrigals: madrigalFamily,
        expected: [
          antonio, camilo, mirabel, luisa, dolores, isabella,
          augustine, bruno, casita, felix, julieta, pepa,
          abuela, pedro,
        ]
      },
    ])('$name', ({ madrigals, expected }) => {
      let backupCopy: Madrigal[];

      beforeEach(() => {
        backupCopy = [...madrigals];
      });

      test('correct order', () => {
        expect(sortedMadrigals(madrigals)).toStrictEqual(expected);
      });

      test('original list not modified', () => {
        expect(madrigals).toStrictEqual(backupCopy);
      });
    });
  });

  describe('filterSongsWithMadrigals', () => {
    const testCases = [
      // Single
      { madrigals: [pedro], madrigalSongs: [dosOruguitas, allOfYou] },
      { madrigals: [abuela], madrigalSongs: [theFamilyMadrigal, weDontTalkAboutBruno, allOfYou] },
      { madrigals: [casita], madrigalSongs: [allOfYou] },
      { madrigals: [bruno], madrigalSongs: [allOfYou] },
      { madrigals: [pepa], madrigalSongs: [weDontTalkAboutBruno, allOfYou] },
      { madrigals: [felix], madrigalSongs: [weDontTalkAboutBruno, allOfYou] },
      { madrigals: [dolores], madrigalSongs: [weDontTalkAboutBruno, allOfYou, turnItDown] },
      { madrigals: [camilo], madrigalSongs: [weDontTalkAboutBruno, allOfYou] },
      { madrigals: [antonio], madrigalSongs: [allOfYou] },
      { madrigals: [julieta], madrigalSongs: [allOfYou] },
      { madrigals: [augustine], madrigalSongs: [allOfYou] },
      { madrigals: [isabella], madrigalSongs: [whatElseCanIDo, weDontTalkAboutBruno, allOfYou] },
      { madrigals: [luisa], madrigalSongs: [surfacePressure, allOfYou] },
      {
        madrigals: [mirabel],
        madrigalSongs: [
          theFamilyMadrigal, waitingOnAMiracle,
          weDontTalkAboutBruno, whatElseCanIDo, allOfYou
        ]
      },

      // Compound
      { madrigals: [bruno, casita], madrigalSongs: [allOfYou] },
      {
        madrigals: [luisa, isabella],
        madrigalSongs: [whatElseCanIDo, weDontTalkAboutBruno, surfacePressure, allOfYou]
      },
      {
        madrigals: [dolores, mirabel, luisa],
        madrigalSongs: [
          theFamilyMadrigal, surfacePressure, waitingOnAMiracle,
          turnItDown, weDontTalkAboutBruno, whatElseCanIDo, allOfYou
        ]
      },
      { madrigals: madrigalFamily, madrigalSongs: songs },
    ];
    test.each(
      testCases.map(t => ({ testName: extractNamesPure(t.madrigals), testData: t }))
    )('$testName', ({ testData }) => {
      const { madrigals, madrigalSongs } = testData;
      const songArray = filterSongsWithMadrigals(madrigals, songs);
      const songSet = new Set(songArray);
      const expectedSet = new Set(madrigalSongs);

      // Comparing sets since order don't matter
      expect(songSet).toStrictEqual(expectedSet);

      // Should fail if solution contains duplicates
      expect(songArray.length).toEqual(expectedSet.size);
    });
  });

  describe('getMostSpecialMadrigal', () => {
    const testCases = [
      { madrigals: [bruno, casita], expectedMadrigal: bruno },
      { madrigals: [luisa, isabella], expectedMadrigal: isabella },
      { madrigals: [dolores, luisa, isabella], expectedMadrigal: dolores },
      { madrigals: [dolores, luisa, mirabel, isabella], expectedMadrigal: mirabel },
      { madrigals: madrigalFamily, expectedMadrigal: mirabel },
    ];
    test.each(
      testCases.map(t => ({ testName: extractNamesPure(t.madrigals), testData: t }))
    )('$testName', ({ testData }) => {
      const { madrigals, expectedMadrigal } = testData;
      expect(getMostSpecialMadrigal(madrigals, songs)).toStrictEqual(expectedMadrigal);
    });

    test('No songs, return first madrigal', () => {
      expect(getMostSpecialMadrigal([abuela, dolores], [])).toStrictEqual(abuela);
    });
  });
});


