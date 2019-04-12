module.exports = {
  title: 'Valisette',
  base: '/Valisette-documentation/',
  description: "A progressive boilerplate to code performant apps.",
  themeConfig: {
    logo: './valisette-logo.png',
    sidebarDepth: 3,
    sidebar: [
      ['/guide/', 'Introduction'],
      ['/guide/REQUIREMENTS.md', 'Requirements'],
      ['/guide/START.md', 'Getting Started'],
      ['/guide/CONFIGURATION.md', 'Configuration File'],
      ['/summary/', 'Summary'],
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: '16 Pixels', link: 'https://16pixels.fr' },
    ]
  }
}
