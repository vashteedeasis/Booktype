import { Book, Passage } from '../types';

export const BOOKS_DATA: Book[] = [
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    coverImage: '/src/assets/images/book_pride_and_prejudice_1793678794473.jpg',
    genre: 'Regency Romance & Satire',
    totalWords: 122189,
    description: 'A romantic masterpiece following Elizabeth Bennet as she navigates manners, upbringing, morality, education, and marriage in the society of the British Regency.',
    chapters: [
      {
        id: 'pap-ch-1',
        bookId: 'pride-and-prejudice',
        number: 1,
        title: 'Chapter I: The Arrival of Netherfield',
        description: 'Mrs. Bennet urges Mr. Bennet to call upon their new wealthy neighbour, Mr. Bingley.',
        passages: [
          {
            id: 'pap-1-1',
            chapterId: 'pap-ch-1',
            number: 1,
            title: 'A Truth Universally Acknowledged',
            text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.'
          },
          {
            id: 'pap-1-2',
            chapterId: 'pap-ch-1',
            number: 2,
            title: 'Netherfield Park Let at Last',
            text: '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?" Mr. Bennet replied that he had not. "But it is," returned she; "for Mrs. Long has just been here, and she told me all about it." Mr. Bennet made no answer. "Do you not want to know who has taken it?" cried his wife impatiently.'
          },
          {
            id: 'pap-1-3',
            chapterId: 'pap-ch-1',
            number: 3,
            title: 'Four or Five Thousand a Year',
            text: '"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."'
          },
          {
            id: 'pap-1-4',
            chapterId: 'pap-ch-1',
            number: 4,
            title: 'A Mixture of Quick Parts',
            text: 'Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper.'
          }
        ]
      },
      {
        id: 'pap-ch-2',
        bookId: 'pride-and-prejudice',
        number: 2,
        title: 'Chapter II: The Surreptitious Visit',
        description: 'Mr. Bennet surprises his household having secretly paid his respects to Mr. Bingley.',
        passages: [
          {
            id: 'pap-2-1',
            chapterId: 'pap-ch-2',
            number: 1,
            title: 'Among the Earliest Visitors',
            text: 'Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner.'
          },
          {
            id: 'pap-2-2',
            chapterId: 'pap-ch-2',
            number: 2,
            title: 'Observing the Second Daughter',
            text: 'Observing his second daughter employed in trimming a hat, he suddenly addressed her with: "I hope Mr. Bingley will like it, Lizzy." "We are not in a way to know what Mr. Bingley likes," said her mother resentfully, "since we are not to visit." "But you forget, mamma," said Elizabeth, "that we shall meet him at the assemblies."'
          }
        ]
      },
      {
        id: 'pap-ch-3',
        bookId: 'pride-and-prejudice',
        number: 3,
        title: 'Chapter III: The Meryton Assembly',
        description: 'The neighborhood meets Mr. Bingley and his cold, haughty friend Mr. Darcy at the ball.',
        passages: [
          {
            id: 'pap-3-1',
            chapterId: 'pap-ch-3',
            number: 1,
            title: 'The Handsome Mr. Darcy',
            text: 'Mr. Darcy soon drew the attention of the room by his fine, tall person, handsome features, noble mien, and the report which was in general circulation within five minutes after his entrance, of his having ten thousand a year. The gentlemen pronounced him to be a fine figure of a man, the ladies declared he was much handsomer than Mr. Bingley.'
          },
          {
            id: 'pap-3-2',
            chapterId: 'pap-ch-3',
            number: 2,
            title: 'Tolerable But Not Handsome Enough',
            text: '"Which do you mean?" and turning round he looked for a moment at Elizabeth, till catching her eye, he withdrew his own and coldly said: "She is tolerable, but not handsome enough to tempt me; and I am in no humour at present to give consequence to young ladies who are slighted by other men."'
          }
        ]
      }
    ]
  },
  {
    id: 'the-count-of-monte-cristo',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    year: 1844,
    coverImage: '/src/assets/images/book_monte_cristo_1793678796844.jpg',
    genre: 'Historical Adventure & Vengeance',
    totalWords: 464162,
    description: 'An epic tale of betrayal, enduring hope, and calculated retribution centering upon Edmond Dantès, a young French sailor wrongly imprisoned in the Château d’If.',
    chapters: [
      {
        id: 'cmc-ch-1',
        bookId: 'the-count-of-monte-cristo',
        number: 1,
        title: 'Chapter I: Marseilles — The Arrival',
        description: 'The three-master Pharaon enters the port of Marseilles under tragic circumstances.',
        passages: [
          {
            id: 'cmc-1-1',
            chapterId: 'cmc-ch-1',
            number: 1,
            title: 'The Signal from Notre-Dame de la Garde',
            text: 'On the 24th of February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon, from Smyrna, Trieste, and Naples. As usual, a pilot put off immediately, and rounding the Château d\'If, got on board the vessel between Cape Morgiou and Rion island.'
          },
          {
            id: 'cmc-1-2',
            chapterId: 'cmc-ch-1',
            number: 2,
            title: 'The Deck of the Pharaon',
            text: 'Immediately, and according to custom, the ramparts of Fort Saint-Jean were covered with spectators; it is always an event at Marseilles for a ship to come into port, especially when this ship, like the Pharaon, has been built, rigged, and laden at the old Phocean docks, and belongs to an owner of the city.'
          },
          {
            id: 'cmc-1-3',
            chapterId: 'cmc-ch-1',
            number: 3,
            title: 'Edmond Dantès at the Helm',
            text: 'He was a fine, tall, slim young man of eighteen or twenty, with black eyes, and hair as dark as ebony; his whole appearance bespeak that calm and resolution peculiar to men accustomed to face danger from their childhood.'
          }
        ]
      },
      {
        id: 'cmc-ch-2',
        bookId: 'the-count-of-monte-cristo',
        number: 2,
        title: 'Chapter II: Father and Son',
        description: 'Edmond returns home to his aged father in the narrow garret of the Allées de Meilhan.',
        passages: [
          {
            id: 'cmc-2-1',
            chapterId: 'cmc-ch-2',
            number: 1,
            title: 'The Modest Garret',
            text: 'Dantès turned through narrow alleys, leaving the bustling quays behind. Ascending to the fifth floor of a modest tenement, he knocked gently upon the faded oak door. A trembling voice answered, and the old man, pale and frail with pride and anxiety, beheld his beloved boy.'
          },
          {
            id: 'cmc-2-2',
            chapterId: 'cmc-ch-2',
            number: 2,
            title: 'A Fortune in Affection',
            text: '"Edmond, my son, my life!" cried the old man, sinking into his son\'s arms. "Is it really you? You have not perished on the unforgiving ocean?" Dantès held his father fast, tears wetting his weathered cheeks as he promised comfort and peace for all their days.'
          }
        ]
      }
    ]
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    year: 1818,
    coverImage: '/src/assets/images/book_frankenstein_1793678795394.jpg',
    genre: 'Gothic Fiction & Science',
    totalWords: 75000,
    description: 'The timeless narrative of Victor Frankenstein, a devoted scientist whose fateful triumph in giving breath to inanimate clay yields devastating consequences.',
    chapters: [
      {
        id: 'frk-ch-1',
        bookId: 'frankenstein',
        number: 1,
        title: 'Chapter V: The Spark of Being',
        description: 'Victor brings his creature to life on a dreary November night.',
        passages: [
          {
            id: 'frk-1-1',
            chapterId: 'frk-ch-1',
            number: 1,
            title: 'A Dreary Night of November',
            text: 'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out.'
          },
          {
            id: 'frk-1-2',
            chapterId: 'frk-ch-1',
            number: 2,
            title: 'The Dull Yellow Eye',
            text: 'By the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs. How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form?'
          }
        ]
      }
    ]
  }
];

export const CLASSICAL_VERSES: Passage[] = [
  {
    id: 'verse-sonnet-18',
    chapterId: 'verse-anthology',
    number: 1,
    title: 'Sonnet 18 — William Shakespeare',
    isVerse: true,
    text: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st;
Nor shall death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.`
  },
  {
    id: 'verse-hope-feather',
    chapterId: 'verse-anthology',
    number: 2,
    title: 'Hope Is the Thing with Feathers — Emily Dickinson',
    isVerse: true,
    text: `"Hope" is the thing with feathers -
That perches in the soul -
And sings the tune without the words -
And never stops - at all -

And sweetest - in the Gale - is heard -
And sore must be the storm -
That could abash the little Bird
That kept so many warm -

I've heard it in the chillest land -
And on the strangest Sea -
Yet - never - in Extremity,
It asked a crumb - of me.`
  }
];

export const HERO_DESK_IMAGE = '/src/assets/images/antique_reading_desk_1793678797442.jpg';
