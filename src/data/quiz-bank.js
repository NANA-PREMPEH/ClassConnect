/**
 * ClassConnect — Quiz Item Bank
 * IRT 3PL calibrated questions for adaptive quiz engine
 *
 * Each item has:
 *   id            - unique identifier
 *   lessonId      - which lesson this question covers
 *   stem          - the question text
 *   options       - array of 4 answer choices
 *   correctIndex  - 0-based index of the correct answer
 *   difficulty    - b parameter (IRT): -3 (very easy) to +3 (very hard), 0 = medium
 *   discrimination - a parameter (IRT): how well it separates ability levels (0.5 - 2.5)
 *   guessing      - c parameter (IRT): probability of guessing correctly (0.25 for 4-option MCQ)
 */

export const quizBank = [
  // ===== LESSON 1: What Is a Computer? =====
  {
    id: 'L1Q1',
    lessonId: 1,
    stem: 'What is the BEST definition of a computer?',
    options: [
      'A machine that only plays games and videos',
      'An electronic device that accepts data, processes it, and produces information',
      'Any device that uses electricity',
      'A tool used only for typing documents'
    ],
    correctIndex: 1,
    difficulty: -1.5,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L1Q2',
    lessonId: 1,
    stem: 'Which of these is NOT a type of computer?',
    options: ['Desktop', 'Laptop', 'Calculator', 'Tablet'],
    correctIndex: 2,
    difficulty: -0.8,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L1Q3',
    lessonId: 1,
    stem: 'What technology did FIRST generation computers use?',
    options: ['Microprocessors', 'Transistors', 'Vacuum tubes', 'Integrated circuits'],
    correctIndex: 2,
    difficulty: 0.3,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L1Q4',
    lessonId: 1,
    stem: 'Which generation of computers introduced the microprocessor?',
    options: ['First generation', 'Second generation', 'Third generation', 'Fourth generation'],
    correctIndex: 3,
    difficulty: 0.5,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L1Q5',
    lessonId: 1,
    stem: 'What is the difference between data and information?',
    options: [
      'Data is processed; information is raw',
      'Data is raw facts; information is processed and meaningful',
      'They mean the same thing',
      'Data is digital; information is analog'
    ],
    correctIndex: 1,
    difficulty: 0.0,
    discrimination: 1.4,
    guessing: 0.25
  },
  {
    id: 'L1Q6',
    lessonId: 1,
    stem: 'A smartphone is a type of computer.',
    options: ['True — it processes data and runs programs', 'False — it is only a phone', 'True — but only expensive ones', 'False — it has no keyboard'],
    correctIndex: 0,
    difficulty: -1.0,
    discrimination: 0.9,
    guessing: 0.25
  },
  {
    id: 'L1Q7',
    lessonId: 1,
    stem: 'What does the fifth generation of computers focus on?',
    options: ['Vacuum tubes', 'Transistors', 'Artificial Intelligence', 'Magnetic storage'],
    correctIndex: 2,
    difficulty: 0.2,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L1Q8',
    lessonId: 1,
    stem: 'A server is a powerful computer that:',
    options: [
      'Only stores personal photos',
      'Provides services to other computers on a network',
      'Cannot connect to the internet',
      'Is smaller than a smartphone'
    ],
    correctIndex: 1,
    difficulty: 0.8,
    discrimination: 1.3,
    guessing: 0.25
  },

  // ===== LESSON 2: Inside the Computer =====
  {
    id: 'L2Q1',
    lessonId: 2,
    stem: 'What is the CPU often called?',
    options: ['The heart of the computer', 'The brain of the computer', 'The body of the computer', 'The memory of the computer'],
    correctIndex: 1,
    difficulty: -1.8,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L2Q2',
    lessonId: 2,
    stem: 'What is the main function of the motherboard?',
    options: [
      'To store files permanently',
      'To display images on screen',
      'To connect all computer components and allow them to communicate',
      'To provide internet access'
    ],
    correctIndex: 2,
    difficulty: -0.3,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L2Q3',
    lessonId: 2,
    stem: 'What happens to data in RAM when the computer is turned off?',
    options: [
      'It is saved permanently',
      'It is transferred to the monitor',
      'It disappears (is lost)',
      'It moves to the keyboard'
    ],
    correctIndex: 2,
    difficulty: -0.5,
    discrimination: 1.4,
    guessing: 0.25
  },
  {
    id: 'L2Q4',
    lessonId: 2,
    stem: 'What unit is used to measure the speed of a CPU?',
    options: ['Kilograms (kg)', 'Gigahertz (GHz)', 'Megabytes (MB)', 'Watts (W)'],
    correctIndex: 1,
    difficulty: 0.6,
    discrimination: 1.5,
    guessing: 0.25
  },
  {
    id: 'L2Q5',
    lessonId: 2,
    stem: 'ROM is different from RAM because ROM:',
    options: [
      'Is faster than RAM',
      'Loses data when power is off',
      'Keeps its data even when the computer is off',
      'Can hold more data than RAM'
    ],
    correctIndex: 2,
    difficulty: 0.4,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L2Q6',
    lessonId: 2,
    stem: 'What does the Power Supply Unit (PSU) do?',
    options: [
      'Displays images on the screen',
      'Converts wall electricity into the correct voltage for components',
      'Stores programs permanently',
      'Connects the computer to the internet'
    ],
    correctIndex: 1,
    difficulty: 0.1,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L2Q7',
    lessonId: 2,
    stem: 'If a computer has more RAM, it can generally:',
    options: [
      'Store more files permanently',
      'Run more tasks at the same time without slowing down',
      'Display brighter colors',
      'Connect to faster internet'
    ],
    correctIndex: 1,
    difficulty: 0.3,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L2Q8',
    lessonId: 2,
    stem: 'Which two types of operations does the CPU perform?',
    options: [
      'Input and output operations',
      'Arithmetic and logic operations',
      'Printing and scanning operations',
      'Storage and display operations'
    ],
    correctIndex: 1,
    difficulty: 0.7,
    discrimination: 1.4,
    guessing: 0.25
  },

  // ===== LESSON 3: Input Devices =====
  {
    id: 'L3Q1',
    lessonId: 3,
    stem: 'An input device is used to:',
    options: [
      'Display information to the user',
      'Send data or commands into a computer',
      'Store data permanently',
      'Print documents on paper'
    ],
    correctIndex: 1,
    difficulty: -1.5,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L3Q2',
    lessonId: 3,
    stem: 'Which of the following is an input device?',
    options: ['Printer', 'Monitor', 'Keyboard', 'Speaker'],
    correctIndex: 2,
    difficulty: -1.8,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L3Q3',
    lessonId: 3,
    stem: 'A scanner converts:',
    options: [
      'Sound into text',
      'Digital files into paper documents',
      'Physical documents into digital images',
      'Video into audio'
    ],
    correctIndex: 2,
    difficulty: 0.0,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L3Q4',
    lessonId: 3,
    stem: 'A touchscreen is special because it is:',
    options: [
      'Only an input device',
      'Only an output device',
      'Both an input and output device',
      'A storage device'
    ],
    correctIndex: 2,
    difficulty: -0.2,
    discrimination: 1.4,
    guessing: 0.25
  },
  {
    id: 'L3Q5',
    lessonId: 3,
    stem: 'A microphone captures _____ and converts it into digital data.',
    options: ['Light', 'Heat', 'Sound', 'Motion'],
    correctIndex: 2,
    difficulty: -1.0,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L3Q6',
    lessonId: 3,
    stem: 'A trackpad is a type of:',
    options: [
      'Output device found on desktops',
      'Pointing device built into laptops',
      'Storage device',
      'Printer accessory'
    ],
    correctIndex: 1,
    difficulty: 0.4,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L3Q7',
    lessonId: 3,
    stem: 'Which input device would you use to capture your face for a video call?',
    options: ['Scanner', 'Keyboard', 'Webcam', 'Printer'],
    correctIndex: 2,
    difficulty: -0.6,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L3Q8',
    lessonId: 3,
    stem: 'A wireless keyboard connects to the computer using:',
    options: [
      'A VGA cable',
      'Bluetooth or a USB receiver',
      'An HDMI cable',
      'A power cable'
    ],
    correctIndex: 1,
    difficulty: 0.5,
    discrimination: 1.3,
    guessing: 0.25
  },

  // ===== LESSON 4: Output Devices =====
  {
    id: 'L4Q1',
    lessonId: 4,
    stem: 'An output device:',
    options: [
      'Sends data into the computer',
      'Presents processed data from the computer to the user',
      'Stores data permanently on a disk',
      'Provides electricity to the computer'
    ],
    correctIndex: 1,
    difficulty: -1.5,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L4Q2',
    lessonId: 4,
    stem: 'Which of the following is an output device?',
    options: ['Mouse', 'Scanner', 'Monitor', 'Keyboard'],
    correctIndex: 2,
    difficulty: -1.8,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L4Q3',
    lessonId: 4,
    stem: 'A "hard copy" refers to:',
    options: [
      'A file saved on a hard disk',
      'A physical paper printout of a document',
      'A very difficult document to read',
      'A backup copy on a flash drive'
    ],
    correctIndex: 1,
    difficulty: 0.2,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L4Q4',
    lessonId: 4,
    stem: 'Which type of printer uses a laser beam and toner powder?',
    options: ['Inkjet printer', 'Laser printer', '3D printer', 'Dot matrix printer'],
    correctIndex: 1,
    difficulty: 0.4,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L4Q5',
    lessonId: 4,
    stem: 'A projector is used to:',
    options: [
      'Print documents in large sizes',
      'Display the computer\'s screen as a large image on a wall',
      'Record sound from the computer',
      'Store data on optical discs'
    ],
    correctIndex: 1,
    difficulty: -0.5,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L4Q6',
    lessonId: 4,
    stem: 'Speakers convert electrical signals into:',
    options: ['Light', 'Text', 'Sound', 'Images'],
    correctIndex: 2,
    difficulty: -1.0,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L4Q7',
    lessonId: 4,
    stem: 'A device that serves as BOTH input and output is called:',
    options: [
      'A storage device',
      'An I/O device',
      'A processing device',
      'A network device'
    ],
    correctIndex: 1,
    difficulty: 0.6,
    discrimination: 1.4,
    guessing: 0.25
  },
  {
    id: 'L4Q8',
    lessonId: 4,
    stem: 'A plotter is mainly used to:',
    options: [
      'Play music files',
      'Draw large-format graphics like maps and architectural plans',
      'Scan photographs',
      'Display video on a wall'
    ],
    correctIndex: 1,
    difficulty: 1.0,
    discrimination: 1.3,
    guessing: 0.25
  },

  // ===== LESSON 5: Storage & Putting It All Together =====
  {
    id: 'L5Q1',
    lessonId: 5,
    stem: 'Why do we need storage devices?',
    options: [
      'To increase the speed of the CPU',
      'To save data permanently so it can be accessed later',
      'To display images on the screen',
      'To connect to the internet'
    ],
    correctIndex: 1,
    difficulty: -1.5,
    discrimination: 1.1,
    guessing: 0.25
  },
  {
    id: 'L5Q2',
    lessonId: 5,
    stem: 'Which storage device uses spinning magnetic disks?',
    options: ['SSD', 'Flash drive', 'HDD', 'SD card'],
    correctIndex: 2,
    difficulty: 0.0,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L5Q3',
    lessonId: 5,
    stem: 'An SSD is faster than an HDD because it:',
    options: [
      'Uses larger disks',
      'Has no moving parts — it uses flash memory chips',
      'Uses more electricity',
      'Is always connected to the internet'
    ],
    correctIndex: 1,
    difficulty: 0.3,
    discrimination: 1.4,
    guessing: 0.25
  },
  {
    id: 'L5Q4',
    lessonId: 5,
    stem: 'Google Drive is an example of:',
    options: ['An HDD', 'Cloud storage', 'An optical disc', 'A flash drive'],
    correctIndex: 1,
    difficulty: -0.8,
    discrimination: 1.0,
    guessing: 0.25
  },
  {
    id: 'L5Q5',
    lessonId: 5,
    stem: 'The correct order of the computing cycle is:',
    options: [
      'Output → Input → Storage → Processing',
      'Input → Processing → Output → Storage',
      'Processing → Input → Output → Storage',
      'Storage → Output → Input → Processing'
    ],
    correctIndex: 1,
    difficulty: 0.5,
    discrimination: 1.5,
    guessing: 0.25
  },
  {
    id: 'L5Q6',
    lessonId: 5,
    stem: 'Which storage medium has the LARGEST typical capacity?',
    options: ['SD card', 'CD', 'Hard Disk Drive (HDD)', 'Flash drive'],
    correctIndex: 2,
    difficulty: 0.2,
    discrimination: 1.2,
    guessing: 0.25
  },
  {
    id: 'L5Q7',
    lessonId: 5,
    stem: 'Optical discs (like CDs and DVDs) are read using:',
    options: ['A magnetic head', 'A laser beam', 'Radio waves', 'Electrical contacts'],
    correctIndex: 1,
    difficulty: 0.7,
    discrimination: 1.3,
    guessing: 0.25
  },
  {
    id: 'L5Q8',
    lessonId: 5,
    stem: 'When you save a school report to a flash drive and print it, which component is the storage device?',
    options: ['The printer', 'The monitor', 'The flash drive', 'The keyboard'],
    correctIndex: 2,
    difficulty: -0.5,
    discrimination: 1.1,
    guessing: 0.25
  }
];
