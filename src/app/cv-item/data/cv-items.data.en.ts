import { CvItem } from '../cv-item';

// tslint:disable:max-line-length
export const GENERAL = {
  name: 'Kayden Miller',
  position: 'Software Engineer',
  description: `Kayden started his career in software at a company in Layton, Utah, called Guru Technologies. Here he developed and refined many of the skills he now has. Prior to Guru Kayden worked on many smaller software projects and did some open source work with a group called Solaris Skunk Werks for a BattleTech board game tool.\n\n` +
  `He has always loved working in software and has been doing it sense he first assembled a computer around the age of 8. However, he didn't fully get into the software world of technology until his later years in Junior High where he learned his frist language of Java with the UI tool Swing.`,
};
// tslint:enable:max-line-length

export const CVITEMS: CvItem[] = [
  {
    title: 'Guru Technologies',
    subtitle: 'Software Engineer',
    begin: '2019-05',
    end: '',
    description: 'Guru Technologies is a Software Development contracting firm that works with companies to develop custom software for their needs' +
      'We work in many different frameworks and have many engineers available to help with the projects we acquire. We also work on our own internal projects' +
      ' that we use to help our daily lives as developers.',
    tags: ['C#', '.NET', '.NET Core', 'Django', 'Kotlin', 'Kubernetes', 'Git', 'KanBan', 'IntelliJ', 'Docker', 'Jira',
      'Agile', 'AWS', 'Confluence', 'GitLab', 'bash'],
    link: 'https://www.gurutechnologies.net/',
    thumbnail: 'guru-tech-logo-small.png',
  },
  {
    title: 'CubiScan',
    subtitle: 'Assembly Technician',
    begin: '2015-05',
    end: '2019-05',
    description: '30 years ago, an idea that began at Cubiscan, developed into the dimensioning and cubing industry. Ever since, Cubiscan has ' +
      'been the industry leader, providing dimensioning, cubing, and weighing equipment and systems to meet your material handling, freight, and warehousing needs.\n' +
      'From shipping and receiving, to warehousing, to logistics and transportation, we understand the challenges you face because we’ve been' +
      ' there, with you in the trenches. Let our technology, our data and our experienced team guide your company to increased profits and improved' +
      ' efficiencies. At Cubiscan, experience is our guide.',
    tags: ['C#', 'Dimensioning', 'Hardware', 'Assembly', 'C', 'C++', 'Object Pascal', 'Delphi'],
    link: 'https://cubiscan.com/',
    thumbnail: 'cubiscan-logo.png',
  },
];

export const CERTIFICATES: CvItem[] = [
  {
    title: 'Git Version Control Basics',
    subtitle: 'Ogden-Weber Applied Technology College',
    begin: '',
    end: '2016-05',
    description: '',
    thumbnail: 'Git-Logo-2Color.png',
    attachment: '',
  },
];

export const EDUCATION: CvItem[] = [
  {
    title: 'Weber State University',
    subtitle: 'Bachelor of Science | Computer Science',
    begin: '2016-8',
    end: '',
    description: '',
    tags: ['Agile', 'C', 'C++', 'Git', 'Java', 'C# .NET', 'Sql'],
    link: 'https://www.weber.edu/',
    thumbnail: 'Weber_State_Wildcats_logo.png',
  },
  {
    title: 'Ogden-Weber Applied Technology College',
    subtitle: 'Bachelor of Science | Computer Science',
    begin: '2013-1',
    end: '2016-5',
    description: '',
    tags: ['C#', '.NET', 'Xamarin', 'Angular', 'Git', 'Visual Studio', 'Visual Basic', 'Java', 'Assembly', 'C++', 'C'],
    link: 'https://www.otech.edu/',
    thumbnail: 'Ogden-Weber_Tech_College_Logo.jpg',
  },
];

export const LANGUAGES = [
  // RATE YOURSELF  =>  100% = NATIVE;  80-99% = FLUENT;  60-79% = ADVANCED;  40-59% = INTERMEDIATE;  20-39% = ELEMENTARY;  0-19% = BEGINNER
  { title: 'English', level: '100' },
  { title: 'German | Deutsch', level: '15' },
];

export const PROJECTS: CvItem[] = [
  {
    title: 'RatS',
    subtitle: 'Script for transfering personal movie ratings from one site to another',
    begin: '2017-02',
    end: '',
    description: 'This Python project offers an easy way of synchronizing personal movie ratings from one site (e.g. IMDB) ' +
      'to another (e.g. Trakt). The script supports 13 sites currently and is constantly expanding.',
    tags: ['Python', 'Git', 'Docker', 'Selenium', 'Beautifulsoup', 'JSON', 'CSV'],
    link: 'https://github.com/StegSchreck/RatS',
    thumbnail: 'RatS.png',
  },
  {
    title: 'AngularCV',
    subtitle: 'A simple self-hosted online-CV',
    begin: '2017-09',
    end: '',
    description: 'This project was created for the purpose of having a basic online-CV, which anyone can host by themselves. ' +
      'This very website is the result of it.',
    tags: ['Angular', 'MaterialDesign', 'GitHub', 'CSS', 'TypeScript', 'JetBrains WebStorm', 'AWS', 'jsPDF', 'npm'],
    link: 'https://github.com/StegSchreck/AngularCV',
    thumbnail: '../AngularCV.svg',
  },
];

export const VOLUNTEERING: CvItem[] = [
  {
    title: 'DFB cup finals & international matches',
    subtitle: 'Admission, visitor services, VIP support, stand-by man, special tasks',
    begin: '2007',
    end: '2016',
    description: 'Admission, visitor services, VIP support, stand-by man, special tasks',
    link: 'http://www.dfb.de',
    thumbnail: 'DFB-Logo.jpg',
  },
];

export const CONTACT = {
  city: 'Washington Terrace, UT',
  phone: '(801) 388-5765',
  mail: 'kaydenmiller1@gmail.com',
  skype: '', // just the account name
  linkedin: 'https://www.linkedin.com/in/kayden-miller-7718b3a3/', // full url
  xing: '', // full url
  github: 'https://github.com/KaydenMiller', // full url
  stackoverflow: 'https://stackoverflow.com/users/13204578/kayden-miller', // full url
  twitter: '', // full url
  facebook: '', // full url
  instagram: '', // full url
  other: [
    { title: 'GitHub Page', icon: 'icon-github', link: 'https://kaydenmiller.github.io' },
  ],
};

export const INTERESTS = [
  {
    title: 'Open Source Software',
    icon: 'code',
  },
  {
    title: 'Board Games',
    icon: 'games'
  },
  {
    title: 'Computer Games',
    icon: 'games'
  },
  {
    title: 'Reading',
    icon: 'icon-book',
  },
  {
    title: 'Camping',
    icon: 'park'
  },
  {
    title: 'Bike Riding',
    icon: 'directions_bike',
  },
  {
    title: 'Shooting',
    icon: 'bolt'
  },
  {
    title: 'Paintball',
    icon: 'bolt'
  }
];

export const PUBLICATIONS: CvItem[] = [
  {
    title: 'How to Touch the Cloud',
    subtitle: 'Article published on Medium / MakeItNew.io',
    begin: '',
    end: '2019-10-03',
    description: 'Different Possibilities on How to Interact with AWS',
    tags: ['AWS', 'Python', 'Ansible', 'Terraform', 'S3', 'CloudFormation', 'SDK', 'CLI'],
    link: 'https://makeitnew.io/how-to-touch-the-cloud-d08bcf14debe',
    thumbnail: 'Medium_MakeItNew.png',
  },
  {
    title: 'The Speaker at the End of the Universe',
    subtitle: 'Article published on Medium',
    begin: '',
    end: '2019-05-27',
    description: 'How to Give a Talk at a Tech Conference',
    tags: ['conference', 'speaker', 'public speaking'],
    link: 'https://medium.com/@stegschreck/the-speaker-at-the-end-of-the-universe-6fb8565587b6',
    thumbnail: 'Medium.svg',
  },
  {
    title: 'The Hitchhiker’s Guide to a Tech Conference',
    subtitle: 'Article published on Medium',
    begin: '',
    end: '2019-05-20',
    description: 'A little How-To for Engineers how to visit a Tech Conference',
    tags: ['conference', 'visitor', 'attendee'],
    link: 'https://medium.com/@stegschreck/the-hitchhikers-guide-to-a-tech-conference-983c29b1e9ef',
    thumbnail: 'Medium.svg',
  },
  {
    title: 'Tear Down This Wall! - Overcoming Collaboration Obstacles on Your DevOps Journey',
    subtitle: 'Article published on Medium / MakeItNew.io',
    begin: '',
    end: '2019-04-17',
    description: 'A summary of our Talk \'Tear Down This Wall!\' given at Code.Talks Commerce Special 2018 in Berlin ' +
      'and DevOpsCon 2018 in Berlin about how we enable more collaboration in our IT teams at Mister Spex.',
    tags: ['DevOps', 'culture', 'collaboration', 'communication', 'microservices'],
    link: 'https://makeitnew.io/tear-down-this-wall-c2211141fdb5',
    thumbnail: 'Medium_MakeItNew.png',
    attachment: 'tear-down-this-wall.pdf',
  },
];

export const TALKS: CvItem[] = [
  {
    title: 'Something, Something... DevOps - A Tale of two developers',
    subtitle: '20 min. @ Netlight EdgeX Vol. 8 - Mi Casa Es Su Casa',
    begin: '',
    end: '2020-11-19',
    description: 'The term "DevOps" has been around for a few years now. Yet, there are still misconceptions and uncertainties around it. We invite you to experience the stories of two developers from different realms to spark your curiosity about the mindset and values behind that sometimes mysterious buzzword "DevOps".',
    tags: ['DevOps', 'Culture', 'Collaboration', 'Communication', 'Enablement'],
    thumbnail: 'Netlight_EdgeX_MiCasaEsSuCasa.png',
  },
  {
    title: 'Looking at a New-Born Star Through the Telescope: Architecture Review Approach at idealo',
    subtitle: '20 min. @ Netlight EdgeX Urknall',
    begin: '',
    end: '2020-06-17',
    description: 'After starting a new project on a green field, you sometimes wonder if you made the right choices at the beginning. This talk will give you an overview of how idealo\'s team product page took a step back and reviewed their early architecture decisions considering the learnings made on the way.',
    tags: ['Architecture', 'Arc42'],
    thumbnail: 'NetlightEdgeXUrknall.png',
  },
  {
    title: 'Bringing a complex stack to the cloud - Our journey and lessons learned',
    subtitle: '45 min. @ AWS Startup Day Berlin 2018',
    begin: '',
    end: '2018-10-09',
    description: 'Mister Spex moved away from AWS to an on-premises infrastructure in 2015. In 2018 they switched back to AWS. This talk covers the story of these changes and the lessons learned.',
    tags: ['AWS', 'cloud', 'migration'],
    thumbnail: 'AWS_Startup_Day.png',
  },
  {
    title: 'Tear down this wall! - Overcoming collaboration obstacles on your DevOps journey',
    subtitle: '60 min. @ DevOpsCon Berlin 2018',
    begin: '',
    end: '2018-05-29',
    description: 'The discussion about DevOps is often focusing solely on the tooling aspect: automation, ' +
      'continuous integration & delivery; and monitoring. But automation and monitoring will only get you so far on ' +
      'your DevOps journey. The first and arguably hardest thing to master in DevOps is getting your work from ' +
      'inception into the hands of the customer fast. It requires your engineers to work hand in hand to ensure the ' +
      'stability of the software as well as the systems it runs on. This talk focuses on the organizational ' +
      'aspects of DevOps: How to measure and improve your team\'s effectiveness by reducing silos and silo thinking and ' +
      'how to get your engineers to share responsibility - a basis for every successful DevOps transformation.',
    tags: ['DevOps', 'culture', 'collaboration', 'communication', 'microservices', 'team structure'],
    link: 'https://jaxenter.com/devops-interview-schreck-uebel-145573.html',
    thumbnail: 'DevOpsCon_2018_Speaker.png',
  },
  {
    title: 'Tear down this wall! - Overcoming collaboration obstacles on your DevOps journey',
    subtitle: '45 min. @ code.talks commerce special Berlin 2018',
    begin: '',
    end: '2018-04-13',
    description: 'The discussion about DevOps is often focusing solely on the tooling aspect: automation, ' +
      'continuous integration & delivery; and monitoring. But automation and monitoring will only get you so far on ' +
      'your DevOps journey. The first and arguably hardest thing to master in DevOps is getting your work from ' +
      'inception into the hands of the customer fast. It requires your engineers to work hand in hand to ensure the ' +
      'stability of the software as well as the systems it runs on. We focus on the organizational ' +
      'aspects of DevOps: How to measure and improve your team\'s effectiveness by reducing silos and silo thinking and ' +
      'how to get your engineers to share responsibility - a basis for every successful DevOps transformation.',
    tags: ['DevOps', 'culture', 'collaboration', 'communication', 'microservices'],
    link: 'https://www.youtube.com/watch?v=KWw0H__mtxI',
    thumbnail: 'code-talks-commerce.png',
  },
];
